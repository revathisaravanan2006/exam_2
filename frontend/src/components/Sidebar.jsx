/* eslint-disable no-unused-vars */
// components/Sidebar.jsx
import React, { useState } from 'react';

export default function Sidebar({
  me,
  users,
  groups,
  activeKind,
  activeId,
  onSelectUser,
  onSelectGroup,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const filteredUsers = (users || [])
    .filter((u) => String(u.id) !== String(me?.id))
    .filter((u) => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredGroups = (groups || []).filter((g) =>
    g.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Rendering sidebar with groups:', groups);

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__brand">Chat App</div>
        <div className="sidebar__user">
          <div className="sidebar__user-name">{me?.name || 'Not logged in'}</div>
          <div className="sidebar__user-email">{me?.email || ''}</div>
        </div>
        <input
          type="text"
          className="sidebar__search"
          placeholder="Search users or groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="sidebar__refresh" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__title">Users ({filteredUsers.length})</div>
        <div className="sidebar__list">
          {filteredUsers.length === 0 ? (
            <div className="sidebar__empty">No users found</div>
          ) : (
            filteredUsers.map((u) => (
              <button
                key={u.id}
                className={`sidebar__item ${
                  activeKind === 'user' && String(activeId) === String(u.id)
                    ? 'sidebar__item--active'
                    : ''
                }`}
                onClick={() => {
                  console.log('User clicked:', u);
                  onSelectUser(u);
                }}
              >
                <div className="sidebar__avatar">{getInitials(u.name)}</div>
                <div className="sidebar__info">
                  <div className="sidebar__name">{u.name || `User ${u.id}`}</div>
                  <div className="sidebar__sub">{u.email || ''}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__title">Groups ({filteredGroups.length})</div>
        <div className="sidebar__list">
          {filteredGroups.length === 0 ? (
            <div className="sidebar__empty">No groups found</div>
          ) : (
            filteredGroups.map((g) => (
              <button
                key={g.id}
                className={`sidebar__item ${
                  activeKind === 'group' && String(activeId) === String(g.id)
                    ? 'sidebar__item--active'
                    : ''
                }`}
                onClick={() => {
                  console.log('Group clicked:', g);
                  onSelectGroup(g);
                }}
              >
                <div className="sidebar__avatar sidebar__avatar--group">#</div>
                <div className="sidebar__info">
                  <div className="sidebar__name">{g.name || `Group ${g.id}`}</div>
                  <div className="sidebar__sub">{g.numberOfMembers || 0} members</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}