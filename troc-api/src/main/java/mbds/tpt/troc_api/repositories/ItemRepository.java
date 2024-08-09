package mbds.tpt.troc_api.repositories;

import mbds.tpt.troc_api.entities.Items;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import mbds.tpt.troc_api.utils.Category;
import mbds.tpt.troc_api.utils.Status;
@Repository
public interface ItemRepository extends JpaRepository<Items, Long> {

@Query("SELECT i FROM Items i WHERE " +
           "(:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:category IS NULL OR i.category = :category) " +
           "AND (:status IS NULL OR i.status = :status)")
    Page<Items> findBySearchCriteria(@Param("keyword") String keyword, 
                                     @Param("category") Category category, 
                                     @Param("status") Status status, 
                                     Pageable pageable);

}
