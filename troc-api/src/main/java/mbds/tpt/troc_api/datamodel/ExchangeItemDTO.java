package mbds.tpt.troc_api.datamodel;

import mbds.tpt.troc_api.entities.ExchangeItems;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.utils.Category;
import mbds.tpt.troc_api.utils.ItemRole;
import mbds.tpt.troc_api.utils.Status;

public class ExchangeItemDTO {
    private Long itemId;
    private String title;
    private String description;
    private Category category;
    private Status status;
    private ItemRole role;

    public ExchangeItemDTO(ExchangeItems exchangeItem) {
        Items item = exchangeItem.getItem();
        this.itemId = item.getItemId();
        this.title = item.getTitle();
        this.description = item.getDescription();
        this.category = item.getCategory();
        this.status = item.getStatus();
        this.role = exchangeItem.getRole();
    }

    public Long getItemId() {
        return itemId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Category getCategory() {
        return category;
    }

    public Status getStatus() {
        return status;
    }

    public ItemRole getItemRole() {
        return role;
    }
}
