import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUsers, createUser, deleteUser, updateUser } from '../services/api';
import UserModal from '../components/UserModal';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(user.token, {
        search,
        role: roleFilter,
        status: statusFilter,
        page,
        limit: 10
      });
      setUsers(res.data.users);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await deleteUser(id, user.token);
      fetchUsers();
    }
  };

  const handleCreateUser = async (userData) => {
    await createUser(userData, user.token);
    setShowModal(false);
    fetchUsers();
  };

  const handleUpdateUser = async (id, userData) => {
    await updateUser(id, userData, user.token);
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Create New User
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${u.status}`}>{u.status}</span>
                  </td>
                  <td>
                    <small>{u.createdBy?.name || 'System'}</small>
                    <br />
                    <small>{new Date(u.createdAt).toLocaleDateString()}</small>
                  </td>
                  <td>
                    <button onClick={() => setEditingUser(u)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <UserModal onClose={() => setShowModal(false)} onSubmit={handleCreateUser} />
      )}
      {editingUser && (
        <UserModal user={editingUser} onClose={() => setEditingUser(null)} onSubmit={handleUpdateUser} />
      )}
    </div>
  );
};

export default AdminPanel;