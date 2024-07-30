package mbds.tpt.troc_api.services;

import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.repositories.UserRepository;
import mbds.tpt.troc_api.utils.UserValidationUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Component
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        List<GrantedAuthority> authorities = new ArrayList<>();
        if (users.getRole() != null && !users.getRole().isEmpty()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + users.getRole().toUpperCase()));
        }

        return new org.springframework.security.core.userdetails.User(
                users.getUsername(),
                users.getPassword(),
                authorities);
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
            role = "ROLE_USER"; // Valeur par défaut pour le rôle
        }
        // Valeur par défaut de isEnabled = true pour avoir un utilisateur actif (non
        // suspendu) à la création
        // Possibilité de changement de cette valeur par défaut en 'false' si l'on met
        // en place un système de vérification d'email.
        boolean isEnabled = true;

        // Validation de l'email
        UserValidationUtils.isValidEmail(email);

        // Validation et formatage du téléphone
        phone = UserValidationUtils.formatPhoneNumber(phone);

        // Hacher le mot de passe avant de l'enregistrer
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        Users users = new Users(username, name, hashedPassword, email, phone, address, role, LocalDateTime.now(),
                null, null, true);
        return userRepository.save(users);
    }

    public Users reactivateUser(Long userId) {
        Users user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        if (user.isEnabled()) {
            throw new IllegalStateException("User is already active");
        }
        
        user.setEnabled(true);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}
