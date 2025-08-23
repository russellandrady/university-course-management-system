package edu.university.admin.model;

import jakarta.persistence.*;
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId; // university id

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int registeredYear;

    // Constructors
    public Student() {}

    public Student(String studentId, String name, int registeredYear) {
        this.studentId = studentId;
        this.name = name;
        this.registeredYear = registeredYear;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getRegisteredYear() { return registeredYear; }
    public void setRegisteredYear(int registeredYear) { this.registeredYear = registeredYear; }
}
