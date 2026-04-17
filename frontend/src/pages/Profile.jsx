import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const updateData = {};
      if (formData.name !== user.name) updateData.name = formData.name;
      if (formData.password) updateData.password = formData.password;
      
      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData, user.token);
        
        const updatedUser = { ...user, name: formData.name };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        login(updatedUser);
        
        setMessage('✅ Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('No changes to update');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    switch(user?.role) {
      case 'admin': return '👑 Administrator';
      case 'manager': return '📊 Manager';
      default: return '👤 Regular User';
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>👤 My Profile</h2>
        <div className="header-right">
          <div className="role-badge">{getRoleBadge()}</div>
          <button onClick={logout} className="logout-btn">🚪 Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="user-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div className="user-info">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '10px' }}>
                {user?.role === 'admin' ? '👑' : user?.role === 'manager' ? '📊' : '👤'}
              </div>
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>

            {message && (
              <div style={{
                padding: '12px',
                marginBottom: '20px',
                borderRadius: '12px',
                background: message.includes('success') ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: message.includes('success') ? '#34d399' : '#f87171',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e4e4e7', fontWeight: '500' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0f0f1e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e4e4e7'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e4e4e7', fontWeight: '500' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#6b7280',
                    cursor: 'not-allowed'
                  }}
                />
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  Email cannot be changed
                </small>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e4e4e7', fontWeight: '500' }}>
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0f0f1e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e4e4e7'
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Updating...' : '💾 Update Profile'}
              </button>
            </form>

            {(user?.role === 'admin' || user?.role === 'manager') && (
              <button 
                onClick={() => navigate('/dashboard')}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginTop: '12px',
                  background: 'rgba(167, 139, 250, 0.2)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  borderRadius: '12px',
                  color: '#a78bfa',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📊 Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;