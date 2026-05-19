/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function App() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (me) {
      loadUsersAndGroups();
    }
  }, [me]);

  useEffect(() => {
    if (selectedUser && me) {
      (selectedUser);
      markMessagesAsRead(selectedUser);
      const interval = setInterval(() => {
        loadMessagesForUser(selectedUser);
        markMessagesAsRead(selectedUser);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, me]);

  useEffect(() => {
    if (selectedGroup && me) {
      loadMessagesForGroup(selectedGroup);
      const interval = setInterval(() => {
        loadMessagesForGroup(selectedGroup);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup, me]);

  const markMessagesAsRead = async (user) => {
    try {loadMessagesForUser
      const res = await api.get(`/users/${me.id}/messages`);
      const allMessages = res.data || [];
      const unreadMessages = allMessages.filter(msg => 
        msg.sender?.id === user.id && 
        msg.recipient?.id === me.id && 
        msg.status !== 'READ'
      );
      
      for (const msg of unreadMessages) {
        await api.put(`/api/messages/${msg.id}/read`);
      }
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const loadUsersAndGroups = async () => {
    try {
      const [usersRes, groupsRes] = await Promise.all([
        api.get('/users/all'),
        api.get('/groups/all'),
      ]);
      setUsers(usersRes.data || []);
      setGroups(groupsRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const loadMessagesForUser = async (user) => {
    try {
      const res = await api.get(`/users/${me.id}/messages`);
      const allMessages = res.data || [];
      const filteredMessages = allMessages.filter((msg) => {
        return (
          (msg.sender?.id === me.id && msg.recipient?.id === user.id) ||
          (msg.sender?.id === user.id && msg.recipient?.id === me.id)
        );
      });
      setMessages(filteredMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const loadMessagesForGroup = async (group) => {
    try {
      const res = await api.get(`/groups/${group.id}/messages`);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error loading group messages:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/users/login?email=${loginForm.email}&password=${loginForm.password}`);
      setMe(res.data);
      alert('Login successful!');
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid login credentials');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/register', registerForm);
      setMe(res.data);
      alert('Registration successful!');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed');
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
    await loadMessagesForUser(user);
    await markMessagesAsRead(user);
  };

  const handleSelectGroup = async (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
    await loadMessagesForGroup(group);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    try {
      if (selectedUser) {
        await api.post(`/users/${me.id}/messages/direct`, {
          recipient: { id: selectedUser.id },
          content: text,
        });
        await loadMessagesForUser(selectedUser);
      } else if (selectedGroup) {
        await api.post(`/groups/${selectedGroup.id}/messages`, {
          sender: { id: me.id },
          content: text,
        });
        await loadMessagesForGroup(selectedGroup);
      } else {
        alert('Please select a user or group first');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert(`Failed to send message: ${err.response?.data || err.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'SENT':
        return <span className="status-sent">✓</span>;
      case 'DELIVERED':
        return <span className="status-delivered">✓✓</span>;
      case 'READ':
        return <span className="status-read">✓✓</span>;
      default:
        return <span className="status-sent">✓</span>;
    }
  };

  if (!me) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Chat App</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>
          <hr />
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
            />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chat App</h2>
          <div className="user-info">
            <strong>{me.name}</strong>
            <small>{me.email}</small>
          </div>
          <button onClick={loadUsersAndGroups}>Refresh</button>
        </div>
        
        <div className="sidebar-section">
          <h3>Users</h3>
          {users.filter(u => u.id !== me.id).map(user => (
            <div
              key={user.id}
              className={`chat-item ${selectedUser?.id === user.id ? 'active' : ''}`}
              onClick={() => handleSelectUser(user)}
            >
              <div className="chat-name">{user.name}</div>
              <div className="chat-email">{user.email}</div>
            </div>
          ))}
        </div>
        
        <div className="sidebar-section">
          <h3>Groups</h3>
          {groups.map(group => (
            <div
              key={group.id}
              className={`chat-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
              onClick={() => handleSelectGroup(group)}
            >
              <div className="chat-name">{group.name}</div>
              <div className="chat-members">{group.numberOfMembers || 0} members</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="chat-window">
        <div className="chat-header">
          <h3>
            {selectedUser?.name || selectedGroup?.name || 'Select a chat'}
          </h3>
        </div>
        
        <div className="messages-area">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`message ${msg.sender?.id === me.id ? 'own' : 'other'}`}
            >
              <div className="message-content">{msg.content}</div>
              <div className="message-footer">
                <div className="message-time">
                  {msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
                {msg.sender?.id === me.id && (
                  <div className="message-status">
                    {getStatusIcon(msg.status)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="message-input-area">
          <input
            type="text"
            id="messageInput"
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.target;
                sendMessage(input.value);
                input.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById('messageInput');
              sendMessage(input.value);
              input.value = '';
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}