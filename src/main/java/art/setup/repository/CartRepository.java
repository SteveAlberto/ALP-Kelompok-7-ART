package art.setup.repository;

import art.setup.model.CartItem;
import art.setup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByUser(User user);
    List<CartItem> findByUser_Id(Long userId);
    void deleteByArtwork_IdAndUser_Id(Long artworkId, Long userId);
}