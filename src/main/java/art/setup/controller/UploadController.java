package art.setup.controller; // Sesuaikan dengan nama package-mu

import art.setup.model.Artwork;
import art.setup.model.User;
import art.setup.service.ArtworkService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UploadController {

    @Autowired
    private ArtworkService artworkService;

    @GetMapping("/upload")
    public String showUploadPage(HttpSession session) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        return "upload";
    }

    @PostMapping("/upload")
    public String processUpload(@ModelAttribute Artwork artwork, HttpSession session) {
        User loggedInArtist = (User) session.getAttribute("loggedInUser");
        if (loggedInArtist == null) {
            return "redirect:/login";
        }

        artwork.setArtist(loggedInArtist);
        
        artwork.setStatus("AVAILABLE");

        double upahPerJam = 50000;
        double pengaliKesulitan = 1.0;

        if (artwork.getDifficulty() != null) {
            if (artwork.getDifficulty().equalsIgnoreCase("INTERMEDIATE")) {
                pengaliKesulitan = 1.5;
            } else if (artwork.getDifficulty().equalsIgnoreCase("ADVANCED")) {
                pengaliKesulitan = 2.0;
            }
        }

        double calculatedPrice = artwork.getProductionCost() + (artwork.getWorkHours() * upahPerJam * pengaliKesulitan);
        
        artwork.setFinalPrice(calculatedPrice);
        
        artworkService.save(artwork); 

        return "redirect:/dashboard"; 
    }
}