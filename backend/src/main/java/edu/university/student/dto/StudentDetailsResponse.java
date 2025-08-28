package edu.university.student.dto;


import java.util.List;

public class StudentDetailsResponse {
    private Long studentId;
    private String name;
    private List<CourseOfferingResponse> courseOfferings;

    public StudentDetailsResponse() {}

    public StudentDetailsResponse(Long studentId, String name, List<CourseOfferingResponse> courseOfferings) {
        this.studentId = studentId;
        this.name = name;
        this.courseOfferings = courseOfferings;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CourseOfferingResponse> getCourseOfferings() {
        return courseOfferings;
    }

    public void setCourseOfferings(List<CourseOfferingResponse> courseOfferings) {
        this.courseOfferings = courseOfferings;
    }
}

