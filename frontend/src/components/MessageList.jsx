/* eslint-disable no-unused-vars */
import React from "react";

function MessageList({
  messages,
  me,
  messagesEndRef,
}) {
  return (
    <div className="messages-area">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${
            msg.sender?.id === me.id
              ? "own"
              : "other"
          }`}
        >
          <div className="message-content">
            {msg.content}
          </div>

          <div className="message-footer">
            <div className="message-time">
              {msg.time
                ? new Date(
                    msg.time
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>

            {msg.sender?.id === me.id && (
              <span
                className={`message-status ${
                  msg.status === "READ"
                    ? "read-status"
                    : ""
                }`}
              >
                {msg.status === "SENT"
                  ? "✓"
                  : "✓✓"}
              </span>
            )}
          </div>
        </div>
      ))}

      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default MessageList;