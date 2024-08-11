package mbds.tpt.troc_api.controllers;

import mbds.tpt.troc_api.datamodel.ItemDataModel;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.services.ItemService;
import mbds.tpt.troc_api.utils.ErrorResponse;

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
}
