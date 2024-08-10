package mbds.tpt.troc_api.entities;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import mbds.tpt.troc_api.utils.ExchangeStatus;

@Entity
@Table(name = "exchanges")
public class Exchanges {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exchange_id")
    private Long exchangeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private Users requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Users receiver;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ExchangeStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "exchange", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ExchangeItems> exchangeItems = new HashSet<>();

    // Constructeurs
    public Exchanges() {
    }

    public Exchanges(Users requester, Users receiver, ExchangeStatus status, LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.requester = requester;
        this.receiver = receiver;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters et Setters
    public Long getExchangeId() {
        return exchangeId;
    }

    public void setExchangeId(Long exchangeId) {
        this.exchangeId = exchangeId;
    }

    public Users getRequester() {
        return requester;
    }

    public void setRequester(Users requester) {
        this.requester = requester;
    }

    public Users getReceiver() {
        return receiver;
    }

    public void setReceiver(Users receiver) {
        this.receiver = receiver;
    }

    public ExchangeStatus getStatus() {
        return status;
    }

    public void setStatus(ExchangeStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<ExchangeItems> getExchangeItems() {
        return exchangeItems;
    }

    public void setExchangeItems(Set<ExchangeItems> exchangeItems) {
        this.exchangeItems = exchangeItems;
    }

    // Méthode utilitaire pour ajouter un item à l'échange
    public void addExchangeItem(ExchangeItems exchangeItem) {
        exchangeItems.add(exchangeItem);
        exchangeItem.setExchange(this);
    }

    // Méthode utilitaire pour retirer un item de l'échange
    public void removeExchangeItem(ExchangeItems exchangeItem) {
        exchangeItems.remove(exchangeItem);
        exchangeItem.setExchange(null);
    }
}
