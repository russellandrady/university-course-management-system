package edu.university.admin.service;

import edu.university.admin.model.Course;
import edu.university.admin.model.CourseOffering;
import edu.university.admin.model.Student;
import edu.university.admin.repository.CourseOfferingRepository;
import edu.university.admin.repository.CourseRepository;
import edu.university.admin.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseOfferingService {

    private final CourseOfferingRepository courseOfferingRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public CourseOfferingService(CourseOfferingRepository courseOfferingRepository,
                                 StudentRepository studentRepository,
                                 CourseRepository courseRepository) {
        this.courseOfferingRepository = courseOfferingRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<CourseOffering> getAllCourseOfferings() {
        return courseOfferingRepository.findAll();
    }

    public CourseOffering getById(Long id) {
        return courseOfferingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course offering not found"));
    }

    // Add offering using a request object
    public CourseOffering addCourseOffering(CourseOfferingRequest request) {
        Student student = studentRepository.findByStudentId(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseOffering offering = new CourseOffering(student, course, request.getOfferedYear(), request.getResult());
        return courseOfferingRepository.save(offering);
    }

    public CourseOffering update(Long id, CourseOfferingRequest request) {
        CourseOffering co = getById(id);

        Student student = studentRepository.findByStudentId(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        co.setStudent(student);
        co.setCourse(course);
        co.setOfferedYear(request.getOfferedYear());
        co.setResult(request.getResult());

        return courseOfferingRepository.save(co);
    }

    public void delete(Long id) {
        courseOfferingRepository.deleteById(id);
    }
}
