package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.entities.Staff;
import es.udc.fi.tfg.model.services.StaffService;
import es.udc.fi.tfg.rest.common.CommonControllerAdvice;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.MediaType;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class StaffControllerTest {

    private MockMvc mockMvc;

    @Mock
    private StaffService staffService;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private StaffController staffController;

    @BeforeEach
    void setUp() {
        CommonControllerAdvice controllerAdvice = new CommonControllerAdvice();
        // Use reflection to set the messageSource field
        try {
            java.lang.reflect.Field field = CommonControllerAdvice.class.getDeclaredField("messageSource");
            field.setAccessible(true);
            field.set(controllerAdvice, messageSource);
        } catch (Exception e) {
            // Ignore for test
        }

        mockMvc = MockMvcBuilders.standaloneSetup(staffController)
                .setControllerAdvice(controllerAdvice)
                .build();
    }

    @Test
    void testGetStaff() throws Exception {
        // Given
        List<Staff> mockStaffList = Arrays.asList(
            new Staff(1, "Laura", 5),
            new Staff(2, "Mario", 5),
            new Staff(3, "Esther", 5)
        );
        
        when(staffService.getStaff()).thenReturn(mockStaffList);

        // When & Then
        mockMvc.perform(get("/api/staff"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].name").value("Laura"))
                .andExpect(jsonPath("$[0].level").value(5))
                .andExpect(jsonPath("$[1].name").value("Mario"))
                .andExpect(jsonPath("$[1].level").value(5))
                .andExpect(jsonPath("$[2].name").value("Esther"))
                .andExpect(jsonPath("$[2].level").value(5));

        verify(staffService, times(1)).getStaff();
    }

    @Test
    void testModifyStaff() throws Exception {
        // Given
        String jsonContent = "[{\"id\":1,\"name\":\"Laura\",\"level\":5}," +
                             "{\"id\":2,\"name\":\"Mario\",\"level\":5}," +
                             "{\"id\":3,\"name\":\"Esther\",\"level\":5}]";

        // When & Then
        mockMvc.perform(put("/api/staff/modify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonContent))
                .andExpect(status().isOk());

        verify(staffService, times(1)).modifyStaff(any(List.class));
    }

    @Test
    void testGetStaffThrowsException() throws Exception {
        // Given
        when(staffService.getStaff()).thenThrow(new RuntimeException("File not found"));

        // When & Then
        mockMvc.perform(get("/api/staff"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.globalError").value("Ha ocurrido un error"));

        verify(staffService, times(1)).getStaff();
    }
}