import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateDb {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres";
        String user = "postgres";
        String password = "root";
        
        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            // Check if database exists
            java.sql.ResultSet rs = stmt.executeQuery("SELECT 1 FROM pg_database WHERE datname = 'loanpro_db'");
            if (!rs.next()) {
                System.out.println("Creating database loanpro_db...");
                stmt.executeUpdate("CREATE DATABASE loanpro_db");
                System.out.println("Database created successfully.");
            } else {
                System.out.println("Database loanpro_db already exists.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
