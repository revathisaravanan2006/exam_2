package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepo messageRepo;
    private final UserRepository userRepo;
    private final ChatGroupRepository groupRepo;

    public MessageService(MessageRepo messageRepo,
                          UserRepository userRepo,
                          ChatGroupRepository groupRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.groupRepo = groupRepo;
    }

    public Message sendDirect(Long senderId, Long recipientId, String content) {

        User sender = userRepo.findById(senderId).orElseThrow();
        User recipient = userRepo.findById(recipientId).orElseThrow();

        Message msg = new Message();
        msg.setContent(content);
        msg.setSender(sender);
        msg.setRecipient(recipient);
        msg.setStatus(MessageStatus.SENT);

        return messageRepo.save(msg);
    }

    public Message sendGroup(Long senderId, Long groupId, String content) {

        User sender = userRepo.findById(senderId).orElseThrow();
        ChatGroup group = groupRepo.findById(groupId).orElseThrow();

        Message msg = new Message();
        msg.setContent(content);
        msg.setSender(sender);
        msg.setGroup(group);
        msg.setStatus(MessageStatus.SENT);

        return messageRepo.save(msg);
    }

    public List<Message> getGroupMessages(Long groupId) {
        return messageRepo.findByGroup_IdOrderByTimeAsc(groupId);
    }

    public List<Message> getUserMessages(Long userId) {

        List<Message> messages = messageRepo.findBySender_IdOrRecipientIdOrderByTimeAsc(userId, userId);

        for (Message msg : messages) {
            if (msg.getRecipient() != null &&
                msg.getRecipient().getId().equals(userId) &&
                msg.getStatus() == MessageStatus.SENT) {

                msg.setStatus(MessageStatus.DELIVERED);
                messageRepo.save(msg);
            }
        }

        return messages;
    }

    public Message findById(Long id) {
        return messageRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
    }
}