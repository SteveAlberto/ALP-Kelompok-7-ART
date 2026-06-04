package art.setup.service;

import art.setup.model.User;
import art.setup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    public User registerUser(User newUser) {
        if (newUser.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password terlalu pendek! Minimal 6 karakter.");
        }

        Optional<User> existingUser = userRepository.findByUsername(newUser.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username sudah terdaftar! Silakan gunakan username lain.");
        }

        return userRepository.save(newUser);
    }

    public User loginUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User foundUser = userOpt.get();
            if (foundUser.getPassword().equals(password)) {
                return foundUser;
            } else {
                throw new IllegalArgumentException("Password salah!");
            }
        } else {
            throw new IllegalArgumentException("Username tidak ditemukan!");
        }
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    
}
