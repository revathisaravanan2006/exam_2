/* eslint-disable no-unused-vars */
import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({
  selectedUser,
  selectedGroup,
  groupMembers,
  users,
  selectedMemberId,
  setSelectedMemberId,
  addMemberToGroup,
  messages,
  me,
  messagesEndRef,
  sendMessage,
}) {
  return (
    <div className="chat-window">
      <ChatHeader
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        groupMembers={groupMembers}
        users={users}
        selectedMemberId={
          selectedMemberId
        }
        setSelectedMemberId={
          setSelectedMemberId
        }
        addMemberToGroup={
          addMemberToGroup
        }
      />

      <MessageList
        messages={messages}
        me={me}
        messagesEndRef={
          messagesEndRef
        }
      />

      <MessageInput
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default ChatWindow;