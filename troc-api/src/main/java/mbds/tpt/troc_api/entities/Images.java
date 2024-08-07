package mbds.tpt.troc_api.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class Images {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long image_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    @JsonBackReference
    private Items item;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    // Constructors
    public Images() {
    }

    public Images(Items item, String imageUrl) {
        this.setItem(item);
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getImage_id() {
        return image_id;
    }

    public void setImage_id(Long image_id) {
        this.image_id = image_id;
    }

    public Items getItem() {
        return item;
    }

    public void setItem(Items item) {
        this.item = item;
        if (item != null && !item.getImages().contains(this)) {
            item.getImages().add(this);
        }
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
