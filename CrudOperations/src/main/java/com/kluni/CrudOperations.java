package com.kluni;
import java.sql.*;
import java.util.Scanner;

public class CrudOperations {
	
	static String url= "jdbc:mysql://localhost:3306/fsad";
	static String usr="root";
	static String pwd="root";

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		createTables();
		Scanner sc = new Scanner(System.in);
		int choice;
		do {
			System.out.println("\n MENU \n");
			System.out.println("1.Insert Department");
			System.out.println("2. Insert Employee");
			System.out.println("3. View Employees");
			System.out.println("4. Update Employee Salary");
			System.out.println("5. Delete Employee");
			System.out.println("6. Exit");
			System.out.println("Enter the choice");
			choice=sc.nextInt();
			
			switch(choice) {
			case 1 : InsertDept();
			case 2 : InsertEmployee();
			case 3 : ViewEmployee();
			case 4 : UpdateEmployee();
			case 5 : DeleteEmployee();
			case 6 : System.out.println("Exiting.....");
			default: System.out.println("Invalid choice!");
			}
		}
		while(choice!=6);

	}
	static void createTables() {
		try(Connection con =DriverManager.getConnection(url,usr,pwd);
				Statement st= con.createStatement()){
			String Department =
				    "CREATE TABLE IF NOT EXISTS dept (" +
				    "dept_id INT PRIMARY KEY, " +
				    "dept_name VARCHAR(50)" +
				    ")";

			String Employee =
				    "CREATE TABLE IF NOT EXISTS employee (" +
				    "emp_id INT PRIMARY KEY, " +
				    "emp_name VARCHAR(50), " +
				    "salary DOUBLE, " +
				    "dept_id INT, " +
				    "FOREIGN KEY (dept_id) REFERENCES dept(dept_id)" +
				    ")";

                   st.execute(Department);
                   st.execute(Employee);
                   System.out.println("Tables created or already exists");
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	 static void InsertDept() {
		 try(Connection con =DriverManager.getConnection(url,usr,pwd)) {

	            String sql = "INSERT INTO dept VALUES (?, ?)";
	            PreparedStatement ps = con.prepareStatement(sql);
	            Scanner sc = new Scanner(System.in);

	            System.out.print("Enter Dept ID: ");
	            ps.setInt(1, sc.nextInt());

	            System.out.print("Enter Dept Name: ");
	            ps.setString(2, sc.next());

	            ps.executeUpdate();
	            System.out.println("Department inserted!");

	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }
	 
	 
	 static void InsertEmployee() {
	        try (Connection con = DriverManager.getConnection(url, usr, pwd)) {

	            String sql = "INSERT INTO employee VALUES (?, ?, ?, ?)";
	            PreparedStatement ps = con.prepareStatement(sql);
	            Scanner sc = new Scanner(System.in);

	            System.out.print("Enter Emp ID: ");
	            ps.setInt(1, sc.nextInt());

	            System.out.print("Enter Emp Name: ");
	            ps.setString(2, sc.next());

	            System.out.print("Enter Salary: ");
	            ps.setDouble(3, sc.nextDouble());

	            System.out.print("Enter Dept ID: ");
	            ps.setInt(4, sc.nextInt());

	            ps.executeUpdate();
	            System.out.println("Employee inserted!");
	            
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }

	 
	 static void ViewEmployee() {
	        try (Connection con = DriverManager.getConnection(url, usr, pwd)) {

	            String sql = "SELECT e.emp_id, e.emp_name, e.salary, d.dept_name" + "FROM employee e"+ "JOIN dept d ON e.dept_id=d.dept_id"+ "";

	            PreparedStatement ps = con.prepareStatement(sql);
	            ResultSet rs = ps.executeQuery();

	            System.out.println("\nID  Name  Salary  Dept");
	            while (rs.next()) {
	                System.out.println(
	                        rs.getInt(1) + "  " +
	                        rs.getString(2) + "  " +
	                        rs.getDouble(3) + "  " +
	                        rs.getString(4)
	                );
	            }

	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }
	 
	 
	 
	 static void UpdateEmployee() {
	        try (Connection con = DriverManager.getConnection(url, usr, pwd)) {

	            String sql = "UPDATE employee SET salary=? WHERE emp_id=?";
	            PreparedStatement ps = con.prepareStatement(sql);
	            Scanner sc = new Scanner(System.in);

	            System.out.print("Enter Emp ID: ");
	            ps.setInt(2, sc.nextInt());

	            System.out.print("Enter New Salary: ");
	            ps.setDouble(1, sc.nextDouble());

	            ps.executeUpdate();
	            System.out.println("Employee updated!");

	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }
	 
	 static void DeleteEmployee() {
	        try (Connection con = DriverManager.getConnection(url, usr, pwd)) {

	            String sql = "DELETE FROM employee WHERE emp_id=?";
	            PreparedStatement ps = con.prepareStatement(sql);
	            Scanner sc = new Scanner(System.in);

	            System.out.print("Enter Emp ID to delete: ");
	            ps.setInt(1, sc.nextInt());

	            ps.executeUpdate();
	            System.out.println("Employee deleted!");

	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }
	 
	 
	 
}
