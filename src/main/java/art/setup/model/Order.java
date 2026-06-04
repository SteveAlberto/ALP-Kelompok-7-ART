package art.setup.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "artwork_id")
    private Artwork artwork;

    private Double paidPrice;
    private LocalDateTime orderDate = LocalDateTime.now();

    private String shippingAddress;
    private String city;
    private String zipCode;
    private String phoneNumber;
    private String notes; 
}