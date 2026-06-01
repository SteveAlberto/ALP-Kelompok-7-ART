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

    @PostMapping("/kirim-pesan")
    public String processSendMessage(@RequestParam Long receiverId, @RequestParam String messageContent, HttpSession session) {

        User sender = (User) session.getAttribute("loggedInUser");
        if (sender == null) {
            return "redirect:/login";
        }

        User receiver = userService.getUserById(receiverId);

        if (receiver != null && !messageContent.trim().isEmpty()) {
            chatService.sendMessage(sender, receiver, messageContent);
        }
        return "redirect:/katalog"; 
    }
}