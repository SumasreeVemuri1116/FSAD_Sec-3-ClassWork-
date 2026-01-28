package com.klu.main;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.klu.config.AppConfig;
import com.klu.model.Library;

public class MainApp {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class); 
        Library library = context.getBean(Library.class);
        library.displayDetails();

	}

}
