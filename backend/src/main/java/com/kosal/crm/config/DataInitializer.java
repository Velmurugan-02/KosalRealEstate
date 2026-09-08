package com.kosal.crm.config;

import com.kosal.crm.entity.Role;
import com.kosal.crm.entity.User;
import com.kosal.crm.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!userRepository.existsByEmail("admin@kosal.com")) {

                User admin = new User();

                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setEmail("admin@kosal.com");
                admin.setPassword(
                        passwordEncoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                admin.setActive(true);

                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("sales@kosal.com")) {

                User sales = new User();

                sales.setFirstName("Sales");
                sales.setLastName("Employee");
                sales.setEmail("sales@kosal.com");
                sales.setPassword(
                        passwordEncoder.encode("Sales@123"));
                sales.setRole(Role.SALES_EMPLOYEE);
                sales.setActive(true);

                userRepository.save(sales);
            }
        };
    }
}