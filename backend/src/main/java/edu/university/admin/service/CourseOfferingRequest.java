package edu.university.admin.service;

public class CourseOfferingRequest {
    private String studentId;
    private String courseId;
    private int offeredYear;
    private int result;

    // Getters and Setters
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public int getOfferedYear() { return offeredYear; }
    public void setOfferedYear(int offeredYear) { this.offeredYear = offeredYear; }

    public int getResult() { return result; }
    public void setResult(int result) { this.result = result; }
}
