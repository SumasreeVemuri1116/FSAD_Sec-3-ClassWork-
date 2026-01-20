package com.klu.model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CourseRegistration {
	private int rollNo;
	private String studentName;
	private String courseName;
	private int semester;
	public CourseRegistration(@Value("101")int rollNo, @Value("Suma")String studentName) {
		this.rollNo = rollNo;
		this.studentName = studentName;
	}
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}
	public void setSemester(int semister) {
		this.semester = semister;
	}
	public void display() {
		System.out.println("RollNo    : " + rollNo);
		System.out.println("Name      : " + studentName);
		System.out.println("Course    : " + courseName);
		System.out.println("Semester  : " + semester);
		
	}

}
