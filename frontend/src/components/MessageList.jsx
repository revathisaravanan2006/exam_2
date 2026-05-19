/* eslint-disable no-unused-vars */
// components/MessageList.jsx
import React, { useRef, useEffect } from 'react';

export default function MessageList({ messages, currentUserId }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list">
        <div className="empty-chat">
          <div className="empty-chat__icon">💬</div>
          <div className="empty-chat__text">No messages yet. Start a conversation!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isOwn = msg.sender?.id === currentUserId;
        return (
          <div key={msg.id} className={`message ${isOwn ? 'message--own' : ''}`}>
            <div className="message__bubble">
              <div className="message__content">{msg.content}</div>
              <div className="message__meta">
                <span className="message__time">{formatTime(msg.time)}</span>
                {isOwn && (
                  <span className="message__status">
                    {msg.status === 'READ' ? '✓✓' : msg.status === 'DELIVERED' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}