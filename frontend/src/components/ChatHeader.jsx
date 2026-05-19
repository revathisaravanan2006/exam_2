/* eslint-disable no-unused-vars */
// components/ChatHeader.jsx
import React from 'react';

export default function ChatHeader({ selectedUser, selectedGroup, activeKind }) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  if (!activeKind) {
    return (
      <div className="chat-header">
        <div className="chat-header__avatar">💬</div>
        <div className="chat-header__info">
          <div className="chat-header__name">Select a chat</div>
          <div className="chat-header__status">Choose a user or group to start messaging</div>
        </div>
      </div>
    );
  }

  if (activeKind === 'user' && selectedUser) {
    return (
      <div className="chat-header">
        <div className="chat-header__avatar">{getInitials(selectedUser.name)}</div>
        <div className="chat-header__info">
          <div className="chat-header__name">{selectedUser.name}</div>
          <div className="chat-header__status">{selectedUser.email}</div>
        </div>
      </div>
    );
  }

  if (activeKind === 'group' && selectedGroup) {
    return (
      <div className="chat-header">
        <div className="chat-header__avatar chat-header__avatar--group">#</div>
        <div className="chat-header__info">
          <div className="chat-header__name">{selectedGroup.name}</div>
          <div className="chat-header__status">{selectedGroup.numberOfMembers || 0} members</div>
        </div>
      </div>
    );
  }

  return null;
}