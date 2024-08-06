package mbds.tpt.troc_api.repositories;

import mbds.tpt.troc_api.entities.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Images, Long> {

}
