package mbds.tpt.troc_api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mbds.tpt.troc_api.entities.ExchangeItems;
import mbds.tpt.troc_api.services.ExchangeItemsService;

@RestController
@RequestMapping("/api/exchange-items")
public class ExchangeItemsController {

    @Autowired
    private ExchangeItemsService exchangeItemsService;

    @GetMapping("/exchange/{exchangeId}")
    public List<ExchangeItems> getExchangeItemsByExchangeId(@PathVariable Long exchangeId) {
        return exchangeItemsService.getExchangeItemsByExchangeId(exchangeId);
    }
}
