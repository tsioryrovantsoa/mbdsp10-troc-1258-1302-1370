package mbds.tpt.troc_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mbds.tpt.troc_api.entities.Exchanges;
import mbds.tpt.troc_api.services.ExchangeService;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangesController {

    @Autowired
    private ExchangeService exchangeService;

    @PostMapping("/propose")
    public ResponseEntity<Exchanges> proposeExchange(
            @RequestParam Long requesterItemId,
            @RequestParam Long receiverItemId) {
        Exchanges exchange = exchangeService.proposeExchange(requesterItemId, receiverItemId);
        return ResponseEntity.ok(exchange);
    }

    // Ajoutez d'autres méthodes pour accepter, refuser ou terminer un échange
}
