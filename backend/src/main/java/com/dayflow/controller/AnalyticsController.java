package com.dayflow.controller;

import com.dayflow.dto.AnalyticsSummaryDto;
import com.dayflow.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsSummaryDto> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }
}
