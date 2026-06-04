import java.sql.Connection;
import java.sql.DriverManager;

public class TestPasswords {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/postgres";
        String user = "postgres";
        String[] passwords = {"", "postgres", "admin", "root", "password", "123456", "postgres123"};
        
        for (String pwd : passwords) {
            try (Connection conn = DriverManager.getConnection(url, user, pwd)) {
                System.out.println("SUCCESS! Password is: '" + pwd + "'");
                System.exit(0);
            } catch (Exception e) {
                // Ignore and try next
            }
        }
        System.out.println("Failed to find password.");
    }
}
