package art.setup.controller;

import art.setup.model.ArtistHistory;
import art.setup.model.User;
import art.setup.service.ArtistHistoryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ProfileController {

    @Autowired
    private ArtistHistoryService artistHistoryService;
    @GetMapping("/profil")
    public String showProfile(HttpSession session, Model model) {
        User currentUser = (User) session.getAttribute("loggedInUser");
        if (currentUser == null) {
            return "redirect:/login"; 
        }

        List<ArtistHistory> riwayatList = artistHistoryService.getHistoryByArtist(currentUser.getId());
        
        model.addAttribute("user", currentUser);
        model.addAttribute("daftarRiwayat", riwayatList);

        return "profil"; 
    }

    @PostMapping("/profil/tambah-riwayat")
    public String addProfileHistory(@RequestParam String year, 
                                    @RequestParam String description, 
                                    HttpSession session) {
                                        
        User currentUser = (User) session.getAttribute("loggedInUser");
        if (currentUser == null) {
            return "redirect:/login";
        }

        if (!year.trim().isEmpty() && !description.trim().isEmpty()) {
            artistHistoryService.addHistory(currentUser, year, description);
        }

        return "redirect:/profil";
    }
}