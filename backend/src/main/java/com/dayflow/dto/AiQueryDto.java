package com.dayflow.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiQueryDto {
    private String prompt;
    private String userRole;
    private Long userId;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String response;
        private String dataSource;
        private List<String> suggestedActions;
    }
}
