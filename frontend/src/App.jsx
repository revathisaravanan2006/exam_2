/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import "./App.css";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

const api = axios.create({
  baseURL: "http://localhost:8082/api",
  headers: {
    "Content-Type":
      "application/json",
  },
});

function App() {
  const [me, setMe] = useState(null);

  const [users, setUsers] = useState([]);

  const [groups, setGroups] = useState([]);

  const [messages, setMessages] =
    useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState(null);

  const [
    groupMembers,
    setGroupMembers,
  ] = useState([]);

  const [groupName, setGroupName] =
    useState("");

  const [
    selectedMemberId,
    setSelectedMemberId,
  ] = useState("");

  const [loginForm, setLoginForm] =
    useState({
      email: "",
      password: "",
    });

  const [
    registerForm,
    setRegisterForm,
  ] = useState({
    name: "",
    email: "",
    password: "",
  });

  const messagesEndRef =
    useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  useEffect(() => {
    if (me) {
      loadUsersAndGroups();
    }
  }, [me]);

  useEffect(() => {
    if (selectedUser && me) {
      loadMessagesForUser(
        selectedUser
      );

      markMessagesAsRead(
        selectedUser
      );

      const interval =
        setInterval(() => {
          loadMessagesForUser(
            selectedUser
          );

          markMessagesAsRead(
            selectedUser
          );
        }, 3000);

      return () =>
        clearInterval(interval);
    }
  }, [selectedUser, me]);

  useEffect(() => {
    if (selectedGroup && me) {
      loadMessagesForGroup(
        selectedGroup
      );

      const interval =
        setInterval(() => {
          loadMessagesForGroup(
            selectedGroup
          );
        }, 3000);

      return () =>
        clearInterval(interval);
    }
  }, [selectedGroup, me]);

  const loadUsersAndGroups =
    async () => {
      try {
        const [
          usersRes,
          groupsRes,
        ] = await Promise.all([
          api.get("/users/all"),
          api.get("/groups/all"),
        ]);

        setUsers(
          usersRes.data || []
        );

        setGroups(
          groupsRes.data || []
        );
      } catch (err) {
        console.error(err);
      }
    };

  const loadMessagesForUser =
    async (user) => {
      try {
        const res = await api.get(
          `/users/${me.id}/messages`
        );

        const filtered = (
          res.data || []
        ).filter((msg) => {
          return (
            (msg.sender?.id ===
              me.id &&
              msg.recipient?.id ===
                user.id) ||
            (msg.sender?.id ===
              user.id &&
              msg.recipient?.id ===
                me.id)
          );
        });

        setMessages(filtered);
      } catch (err) {
        console.error(err);
      }
    };

  const loadMessagesForGroup =
    async (group) => {
      try {
        const res = await api.get(
          `/groups/${group.id}/messages`
        );

        setMessages(
          res.data || []
        );
      } catch (err) {
        console.error(err);
      }
    };

  const loadGroupMembers =
    async (groupId) => {
      try {
        const res = await api.get(
          `/groups/${groupId}/members`
        );

        setGroupMembers(
          res.data || []
        );
      } catch (err) {
        console.error(err);
      }
    };

  const markMessagesAsRead =
    async (user) => {
      try {
        const res = await api.get(
          `/users/${me.id}/messages`
        );

        const unread = (
          res.data || []
        ).filter(
          (msg) =>
            msg.sender?.id ===
              user.id &&
            msg.recipient?.id ===
              me.id &&
            msg.status !== "READ"
        );

        for (const msg of unread) {
          await api.put(
            `/messages/${msg.id}/read`
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

  const createGroup =
    async () => {
      if (!groupName.trim()) {
        alert("Enter group name");
        return;
      }

      try {
        await api.post(
          `/groups?name=${groupName}`
        );

        setGroupName("");

        loadUsersAndGroups();

        alert("Group created");
      } catch (err) {
        console.error(err);
      }
    };

  const addMemberToGroup =
    async () => {
      if (!selectedGroup) {
        alert(
          "Select a group first"
        );
        return;
      }

      if (!selectedMemberId) {
        alert("Select a user");
        return;
      }

      try {
        const user = users.find(
          (u) =>
            String(u.id) ===
            String(selectedMemberId)
        );

        await api.post(
          `/groups/${selectedGroup.id}/members`,
          {
            name: user.name,
          }
        );

        loadGroupMembers(
          selectedGroup.id
        );

        loadUsersAndGroups();

        setSelectedMemberId("");

        alert("Member added");
      } catch (err) {
        console.error(err);
      }
    };

  const handleLogin =
    async (e) => {
      e.preventDefault();

      try {
        const res = await api.post(
          `/users/login?email=${loginForm.email}&password=${loginForm.password}`
        );

        setMe(res.data);

        alert(
          "Login successful"
        );
      } catch (err) {
        alert(
          "Invalid credentials"
        );
      }
    };

  const handleRegister =
    async (e) => {
      e.preventDefault();

      try {
        const res = await api.post(
          "/users/register",
          registerForm
        );

        setMe(res.data);

        alert(
          "Registered successfully"
        );
      } catch (err) {
        console.error(err);
      }
    };

  const handleSelectUser =
    async (user) => {
      setSelectedUser(user);

      setSelectedGroup(null);

      setGroupMembers([]);

      await loadMessagesForUser(
        user
      );

      await markMessagesAsRead(
        user
      );
    };

  const handleSelectGroup =
    async (group) => {
      setSelectedGroup(group);

      setSelectedUser(null);

      await loadMessagesForGroup(
        group
      );

      await loadGroupMembers(
        group.id
      );
    };

  const sendMessage =
    async (text) => {
      if (!text.trim()) return;

      try {
        if (selectedUser) {
          await api.post(
            `/users/${me.id}/messages/direct`,
            {
              recipient: {
                id: selectedUser.id,
              },
              content: text,
            }
          );

          await loadMessagesForUser(
            selectedUser
          );
        } else if (
          selectedGroup
        ) {
          await api.post(
            `/groups/${selectedGroup.id}/messages`,
            {
              sender: {
                id: me.id,
              },
              content: text,
            }
          );

          await loadMessagesForGroup(
            selectedGroup
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

  const logout = () => {
    setMe(null);

    setMessages([]);

    setSelectedUser(null);

    setSelectedGroup(null);
  };

  if (!me) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Chat App</h1>

          <form
            onSubmit={handleLogin}
          >
            <input
              type="email"
              placeholder="Email"
              value={
                loginForm.email
              }
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  email:
                    e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={
                loginForm.password
              }
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  password:
                    e.target.value,
                })
              }
            />

            <button type="submit">
              Login
            </button>
          </form>

          <hr />

          <form
            onSubmit={
              handleRegister
            }
          >
            <input
              type="text"
              placeholder="Name"
              value={
                registerForm.name
              }
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  name:
                    e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={
                registerForm.email
              }
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  email:
                    e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={
                registerForm.password
              }
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  password:
                    e.target.value,
                })
              }
            />

            <button type="submit">
              Register
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
        selectedUser={
          selectedUser
        }
        selectedGroup={
          selectedGroup
        }
        groupName={groupName}
        setGroupName={
          setGroupName
        }
        createGroup={
          createGroup
        }
        handleSelectUser={
          handleSelectUser
        }
        handleSelectGroup={
          handleSelectGroup
        }
        loadUsersAndGroups={
          loadUsersAndGroups
        }
        logout={logout}
      />

      <ChatWindow
        selectedUser={
          selectedUser
        }
        selectedGroup={
          selectedGroup
        }
        groupMembers={
          groupMembers
        }
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
        messages={messages}
        me={me}
        messagesEndRef={
          messagesEndRef
        }
        sendMessage={
          sendMessage
        }
      />
    </div>
  );
}

export default App;