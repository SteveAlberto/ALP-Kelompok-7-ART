package art.setup.service;

import art.setup.model.Artwork;
import art.setup.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtworkService {
    @Autowired
    private ArtworkRepository artworkRepository;

    public Double calculateFinalPrice(Double productionCost, Integer workHours, String difficulty) {
        double difficultyFee = 0.0;
        
        if (difficulty != null) {
            switch (difficulty.toLowerCase()) {
                case "mudah":
                    difficultyFee = 0.0; 
                    break;
                case "sedang":
                    difficultyFee = 100000.0;
                    break;
                case "sulit":
                    difficultyFee = 200000.0; 
                    break;
                default:
                    difficultyFee = 0.0;
            }
        }
        double hourlyRate = 50000.0;
        return productionCost + (workHours * hourlyRate) + difficultyFee;
    }

    public Artwork saveNewArtwork(Artwork artwork) {
        Double calculatedPrice = calculateFinalPrice(
            artwork.getProductionCost(), 
            artwork.getWorkHours(), 
            artwork.getDifficulty()
        );
        artwork.setFinalPrice(calculatedPrice);
        
        return artworkRepository.save(artwork);
    }

    public List<Artwork> getAllCatalog() {
        return artworkRepository.findAll();
    }
    
    public Artwork getArtworkById(Long id) {
        return artworkRepository.findById(id).orElse(null);
    }

    public List<Artwork> getArtworksByArtistId(Long artistId) {
        return artworkRepository.findByArtist_Id(artistId);
    }

    public Artwork updateArtwork(Long id, Artwork updatedArtwork) {
        Artwork existingArtwork = artworkRepository.findById(id).orElse(null);
        
        if (existingArtwork != null) {
            existingArtwork.setTitle(updatedArtwork.getTitle());
            existingArtwork.setCategory(updatedArtwork.getCategory());
            existingArtwork.setProductionCost(updatedArtwork.getProductionCost());
            existingArtwork.setWorkHours(updatedArtwork.getWorkHours());
            existingArtwork.setDifficulty(updatedArtwork.getDifficulty());
            
            Double recalculatedPrice = calculateFinalPrice(
                updatedArtwork.getProductionCost(), 
                updatedArtwork.getWorkHours(), 
                updatedArtwork.getDifficulty()
            );
            existingArtwork.setFinalPrice(recalculatedPrice);
            
            return artworkRepository.save(existingArtwork);
        }
        return null;
    }

    public void deleteArtwork(Long id) {
        artworkRepository.deleteById(id);
    }

    public void save(Artwork artwork) {
        artworkRepository.save(artwork);
    }
}