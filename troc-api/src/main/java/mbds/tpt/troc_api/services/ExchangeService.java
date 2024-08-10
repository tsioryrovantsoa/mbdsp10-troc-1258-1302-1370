package mbds.tpt.troc_api.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
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
        Items requesterItem = itemRepository.findById(requesterItemId)
                .orElseThrow(() -> new RuntimeException("Requester item not found"));
        Items receiverItem = itemRepository.findById(receiverItemId)
                .orElseThrow(() -> new RuntimeException("Receiver item not found"));

        Users requester = requesterItem.getUser();
        Users receiver = receiverItem.getUser();

        Exchanges exchange = new Exchanges();
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setStatus(ExchangeStatus.EN_ATTENTE);
        exchange.setCreatedAt(LocalDateTime.now());
        exchange.setUpdatedAt(LocalDateTime.now());

        exchangeRepository.save(exchange);

        ExchangeItems requesterExchangeItem = new ExchangeItems(exchange, requesterItem, ItemRole.DONNE);
        ExchangeItems receiverExchangeItem = new ExchangeItems(exchange, receiverItem, ItemRole.RECU);

        exchange.getExchangeItems().add(requesterExchangeItem);
        exchange.getExchangeItems().add(receiverExchangeItem);

        exchangeRepository.save(exchange);

        return exchange;
    }
}
