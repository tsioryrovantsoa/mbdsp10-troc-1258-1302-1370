package mbds.tpt.troc_api.controllers;

import mbds.tpt.troc_api.datamodel.ItemDataModel;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/items")
public class ItemsController {

    @Autowired
    private ItemService itemService;

    @PostMapping
    public ResponseEntity<Items> createItem(@ModelAttribute ItemDataModel itemData) {
        try {
            Items createdItem = itemService.createItem(itemData);
            return ResponseEntity.ok(createdItem);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
