package edu.university.admin.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "course_offerings")
public class CourseOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonBackReference
    @JsonIgnoreProperties({"courseOfferings", "password"})
    private Student student;

    // Many offerings belong to one course
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonBackReference
    private Course course;

    @Column(nullable = false)
    private int offeredYear;

    private Integer result; // can be null until graded

    // Constructors
    public CourseOffering() {}

    public CourseOffering(Student student, Course course, int offeredYear, Integer result) {
        this.student = student;
        this.course = course;
        this.offeredYear = offeredYear;
        this.result = result;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public int getOfferedYear() { return offeredYear; }
    public void setOfferedYear(int offeredYear) { this.offeredYear = offeredYear; }
    public Integer getResult() { return result; }
    public void setResult(Integer result) { this.result = result; }
}
