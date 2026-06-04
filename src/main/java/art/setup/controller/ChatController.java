package art.setup.controller;

import art.setup.model.ChatMessage;
import art.setup.model.User;
import art.setup.service.ChatService;
import art.setup.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    @GetMapping("/inbox")
    public String showInbox(HttpSession session, Model model) {
        User currentUser = (User) session.getAttribute("loggedInUser");
        if (currentUser == null) {
            return "redirect:/login"; 
        }

        List<ChatMessage> messages = chatService.getInboxForUser(currentUser.getId());
        model.addAttribute("pesanMasuk", messages);

        return "inbox"; 
    }

    @GetMapping("/api/chat/list")
    @ResponseBody 
    public List<ChatMessage> getChatHistory(HttpSession session) {
        User currentUser = (User) session.getAttribute("loggedInUser");
        if (currentUser == null) return null;
        
        return chatService.getInboxForUser(currentUser.getId());
    }

    @PostMapping("/api/chat/send")
    @ResponseBody
    public String apiSendMessage(@RequestBody ChatMessageRequest request, HttpSession session) {
        User sender = (User) session.getAttribute("loggedInUser");
        if (sender == null) return "error: not logged in";

        User receiver = userService.getUserById(request.getReceiverId());

        if (receiver != null && !request.getContent().trim().isEmpty()) {
            chatService.sendMessage(sender, receiver, request.getContent());
            return "success";
        }
        return "error: invalid data";
    }

    public static class ChatMessageRequest {
        private Long receiverId;
        private String content;

        // Getter & Setter
        public Long getReceiverId() { return receiverId; }
        public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}