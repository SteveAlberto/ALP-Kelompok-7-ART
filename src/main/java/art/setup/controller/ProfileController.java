package art.setup.controller;

import art.setup.model.Artwork;
import art.setup.model.User;
import art.setup.service.ArtworkService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ProfileController {

    @Autowired
    private ArtworkService artworkService;

    @GetMapping("/dashboard")
    public String showDashboard(HttpSession session, Model model) {
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            return "redirect:/login"; 
        }

        List<Artwork> myArtworks = artworkService.getArtworksByArtistId(loggedInUser.getId());
        int activeListings = myArtworks.size();

        model.addAttribute("myArtworks", myArtworks);
        model.addAttribute("activeListings", activeListings);
        
        return "dashboard";
    }
}