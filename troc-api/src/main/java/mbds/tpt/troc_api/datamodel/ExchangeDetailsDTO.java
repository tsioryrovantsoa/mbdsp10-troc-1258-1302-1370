package mbds.tpt.troc_api.datamodel;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import mbds.tpt.troc_api.entities.ExchangeItems;
import mbds.tpt.troc_api.entities.Exchanges;
import mbds.tpt.troc_api.utils.ExchangeStatus;

public class ExchangeDetailsDTO {
    private Long exchangeId;
    private UserDTO requester;
    private UserDTO receiver;
    private ExchangeStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ExchangeItemDTO> items;

    public ExchangeDetailsDTO(Exchanges exchange, List<ExchangeItems> exchangeItems) {
        this.exchangeId = exchange.getExchangeId();
        this.requester = new UserDTO(exchange.getRequester());
        this.receiver = new UserDTO(exchange.getReceiver());
        this.status = exchange.getStatus();
        this.createdAt = exchange.getCreatedAt();
        this.updatedAt = exchange.getUpdatedAt();
        this.items = exchangeItems.stream()
                .map(ExchangeItemDTO::new)
                .collect(Collectors.toList());
    }

    public Long getExchangeId() {
        return exchangeId;
    } 

    public UserDTO getRequester() {
        return requester;
    }

    public UserDTO getReceiver() {
        return receiver;
    }

    public ExchangeStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<ExchangeItemDTO> getItems() {
        return items;
    }
}
