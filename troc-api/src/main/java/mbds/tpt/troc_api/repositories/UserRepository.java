package mbds.tpt.troc_api.repositories;

import mbds.tpt.troc_api.entities.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);

    @Query(
        "SELECT u FROM Users u WHERE " +
        "(:name IS NULL OR u.name LIKE %:name%) AND " +
        "(:role IS NULL OR u.role = :role) " +
        "ORDER BY u.createdAt DESC"
    )
    Page<Users> findUsers(
        @Param("name") String name,
        @Param("role") String role,
        Pageable pageable
    );
}
