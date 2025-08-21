package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.entities.Staff;
import es.udc.fi.tfg.rest.dtos.StaffDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class StaffServiceImplTest {

    @InjectMocks
    private StaffServiceImpl staffService;

    @Test
    void testStaffServiceInstantiation() {
        // Given & When & Then
        assertNotNull(staffService);
    }

    @Test
    void testStaffDtoCreation() {
        // Given
        StaffDto staff1 = new StaffDto(1, "Laura", 5);
        StaffDto staff2 = new StaffDto(2, "Mario", 5);
        
        // When
        List<StaffDto> staffList = Arrays.asList(staff1, staff2);
        
        // Then
        assertEquals(2, staffList.size());
        assertEquals("Laura", staff1.getName());
        assertEquals(5, staff1.getLevel());
        assertEquals("Mario", staff2.getName());
        assertEquals(5, staff2.getLevel());
    }

    @Test
    void testStaffEntityCreation() {
        // Given & When
        Staff staff1 = new Staff(1, "Pedro", 4);
        Staff staff2 = new Staff(2, "Marta", 4);
        
        // Then
        assertEquals("Pedro", staff1.getName());
        assertEquals(4, staff1.getLevel());
        assertEquals(1, staff1.getId());
        
        assertEquals("Marta", staff2.getName());
        assertEquals(4, staff2.getLevel());
        assertEquals(2, staff2.getId());
    }

    @Test
    void testStaffServiceMethodsExist() throws Exception {
        // This test verifies that the service has the required methods
        // and they don't throw compilation errors
        
        // Given - check if methods exist using reflection
        assertTrue(staffService.getClass().getDeclaredMethod("getStaff") != null);
        assertTrue(staffService.getClass().getDeclaredMethod("modifyStaff", List.class) != null);
        
        // The service class is properly annotated
        assertTrue(staffService.getClass().isAnnotationPresent(org.springframework.stereotype.Service.class));
        assertTrue(staffService.getClass().isAnnotationPresent(org.springframework.transaction.annotation.Transactional.class));
    }
}