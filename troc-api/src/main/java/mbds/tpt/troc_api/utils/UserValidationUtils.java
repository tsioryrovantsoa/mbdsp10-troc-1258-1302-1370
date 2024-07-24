package mbds.tpt.troc_api.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserValidationUtils {

    // Valider l'email
    public static boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);

        if (!matcher.matches()) {
            throw new IllegalArgumentException("Invalid email format: " + email);
        }
        return true;
    }

    // Valider et formater le numéro de téléphone
    public static String formatPhoneNumber(String phone) throws IllegalArgumentException {
        // Expression régulière pour correspondre à différents formats de numéros
        // malgaches
        String phoneRegex = "^(\\+261|261|0)?(3[2-4|7-8])(\\d{7})$";
        Pattern pattern = Pattern.compile(phoneRegex);
        Matcher matcher = pattern.matcher(phone);

        if (matcher.matches()) {
            String prefix = matcher.group(2);
            String number = matcher.group(3);

            // Reformater le numéro en format international +261320000000
            return "+261" + prefix + number;
        } else {
            throw new IllegalArgumentException("Invalid phone number format.");
        }
    }
}
