import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../../styles/AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

    const [openActionId, setOpenActionId] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  const [showUserModal, setShowUserModal] = useState(false);

  const [showRoleModal, setShowRoleModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");

  const [actionLoading, setActionLoading] = useState(false);


  // =====================================
  // FETCH USERS
  // =====================================

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/users",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users."
        );
      }

      setUsers(data.users || []);

    } catch (err) {

      console.error(
        "Fetch admin users error:",
        err
      );

      setError(
        err.message ||
        "Failed to load users."
      );

    } finally {

      setLoading(false);

    }
  }, []);


  // =====================================
  // LOAD USERS
  // =====================================

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  // =====================================
  // FILTER USERS
  // =====================================

  const filteredUsers = useMemo(() => {

    return users.filter((user) => {

      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        !search ||
        user.name
          ?.toLowerCase()
          .includes(search) ||
        user.email
          ?.toLowerCase()
          .includes(search);


      const matchesRole =
        !roleFilter ||
        user.role === roleFilter;


      return (
        matchesSearch &&
        matchesRole
      );

    });

  }, [
    users,
    searchTerm,
    roleFilter
  ]);


  // =====================================
  // FORMAT ROLE
  // =====================================

  const formatRole = (role) => {

    if (!role) {
      return "Unknown";
    }

    return (
      role.charAt(0).toUpperCase() +
      role.slice(1)
    );

  };


  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    return new Date(date)
      .toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
      );

  };


  // =====================================
  // USER AVATAR
  // =====================================

  const getInitial = (name) => {

    if (!name) {
      return "?";
    }

    return name
      .trim()
      .charAt(0)
      .toUpperCase();

  };
// =====================================
// GET TOKEN
// =====================================

const getToken = () => {
  return localStorage.getItem("token");
};


// =====================================
// VIEW USER
// =====================================

const handleViewUser = (user) => {

  setSelectedUser(user);

  setShowUserModal(true);

  setOpenActionId(null);
};


// =====================================
// OPEN ROLE EDIT
// =====================================

const handleEditRole = (user) => {

  setSelectedUser(user);

  setSelectedRole(user.role);

  setShowRoleModal(true);

  setOpenActionId(null);
};


// =====================================
// UPDATE ROLE
// =====================================

const handleRoleUpdate = async () => {

  if (!selectedUser) {
    return;
  }


  try {

    setActionLoading(true);


    const token = getToken();


    const response = await fetch(
      `http://localhost:5000/api/admin/users/${selectedUser._id}/role`,
      {
        method: "PATCH",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          role: selectedRole
        })
      }
    );


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to update user role."
      );

    }


    setShowRoleModal(false);

    setSelectedUser(null);

    await fetchUsers();

  } catch (err) {

    console.error(
      "Update role error:",
      err
    );

    setError(
      err.message ||
      "Failed to update user role."
    );

  } finally {

    setActionLoading(false);

  }
};


// =====================================
// DELETE USER
// =====================================

