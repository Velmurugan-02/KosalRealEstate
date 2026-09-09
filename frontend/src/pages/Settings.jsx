import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Minus,
  X,
  User,
  Shield,
  Bell,
  Building,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import './Settings.css';

const INITIAL_MEMBERS = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@kosalestates.com',
    role: 'Sales Head',
    roleClass: 'sales-head',
    status: 'Active',
    statusClass: 'active',
    lastActive: 'Just now',
  },
  {
    id: 2,
    name: 'Neha Saxena',
    email: 'neha.s@kosalestates.com',
    role: 'Sales Employee',
    roleClass: 'sales-employee',
    status: 'Active',
    statusClass: 'active',
    lastActive: '10 mins ago',
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit.p@kosalestates.com',
    role: 'Sales Employee',
    roleClass: 'sales-employee',
    status: 'Active',
    statusClass: 'active',
    lastActive: '2 hours ago',
  },
  {
    id: 4,
    name: 'Suresh Kumar',
    email: 'suresh.k@kosalestates.com',
    role: 'Admin Manager',
    roleClass: 'admin-manager',
    status: 'Active',
    statusClass: 'active',
    lastActive: 'Yesterday',
  },
  {
    id: 5,
    name: 'Priya Iyer',
    email: 'priya.iyer@kosalestates.com',
    role: 'Sales Employee',
    roleClass: 'sales-employee',
    status: 'Invited',
    statusClass: 'invited',
    lastActive: 'Pending invite',
  },
];

const PERMISSIONS = [
  { feature: 'Manage Leads & Status', admin: true, salesRep: true },
  { feature: 'View All Leads (Global Pipeline)', admin: true, salesRep: false },
  { feature: 'Manage Properties & Highrises', admin: true, salesRep: false },
  { feature: 'Create & Lock Bookings', admin: true, salesRep: true },
  { feature: 'View Team Performance Reports', admin: true, salesRep: false },
  { feature: 'IT User Activation & CRM Settings', admin: true, salesRep: false },
];

