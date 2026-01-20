package com.klu.model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ProductOrder {
	private int orderid;
	private String customerName;
	private String productName;
	private int quantity;
	
	public ProductOrder(@Value("102")int orderid, @Value("Vemuri")String customerName)
	{
		this.orderid = orderid;
		this.customerName = customerName;
	}
	@Value("Mobile")
	public void setProductName(String productName) {
		this.productName = productName;
	}
	@Value("2")
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
	public void display() {
		System.out.println("Following is the order details: \n");
		System.out.println("Order ID      : " + orderid);
		System.out.println("Customer Name : " + customerName);
		System.out.println("Product Name  : " + productName);
		System.out.println("Quantity      : " + quantity);
	}

}
