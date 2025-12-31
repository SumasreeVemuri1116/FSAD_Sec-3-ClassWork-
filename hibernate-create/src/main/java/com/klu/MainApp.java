package com.klu;
import org.hibernate.*;
import org.hibernate.action.*;

public class MainApp {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		// Load configuration & create sessionfactory
		SessionFactory factory=new Configuration().configure().buildSessionFactory();
		
		//Open Session
		Session session=factory.openSession();
		//begin trasaction
		Transaction tx=session.beginTransaction();
		//create object
		Student s=new Student("Suma");
		
		//save object
		session.save(s);
		//commit
		tx.commit();
		//close the resourses
		session.close();
		factory.close();
		System.out.println("Data have been inserted successfully");
		

	}

}
