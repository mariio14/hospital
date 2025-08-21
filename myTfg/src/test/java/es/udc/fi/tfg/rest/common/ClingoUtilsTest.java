package es.udc.fi.tfg.rest.common;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for ClingoUtils utility functions.
 */
public class ClingoUtilsTest {

    @Test
    public void testBasicSanitization() {
        assertEquals("juan_perez", ClingoUtils.sanitizeForClingo("Juan Pérez"));
        assertEquals("maria_jose", ClingoUtils.sanitizeForClingo("María José"));
        assertEquals("test_user", ClingoUtils.sanitizeForClingo("Test User"));
    }

    @Test
    public void testSpecialCharacters() {
        assertEquals("test_123", ClingoUtils.sanitizeForClingo("Test@#$ 123"));
        assertEquals("user_name", ClingoUtils.sanitizeForClingo("User-Name"));
        assertEquals("hello_world", ClingoUtils.sanitizeForClingo("Hello.World!"));
    }

    @Test
    public void testAccentsAndDiacritics() {
        assertEquals("pedro_sanchez", ClingoUtils.sanitizeForClingo("Pedro Sánchez"));
        assertEquals("jose_maria", ClingoUtils.sanitizeForClingo("José María"));
        assertEquals("ana_garcia", ClingoUtils.sanitizeForClingo("Ana García"));
    }

    @Test
    public void testStartsWithNumber() {
        assertEquals("id_123test", ClingoUtils.sanitizeForClingo("123Test"));
        assertEquals("id_456_user", ClingoUtils.sanitizeForClingo("456 User"));
    }

    @Test
    public void testEmptyAndNull() {
        assertNull(ClingoUtils.sanitizeForClingo(null));
        assertEquals("id_", ClingoUtils.sanitizeForClingo(""));
        assertEquals("id_", ClingoUtils.sanitizeForClingo("@#$%"));
    }

    @Test
    public void testAlreadyValid() {
        assertEquals("valid_name", ClingoUtils.sanitizeForClingo("valid_name"));
        assertEquals("test123", ClingoUtils.sanitizeForClingo("test123"));
        assertEquals("user_name_123", ClingoUtils.sanitizeForClingo("user_name_123"));
    }

    @Test
    public void testRealWorldExamples() {
        // Common Spanish names with special characters
        assertEquals("dr_rodriguez", ClingoUtils.sanitizeForClingo("Dr. Rodríguez"));
        assertEquals("ana_cristina", ClingoUtils.sanitizeForClingo("Ana-Cristina"));
        assertEquals("manuel_angel", ClingoUtils.sanitizeForClingo("Manuel Ángel"));
        assertEquals("maria_del_carmen", ClingoUtils.sanitizeForClingo("María del Carmen"));
    }
}