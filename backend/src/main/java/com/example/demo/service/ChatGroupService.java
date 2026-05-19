package com.example.demo.service;

import com.example.demo.model.ChatGroup;
import com.example.demo.repository.ChatGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatGroupService {

    private final ChatGroupRepository chatGroupRepository;

    public ChatGroupService(ChatGroupRepository chatGroupRepository) {
        this.chatGroupRepository = chatGroupRepository;
    }

    public ChatGroup create(String name) {
        ChatGroup group = new ChatGroup(name);
        return chatGroupRepository.save(group);
    }

    public ChatGroup getGroupById(Long groupId) {
        return chatGroupRepository.findById(groupId)
                .orElseThrow();
    }

    public List<ChatGroup> getAllGroups() {
        return chatGroupRepository.findAll();
    }

    public ChatGroup updateGroup(Long groupId, String name) {

        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow();

        group.setName(name);

        return chatGroupRepository.save(group);
    }

    public void deleteGroup(Long groupId) {
        chatGroupRepository.deleteById(groupId);
    }

    public ChatGroup incrementMemberCount(ChatGroup group) {

        Integer count = group.getNumberOfMembers();
        if (count == null) count = 0;

        group.setNumberOfMembers(count + 1);

        return chatGroupRepository.save(group);
    }
}