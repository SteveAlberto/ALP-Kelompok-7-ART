package art.setup.service;

import art.setup.model.ChatMessage;
import art.setup.model.User;
import art.setup.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage sendMessage(User sender, User receiver, String content) {
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setMessageContent(content);
        
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getInboxForUser(Long userId) {
        return chatMessageRepository.findByReceiverIdOrderBySentAtDesc(userId);
    }
}