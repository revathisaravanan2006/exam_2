package com.example.demo.controller;

import com.example.demo.model.Message;
import com.example.demo.model.MessageStatus;
import com.example.demo.service.MessageService;
import com.example.demo.repository.MessageRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageService service;
    private final MessageRepo messageRepo;

    public MessageController(MessageService service, MessageRepo messageRepo) {
        this.service = service;
        this.messageRepo = messageRepo;
    }

    @PostMapping("/users/{senderId}/messages/direct")
    public ResponseEntity<Message> direct(@PathVariable Long senderId,
                                          @RequestBody Message req) {

        Long recipientId = req.getRecipient().getId();

        return ResponseEntity.ok(
                service.sendDirect(senderId, recipientId, req.getContent())
        );
    }

    @PostMapping("/groups/{groupId}/messages")
    public ResponseEntity<Message> group(@PathVariable Long groupId,
                                         @RequestBody Message req) {

        Long senderId = req.getSender().getId();

        return ResponseEntity.ok(
                service.sendGroup(senderId, groupId, req.getContent())
        );
    }

    @GetMapping("/groups/{groupId}/messages")
    public ResponseEntity<List<Message>> groupMessages(@PathVariable Long groupId) {
        return ResponseEntity.ok(service.getGroupMessages(groupId));
    }

    @GetMapping("/users/{userId}/messages")
    public ResponseEntity<List<Message>> userMessages(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getUserMessages(userId));
    }

    @PutMapping("/messages/{messageId}/read")
    public ResponseEntity<Message> markAsRead(@PathVariable Long messageId) {
        Message message = service.findById(messageId);
        message.setStatus(MessageStatus.READ);
        return ResponseEntity.ok(messageRepo.save(message));
    }
}