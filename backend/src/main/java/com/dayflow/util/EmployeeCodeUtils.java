package com.dayflow.util;

import com.dayflow.repository.EmployeeRepository;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class EmployeeCodeUtils {

    private final EmployeeRepository employeeRepository;

    public EmployeeCodeUtils(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public synchronized String generateLoginId(String companyName, String firstName, String lastName, int year) {
        String compPrefix = (companyName != null && companyName.length() >= 2) ? companyName.substring(0, 2).toUpperCase() : "CO";
        
        String fnPrefix = (firstName != null && firstName.length() >= 2) ? firstName.substring(0, 2).toUpperCase() : (firstName != null && firstName.length() == 1 ? (firstName + "X").toUpperCase() : "XX");
        String lnPrefix = (lastName != null && lastName.length() >= 2) ? lastName.substring(0, 2).toUpperCase() : (lastName != null && lastName.length() == 1 ? (lastName + "X").toUpperCase() : "XX");
        
        String baseCode = compPrefix + fnPrefix + lnPrefix + year;
        
        // Find sequence
        int count = employeeRepository.countByEmployeeCodeStartingWith(baseCode);
        String serial = String.format("%04d", count + 1);
        
        return baseCode + serial;
    }
}
