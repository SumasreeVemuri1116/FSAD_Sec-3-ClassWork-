package com.klu.service;

import java.util.List;

import com.klu.model.Student;

public interface StudentService {
	
    Student createStudent(Student student);
    Student getStudentById(int id);
    List<Student> getAllStudents();
    Student updateStudent(int id,Student student);
    String deleteStudent(int id);
    List<Student> searchStudent(String name,String course);
}
