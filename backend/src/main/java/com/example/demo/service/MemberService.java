package com.example.demo.service;

import com.example.demo.model.ChatGroup;
import com.example.demo.model.GroupMember;
import com.example.demo.repository.ChatGroupRepository;
import com.example.demo.repository.GroupMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private final GroupMemberRepository memberRepository;
    private final ChatGroupRepository chatGroupRepository;

    public MemberService(GroupMemberRepository memberRepository,
                         ChatGroupRepository chatGroupRepository) {
        this.memberRepository = memberRepository;
        this.chatGroupRepository = chatGroupRepository;
    }

    public GroupMember addMember(Long groupId, String name) {

        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow();

        GroupMember member = new GroupMember(name, group);

        Integer count = group.getNumberOfMembers();
        if (count == null) count = 0;

        group.setNumberOfMembers(count + 1);

        chatGroupRepository.save(group);

        return memberRepository.save(member);
    }

    public List<GroupMember> getMembersByGroup(Long groupId) {

        ChatGroup group = chatGroupRepository.findById(groupId)
                .orElseThrow();

        return memberRepository.findByGroup(group);
    }

    public GroupMember getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow();
    }

    public void deleteMember(Long memberId) {

        GroupMember member = memberRepository.findById(memberId)
                .orElseThrow();

        ChatGroup group = member.getGroup();

        Integer count = group.getNumberOfMembers();
        if (count == null) count = 0;

        group.setNumberOfMembers(count - 1);

        chatGroupRepository.save(group);

        memberRepository.delete(member);
    }
}