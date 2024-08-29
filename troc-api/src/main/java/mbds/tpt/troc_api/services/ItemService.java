package mbds.tpt.troc_api.services;

import mbds.tpt.troc_api.datamodel.ItemDataModel;
import mbds.tpt.troc_api.entities.Images;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.repositories.ImageRepository;
import mbds.tpt.troc_api.repositories.ItemRepository;
import mbds.tpt.troc_api.repositories.UserRepository;
import mbds.tpt.troc_api.utils.Status;

// import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import mbds.tpt.troc_api.utils.Category;
import org.springframework.data.domain.Pageable;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Items createItem(ItemDataModel itemRequest) throws IOException {
        // Obtenir l'utilisateur connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Items item = new Items();
        item.setTitle(itemRequest.getTitle());
        item.setDescription(itemRequest.getDescription());
        item.setCategory(itemRequest.getCategory());
        item.setStatus(Status.DISPONIBLE);
        item.setUser(user);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        Items savedItem = itemRepository.save(item);

        Set<Images> images = new HashSet<>();
        if (itemRequest.getNewImages() != null) {
            for (MultipartFile file : itemRequest.getNewImages()) {
                String imageUrl = fileStorageService.saveFile(file);
                Images image = new Images(savedItem, imageUrl);
                images.add(image);
            }
            imageRepository.saveAll(images);
        }
        savedItem.setImages(images);
        return itemRepository.save(savedItem);
    }

    @Transactional
    public Items updateItem(Long itemId, ItemDataModel itemRequest) throws Exception {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            Users user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Items item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            if (!item.getUser().getUser_id().equals(user.getUser_id())) {
                throw new RuntimeException("Unauthorized to update this item");
            }

            // Update fields only if they are provided in the request
            // Update fields
            if (itemRequest.getTitle() != null)
                item.setTitle(itemRequest.getTitle());
            if (itemRequest.getDescription() != null)
                item.setDescription(itemRequest.getDescription());
            if (itemRequest.getCategory() != null)
                item.setCategory(itemRequest.getCategory());
            if (itemRequest.getStatus() != null)
                item.setStatus(Status.valueOf(itemRequest.getStatus().toUpperCase()));
            item.setUpdatedAt(LocalDateTime.now());

            Items savedItem = itemRepository.save(item);

            // Removing images
            if (itemRequest.getImagesToRemove() != null) {
                Set<Images> imagesToRemove = savedItem.getImages().stream()
                        .filter(image -> itemRequest.getImagesToRemove().contains(image.getImage_id()))
                        .collect(Collectors.toSet());

                for (Images image : imagesToRemove) {
                    savedItem.getImages().remove(image); // Remove from the item
                    imageRepository.delete(image); // Delete from the repository
                    fileStorageService.deleteFile(image.getImageUrl()); // Delete from the server
                }
            }

            // Add new images
            Set<Images> images = new HashSet<>();
            Set<Images> actualImages = item.getImages();
            for (Images file : actualImages) {
                String imageUrl = file.getImageUrl();
                Images image = new Images(savedItem, imageUrl);
                images.add(image);
            }
            if (itemRequest.getNewImages() != null) {
                for (MultipartFile file : itemRequest.getNewImages()) {
                    String imageUrl = fileStorageService.saveFile(file);
                    Images image = new Images(savedItem, imageUrl);
                    images.add(image);
                }
                imageRepository.saveAll(images);
            }
            savedItem.setImages(images);

            return itemRepository.save(savedItem);
        } catch (Exception e) {
            // Handle the exception, e.g., log it
            System.out.println("Error updating item" + e.getMessage());
            throw e; // Re-throw the exception to roll back the transaction
        }
    }

    public Page<Items> searchItems(String keyword, Category category, Status status,
            int page, int size, String sortField, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortField).ascending()
                : Sort.by(sortField).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return itemRepository.findBySearchCriteria(keyword, category, status, pageable);
    }

    @Transactional
    public void deleteItem(Long itemId) {
        Items item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found with id: " + itemId));

        // Supprimer l'item lui-même
        itemRepository.delete(item);
    }

    public Items getItemById(Long id) {
        Optional<Items> item = itemRepository.findById(id);
        Items loadedItem = item.orElseThrow(() -> new RuntimeException("Item not found with id " + id));

        // Charger explicitement les relations si nécessaire
        loadedItem.getImages().size(); // Déclenche le chargement des images

        return loadedItem;
    }

    public Page<Items> getItemsByUserWithCriteria(
            Users user,
            String keyword,
            Category category,
            Status status,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size);
        return itemRepository.findByUserWithCriteria(user, keyword, category, status, pageable);
    }
}
