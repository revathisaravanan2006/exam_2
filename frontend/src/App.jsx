/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
// App.jsx
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
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
  const [activeKind, setActiveKind] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  const activeUser = useMemo(() => {
    if (activeKind !== 'user') return null;
    return users.find((u) => String(u.id) === String(activeId));
  }, [users, activeId, activeKind]);

  const activeGroup = useMemo(() => {
    if (activeKind !== 'group') return null;
    return groups.find((g) => String(g.id) === String(activeId));
  }, [groups, activeId, activeKind]);

  useEffect(() => {
    if (me) {
      loadData();
    }
  }, [me]);

  const loadData = async () => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/users/login?email=${loginForm.email}&password=${loginForm.password}`);
      setMe(res.data);
      await loadData();
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
      await loadData();
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed. Email might already exist.');
    }
  };

  const selectUser = async (user) => {
    setActiveKind('user');
    setActiveId(user.id);
    try {
      const res = await api.get(`/users/${me.id}/messages`);
      const all = res.data || [];
      const filtered = all.filter((m) => {
        const senderId = m?.sender?.id;
        const recipientId = m?.recipient?.id;
        return (
          (String(senderId) === String(me.id) && String(recipientId) === String(user.id)) ||
          (String(senderId) === String(user.id) && String(recipientId) === String(me.id))
        );
      });
      setMessages(filtered);
    } catch (err) {
      console.error('Error fetching user messages:', err);
    }
  };

  const selectGroup = async (group) => {
    setActiveKind('group');
    setActiveId(group.id);
    try {
      const res = await api.get(`/groups/${group.id}/messages`);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching group messages:', err);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    try {
      if (activeKind === 'user' && activeUser) {
        await api.post(`/users/${me.id}/messages/direct`, {
          recipient: { id: activeUser.id },
          content: text,
        });
        await selectUser(activeUser);
      } else if (activeKind === 'group' && activeGroup) {
        await api.post(`/groups/${activeGroup.id}/messages`, {
          sender: { id: me.id },
          content: text,
        });
        await selectGroup(activeGroup);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!me) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card__title">Chat App</div>
          <form className="auth-form" onSubmit={handleLogin}>
            <input
              className="auth-form__input"
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
            <input
              className="auth-form__input"
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button className="auth-form__button" type="submit">
              Login
            </button>
          </form>
          <div className="auth-divider">OR</div>
          <form className="auth-form" onSubmit={handleRegister}>
            <input
              className="auth-form__input"
              type="text"
              placeholder="Full Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
            />
            <input
              className="auth-form__input"
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
            />
            <input
              className="auth-form__input"
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
            />
            <button className="auth-form__button" type="submit">
              Create Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        me={me}
        users={users}
        groups={groups}
        activeKind={activeKind}
        activeId={activeId}
        onSelectUser={selectUser}
        onSelectGroup={selectGroup}
        onRefresh={loadData}
      />
      <ChatWindow
        selectedUser={activeUser}
        selectedGroup={activeGroup}
        activeKind={activeKind}
        messages={messages}
        currentUserId={me.id}
        sendMessage={sendMessage}
      />
    </div>
  );
}