function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [activeTab, setActiveTab] = useState('team');

  // Persistent team members
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('kosal_crm_team_members');
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kosal_crm_team_members', JSON.stringify(members));
    } catch {
      // ignore
    }
  }, [members]);

  // Invite Member Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Sales Employee',
    password: 'Sales@123',
  });

  // Edit Member Modal state
  const [editingMember, setEditingMember] = useState(null);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Rajesh',
    lastName: user?.lastName || 'Sharma',
    email: user?.email || 'rajesh.sharma@kosalestates.com',
    phone: '+91 98765 43210',
    designation: isAdmin ? 'Managing Director & IT Head' : 'Senior Sales Specialist',
    city: 'Noida, Sector 62',
    currentPassword: '',
    newPassword: '',
  });

  // Notifications Form state
  const [notifications, setNotifications] = useState({
    leadAssigned: true,
    unitBooked: true,
    siteVisitReminder: true,
    dailyDigest: false,
    priceChangeAlert: true,
  });

  // Company Settings Form state
  const [companyData, setCompanyData] = useState({
    companyName: 'Kosal Real Estate Pvt. Ltd.',
    reraNumber: 'UPRERAPRJ984321',
    gstin: '07AAAAA0000A1Z5',
    supportEmail: 'contact@kosalestates.com',
    phone: '+91 120 4567890',
    address: 'Tower A, Floor 14, Commercial Express Park, Noida Sector 62, UP 201309',
    currency: 'INR (₹)',
    unitSystem: 'Square Feet (Sq.Ft.)',
  });

  // Delete Member Handler
  const handleDelete = (id) => {
    if (!isAdmin) {
      alert('Only Admin Managers can remove team members.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Invite Member Handler
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) {
      alert('Please fill in member name and email.');
      return;
    }
    const roleClass =
      newMember.role === 'Admin Manager'
        ? 'admin-manager'
        : newMember.role === 'Sales Head'
        ? 'sales-head'
        : 'sales-employee';
    const initialPass =
      newMember.password?.trim() ||
      (newMember.role === 'Admin Manager' ? 'Admin@123' : 'Sales@123');

    const added = {
      id: Date.now(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      roleClass,
      password: initialPass,
      status: 'Invited',
      statusClass: 'invited',
      lastActive: 'Pending invite',
    };
    setMembers((prev) => [added, ...prev]);
    setShowInviteModal(false);
    setNewMember({
      name: '',
      email: '',
      role: 'Sales Employee',
      password: 'Sales@123',
    });
    alert(
      `Account created successfully!\n\n${added.name} can now sign in at the Login page with:\nEmail: ${added.email}\nPassword: ${initialPass}`
    );
  };

  // Edit Member Handler
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    const roleClass =
      editingMember.role === 'Admin Manager'
        ? 'admin-manager'
        : editingMember.role === 'Sales Head'
        ? 'sales-head'
        : 'sales-employee';
    const statusClass =
      editingMember.status === 'Active'
        ? 'active'
        : editingMember.status === 'Invited'
        ? 'invited'
        : 'negotiation';

    // Update lastActive according to status changes
    let lastActive = 'Just now';
    if (editingMember.status === 'Inactive') {
      lastActive = 'Deactivated';
    } else if (editingMember.status === 'Invited') {
      lastActive = 'Pending invite';
    } else if (editingMember.status === 'Active') {
      lastActive = 'Just now';
    }

    const updated = {
      ...editingMember,
      roleClass,
      statusClass,
      lastActive,
      password:
        editingMember.password?.trim() ||
        (editingMember.role === 'Admin Manager' ? 'Admin@123' : 'Sales@123'),
    };

    setMembers((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
    setEditingMember(null);
    alert(`Member ${updated.name} updated successfully!\nStatus: ${updated.status}\nLast Active: ${lastActive}`);
  };

  // Save Profile Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profile preferences updated successfully!');
  };

  // Save Notifications Handler
  const handleSaveNotifications = (e) => {
    e.preventDefault();
    alert('Notification settings saved!');
  };

  // Save Company Handler
  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Only Administrators can modify company credentials.');
      return;
    }
    alert('Company & CRM settings successfully updated!');
  };

  return (
    <div className="settings-page-grid">
      {/* Left Sub-Navigation */}
      <aside className="settings-subnav">
        <button
          type="button"
          className={`subnav-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span>Profile</span>
          <User size={16} />
        </button>
        <button
          type="button"
          className={`subnav-link ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <span>Team Members</span>
          <span className="team-count-badge" style={{ padding: '2px 7px', fontSize: 11 }}>
            {members.length}
          </span>
        </button>
        <button
          type="button"
          className={`subnav-link ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <span>Roles &amp; Permissions</span>
          <Shield size={16} />
        </button>
        <button
          type="button"
          className={`subnav-link ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <span>Notifications</span>
          <Bell size={16} />
        </button>
        <button
          type="button"
          className={`subnav-link ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          <span>Company Settings</span>
          <Building size={16} />
        </button>
      </aside>

      {/* Main Settings Content Area */}
      <div className="settings-content-area">
        {/* ================================================================= */}
        {/* 1. PROFILE TAB                                                    */}
        {/* ================================================================= */}
        {activeTab === 'profile' && (
          <div className="settings-card">
            <div className="settings-card-header">
              <h1 className="settings-card-title">My Personal Profile</h1>
              <p className="settings-card-subtitle">
                Manage your profile identity, contact information, and CRM login credentials.
              </p>
            </div>

            <div className="profile-avatar-row">
              <div className="profile-avatar-large">
                {profileData.firstName?.[0] || 'U'}
              </div>
              <div className="profile-avatar-info">
                <div className="profile-name-title">
                  <span>
                    {profileData.firstName} {profileData.lastName}
                  </span>
                  <span className={`team-role-pill ${isAdmin ? 'admin-manager' : 'sales-employee'}`}>
                    {isAdmin ? 'ADMINISTRATOR' : 'SALES EMPLOYEE'}
                  </span>
                </div>
                <span className="profile-email-sub">{profileData.email}</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="settings-form-grid">
                <div className="settings-field-group">
                  <label className="settings-field-label">First Name</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, firstName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Last Name</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, lastName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Official Work Email</label>
                  <input
                    type="email"
                    className="settings-input-control"
                    value={profileData.email}
                    disabled
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Direct Phone Number</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Designation / Role Title</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={profileData.designation}
                    onChange={(e) =>
                      setProfileData({ ...profileData, designation: e.target.value })
                    }
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Primary Office City</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={profileData.city}
                    onChange={(e) =>
                      setProfileData({ ...profileData, city: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="settings-card-header" style={{ marginTop: 20 }}>
                <h3 className="settings-card-title" style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Key size={18} /> Password &amp; Security
                </h3>
                <p className="settings-card-subtitle">
                  Ensure your CRM account is using a strong password.
                </p>
              </div>

              <div className="settings-form-grid" style={{ marginTop: 14 }}>
                <div className="settings-field-group">
                  <label className="settings-field-label">Current Password</label>
                  <input
                    type="password"
                    className="settings-input-control"
                    placeholder="••••••••"
                    value={profileData.currentPassword}
                    onChange={(e) =>
                      setProfileData({ ...profileData, currentPassword: e.target.value })
                    }
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">New Password</label>
                  <input
                    type="password"
                    className="settings-input-control"
                    placeholder="Enter new strong password"
                    value={profileData.newPassword}
                    onChange={(e) =>
                      setProfileData({ ...profileData, newPassword: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="settings-card-footer">
                <button type="submit" className="save-settings-btn">
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. TEAM MEMBERS TAB                                               */}
        {/* ================================================================= */}
        {activeTab === 'team' && (
          <>
            <div className="team-header-row">
              <div className="team-title-group">
                <h1 className="team-page-title">Team Members</h1>
                <span className="team-count-badge">{members.length} Active</span>
              </div>

              {isAdmin ? (
                <button
                  type="button"
                  className="invite-member-btn"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Plus size={18} />
                  <span>Invite Member</span>
                </button>
              ) : (
                <span
                  className="sales-view-badge"
                  title="Admin Manager access is required to invite or modify workspace members"
                >
                  View Only (Admin Required)
                </span>
              )}
            </div>

            {/* Sales Employee Read-Only Banner */}
            {!isAdmin && (
              <div className="dashboard-role-banner" style={{ marginBottom: 16 }}>
                <div className="role-banner sales-banner">
                  <span className="role-tag sales-tag">SALES EMPLOYEE</span>
                  <span className="role-banner-text">
                    <strong>Read-Only Workspace Settings:</strong> You are viewing team members and permission matrix. Inviting members, updating roles, and CRM configuration require Admin Manager access.
                  </span>
                </div>
              </div>
            )}

            {/* Team Members Table Card */}
            <div className="team-table-card">
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="member-name-bold">{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        <span className={`team-role-pill ${member.roleClass}`}>
                          {member.role}
                        </span>
                      </td>
                      <td>
                        <span className={`team-status-pill ${member.statusClass}`}>
                          {member.status}
                        </span>
                      </td>
                      <td>{member.lastActive}</td>
                      <td>
                        {isAdmin ? (
                          <div className="team-action-icons">
                            <button
                              type="button"
                              className="team-icon-btn"
                              title="Edit Member"
                              onClick={() => setEditingMember({ ...member })}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              className="team-icon-btn delete"
                              title="Delete Member"
                              onClick={() => handleDelete(member.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ================================================================= */}
        {/* 3. ROLES & PERMISSIONS TAB                                       */}
        {/* ================================================================= */}
        {activeTab === 'roles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="settings-card-header" style={{ border: 'none', padding: 0 }}>
              <h1 className="team-page-title">Roles &amp; Access Permissions</h1>
              <p className="settings-card-subtitle">
                Inspect workspace privilege tiers and baseline functional access matrix.
              </p>
            </div>

            {/* 3 Scope Cards */}
            <div className="role-cards-grid">
              <div className="role-scope-card admin">
                <div className="role-scope-header">
                  <span className="role-scope-title">Administrator</span>
                  <span className="role-scope-badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                    Full Access
                  </span>
                </div>
                <p className="role-scope-desc">
                  Complete ownership of user accounts, property inventory publishing, team performance metrics, and global customer pipelines.
                </p>
                <span className="role-scope-count">1 Active Member</span>
              </div>

              <div className="role-scope-card sales-head">
                <div className="role-scope-header">
                  <span className="role-scope-title">Sales Head</span>
                  <span className="role-scope-badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                    Supervisory
                  </span>
                </div>
                <p className="role-scope-desc">
                  Oversees team lead distribution, advances high-value negotiations, and monitors site visit conversion rates across sales reps.
                </p>
                <span className="role-scope-count">1 Active Member</span>
              </div>

              <div className="role-scope-card sales-rep">
                <div className="role-scope-header">
                  <span className="role-scope-title">Sales Employee</span>
                  <span className="role-scope-badge" style={{ backgroundColor: '#fff7ed', color: '#c2410c' }}>
                    Assigned Leads
                  </span>
                </div>
                <p className="role-scope-desc">
                  Focused on assigned customer communications, managing lead stages, scheduling site visits, and booking available inventory units.
                </p>
                <span className="role-scope-count">
                  {members.filter((m) => m.role === 'Sales Employee').length} Active Members
                </span>
              </div>
            </div>

            {/* Role Permissions Matrix Card */}
            <div className="matrix-card">
              <h2 className="matrix-title">Role Permissions Matrix</h2>
              <p className="matrix-subtitle">
                A quick look at baseline features accessible by workspace role tiers.
              </p>

              <div className="matrix-list">
                {PERMISSIONS.map((p, idx) => (
                  <div key={idx} className="matrix-row">
                    <span>{p.feature}</span>
                    <div className="matrix-role-flags">
                      <div
                        className={`matrix-flag-item ${
                          p.admin ? 'checked' : 'disabled'
                        }`}
                      >
                        {p.admin ? (
                          <Check size={16} className="flag-icon" />
                        ) : (
                          <Minus size={16} />
                        )}
                        <span>Admin</span>
                      </div>

                      <div
                        className={`matrix-flag-item ${
                          p.salesRep ? 'checked' : 'disabled'
                        }`}
                      >
                        {p.salesRep ? (
                          <Check size={16} className="flag-icon" />
                        ) : (
                          <Minus size={16} />
                        )}
                        <span>Sales Rep</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. NOTIFICATIONS TAB                                              */}
        {/* ================================================================= */}
        {activeTab === 'notifications' && (
          <div className="settings-card">
            <div className="settings-card-header">
              <h1 className="settings-card-title">Notification Preferences</h1>
              <p className="settings-card-subtitle">
                Configure real-time alerts for customer enquiries, bookings, and site visit milestones.
              </p>
            </div>

            <form onSubmit={handleSaveNotifications}>
              <div className="notification-group-list">
                <div className="notification-item-row">
                  <div className="notification-item-text">
                    <span className="notification-item-title">New Lead Assigned Alerts</span>
                    <span className="notification-item-desc">
                      Receive an instant email and push notification when a lead is assigned to you.
                    </span>
                  </div>
                  <label className="switch-label">
                    <input
                      type="checkbox"
                      checked={notifications.leadAssigned}
                      onChange={(e) =>
                        setNotifications({ ...notifications, leadAssigned: e.target.checked })
                      }
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                <div className="notification-item-row">
                  <div className="notification-item-text">
                    <span className="notification-item-title">Unit Booking Confirmations</span>
                    <span className="notification-item-desc">
                      Notify immediately when an inventory property unit is successfully booked.
                    </span>
                  </div>
                  <label className="switch-label">
                    <input
                      type="checkbox"
                      checked={notifications.unitBooked}
                      onChange={(e) =>
                        setNotifications({ ...notifications, unitBooked: e.target.checked })
                      }
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                <div className="notification-item-row">
                  <div className="notification-item-text">
                    <span className="notification-item-title">Site Visit Scheduled Reminders</span>
                    <span className="notification-item-desc">
                      Send 2-hour and 30-minute reminder alerts before customer site tours.
                    </span>
                  </div>
                  <label className="switch-label">
                    <input
                      type="checkbox"
                      checked={notifications.siteVisitReminder}
                      onChange={(e) =>
                        setNotifications({ ...notifications, siteVisitReminder: e.target.checked })
                      }
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                <div className="notification-item-row">
                  <div className="notification-item-text">
                    <span className="notification-item-title">Daily Pipeline Digest</span>
                    <span className="notification-item-desc">
                      Daily morning email summarizing pending customer follow-ups and performance metrics.
                    </span>
                  </div>
                  <label className="switch-label">
                    <input
                      type="checkbox"
                      checked={notifications.dailyDigest}
                      onChange={(e) =>
                        setNotifications({ ...notifications, dailyDigest: e.target.checked })
                      }
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                <div className="notification-item-row">
                  <div className="notification-item-text">
                    <span className="notification-item-title">Inventory Price Revisions</span>
                    <span className="notification-item-desc">
                      Notify when developers update base price per Sq.Ft. on high-rise projects.
                    </span>
                  </div>
                  <label className="switch-label">
                    <input
                      type="checkbox"
                      checked={notifications.priceChangeAlert}
                      onChange={(e) =>
                        setNotifications({ ...notifications, priceChangeAlert: e.target.checked })
                      }
                    />
                    <span className="switch-slider" />
                  </label>
                </div>
              </div>

              <div className="settings-card-footer">
                <button type="submit" className="save-settings-btn">
                  Save Notification Preferences
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. COMPANY SETTINGS TAB                                           */}
        {/* ================================================================= */}
        {activeTab === 'company' && (
          <div className="settings-card">
            <div className="settings-card-header">
              <h1 className="settings-card-title">Company &amp; CRM Settings</h1>
              <p className="settings-card-subtitle">
                Official agency credentials, tax numbers, and localized real-estate parameters.
              </p>
            </div>

            {!isAdmin && (
              <div className="dashboard-role-banner">
                <div className="role-banner sales-banner">
                  <span className="role-tag sales-tag">SALES EMPLOYEE</span>
                  <span className="role-banner-text">
                    <strong>Read-Only View:</strong> Agency legal information and corporate settings can only be altered by an Administrator.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveCompany}>
              <div className="settings-form-grid">
                <div className="settings-field-group">
                  <label className="settings-field-label">Company Legal Name</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={companyData.companyName}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, companyName: e.target.value })
                    }
                    disabled={!isAdmin}
                    required
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">State RERA Registration Number</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={companyData.reraNumber}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, reraNumber: e.target.value })
                    }
                    disabled={!isAdmin}
                    required
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Corporate GSTIN Number</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={companyData.gstin}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, gstin: e.target.value })
                    }
                    disabled={!isAdmin}
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Support &amp; Inquiries Email</label>
                  <input
                    type="email"
                    className="settings-input-control"
                    value={companyData.supportEmail}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, supportEmail: e.target.value })
                    }
                    disabled={!isAdmin}
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Official Office Phone</label>
                  <input
                    type="text"
                    className="settings-input-control"
                    value={companyData.phone}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, phone: e.target.value })
                    }
                    disabled={!isAdmin}
                  />
                </div>

                <div className="settings-field-group">
                  <label className="settings-field-label">Standard Area Measurement Unit</label>
                  <select
                    className="settings-input-control"
                    value={companyData.unitSystem}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, unitSystem: e.target.value })
                    }
                    disabled={!isAdmin}
                  >
                    <option value="Square Feet (Sq.Ft.)">Square Feet (Sq.Ft.)</option>
                    <option value="Square Yards (Sq.Yd.)">Square Yards (Sq.Yd.)</option>
                    <option value="Square Meters (Sq.M.)">Square Meters (Sq.M.)</option>
                  </select>
                </div>
              </div>

              <div className="settings-field-group" style={{ marginTop: 16 }}>
                <label className="settings-field-label">Head Office Corporate Address</label>
                <textarea
                  className="settings-input-control"
                  style={{ height: 72, padding: '10px 14px', resize: 'vertical' }}
                  value={companyData.address}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, address: e.target.value })
                  }
                  disabled={!isAdmin}
                />
              </div>

              {isAdmin && (
                <div className="settings-card-footer">
                  <button type="submit" className="save-settings-btn">
                    Save Company Profile
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* INVITE MEMBER MODAL DIALOG                                          */}
      {/* =================================================================== */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div
            className="invite-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <h2 className="modal-title">Invite New Team Member</h2>
                <span className="modal-subtitle">
                  Assign CRM permissions and email workspace access
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowInviteModal(false)}
                title="Close Modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="modal-input-field"
                    placeholder="e.g. Vikas Nair"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input
                    type="email"
                    className="modal-input-field"
                    placeholder="e.g. vikas.n@kosalestates.com"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    required
                  />
                </div>

                  <div className="form-group">
                    <label className="form-label">Workspace Role *</label>
                    <select
                      className="modal-input-field"
                      value={newMember.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setNewMember({
                          ...newMember,
                          role: newRole,
                          password: newRole === 'Admin Manager' ? 'Admin@123' : 'Sales@123',
                        });
                      }}
                    >
                      <option value="Sales Employee">Sales Employee (Rep)</option>
                      <option value="Sales Head">Sales Head</option>
                      <option value="Admin Manager">Admin Manager</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Initial Login Password *</label>
                    <input
                      type="text"
                      className="modal-input-field"
                      placeholder={newMember.role === 'Admin Manager' ? 'Admin@123' : 'Sales@123'}
                      value={newMember.password}
                      onChange={(e) =>
                        setNewMember({ ...newMember, password: e.target.value })
                      }
                      required
                    />
                    <span style={{ fontSize: 11.5, color: '#64748b', marginTop: 4, display: 'block' }}>
                      💡 This user can use this email &amp; password to sign in immediately on the login screen.
                    </span>
                  </div>
                </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="lead-cancel-btn"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="lead-submit-btn">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* EDIT MEMBER MODAL DIALOG                                            */}
      {/* =================================================================== */}
      {editingMember && (
        <div className="modal-overlay" onClick={() => setEditingMember(null)}>
          <div
            className="edit-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <h2 className="modal-title">Edit Team Member</h2>
                <span className="modal-subtitle">
                  Update role permissions and account status for {editingMember.name}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingMember(null)}
                title="Close Modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="modal-input-field"
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input
                    type="email"
                    className="modal-input-field"
                    value={editingMember.email}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Workspace Role *</label>
                  <select
                    className="modal-input-field"
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                  >
                    <option value="Sales Employee">Sales Employee</option>
                    <option value="Sales Head">Sales Head</option>
                    <option value="Admin Manager">Admin Manager</option>
                  </select>
                </div>

                  <div className="form-group">
                    <label className="form-label">Account Status</label>
                    <select
                      className="modal-input-field"
                      value={editingMember.status}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, status: e.target.value })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Invited">Invited / Pending</option>
                      <option value="Inactive">Inactive / Suspended</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Login Password</label>
                    <input
                      type="text"
                      className="modal-input-field"
                      placeholder="Leave unchanged or enter new password"
                      value={editingMember.password || (editingMember.role === 'Admin Manager' ? 'Admin@123' : 'Sales@123')}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, password: e.target.value })
                      }
                    />
                    <span style={{ fontSize: 11.5, color: '#64748b', marginTop: 4, display: 'block' }}>
                      💡 Set or reset password for this user to log into the CRM.
                    </span>
                  </div>
                </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="lead-cancel-btn"
                  onClick={() => setEditingMember(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="lead-submit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
