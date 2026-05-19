/* eslint-disable no-unused-vars */
// components/MessageInput.jsx
import React, { useState } from 'react';

export default function MessageInput({ sendMessage, activeKind }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  if (!activeKind) {
    return (
      <div className="message-input">
        <input
          className="message-input__field"
          type="text"
          placeholder="Select a chat to start messaging..."
          disabled
        />
        <button className="message-input__button" disabled>
          Send
        </button>
      </div>
    );
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        className="message-input__field"
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="message-input__button" type="submit">
        Send
      </button>
    </form>
  );
}