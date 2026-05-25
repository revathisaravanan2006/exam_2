/* eslint-disable no-unused-vars */
import React from "react";

function ChatHeader({
  selectedUser,
  selectedGroup,
  groupMembers,
  users,
  selectedMemberId,
  setSelectedMemberId,
  addMemberToGroup,
}) {
  return (
    <div className="chat-header">
      <div className="chat-header-top">
        <h2>
          {selectedUser?.name ||
            selectedGroup?.name ||
            "Select Chat"}
        </h2>
      </div>

      {selectedGroup && (
        <div className="group-info-box">
          <div className="members-text">
            Members:
            {groupMembers.length > 0
              ? " " +
                groupMembers
                  .map((m) => m.name)
                  .join(", ")
              : " No members"}
          </div>

          <div className="add-member-section">
            <select
              value={selectedMemberId}
              onChange={(e) =>
                setSelectedMemberId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select User
              </option>

              {users
                .filter(
                  (u) =>
                    !groupMembers.some(
                      (m) =>
                        m.name === u.name
                    )
                )
                .map((u) => (
                  <option
                    key={u.id}
                    value={u.id}
                  >
                    {u.name}
                  </option>
                ))}
            </select>

            <button
              onClick={addMemberToGroup}
            >
              Add Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatHeader;