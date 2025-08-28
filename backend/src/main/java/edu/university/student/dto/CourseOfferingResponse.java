package edu.university.student.dto;

public class CourseOfferingResponse {
    private Long offeringId;
    private String courseId;
    private String courseName;
    private int offeredYear;
    private String result;

    public CourseOfferingResponse() {}

    public CourseOfferingResponse(Long offeringId, String courseId, String courseName, int offeredYear, String result) {
        this.offeringId = offeringId;
        this.courseId = courseId;
        this.courseName = courseName;
        this.offeredYear = offeredYear;
        this.result = result;
    }

    public Long getOfferingId() {
        return offeringId;
    }

    public void setOfferingId(Long offeringId) {
        this.offeringId = offeringId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public int getOfferedYear() {
        return offeredYear;
    }

    public void setOfferedYear(int offeredYear) {
        this.offeredYear = offeredYear;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}