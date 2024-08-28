package mbds.tpt.troc_api.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import mbds.tpt.troc_api.utils.ResourceNotFoundException;
import mbds.tpt.troc_api.utils.Status;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import mbds.tpt.troc_api.datamodel.ExchangeDetailsDTO;
import mbds.tpt.troc_api.entities.ExchangeItems;
import mbds.tpt.troc_api.entities.Exchanges;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.repositories.ExchangeItemsRepository;
import mbds.tpt.troc_api.repositories.ExchangeRepository;
import mbds.tpt.troc_api.repositories.ItemRepository;
import mbds.tpt.troc_api.repositories.UserRepository;
import mbds.tpt.troc_api.utils.ExchangeStatus;
import mbds.tpt.troc_api.utils.ItemRole;

@Service
public class ExchangeService {

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExchangeItemsRepository exchangeItemsRepository;

    @Transactional
    public Exchanges proposeExchange(Long requesterItemId, Long receiverItemId) {
        // Récupération des items des utilisateurs avec gestion des exceptions
        Items requesterItem = itemRepository.findById(requesterItemId)
                .orElseThrow(() -> new IllegalArgumentException("Objet à échanger introuvable"));
        Items receiverItem = itemRepository.findById(receiverItemId)
                .orElseThrow(() -> new IllegalArgumentException("Objet demandé introuvable"));

        // Récupération des utilisateurs propriétaires des items
        Users requester = requesterItem.getUser();
        Users receiver = receiverItem.getUser();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication.getPrincipal() instanceof UserDetails)) {
            throw new UsernameNotFoundException("Utilisateur non authentifié");
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Users currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        // Vérifier que l'item à échanger appartient à l'utilisateur connecté
        if (!requesterItem.getUser().equals(currentUser)) {
            throw new IllegalArgumentException("L'objet à échanger n'appartient pas à l'utilisateur connecté");
        }

        // Vérifier si l'utilisateur est activé
        if (!currentUser.isEnabled()) {
            throw new DisabledException("L'utilisateur est désactivé");
        }

        // Création de l'échange
        Exchanges exchange = new Exchanges();
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setStatus(ExchangeStatus.EN_ATTENTE);
        exchange.setCreatedAt(LocalDateTime.now());
        exchange.setUpdatedAt(LocalDateTime.now());

        // Ajout des items à l'échange
        ExchangeItems requesterExchangeItem = new ExchangeItems(exchange, requesterItem, ItemRole.DONNE);
        ExchangeItems receiverExchangeItem = new ExchangeItems(exchange, receiverItem, ItemRole.RECU);

        exchange.getExchangeItems().add(requesterExchangeItem);
        exchange.getExchangeItems().add(receiverExchangeItem);

        // Enregistrement de l'échange et des items en une seule transaction
        exchangeRepository.save(exchange);

        return exchange;
    }

    @Transactional
    public Exchanges acceptExchange(Long exchangeId) {
        Exchanges exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));

        if (!exchange.getStatus().equals(ExchangeStatus.EN_ATTENTE)) {
            throw new IllegalStateException("Exchange is not in pending status");
        }

        exchange.setStatus(ExchangeStatus.ACCEPTE);
        exchange.setUpdatedAt(LocalDateTime.now());

        // Update items status
        updateItemsStatus(exchange);

        return exchangeRepository.save(exchange);
    }

    @Transactional
    public Exchanges rejectExchange(Long exchangeId) {
        Exchanges exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));

        if (!exchange.getStatus().equals(ExchangeStatus.EN_ATTENTE)) {
            throw new IllegalStateException("Exchange is not in pending status");
        }

        exchange.setStatus(ExchangeStatus.REFUSE);
        exchange.setUpdatedAt(LocalDateTime.now());

        return exchangeRepository.save(exchange);
    }

    private void updateItemsStatus(Exchanges exchange) {
        Set<ExchangeItems> exchangeItems = exchange.getExchangeItems();
        for (ExchangeItems exchangeItem : exchangeItems) {
            Items item = exchangeItem.getItem();
            item.setStatus(Status.INDISPONIBLE);
            itemRepository.save(item);
        }
    }

    public void deleteExchange(Long exchangeId) throws Exception {
        Exchanges exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new IllegalArgumentException("Exchange not found with id: " + exchangeId));
        exchangeRepository.delete(exchange);
    }

    public List<Exchanges> getExchangesByItemId(Long itemId) {
        return exchangeRepository.findExchangesByItemId(itemId);
    }

    public List<Exchanges> getExchangesByRequester(Users requester) {
        return exchangeRepository.findByRequester(requester);
    }

    public ExchangeDetailsDTO getExchangeDetails(Long exchangeId) {
        Exchanges exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));

        List<ExchangeItems> exchangeItems = exchangeItemsRepository.findByExchangeExchangeId(exchangeId);

        return new ExchangeDetailsDTO(exchange, exchangeItems);
    }
}
