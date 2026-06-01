package art.setup.repository;

import art.setup.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByReceiverIdOrderBySentAtDesc(Long receiverId);
    List<ChatMessage> findBySenderIdAndReceiverId(Long senderId, Long receiverId);
}