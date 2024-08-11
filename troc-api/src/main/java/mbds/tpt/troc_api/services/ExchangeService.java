package mbds.tpt.troc_api.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import mbds.tpt.troc_api.entities.ExchangeItems;
import mbds.tpt.troc_api.entities.Exchanges;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.entities.Users;
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

}
