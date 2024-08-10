package mbds.tpt.troc_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mbds.tpt.troc_api.entities.Exchanges;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchanges, Long> {
}