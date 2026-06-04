package art.setup.controller;

import art.setup.model.Artwork;
import art.setup.model.User;
import art.setup.service.ArtworkService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class MarketplaceController {

    @Autowired
    private ArtworkService artworkService;

    @GetMapping("/")
    public String landingPage() {
        return "index";
    }

    @GetMapping("/katalog")
    public String showCatalog(Model model) {
        List<Artwork> artworks = artworkService.getAllCatalog();
        model.addAttribute("artworks", artworks);
        return "katalog";
    }

    @GetMapping("/karya/{id}")
    public String showArtworkDetail(@PathVariable Long id, Model model) {
        Artwork artwork = artworkService.getArtworkById(id);
        model.addAttribute("detailKarya", artwork);
        return "detail-karya";
    }

    // @GetMapping("/upload")
    // public String showUploadForm(Model model, HttpSession session) {
    //     if (session.getAttribute("loggedInUser") == null) {
    //         return "redirect:/login";
    //     }
    //     model.addAttribute("karyaBaru", new Artwork());
    //     return "upload-karya";
    // }

    // @PostMapping("/upload")
    // public String processUpload(@ModelAttribute("karyaBaru") Artwork artwork, HttpSession session) {
    //     User currentUser = (User) session.getAttribute("loggedInUser");

    //     if (currentUser == null) {
    //         return "redirect:/login";
    //     }

    //     artwork.setArtist(currentUser);
    //     artworkService.saveNewArtwork(artwork);

    //     return "redirect:/katalog";
    // }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model, HttpSession session) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        
        Artwork artwork = artworkService.getArtworkById(id);
        model.addAttribute("karyaEdit", artwork);
        
        return "edit-karya";
    }

    @PostMapping("/edit/{id}")
    public String processEdit(@PathVariable Long id, @ModelAttribute("karyaEdit") Artwork artwork) {
        artworkService.updateArtwork(id, artwork);
        return "redirect:/katalog";
    }

    @GetMapping("/hapus/{id}")
    public String deleteArtwork(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }
        
        artworkService.deleteArtwork(id);
        return "redirect:/katalog";
    }
}