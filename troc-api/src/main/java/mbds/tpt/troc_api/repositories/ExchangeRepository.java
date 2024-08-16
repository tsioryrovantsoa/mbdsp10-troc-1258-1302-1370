package mbds.tpt.troc_api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mbds.tpt.troc_api.entities.Exchanges;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchanges, Long> {
    @Query("SELECT e FROM Exchanges e JOIN e.exchangeItems ei WHERE ei.item.item_id = :itemId")
    List<Exchanges> findExchangesByItemId(@Param("itemId") Long itemId);
}