import io.github.cdimascio.dotenv.Dotenv;

public class Main {
    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();
        String apiKey = dotenv.get("GEMINI_API_KEY");

        if (apiKey == null) {
            System.out.println("❌ API key NOT found");
        } else {
            System.out.println("✅ API key loaded: " + apiKey.substring(0, 5) + "*****");
        }
    }
}
