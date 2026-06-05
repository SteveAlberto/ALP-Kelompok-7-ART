package art.setup.controller;

import art.setup.model.Artwork;
import art.setup.model.User;
import art.setup.service.ArtworkService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

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
    public String processUpload(@ModelAttribute Artwork artwork, 
                                @RequestParam("imageFile") MultipartFile multipartFile, 
                                HttpSession session) throws IOException {
        
        User loggedInArtist = (User) session.getAttribute("loggedInUser");
        if (loggedInArtist == null) {
            return "redirect:/login";
        }

        artwork.setArtist(loggedInArtist);
        artwork.setStatus("AVAILABLE");

        // --- 1. LOGIKA PERHITUNGAN HARGA (Asli buatanmu) ---
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
        // ----------------------------------------------------

        // --- 2. LOGIKA UPLOAD FILE FOTO KE FOLDER LOKAL ---
        if (!multipartFile.isEmpty()) {
            // Bersihkan nama file dari karakter aneh
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            try (InputStream inputStream = multipartFile.getInputStream()) {
                Path filePath = uploadPath.resolve(uniqueFileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }
            
            artwork.setImageUrl("/uploads/" + uniqueFileName);
        }

        artworkService.save(artwork); 

        return "redirect:/dashboard"; 
    }
}