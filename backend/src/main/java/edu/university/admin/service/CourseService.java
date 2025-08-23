package edu.university.admin.service;

import edu.university.admin.model.Course;
import edu.university.admin.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public List<Course> getAllCourses() {
        return repo.findAll();
    }

    public Course getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course addCourse(Course course) {
        return repo.save(course);
    }

    public Course update(Long id, Course updated) {
        Course course = getById(id);
        course.setCourseId(updated.getCourseId());
        course.setName(updated.getName());
        course.setCredits(updated.getCredits());
        course.setMandatory(updated.isMandatory());
        return repo.save(course);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
