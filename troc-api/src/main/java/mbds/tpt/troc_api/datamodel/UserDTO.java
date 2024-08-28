package mbds.tpt.troc_api.datamodel;

import mbds.tpt.troc_api.entities.Users;

public class UserDTO {
    private Long userId;
    private String username;
    private String name;
    private String email;

    public UserDTO(Users user) {
        this.userId = user.getUser_id();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
