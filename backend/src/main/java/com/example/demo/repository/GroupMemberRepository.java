package com.example.demo.repository;

import com.example.demo.model.GroupMember;
import com.example.demo.model.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroup(ChatGroup group);
}