const handleDeleteUser = async (user) => {

  const confirmed =
    window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    );


  if (!confirmed) {
    return;
  }


  try {

    setActionLoading(true);

    setError("");


    const token = getToken();


    const response = await fetch(
      `http://localhost:5000/api/admin/users/${user._id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to delete user."
      );

    }


    setOpenActionId(null);

    await fetchUsers();

  } catch (err) {

    console.error(
      "Delete user error:",
      err
    );

    setError(
      err.message ||
      "Failed to delete user."
    );

  } finally {

    setActionLoading(false);

  }
};

  return (

    <div className="admin-users-page">

      {/* =================================
          PAGE TITLE
      ================================= */}

      <h2 className="admin-users-page-title">
        USERS MANAGEMENT
      </h2>


      {/* =================================
          MAIN CARD
      ================================= */}

      <div className="admin-users-card">


        {/* HEADER */}

        <div className="admin-users-card-header">

          <div>

            <h1>
              Users
            </h1>

            <p>
              Manage platform users, roles, and account status.
            </p>

          </div>


          <div className="admin-users-count">

            <span>
              {users.length}
            </span>

            Total Users

          </div>

        </div>


        {/* =================================
            TOOLBAR
        ================================= */}

        <div className="admin-users-toolbar">


          {/* SEARCH */}

          <div className="admin-users-search">

            <i className="fas fa-search"></i>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search by name or email..."
            />

          </div>


          {/* ROLE FILTER */}

          <select
            className="admin-users-filter"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value
              )
            }
          >

            <option value="">
              All Roles
            </option>

            <option value="student">
              Student
            </option>

            <option value="instructor">
              Instructor
            </option>

            <option value="admin">
              Admin
            </option>

          </select>


          {/* STATUS FILTER */}

          <select
            className="admin-users-filter"
            disabled
            title="Status management will be enabled after adding the status field."
          >

            <option value="">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>


          {/* REFRESH */}

          <button
            type="button"
            className="admin-users-refresh"
            onClick={fetchUsers}
            disabled={loading}
          >

            <i
              className={
                loading
                  ? "fas fa-spinner fa-spin"
                  : "fas fa-sync-alt"
              }
            ></i>

            {loading
              ? "Loading..."
              : "Refresh"}

          </button>

        </div>


        {/* =================================
            ERROR
        ================================= */}

        {error && (

          <div className="admin-users-error">

            <i className="fas fa-exclamation-circle"></i>

            {error}

          </div>

        )}


        {/* =================================
            TABLE
        ================================= */}

        <div className="admin-users-table-wrapper">

          <table className="admin-users-table">

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Email
                </th>

                <th>
                  Role
                </th>

                <th>
                  Status
                </th>

                <th>
                  Joined
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="admin-users-empty"
                  >

                    <i className="fas fa-spinner fa-spin"></i>

                    <span>
                      Loading users...
                    </span>

                  </td>

                </tr>

              ) : filteredUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="admin-users-empty"
                  >

                    <i className="fas fa-users"></i>

                    <span>
                      No users found.
                    </span>

                  </td>

                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr key={user._id}>


                    {/* USER */}

                    <td>

                      <div className="admin-user-info">

                        {user.profileImage ? (

                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="admin-user-avatar"
                          />

                        ) : (

                          <div className="admin-user-avatar admin-user-avatar-placeholder">

                            {getInitial(
                              user.name
                            )}

                          </div>

                        )}


                        <div>

                          <div className="admin-user-name">

                            {user.name}

                          </div>

                        </div>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>

                      <span className="admin-user-email">

                        {user.email}

                      </span>

                    </td>


                    {/* ROLE */}

                    <td>

                      <span
                        className={`admin-role-badge admin-role-${user.role}`}
                      >

                        {formatRole(
                          user.role
                        )}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span className="admin-status-badge admin-status-active">

                        <span className="admin-status-dot"></span>

                        Active

                      </span>

                    </td>


                    {/* JOINED */}

                    <td>

                      <span className="admin-user-date">

                        {formatDate(
                          user.createdAt
                        )}

                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

  <div className="admin-user-actions">

    <button
      type="button"
      className="admin-user-action"
      title="User actions"
      onClick={() =>
        setOpenActionId(
          openActionId === user._id
            ? null
            : user._id
        )
      }
    >

      <i className="fas fa-ellipsis-v"></i>

    </button>


    {openActionId === user._id && (

      <div className="admin-user-action-menu">

        <button
          type="button"
          onClick={() =>
            handleViewUser(user)
          }
        >

          <i className="fas fa-eye"></i>

          View User

        </button>


        <button
          type="button"
          onClick={() =>
            handleEditRole(user)
          }
        >

          <i className="fas fa-user-edit"></i>

          Edit Role

        </button>


        <button
          type="button"
          className="admin-action-danger"
          onClick={() =>
            handleDeleteUser(user)
          }
          disabled={actionLoading}
        >

          <i className="fas fa-trash"></i>

          Delete User

        </button>

      </div>

    )}

  </div>

</td>
                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>


        {/* =================================
            RESULTS FOOTER
        ================================= */}

        {!loading && users.length > 0 && (

          <div className="admin-users-footer">

            Showing{" "}
            <strong>
              {filteredUsers.length}
            </strong>{" "}
            of{" "}
            <strong>
              {users.length}
            </strong>{" "}
            users

          </div>

        )}

      </div>
 {/* =================================
    VIEW USER MODAL
================================= */}

{showUserModal && selectedUser && (

  <div
    className="admin-modal-overlay"
    onClick={() =>
      setShowUserModal(false)
    }
  >

    <div
      className="admin-user-modal"
      onClick={(event) =>
        event.stopPropagation()
      }
    >

      <div className="admin-modal-header">

        <h2>
          User Details
        </h2>

        <button
          type="button"
          onClick={() =>
            setShowUserModal(false)
          }
        >
          <i className="fas fa-times"></i>
        </button>

      </div>


      <div className="admin-user-modal-profile">

        {selectedUser.profileImage ? (

          <img
            src={selectedUser.profileImage}
            alt={selectedUser.name}
            className="admin-user-modal-avatar"
          />

        ) : (

          <div className="admin-user-modal-avatar admin-user-avatar-placeholder">

            {getInitial(
              selectedUser.name
            )}

          </div>

        )}


        <h3>
          {selectedUser.name}
        </h3>

        <p>
          {selectedUser.email}
        </p>

      </div>


      <div className="admin-user-details">

        <div>
          <span>Role</span>
          <strong>
            {formatRole(
              selectedUser.role
            )}
          </strong>
        </div>


        <div>
          <span>Joined</span>
          <strong>
            {formatDate(
              selectedUser.createdAt
            )}
          </strong>
        </div>


        <div>
          <span>Status</span>
          <strong>
            Active
          </strong>
        </div>

      </div>

    </div>

  </div>

)}
{/* =================================
    EDIT ROLE MODAL
================================= */}

{showRoleModal && selectedUser && (

  <div
    className="admin-modal-overlay"
    onClick={() =>
      setShowRoleModal(false)
    }
  >

    <div
      className="admin-user-modal"
      onClick={(event) =>
        event.stopPropagation()
      }
    >

      <div className="admin-modal-header">

        <h2>
          Edit User Role
        </h2>

        <button
          type="button"
          onClick={() =>
            setShowRoleModal(false)
          }
        >

          <i className="fas fa-times"></i>

        </button>

      </div>


      <div className="admin-role-edit-content">

        <p>
          Change the role assigned to:
        </p>

        <strong>
          {selectedUser.name}
        </strong>


        <label>
          User Role
        </label>


        <select
          value={selectedRole}
          onChange={(event) =>
            setSelectedRole(
              event.target.value
            )
          }
        >

          <option value="student">
            Student
          </option>

          <option value="instructor">
            Instructor
          </option>

          <option value="admin">
            Admin
          </option>

        </select>


        <div className="admin-modal-actions">

          <button
            type="button"
            className="admin-modal-cancel"
            onClick={() =>
              setShowRoleModal(false)
            }
          >
            Cancel
          </button>


          <button
            type="button"
            className="admin-modal-save"
            onClick={handleRoleUpdate}
            disabled={actionLoading}
          >

            {actionLoading
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>

    </div>

  </div>

)}

    </div>

  );
};

export default AdminUsers;