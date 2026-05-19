import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API = axios.create({ baseURL: 'http://localhost:8082/api' })

function App() {
  const [view, setView] = useState('register')
  const [user, setUser] = useState(null)
  const [groups, setGroups] = useState([])
  const [messages, setMessages] = useState([])

  // Register
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const handleRegister = async () => {
    try {
      const res = await API.post('/users/register', regForm)
      setUser(res.data)
      setView('menu')
    } catch (err) {
      alert('Register failed: ' + err.message)
    }
  }

  // Create Group
  const [groupName, setGroupName] = useState('')
  const handleCreateGroup = async () => {
    try {
      const res = await API.post('/groups', { name: groupName })
      setGroups([...groups, res.data])
      setGroupName('')
    } catch (err) {
      alert('Group creation failed: ' + err.message)
    }
  }

  // Add Member
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [memberName, setMemberName] = useState('')
  const handleAddMember = async () => {
    try {
      await API.post(`/groups/${selectedGroup}/members`, { name: memberName })
      setMemberName('')
      alert('Member added!')
    } catch (err) {
      alert('Failed to add member: ' + err.message)
    }
  }

  // Send Direct Message
  const [recipientId, setRecipientId] = useState('')
  const [msgContent, setMsgContent] = useState('')
  const handleSendDirect = async () => {
    try {
      await API.post(`/users/${user.id}/messages/direct`, { recipientId, content: msgContent })
      setMsgContent('')
      alert('Message sent!')
    } catch (err) {
      alert('Failed to send: ' + err.message)
    }
  }

  // Send Group Message
  const handleSendGroup = async () => {
    try {
      await API.post(`/groups/${selectedGroup}/messages`, { sender: user, content: msgContent })
      setMsgContent('')
      alert('Group message sent!')
    } catch (err) {
      alert('Failed to send: ' + err.message)
    }
  }

  // Get Group Messages
  const handleGetGroupMessages = async () => {
    try {
      const res = await API.get(`/groups/${selectedGroup}/messages`)
      setMessages(res.data)
    } catch (err) {
      alert('Failed to fetch messages: ' + err.message)
    }
  }

  return (
    <div className="app">
      <h1>💬 Chat App</h1>
      {!user ? (
        <div className="section">
          <h2>Register</h2>
          <input placeholder="Name" value={regForm.name} onChange={(e) => setRegForm({...regForm, name: e.target.value})} />
          <input placeholder="Email" value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} />
          <input placeholder="Password" type="password" value={regForm.password} onChange={(e) => setRegForm({...regForm, password: e.target.value})} />
          <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.name}!</p>
          <div className="section">
            <h3>Create Group</h3>
            <input placeholder="Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            <button onClick={handleCreateGroup}>Create</button>
          </div>

          <div className="section">
            <h3>Add Member to Group</h3>
            <select onChange={(e) => setSelectedGroup(e.target.value)}>
              <option value="">Select Group</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <input placeholder="Member name" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
            <button onClick={handleAddMember}>Add Member</button>
          </div>

          <div className="section">
            <h3>Send Direct Message</h3>
            <input placeholder="Recipient ID" type="number" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} />
            <input placeholder="Message" value={msgContent} onChange={(e) => setMsgContent(e.target.value)} />
            <button onClick={handleSendDirect}>Send</button>
          </div>

          <div className="section">
            <h3>Send Group Message</h3>
            <select onChange={(e) => setSelectedGroup(e.target.value)}>
              <option value="">Select Group</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <input placeholder="Message" value={msgContent} onChange={(e) => setMsgContent(e.target.value)} />
            <button onClick={handleSendGroup}>Send</button>
          </div>

          <div className="section">
            <h3>View Group Messages</h3>
            <select onChange={(e) => setSelectedGroup(e.target.value)}>
              <option value="">Select Group</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <button onClick={handleGetGroupMessages}>Load Messages</button>
            <div className="messages">
              {messages.map(m => <div key={m.id} className="msg">
                <strong>User {m.sender?.id}:</strong> {m.content} <small>({m.status})</small>
              </div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
