import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatWindow({
  selectedUser,
  messages,
  currentUserId,
  sendMessage,
}) {

  return (
    <div className="chat-window">

      <ChatHeader
        selectedUser={selectedUser}
      />

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
      />

      <MessageInput
        sendMessage={sendMessage}
      />

    </div>
  )
}