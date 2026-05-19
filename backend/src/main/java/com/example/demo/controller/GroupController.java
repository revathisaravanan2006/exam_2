package com.example.demo.controller;

import com.example.demo.model.ChatGroup;
import com.example.demo.service.ChatGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final ChatGroupService chatGroupService;

    public GroupController(ChatGroupService chatGroupService) {
        this.chatGroupService = chatGroupService;
    }

    @PostMapping
    public ResponseEntity<ChatGroup> createGroup(@RequestParam String name) {
        return ResponseEntity.ok(chatGroupService.create(name));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<ChatGroup> getGroupById(@PathVariable Long groupId) {
        return ResponseEntity.ok(chatGroupService.getGroupById(groupId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ChatGroup>> getAllGroups() {
        return ResponseEntity.ok(chatGroupService.getAllGroups());
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<ChatGroup> updateGroup(
            @PathVariable Long groupId,
            @RequestParam String name) {

        return ResponseEntity.ok(chatGroupService.updateGroup(groupId, name));
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long groupId) {
        chatGroupService.deleteGroup(groupId);
        return ResponseEntity.ok("Group deleted successfully");
    }
}