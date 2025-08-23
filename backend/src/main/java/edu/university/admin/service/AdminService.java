package edu.university.admin.service;

import edu.university.admin.model.Admin;
import edu.university.admin.model.Student;
import edu.university.admin.repository.AdminRepository;
import edu.university.admin.repository.StudentRepository;
import edu.university.security.util.JwtUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtutil;

    // Insert default admin (admin/admin) if not exists
    @PostConstruct
    public void init() {
        adminRepository.findByUsername("admin")
                .orElseGet(() -> adminRepository.save(
                        new Admin("admin", passwordEncoder.encode("admin"))
                ));
    }

    public String login(String username, String password) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Generate JWT with role ADMIN
        return jwtutil.generateToken(username, "ADMIN");
    }

    private final StudentRepository repo;

    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder, JwtUtil jwtutil, StudentRepository repo) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtutil = jwtutil;
        this.repo = repo;
    }

}
