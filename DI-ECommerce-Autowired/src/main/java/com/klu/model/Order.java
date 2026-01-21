package com.klu.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Order {
	private int orderId;
	private String customerName;
	private int quantity;
	@Autowired
	private Product product;
	
	
	public Order() {
		this.orderId = 2006;
		this.customerName = "Sumasree";
		this.quantity = 2;
	}
	public void display() {
		System.out.println("The following are the order details: \n");
		System.out.println("Order ID         : "  + orderId);
		System.out.println("Customer Name    : "  + customerName);
		System.out.println("Qunatity         : "  + quantity);
		System.out.println("Product ID       : "  + product.getProductId());
		System.out.println("Product Name     : "  + product.getProductName());
		System.out.println("Price            : "  + product.getPrice());
		System.out.println("Product Category : "  + product.getCategory());

		
	}

}
