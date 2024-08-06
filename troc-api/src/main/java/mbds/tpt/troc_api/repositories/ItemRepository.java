package mbds.tpt.troc_api.repositories;

import mbds.tpt.troc_api.entities.Items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Items, Long> {

}
