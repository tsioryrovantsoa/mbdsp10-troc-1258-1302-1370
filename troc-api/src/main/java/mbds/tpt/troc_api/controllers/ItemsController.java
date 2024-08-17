package mbds.tpt.troc_api.controllers;

import mbds.tpt.troc_api.datamodel.ItemDataModel;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.entities.Images;
import mbds.tpt.troc_api.repositories.ImageRepository;
import mbds.tpt.troc_api.services.ItemService;
import mbds.tpt.troc_api.utils.ErrorResponse;
import mbds.tpt.troc_api.utils.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.data.domain.Pageable;
import mbds.tpt.troc_api.utils.Category;
import mbds.tpt.troc_api.utils.Status;

@RestController
@RequestMapping("/api/items")
public class ItemsController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private ImageRepository imageRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> createItem(@ModelAttribute ItemDataModel itemData) {
        try {
            Items createdItem = itemService.createItem(itemData);
            return ResponseEntity.ok(createdItem);
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateItem(@PathVariable Long itemId, @ModelAttribute ItemDataModel itemRequest) {
        try {
            Items updatedItem = itemService.updateItem(itemId, itemRequest);
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ErrorResponse.handleException(e);
        }
    }

    private ResponseEntity<?> handleException(Exception e) {
        if (e instanceof IOException) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("Unsupported media type");
        } else if (e instanceof IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Items>> searchItems(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        String sortDirection = sortParams.length > 1 ? sortParams[1] : "asc";

        Page<Items> items = itemService.searchItems(keyword, category, status, page, size, sortField, sortDirection);
        return ResponseEntity.ok(items);
    }

    private List<Sort.Order> createSortOrders(String[] sort) {
        List<Sort.Order> orders = new ArrayList<>();
        for (String sortOrder : sort) {
            String[] parts = sortOrder.split(",");
            String property = parts[0].trim();
            Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("desc"))
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            orders.add(new Sort.Order(direction, property));
        }
        return orders;
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId) {
        try {
            itemService.deleteItem(itemId);
            return ResponseEntity.ok("Item deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Items> getItemById(@PathVariable Long id) {
        Items item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/images/{imageId}")
    public ResponseEntity<Resource> serveImage(@PathVariable Long imageId) {
        try {
            // Récupérer l'image à partir de l'ID
            Images image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

            String filename = image.getImageUrl();
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Déterminer le type de contenu basé sur l'extension du fichier
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String determineContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "png":
                return "image/png";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream";
        }
    }

}
