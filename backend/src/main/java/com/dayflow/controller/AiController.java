package com.dayflow.controller;

import com.dayflow.dto.AiQueryDto;
import com.dayflow.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AiQueryDto.Response> chatQuery(@RequestBody AiQueryDto query) {
        return ResponseEntity.ok(aiService.processQuery(query));
    }

    @GetMapping("/insights")
    public ResponseEntity<List<Map<String, Object>>> getAttendanceInsights() {
        return ResponseEntity.ok(aiService.getAttendanceInsights());
    }
}
