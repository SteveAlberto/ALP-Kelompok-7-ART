package art.setup.controller;

import art.setup.model.*;
import art.setup.repository.*;
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

    @GetMapping("/cart")
    public String showCart(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) return "redirect:/login";

        List<CartItem> cartItems = cartRepository.findByUser_Id(user.getId());
        
        double subtotal = 0;
        for (CartItem item : cartItems) {
            subtotal += item.getArtwork().getFinalPrice();
        }
        double fee = subtotal * 0.02; 
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
        if (artwork != null) {
            CartItem item = new CartItem();
            item.setUser(user);
            item.setArtwork(artwork);
            cartRepository.save(item);
        }
        return "redirect:/cart";
    }
}