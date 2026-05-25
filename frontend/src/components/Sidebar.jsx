/* eslint-disable no-unused-vars */
import React from "react";

function Sidebar({
  me,
  users,
  groups,
  selectedUser,
  selectedGroup,
  groupName,
  setGroupName,
  createGroup,
  handleSelectUser,
  handleSelectGroup,
  loadUsersAndGroups,
  logout,
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Chat App</h2>

        <div className="user-info">
          <strong>{me.name}</strong>
          <small>{me.email}</small>
        </div>

        <div className="sidebar-buttons">
          

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <div className="group-create">
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) =>
              setGroupName(e.target.value)
            }
          />

          <button onClick={createGroup}>
            Create Group
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Users</h3>

        {users
          .filter((u) => u.id !== me.id)
          .map((user) => (
            <div
              key={user.id}
              className={`chat-item ${
                selectedUser?.id === user.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleSelectUser(user)
              }
            >
              <div className="chat-name">
                {user.name}
              </div>

              <div className="chat-email">
                {user.email}
              </div>
            </div>
          ))}
      </div>

      <div className="sidebar-section">
        <h3>Groups</h3>

        {groups.map((group) => (
          <div
            key={group.id}
            className={`chat-item ${
              selectedGroup?.id === group.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleSelectGroup(group)
            }
          >
            <div className="chat-name">
              {group.name}
            </div>

            <div className="chat-members">
              {group.numberOfMembers || 0} members
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;