package com.example.demo.controller;

import com.example.demo.model.ChatGroup;
import com.example.demo.service.ChatGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final ChatGroupService service;

    public GroupController(ChatGroupService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ChatGroup> create(@RequestParam String name) {
        return ResponseEntity.ok(service.create(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatGroup> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getGroupById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ChatGroup>> all() {
        return ResponseEntity.ok(service.getAllGroups());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChatGroup> update(@PathVariable Long id,
                                           @RequestParam String name) {
        return ResponseEntity.ok(service.updateGroup(id, name));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteGroup(id);
        return ResponseEntity.ok("Deleted");
    }
}