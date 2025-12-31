package com.klu;
import javax.persistence.*;

@Entity
@Table(name="Student")
public class Student {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private String name;
	
	public Student();
	public Student(String name) {
		this.name=name;
	}
	

}
