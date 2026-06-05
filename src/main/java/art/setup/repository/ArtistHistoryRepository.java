package art.setup.repository;

import art.setup.model.ArtistHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArtistHistoryRepository extends JpaRepository<ArtistHistory, Long> {
    List<ArtistHistory> findByArtistIdOrderByYearDesc(Long artistId);
    List<ArtistHistory> findByArtistId(Long artistId);
}