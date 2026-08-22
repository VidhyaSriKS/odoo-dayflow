package com.dayflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DayflowApplication {

    public static void main(String[] args) {
        SpringApplication.run(DayflowApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  DAYFLOW HRMS BACKEND SUCCESSFULLY STARTED      ");
        System.out.println("  REST Base API: http://localhost:8080/api        ");
        System.out.println("  H2 Console: http://localhost:8080/api/h2-console ");
        System.out.println("=================================================");
    }
}
