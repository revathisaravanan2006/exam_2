/* eslint-disable no-unused-vars */
import React from "react";

function MessageInput({
  sendMessage,
}) {
  return (
    <div className="message-input-area">
      <input
        type="text"
        id="messageInput"
        placeholder="Type message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const input = e.target;

            sendMessage(input.value);

            input.value = "";
          }
        }}
      />

      <button
        onClick={() => {
          const input =
            document.getElementById(
              "messageInput"
            );

          sendMessage(input.value);

          input.value = "";
        }}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;