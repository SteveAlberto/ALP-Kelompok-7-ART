package art.setup.controller;

import art.setup.model.*;
import art.setup.repository.*;
import art.setup.service.OrderService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class CartController {

    @Autowired private CartRepository cartRepository;
    @Autowired private ArtworkRepository artworkRepository;
    
    // Inject OrderService untuk menangani transaksi saat checkout
    @Autowired private OrderService orderService; 

    @GetMapping("/cart")
    public String showCart(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) return "redirect:/login";

        // MENGATASI ERROR: Kita gunakan objek user langsung, bukan ID-nya
        List<CartItem> cartItems = cartRepository.findByUser(user);
        
        double subtotal = 0;
        for (CartItem item : cartItems) {
            subtotal += item.getArtwork().getFinalPrice();
        }
        double fee = subtotal * 0.02; // Contoh fee aplikasi 2%
        double grandTotal = subtotal + fee;

        model.addAttribute("cartItems", cartItems);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("fee", fee);
        model.addAttribute("grandTotal", grandTotal);
        
        return "cart";
    }

    @PostMapping("/cart/add/{artworkId}")
    public String addToCart(@PathVariable Long artworkId, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) return "redirect:/login";

        Artwork artwork = artworkRepository.findById(artworkId).orElse(null);
        
        if (artwork != null && "AVAILABLE".equals(artwork.getStatus())) {
            CartItem item = new CartItem();
            item.setUser(user);
            item.setArtwork(artwork);
            cartRepository.save(item);
        }
        return "redirect:/cart";
    }

    
    @GetMapping("/cart/checkout")
    public String showCartCheckout(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) return "redirect:/login";
        
        List<CartItem> cartItems = cartRepository.findByUser(user);
        if(cartItems.isEmpty()) return "redirect:/cart";
        
        // Hitung total harga keranjang
        double subtotal = 0;
        for (CartItem item : cartItems) {
            subtotal += item.getArtwork().getFinalPrice();
        }
        double fee = subtotal * 0.02;
        double grandTotal = subtotal + fee;

        model.addAttribute("cartItems", cartItems);
        model.addAttribute("grandTotal", grandTotal);
        
        return "cart-checkout";
    }

    @PostMapping("/cart/checkout/process")
    public String processCartCheckout(@RequestParam String shippingAddress,
                                        @RequestParam String city,
                                        @RequestParam String zipCode,
                                        @RequestParam String phoneNumber,
                                        HttpSession session) {
        User buyer = (User) session.getAttribute("loggedInUser");
        if (buyer == null) return "redirect:/login";

        List<CartItem> cartItems = cartRepository.findByUser(buyer);

        if (!cartItems.isEmpty()) {
            // 1. Pindahkan isi keranjang ke dalam tabel Order dan ubah status jadi SOLD
            orderService.processCartCheckout(buyer, cartItems, shippingAddress, city, zipCode, phoneNumber);
            
            // 2. Kosongkan keranjang pembeli tersebut karena sudah dibayar
            cartRepository.deleteAll(cartItems); 
        }
        
        return "redirect:/dashboard";
    }

    @PostMapping("/cart/remove/{cartItemId}")
    public String removeFromCart(@PathVariable Long cartItemId, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user != null) {
            cartRepository.deleteById(cartItemId);
        }
        return "redirect:/cart";
    }
}