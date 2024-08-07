package mbds.tpt.troc_api.services;

import mbds.tpt.troc_api.datamodel.ItemDataModel;
import mbds.tpt.troc_api.entities.Images;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.repositories.ImageRepository;
import mbds.tpt.troc_api.repositories.ItemRepository;
import mbds.tpt.troc_api.repositories.UserRepository;
import mbds.tpt.troc_api.utils.Status;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Iterator;
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
        for (MultipartFile file : itemRequest.getImages()) {
            String imageUrl = fileStorageService.saveFile(file);
            Images image = new Images(savedItem, imageUrl);
            images.add(image);
        }
        imageRepository.saveAll(images);

        savedItem.setImages(images);
        return itemRepository.save(savedItem);
    }

    @Transactional
    public Items updateItem(Long itemId, ItemDataModel itemRequest) throws IOException {
        // Obtenir l'utilisateur connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Items item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Vérifier si l'utilisateur est le propriétaire de l'item
        if (!item.getUser().equals(user)) {
            throw new RuntimeException("You are not authorized to update this item");
        }

        if (itemRequest.getTitle() != null && !itemRequest.getTitle().isEmpty()) {
            item.setTitle(itemRequest.getTitle());
        }
        if (itemRequest.getDescription() != null) {
            item.setDescription(itemRequest.getDescription());
        }
        if (itemRequest.getCategory() != null) {
            item.setCategory(itemRequest.getCategory());
        }
        if (itemRequest.getStatus() != null && !itemRequest.getStatus().isEmpty()) {
            try {
                item.setStatus(Status.valueOf(itemRequest.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value");
            }
        }
        item.setUpdatedAt(LocalDateTime.now());

        // Gérer les nouvelles images si elles sont fournies
        Set<Images> currentImages = item.getImages();
        MultipartFile[] newImages = itemRequest.getImages();

        // S'il y a de nouvelles images
        if (newImages != null) {
            // Supprimer les anciennes images si aucun fichier n'est fourni dans la mise à jour
            if (newImages.length == 0) {
                imageRepository.deleteAll(currentImages);
                currentImages.clear();
            } else {
                // Mettre à jour ou ajouter les nouvelles images
                Iterator<Images> currentImagesIterator = currentImages.iterator();
                for (MultipartFile file : newImages) {
                    if (currentImagesIterator.hasNext()) {
                        Images oldImage = currentImagesIterator.next();
                        String newImageUrl = fileStorageService.saveFile(file);
                        oldImage.setImageUrl(newImageUrl);
                    } else {
                        String newImageUrl = fileStorageService.saveFile(file);
                        Images newImage = new Images(item, newImageUrl);
                        currentImages.add(newImage);
                    }
                }

                // Supprimer les images restantes si moins d'images sont fournies
                while (currentImagesIterator.hasNext()) {
                    Images oldImage = currentImagesIterator.next();
                    currentImagesIterator.remove();
                    imageRepository.delete(oldImage);
                }
            }
        }

        Items savedItem = itemRepository.save(item);
        itemRepository.flush(); // Ajout du flush ici

        return savedItem;
    }
}
