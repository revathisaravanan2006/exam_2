package com.example.demo.repository;

import com.example.demo.model.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
      ChatGroup findByName(String name);
}
