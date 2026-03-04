package com.klu.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.Student;

public interface StudentRepo extends JpaRepository<Student, Integer> {
	List<Student> findByNameIgnoreCaseAndCourseIgnoreCase(String name, String course);
}
