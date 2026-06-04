package art.setup.repository;

import art.setup.model.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByCategory(String category);
    List<Artwork> findByArtistId(Long artistId);
    List<Artwork> findByArtist_Id(Long artistId);
}