package art.setup.service;

import art.setup.model.ArtistHistory;
import art.setup.model.User;
import art.setup.repository.ArtistHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtistHistoryService {

    @Autowired
    private ArtistHistoryRepository artistHistoryRepository;

    public ArtistHistory addHistory(User artist, String year, String description) {
        ArtistHistory history = new ArtistHistory();
        history.setArtist(artist);
        history.setYear(year);
        history.setDescription(description);
        
        return artistHistoryRepository.save(history);
    }

    public List<ArtistHistory> getHistoryByArtist(Long artistId) {
        return artistHistoryRepository.findByArtistIdOrderByYearDesc(artistId);
    }

    public List<ArtistHistory> getHistoryByUserId(Long userId) {
        return artistHistoryRepository.findByArtistId(userId);
    }
}