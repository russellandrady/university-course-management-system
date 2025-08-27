package edu.university.admin.service;

public class CourseOfferingUpdateRequest {
    private Long id;          // auto-increment ID of the course offering
    private Integer offeredYear; // new offered year
    private Integer result;      // new result

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getOfferedYear() { return offeredYear; }
    public void setOfferedYear(Integer offeredYear) { this.offeredYear = offeredYear; }

    public Integer getResult() { return result; }
    public void setResult(Integer result) { this.result = result; }
}