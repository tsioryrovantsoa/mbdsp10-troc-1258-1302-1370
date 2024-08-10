package mbds.tpt.troc_api.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import mbds.tpt.troc_api.utils.ItemRole;

@Entity
@Table(name = "exchange_items")
public class ExchangeItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exchange_item_id")
    private Long exchangeItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exchange_id", nullable = false)
    @JsonIgnore
    private Exchanges exchange;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    @JsonIgnore
    private Items item;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private ItemRole role;

    // Constructeurs
    public ExchangeItems() {
    }

    public ExchangeItems(Exchanges exchange, Items item, ItemRole role) {
        this.exchange = exchange;
        this.item = item;
        this.role = role;
    }

    // Getters et Setters
    public Long getExchangeItemId() {
        return exchangeItemId;
    }

    public void setExchangeItemId(Long exchangeItemId) {
        this.exchangeItemId = exchangeItemId;
    }

    public Exchanges getExchange() {
        return exchange;
    }

    public void setExchange(Exchanges exchange) {
        this.exchange = exchange;
    }

    public Items getItem() {
        return item;
    }

    public void setItem(Items item) {
        this.item = item;
    }

    public ItemRole getRole() {
        return role;
    }

    public void setRole(ItemRole role) {
        this.role = role;
    }
}
