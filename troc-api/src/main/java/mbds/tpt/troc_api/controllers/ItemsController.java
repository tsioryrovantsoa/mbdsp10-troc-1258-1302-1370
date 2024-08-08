package mbds.tpt.troc_api.controllers;

import mbds.tpt.troc_api.datamodel.ItemDataModel;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.services.ItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/items")
public class ItemsController {

    @Autowired
    private ItemService itemService;

    @PostMapping
    public ResponseEntity<?> createItem(@ModelAttribute ItemDataModel itemData) {
        try {
            Items createdItem = itemService.createItem(itemData);
            return ResponseEntity.ok(createdItem);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<Items> updateItem(
            @PathVariable Long itemId,
            @ModelAttribute ItemDataModel itemRequest) throws Exception {

        // Items updatedItem = itemService.updateItem(itemId, itemRequest);
        // return ResponseEntity.ok(updatedItem);
        try {
            Items updatedItem = itemService.updateItem(itemId, itemRequest);
            return ResponseEntity.ok(updatedItem);
        } catch (IOException e) {
            // Handle the exception, e.g., return a 500 error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
