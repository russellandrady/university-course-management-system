package edu.university.admin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String courseId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int credits;

    @Column(nullable = false)
    private boolean mandatory;

    // Constructors
    public Course() {}

    public Course(String courseId, String name, int credits, boolean mandatory) {
        this.courseId = courseId;
        this.name = name;
        this.credits = credits;
        this.mandatory = mandatory;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }
    public boolean isMandatory() { return mandatory; }
    public void setMandatory(boolean mandatory) { this.mandatory = mandatory; }
}
