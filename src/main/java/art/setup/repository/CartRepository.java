package art.setup.repository;

import art.setup.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser_Id(Long userId);
    void deleteByArtwork_IdAndUser_Id(Long artworkId, Long userId);
}