// src/components/Navbar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, hasRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">User Management System</div>
      <div className="nav-links">
        {hasRole(['admin', 'manager']) && (
          <Link to="/dashboard">User List</Link>
        )}
        {hasRole(['admin']) && (
          <Link to="/admin">Admin Panel</Link>
        )}
        <Link to="/profile">My Profile</Link>
        <button onClick={handleLogout} className="nav-logout">Logout</button>
      </div>
      <div className="nav-user">Welcome, {user?.name} ({user?.role})</div>
    </nav>
  );
};

export default Navbar;