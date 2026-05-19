package com.example.demo.controller;

import com.example.demo.model.Message;
import com.example.demo.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/users/{senderId}/messages/direct")
    public ResponseEntity<Message> sendDirect(
            @PathVariable Long senderId,
            @RequestBody Message req) {

        Message msg = messageService.sendDirect(
                senderId,
                req.getRecipientId(),
                req.getContent()
        );

        return ResponseEntity.ok(msg);
    }

    @PostMapping("/groups/{groupId}/messages")
    public ResponseEntity<Message> sendGroup(
            @PathVariable Long groupId,
            @RequestBody Message req) {

        Long senderId = req.getSender().getId();

        Message msg = messageService.sendGroup(
                senderId,
                groupId,
                req.getContent()
        );

        return ResponseEntity.ok(msg);
    }

    @GetMapping("/groups/{groupId}/messages")
    public ResponseEntity<List<Message>> getGroupMessages(@PathVariable Long groupId) {
        return ResponseEntity.ok(messageService.getGroupMessages(groupId));
    }

    @GetMapping("/users/{userId}/messages")
    public ResponseEntity<List<Message>> getUserMessages(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getUserMessages(userId));
    }
}