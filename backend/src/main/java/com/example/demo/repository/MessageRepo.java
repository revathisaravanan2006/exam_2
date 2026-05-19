package com.example.demo.repository;

import com.example.demo.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message, Long> {

    List<Message> findByGroup_IdOrderByTimeAsc(Long groupId);

    List<Message> findBySender_IdOrRecipientIdOrderByTimeAsc(Long senderId, Long recipientId);
}