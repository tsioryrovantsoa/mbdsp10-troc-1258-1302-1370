package mbds.tpt.troc_api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mbds.tpt.troc_api.entities.ExchangeItems;

@Repository
public interface ExchangeItemsRepository extends JpaRepository<ExchangeItems, Long> {
    List<ExchangeItems> findByExchange_ExchangeId(Long exchangeId);
}