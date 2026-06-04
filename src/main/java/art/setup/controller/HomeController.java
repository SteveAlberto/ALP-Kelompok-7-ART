package art.setup.controller;

import art.setup.model.Artwork;
import art.setup.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private ArtworkRepository artworkRepository;

    @GetMapping("/")
    public String home(Model model) {
        List<Artwork> allArtworks = artworkRepository.findAll();
        
        if (allArtworks.size() > 3) {
            allArtworks = allArtworks.subList(allArtworks.size() - 3, allArtworks.size());
        }
        
        model.addAttribute("artworks", allArtworks);
        
        return "index";
    }
}