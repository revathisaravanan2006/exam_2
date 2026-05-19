package com.example.demo.controller;

import com.example.demo.model.GroupMember;
import com.example.demo.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/groups/{groupId}/members")
    public ResponseEntity<GroupMember> addMember(
            @PathVariable Long groupId,
            @RequestBody GroupMember req) {

        return ResponseEntity.ok(
                memberService.addMember(groupId, req.getName())
        );
    }

    @GetMapping("/groups/{groupId}/members")
    public ResponseEntity<List<GroupMember>> getMembersByGroup(
            @PathVariable Long groupId) {

        return ResponseEntity.ok(
                memberService.getMembersByGroup(groupId)
        );
    }

    @GetMapping("/members/{memberId}")
    public ResponseEntity<GroupMember> getMemberById(
            @PathVariable Long memberId) {

        return ResponseEntity.ok(
                memberService.getMemberById(memberId)
        );
    }

    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<String> deleteMember(
            @PathVariable Long memberId) {

        memberService.deleteMember(memberId);
        return ResponseEntity.ok("Member deleted successfully");
    }
}