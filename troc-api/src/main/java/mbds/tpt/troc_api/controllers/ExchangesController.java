package mbds.tpt.troc_api.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mbds.tpt.troc_api.entities.Exchanges;
import mbds.tpt.troc_api.entities.Items;
import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.repositories.UserRepository;
import mbds.tpt.troc_api.services.ExchangeService;
import mbds.tpt.troc_api.utils.ErrorResponse;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangesController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExchangeService exchangeService;

    @PostMapping("/propose")
    public ResponseEntity<?> proposeExchange(
            @RequestParam Long requesterItemId,
            @RequestParam Long receiverItemId) {
        try {
            Exchanges exchange = exchangeService.proposeExchange(requesterItemId, receiverItemId);
            return ResponseEntity.ok(exchange);
        } catch (Exception e) {
            return ErrorResponse.handleException(e);
        }

    }

    @PutMapping("/{exchangeId}/accept")
    public ResponseEntity<Exchanges> acceptExchange(@PathVariable Long exchangeId) {
        Exchanges updatedExchange = exchangeService.acceptExchange(exchangeId);
        return ResponseEntity.ok(updatedExchange);
    }

    @PutMapping("/{exchangeId}/reject")
    public ResponseEntity<Exchanges> rejectExchange(@PathVariable Long exchangeId) {
        Exchanges updatedExchange = exchangeService.rejectExchange(exchangeId);
        return ResponseEntity.ok(updatedExchange);
    }

    @GetMapping("/item/{item_id}")
    public ResponseEntity<List<Exchanges>> getItemById(@PathVariable Long item_id) {
        List<Exchanges> exchanges = exchangeService.getExchangesByItemId(item_id);
        return ResponseEntity.ok(exchanges);
    }

    @GetMapping("/my-requests")
    public List<Exchanges> getMyRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Users currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        return exchangeService.getExchangesByRequester(currentUser);
    }
}
