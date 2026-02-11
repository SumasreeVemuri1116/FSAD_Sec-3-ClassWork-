package com.klu.service;

import org.springframework.stereotype.Service;

@Service
public class CalcService {
	public int add(int a, int b) {
		return a+b;
	}
	
	public int subtract(int a, int b) {
		return a-b;
	}
	
	public int multiply(int a,int b) {
		return a*b;
	}
	
	public double division(int a, int b) {
		if(b==0) {
			throw new ArithmeticException("Division is not possible");
		}
		return (double) a/b;
	}
	
	public int modulus(int a,int b) {
		return a%b;
	}

}
