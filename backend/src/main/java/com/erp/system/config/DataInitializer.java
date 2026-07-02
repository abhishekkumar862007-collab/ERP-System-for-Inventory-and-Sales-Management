package com.erp.system.config;

import com.erp.system.entity.Role;
import com.erp.system.entity.User;
import com.erp.system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        createOrUpdateUser("admin", "admin@erp.com", "admin1234", Role.ROLE_ADMIN);
        createOrUpdateUser("sales", "sales@erp.com", "sales1234", Role.ROLE_SALES_EXECUTIVE);
        createOrUpdateUser("purchase", "purchase@erp.com", "purchase1234", Role.ROLE_PURCHASE_MANAGER);
        createOrUpdateUser("inventory", "inventory@erp.com", "inventory1234", Role.ROLE_INVENTORY_MANAGER);
        createOrUpdateUser("accountant", "accountant@erp.com", "accountant1234", Role.ROLE_ACCOUNTANT);
    }

    private void createOrUpdateUser(String username, String email, String password, Role role) {
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            User user = new User(
                    username,
                    email,
                    passwordEncoder.encode(password),
                    role
            );
            userRepository.save(user);
            System.out.println("Default user created: " + username + " / " + password + " (" + role + ")");
        } else {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(password));
            user.setEmail(email);
            user.setRole(role);
            userRepository.save(user);
            System.out.println("User updated: " + username + " / " + password + " (" + role + ")");
        }
    }
}
