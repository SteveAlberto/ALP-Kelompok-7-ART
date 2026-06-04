package art.setup.controller;

import art.setup.model.Artwork;
import art.setup.model.User;
import art.setup.service.OrderService;
import art.setup.repository.ArtworkRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class CheckoutController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ArtworkRepository artworkRepository;

    @GetMapping("/checkout/{artworkId}")
    public String showCheckout(@PathVariable Long artworkId, Model model, HttpSession session) {
        User buyer = (User) session.getAttribute("loggedInUser");
        if (buyer == null) return "redirect:/login";

        Artwork artwork = artworkRepository.findById(artworkId).orElse(null);
        if (artwork == null || !"AVAILABLE".equals(artwork.getStatus())) {
            return "redirect:/katalog?error=unavailable";
        }

        model.addAttribute("artwork", artwork);
        return "checkout";
    }

    // 2. Memproses form checkout
    @PostMapping("/checkout/process/{artworkId}")
    public String processCheckout(@PathVariable Long artworkId, 
                                    @RequestParam String shippingAddress,
                                    @RequestParam String city,
                                    @RequestParam String zipCode,
                                    @RequestParam String phoneNumber,
                                    HttpSession session) {
        
        User buyer = (User) session.getAttribute("loggedInUser");
        Artwork artwork = artworkRepository.findById(artworkId).orElse(null);
        
        if (buyer != null && artwork != null) {
            // Memanggil Service yang sudah kita buat tadi
            orderService.completePurchase(buyer, artwork, shippingAddress, city, zipCode, phoneNumber);
            return "redirect:/dashboard"; // Redirect ke dashboard setelah sukses
        }
        
        return "redirect:/katalog?error=failed";
    }
}