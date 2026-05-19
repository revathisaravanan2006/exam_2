package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private final GroupMemberRepository memberRepo;
    private final ChatGroupRepository groupRepo;

    public MemberService(GroupMemberRepository memberRepo,
                         ChatGroupRepository groupRepo) {
        this.memberRepo = memberRepo;
        this.groupRepo = groupRepo;
    }

    public GroupMember addMember(Long groupId, String name) {

        ChatGroup group = groupRepo.findById(groupId).orElseThrow();

        GroupMember member = new GroupMember(name, group);

        Integer count = group.getNumberOfMembers();
        if (count == null) count = 0;

        group.setNumberOfMembers(count + 1);

        groupRepo.save(group);

        return memberRepo.save(member);
    }

    public List<GroupMember> getMembersByGroup(Long groupId) {
        ChatGroup group = groupRepo.findById(groupId).orElseThrow();
        return memberRepo.findByGroup(group);
    }

    public GroupMember getMemberById(Long id) {
        return memberRepo.findById(id).orElseThrow();
    }

    public void deleteMember(Long id) {

        GroupMember m = memberRepo.findById(id).orElseThrow();

        ChatGroup g = m.getGroup();

        Integer count = g.getNumberOfMembers();
        if (count == null) count = 0;

        g.setNumberOfMembers(count - 1);

        groupRepo.save(g);

        memberRepo.delete(m);
    }
}