import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X, UserPlus } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Role toggle: 'SALES_EMPLOYEE' or 'ADMIN'
  const [role, setRole] = useState('SALES_EMPLOYEE');
  const [email, setEmail] = useState('sales@kosal.com');
  const [password, setPassword] = useState('Sales@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register New User Modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'SALES_EMPLOYEE',
    password: 'Sales@123',
  });

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setErrorMessage('');
    if (selectedRole === 'SALES_EMPLOYEE') {
      setEmail('sales@kosal.com');
      setPassword('Sales@123');
    } else {
      setEmail('admin@kosal.com');
      setPassword('Admin@123');
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Please provide full name and work email.');
      return;
    }

    try {
      const savedStr = localStorage.getItem('kosal_crm_team_members');
      const existing = savedStr ? JSON.parse(savedStr) : [];
      const roleLabel =
        newUser.role === 'ADMIN' ? 'Admin Manager' : 'Sales Employee';
      const roleClass =
        newUser.role === 'ADMIN' ? 'admin-manager' : 'sales-employee';
      const userPass =
        newUser.password?.trim() ||
        (newUser.role === 'ADMIN' ? 'Admin@123' : 'Sales@123');

      const created = {
        id: Date.now(),
        name: newUser.name.trim(),
        email: newUser.email.trim().toLowerCase(),
        role: roleLabel,
        roleClass,
        password: userPass,
        status: 'Active',
        statusClass: 'active',
        lastActive: 'Just now',
      };

      existing.unshift(created);
      localStorage.setItem('kosal_crm_team_members', JSON.stringify(existing));

      setShowRegisterModal(false);
      setRole(newUser.role);
      setEmail(created.email);
      setPassword(created.password);
      setNewUser({
        name: '',
        email: '',
        role: 'SALES_EMPLOYEE',
        password: 'Sales@123',
      });
      alert(
        `Account created successfully!\n\nName: ${created.name}\nEmail: ${created.email}\nRole: ${roleLabel}\n\nYour credentials have been loaded. Click 'Sign In' to access the workspace.`
      );
    } catch (err) {
      console.error('Account creation error:', err);
      alert('Failed to register account. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="login-container">
      {/* Left Column: Visual Hero Section */}
      <div className="login-hero">
        <div className="login-brand">
          <div className="brand-icon-box">K</div>
          <span className="brand-name">KOSAL CRM</span>
        </div>

        <div className="login-hero-content">
          <h1 className="login-hero-title">
            Smart Real Estate Sales Management
          </h1>
          <p className="login-hero-subtitle">
            Empower your sales organization. Accelerate site visits, manage hot leads, and secure seamless unit bookings.
          </p>
        </div>

        <div className="login-hero-footer">
          © 2026 Kosal Technologies. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <h2 className="login-heading">Welcome Back</h2>
          <p className="login-subheading">
            Enter your credentials to access your sales workspace
          </p>

          {/* Role Switcher */}
          <div className="role-switch-container">
            <label className="role-switch-label">Sign in as</label>
            <div className="role-switcher">
              <button
                type="button"
                className={`role-tab-btn ${role === 'SALES_EMPLOYEE' ? 'active' : ''}`}
                onClick={() => handleRoleChange('SALES_EMPLOYEE')}
              >
                Sales Employee
              </button>
              <button
                type="button"
                className={`role-tab-btn ${role === 'ADMIN' ? 'active' : ''}`}
                onClick={() => handleRoleChange('ADMIN')}
              >
                Admin Manager
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="login-error-alert" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="login-field-group">
              <label className="login-field-label" htmlFor="work-email">
                Work Email
              </label>
              <input
                id="work-email"
                type="email"
                className="login-input-box"
                placeholder="name@kosalestates.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="login-field-group">
              <div className="login-label-row">
                <label className="login-field-label" htmlFor="password-input">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Default demo passwords: Sales@123 or Admin@123');
                  }}
                  className="forgot-password-link"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="password-input-container">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input-box"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>

            <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
              <span>Need a new login ID? </span>
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                + Register New Account
              </button>
            </div>
          </form>
        </div>

        <div className="login-footer-note">
          Need assistance or activation key? Contact IT Sub-Core at 011-8022
        </div>
      </div>

      {/* Create New Account Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="invite-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserPlus size={20} color="var(--primary)" />
                  Create New Login ID
                </h2>
                <span className="modal-subtitle">
                  Create a new Sales Employee or Admin Manager account
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowRegisterModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAccount}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="modal-input-field"
                    placeholder="e.g. Meera Kapoor"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input
                    type="email"
                    className="modal-input-field"
                    placeholder="e.g. meera.k@kosalestates.com"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Role *</label>
                  <select
                    className="modal-input-field"
                    value={newUser.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setNewUser({
                        ...newUser,
                        role: newRole,
                        password: newRole === 'ADMIN' ? 'Admin@123' : 'Sales@123',
                      });
                    }}
                  >
                    <option value="SALES_EMPLOYEE">Sales Employee (Rep)</option>
                    <option value="ADMIN">Admin Manager</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Login Password *</label>
                  <input
                    type="text"
                    className="modal-input-field"
                    placeholder={newUser.role === 'ADMIN' ? 'Admin@123' : 'Sales@123'}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="lead-cancel-btn"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="lead-submit-btn">
                  Create &amp; Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
