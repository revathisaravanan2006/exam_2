package com.example.demo.service;

import com.example.demo.model.Message;
import com.example.demo.model.User;
import com.example.demo.model.ChatGroup;
import com.example.demo.repository.MessageRepo;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ChatGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepo messageRepository;
    private final UserRepository userRepository;
    private final ChatGroupRepository chatGroupRepository;

    public MessageService(MessageRepo messageRepository,
                          UserRepository userRepository,
                          ChatGroupRepository chatGroupRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.chatGroupRepository = chatGroupRepository;
    }

    public Message sendDirect(Long senderId, Long recipientId, String content) {

        User sender = userRepository.findById(senderId).orElseThrow();

        Message msg = new Message();
        msg.setContent(content);
        msg.setSender(sender);
        msg.setRecipientId(recipientId);
        msg.setStatus("SENT");

        return messageRepository.save(msg);
    }

    public Message sendGroup(Long senderId, Long groupId, String content) {

        User sender = userRepository.findById(senderId).orElseThrow();
        ChatGroup group = chatGroupRepository.findById(groupId).orElseThrow();

        Message msg = new Message();
        msg.setContent(content);
        msg.setSender(sender);
        msg.setGroup(group);
        msg.setStatus("SENT");

        return messageRepository.save(msg);
    }

    public List<Message> getGroupMessages(Long groupId) {
        return messageRepository.findByGroup_IdOrderByTimeAsc(groupId);
    }

    public List<Message> getUserMessages(Long userId) {
        return messageRepository.findBySender_IdOrRecipientIdOrderByTimeAsc(userId, userId);
    }
}