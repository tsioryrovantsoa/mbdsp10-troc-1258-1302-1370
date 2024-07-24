package mbds.tpt.troc_api.services;

import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@Component
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                users.getUsername(),
                users.getPassword(),
                new ArrayList<>());
    }

    public Users getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public Page<Users> findUsers(String name, String role, Pageable pageable) {
        return userRepository.findUsers(name, role, pageable);
    }

    public Users registerUser(String username, String name, String password, String email, String phone, String address,
            String role) {
        if (role == null || role.isEmpty()) {
            role = "USER"; // Valeur par défaut pour le rôle
        }
        // Valeur par défaut de isEnabled = true pour avoir un utilisateur actif (non
        // suspendu) à la création
        // Possibilité de changement de cette valeur par défaut en 'false' si l'on met
        // en place un système de vérification d'email.
        boolean isEnabled = true;
        Users users = new Users(username, name, password, email, phone, address, role, LocalDateTime.now(),
                null, null, isEnabled);
        return userRepository.save(users);
    }
}
