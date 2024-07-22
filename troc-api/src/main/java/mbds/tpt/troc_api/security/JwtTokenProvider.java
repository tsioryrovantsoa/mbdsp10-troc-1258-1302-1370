package mbds.tpt.troc_api.security;

import io.jsonwebtoken.*;
import mbds.tpt.troc_api.entities.Users;
import mbds.tpt.troc_api.services.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    @Autowired
    private UserService userService;

    private Key key;

    public JwtTokenProvider(@Value("${app.jwtSecret}") String jwtSecret) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        User userPrincipal = (User) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        Users users = userService.getByUsername(userPrincipal.getUsername());
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", users.getUser_id());
        claims.put("username", users.getUsername());
        claims.put("name", users.getName());
        claims.put("email", users.getEmail());
        claims.put("phone", users.getPhone());
        claims.put("address", users.getAddress());
        claims.put("role", users.getRole());
        claims.put("createdAt", users.getCreatedAt().toString());
        if (users.getUpdatedAt() != null) {
            claims.put("updatedAt", users.getUpdatedAt().toString());
        }
        if (users.getDeletedAt() != null) {
            claims.put("deletedAt", users.getDeletedAt().toString());
        }

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();

        // return claims.getSubject();

        System.out.println("Claims: " + claims);
        return claims.get("username", String.class);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(key).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            // Log exception
        } catch (MalformedJwtException ex) {
            // Log exception
        } catch (ExpiredJwtException ex) {
            // Log exception
        } catch (UnsupportedJwtException ex) {
            // Log exception
        } catch (IllegalArgumentException ex) {
            // Log exception
        }
        return false;
    }
}