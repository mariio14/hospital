package es.udc.fi.tfg.rest.common;

import java.text.Normalizer;
import java.util.Locale;

/**
 * Utility class for sanitizing identifiers to be used with Clingo (Answer Set Programming).
 * Clingo identifiers must start with a lowercase letter and contain only alphanumeric characters and underscores.
 */
public class ClingoUtils {
    
    /**
     * Sanitizes a string to be a valid Clingo identifier.
     * - Removes accents and diacritics
     * - Replaces spaces with underscores
     * - Removes all non-alphanumeric characters except underscores
     * - Converts to lowercase
     * - Ensures it starts with a letter (prefixes with 'id_' if needed)
     * 
     * @param input the string to sanitize
     * @return a sanitized string suitable for use as a Clingo identifier
     */
    public static String sanitizeForClingo(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove accents and normalize characters
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        
        // Remove diacritical marks
        normalized = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        
        // Replace spaces with underscores
        normalized = normalized.replace(" ", "_");
        
        // Convert to lowercase
        normalized = normalized.toLowerCase(Locale.ROOT);
        
        // Keep only alphanumeric characters and underscores
        normalized = normalized.replaceAll("[^a-z0-9_]", "");
        
        // Ensure it starts with a letter (clingo requirement)
        if (normalized.isEmpty() || Character.isDigit(normalized.charAt(0))) {
            normalized = "id_" + normalized;
        }
        
        return normalized;
    }
}