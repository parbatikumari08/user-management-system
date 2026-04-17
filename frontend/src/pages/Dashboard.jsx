import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getUsers, deleteUser, updateUser, createUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  // Redirect if not admin or manager
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'manager') {
      navigate('/profile');
    }
  }, [user, navigate]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    if (!user?.token) return;
    
    setLoading(true);
    try {
      const res = await getUsers(user.token, {
        search,
        role: roleFilter,
        status: statusFilter,
        page,
        limit: 6
      });
      setUsers(res.data.users || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to fetch users", "error");
      if (err.response?.status === 403) {
        // Forbidden - user might not have permission
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page, user?.token, navigate]);

  useEffect(() => {
    if (user?.token && (user?.role === 'admin' || user?.role === 'manager')) {
      fetchUsers();
    }
  }, [fetchUsers, user]);

  const handleDelete = async (id, name) => {
    if (!canDelete) {
      showToast("You don't have permission to delete users", "error");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteUser(id, user.token);
        showToast(`${name} deleted successfully`);
        fetchUsers();
      } catch (err) {
        showToast(err.response?.data?.message || "Delete failed", "error");
      }
    }
  };

  const handleUpdate = async (id, updatedData) => {
    if (!canEdit) {
      showToast("You don't have permission to edit users", "error");
      return;
    }
    
    try {
      await updateUser(id, updatedData, user.token);
      showToast("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    }
  };

  const handleCreate = async (userData) => {
    if (!canCreate) {
      showToast("You don't have permission to create users", "error");
      return;
    }
    
    try {
      await createUser(userData, user.token);
      showToast("User created successfully");
      setShowCreateModal(false);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Creation failed", "error");
    }
  };

  const canEdit = user?.role === "admin" || user?.role === "manager";
  const canDelete = user?.role === "admin";
  const canCreate = user?.role === "admin";

  // Don't render if not admin/manager (will redirect)
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return null;
  }

  return (
    <>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="header">
        <h2>✨ User Management Dashboard</h2>
        <div className="header-right">
          <div className="role-badge">
            {user?.role === 'admin' ? '👑 Administrator' : '📊 Manager'}
          </div>
          <button onClick={logout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Roles</option>
            <option value="admin">👑 Admin</option>
            <option value="manager">📊 Manager</option>
            <option value="user">👤 User</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="active">🟢 Active</option>
            <option value="inactive">🔴 Inactive</option>
          </select>

          {canCreate && (
            <button onClick={() => setShowCreateModal(true)}>
              + Create New User
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            {users.length === 0 ? (
              <div className="user-card" style={{ textAlign: 'center', justifyContent: 'center' }}>
                <p>No users found. {canCreate && "Click 'Create New User' to add one."}</p>
              </div>
            ) : (
              <div className="users-grid">
                {users.map((u) => (
                  <div className="user-card" key={u._id}>
                    <div className="user-info">
                      {editingUser?._id === u._id ? (
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          style={{ marginBottom: "10px", width: "100%" }}
                        />
                      ) : (
                        <>
                          <div className="user-name">{u.name}</div>
                          <div className="user-email">{u.email}</div>
                        </>
                      )}
                      
                      <div>
                        <span className={`user-role role-${u.role}`}>
                          {u.role === 'admin' ? '👑 Admin' : u.role === 'manager' ? '📊 Manager' : '👤 User'}
                        </span>
                        <span className={`status-${u.status}`}>
                          {u.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </div>
                      
                      <div className="audit-info">
                        {u.createdBy?.name && (
                          <span>📝 Created by: {u.createdBy.name}</span>
                        )}
                        <span>🕒 Updated: {new Date(u.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="user-actions">
                      {editingUser?._id === u._id ? (
                        <>
                          <button onClick={() => handleUpdate(u._id, { name: editingUser.name })} className="btn-edit">
                            💾 Save
                          </button>
                          <button onClick={() => setEditingUser(null)} className="btn-delete">
                            ❌ Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {canEdit && (
                            <button onClick={() => setEditingUser(u)} className="btn-edit">
                              ✏️ Edit
                            </button>
                          )}
                          {canDelete && (
                            <button onClick={() => handleDelete(u._id, u.name)} className="btn-delete">
                              🗑️ Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage(1)} disabled={page === 1}>
                  ⏮ First
                </button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  ◀ Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={page === pageNum ? "active" : ""}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next ▶
                </button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  Last ⏭
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>✨ Create New User</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleCreate({
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password"),
                role: formData.get("role"),
                status: formData.get("status")
              });
            }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <select name="role" required>
                <option value="user">👤 User</option>
                <option value="manager">📊 Manager</option>
                <option value="admin">👑 Admin</option>
              </select>
              <select name="status" required>
                <option value="active">🟢 Active</option>
                <option value="inactive">🔴 Inactive</option>
              </select>
              <div className="modal-buttons">
                <button type="submit">✅ Create User</button>
                <button type="button" onClick={() => setShowCreateModal(false)}>❌ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;