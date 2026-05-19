package com.example.demo.repository;

import com.example.demo.model.ChatGroup;
import com.example.demo.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroupId(Long groupId);
    List<GroupMember> findByGroup(ChatGroup group);
}
