package com.dayflow.service;

import com.dayflow.dto.NotificationDto;
import com.dayflow.entity.Notification;
import com.dayflow.entity.User;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.NotificationRepository;
import com.dayflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public NotificationDto createNotification(Long userId, String title, String message, String type) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        Notification notif = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type != null ? type : "INFO")
                .read(false)
                .build();

        notif = notificationRepository.save(notif);
        return mapToDto(notif);
    }

    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notif.setRead(true);
        notificationRepository.save(notif);
    }

    public NotificationDto mapToDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .userId(n.getUser().getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
