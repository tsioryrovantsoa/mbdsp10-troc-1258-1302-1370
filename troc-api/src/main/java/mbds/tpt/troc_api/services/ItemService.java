package mbds.tpt.troc_api.services;

import mbds.tpt.troc_api.datamodel.ItemDataModel;
import mbds.tpt.troc_api.entities.Images;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.repositories.ImageRepository;
import mbds.tpt.troc_api.repositories.ItemRepository;
import mbds.tpt.troc_api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
        Users user = userRepository.findById((long) itemRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Items item = new Items();
        item.setTitle(itemRequest.getTitle());
        item.setDescription(itemRequest.getDescription());
        item.setCategory(itemRequest.getCategory());
        item.setStatus(itemRequest.getStatus());
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
}
