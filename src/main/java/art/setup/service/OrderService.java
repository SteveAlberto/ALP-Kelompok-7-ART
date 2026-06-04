package art.setup.service;

import art.setup.model.Artwork;
import art.setup.model.CartItem;
import art.setup.model.Order;
import art.setup.model.User;
import java.util.List;
import art.setup.repository.ArtworkRepository;
import art.setup.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    @Transactional
    public void completePurchase(User buyer, Artwork artwork, String address, String city, String zip, String phone) {
        
        artwork.setStatus("SOLD");
        artworkRepository.save(artwork);

        Order order = new Order();
        order.setBuyer(buyer);
        order.setArtwork(artwork);
        order.setPaidPrice(artwork.getFinalPrice());
        order.setOrderDate(LocalDateTime.now());
        
        order.setShippingAddress(address);
        order.setCity(city);
        order.setZipCode(zip);
        order.setPhoneNumber(phone);
        
        orderRepository.save(order);
    }

    @Transactional
    public void processCartCheckout(User buyer, List<CartItem> cartItems, String address, String city, String zip, String phone) {
        for (CartItem item : cartItems) {
            Artwork artwork = item.getArtwork();
            
            if ("AVAILABLE".equals(artwork.getStatus())) {
                // 1. Update status karya jadi SOLD
                artwork.setStatus("SOLD");
                artworkRepository.save(artwork);

                // 2. Buat record order
                Order order = new Order();
                order.setBuyer(buyer);
                order.setArtwork(artwork);
                order.setPaidPrice(artwork.getFinalPrice());
                order.setOrderDate(LocalDateTime.now());
                order.setShippingAddress(address);
                order.setCity(city);
                order.setZipCode(zip);
                order.setPhoneNumber(phone);
                
                orderRepository.save(order);
            }
        }
    }
}