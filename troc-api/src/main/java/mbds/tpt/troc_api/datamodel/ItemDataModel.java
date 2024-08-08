package mbds.tpt.troc_api.datamodel;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import mbds.tpt.troc_api.utils.Category;

public class ItemDataModel {
    private String title;
    private String description;
    private Category category;
    private String status;
    // private MultipartFile[] images;
    private List<Long> imagesToRemove = null; // Liste des IDs d'images à supprimer (pour la mise à jour)
    private MultipartFile[] newImages; // Liste des nouvelles images à ajouter (pour la création et mise à jour)

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public MultipartFile[] getNewImages() {
        return newImages;
    }

    public void setNewImages(MultipartFile[] newImages) {
        this.newImages = newImages;
    }

    public List<Long> getImagesToRemove() {
        return imagesToRemove;
    }

    public void setImagesToRemove(List<Long> imagesToRemove) {
        this.imagesToRemove = imagesToRemove;
    }
}
