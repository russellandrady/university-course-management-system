package edu.university.admin.dto;

import edu.university.admin.model.CourseOffering;

public class CourseOfferingResponse {

    private Long id;
    private StudentDto student;
    private CourseDto course;
    private int offeredYear;
    private Integer result;

    public CourseOfferingResponse() {}

    public CourseOfferingResponse(CourseOffering co) {
        this.id = co.getId();
        this.student = new StudentDto(co.getStudent().getStudentId(), co.getStudent().getName());
        this.course = new CourseDto(co.getCourse().getCourseId(), co.getCourse().getName());
        this.offeredYear = co.getOfferedYear();
        this.result = co.getResult();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StudentDto getStudent() { return student; }
    public void setStudent(StudentDto student) { this.student = student; }

    public CourseDto getCourse() { return course; }
    public void setCourse(CourseDto course) { this.course = course; }

    public int getOfferedYear() { return offeredYear; }
    public void setOfferedYear(int offeredYear) { this.offeredYear = offeredYear; }

    public Integer getResult() { return result; }
    public void setResult(Integer result) { this.result = result; }

    // Inner DTOs
    public static class StudentDto {
        private String studentId;
        private String name;

        public StudentDto() {}
        public StudentDto(String studentId, String name) {
            this.studentId = studentId;
            this.name = name;
        }

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class CourseDto {
        private String courseId;
        private String name;

        public CourseDto() {}
        public CourseDto(String courseId, String name) {
            this.courseId = courseId;
            this.name = name;
        }

        public String getCourseId() { return courseId; }
        public void setCourseId(String courseId) { this.courseId = courseId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
