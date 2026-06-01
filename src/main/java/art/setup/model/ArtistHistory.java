package art.setup.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "artist_history")
public class ArtistHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "history_year")
    private String year;

    @Column(nullable = false)
    private String description; 
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    private User artist;
}