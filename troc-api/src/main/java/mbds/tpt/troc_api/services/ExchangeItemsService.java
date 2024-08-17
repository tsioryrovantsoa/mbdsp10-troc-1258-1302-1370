package mbds.tpt.troc_api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mbds.tpt.troc_api.entities.ExchangeItems;
import mbds.tpt.troc_api.repositories.ExchangeItemsRepository;

@Service
public class ExchangeItemsService {

    @Autowired
    private ExchangeItemsRepository exchangeItemsRepository;

    public List<ExchangeItems> getExchangeItemsByExchangeId(Long exchangeId) {
        return exchangeItemsRepository.findByExchange_ExchangeId(exchangeId);
    }
}
