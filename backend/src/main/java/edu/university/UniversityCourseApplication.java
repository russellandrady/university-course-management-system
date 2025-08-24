package edu.university;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.CrossOrigin;

@EnableMethodSecurity
@SpringBootApplication
public class UniversityCourseApplication {
	public static void main(String[] args) {
		SpringApplication.run(UniversityCourseApplication.class, args);
	}
}
