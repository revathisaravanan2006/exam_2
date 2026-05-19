/* eslint-disable no-unused-vars */
// components/MessageInput.jsx
import React, { useState } from 'react';

export default function MessageInput({ sendMessage, activeKind }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeKind) return;
    sendMessage(text);
    setText('');
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        className="message-input__field"
        type="text"
        placeholder={activeKind ? "Type a message..." : "Select a chat to start messaging..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!activeKind}
      />
      <button className="message-input__button" type="submit" disabled={!activeKind}>
        Send
      </button>
    </form>
  );
}