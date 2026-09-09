import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Settings as SettingsIcon,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import './Layout.css';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute dynamic clickable breadcrumbs based on route
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const items = [{ label: 'KOSAL CRM', to: '/dashboard' }];

    if (path.startsWith('/dashboard')) {
      items.push({ label: 'Dashboard', to: null });
    } else if (path === '/leads/new') {
      items.push({ label: 'Leads', to: '/leads' });
      items.push({ label: 'Add New Lead', to: null });
    } else if (path.startsWith('/leads/') && path.endsWith('/edit')) {
      const leadId = path.split('/')[2];
      items.push({ label: 'Leads', to: '/leads' });
      items.push({ label: 'Lead Details', to: `/leads/${leadId}` });
      items.push({ label: 'Edit Lead', to: null });
    } else if (path.startsWith('/leads/')) {
      items.push({ label: 'Leads', to: '/leads' });
      items.push({ label: 'Lead Details', to: null });
    } else if (path.startsWith('/leads')) {
      items.push({ label: 'Leads', to: null });
    } else if (path.startsWith('/properties/') && path.endsWith('/book')) {
      const propId = path.split('/')[2];
      items.push({ label: 'Properties', to: '/properties' });
      items.push({ label: 'Property Details', to: `/properties/${propId}` });
      items.push({ label: 'Book Unit', to: null });
    } else if (path.startsWith('/properties/')) {
      items.push({ label: 'Properties', to: '/properties' });
      items.push({ label: 'Property Details', to: null });
    } else if (path.startsWith('/properties')) {
      items.push({ label: 'Properties', to: null });
    } else if (path.startsWith('/bookings')) {
      items.push({ label: 'Bookings', to: null });
    } else if (path.startsWith('/settings')) {
      items.push({ label: 'Settings', to: null });
    } else {
      items.push({ label: 'Dashboard', to: null });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : 'Rajesh Sharma';

  const displayRole = user?.role === 'ADMIN' ? 'ADMIN' : 'SALES EMPLOYEE';

  const avatarInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`
    : 'RS';

  return (
    <div className="app-layout-container">
      {/* Sidebar matching kosal-sidebar.png */}
      <aside className="app-sidebar">
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">K</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">KOSAL</span>
            <span className="sidebar-brand-subtitle">REAL ESTATE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <LayoutDashboard size={19} className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Users size={19} className="nav-icon" />
            <span>Leads</span>
          </NavLink>

          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Building2 size={19} className="nav-icon" />
            <span>Properties</span>
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <CalendarCheck size={19} className="nav-icon" />
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <SettingsIcon size={19} className="nav-icon" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* User Card at Bottom */}
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">{avatarInitials}</div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name" title={displayName}>
                {displayName}
              </span>
              <span className="sidebar-role-badge">{displayRole}</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={logout}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="app-main-viewport">
        {/* Top Header Bar */}
        <header className="app-header">
          {/* Clickable Breadcrumbs */}
          <div className="header-breadcrumbs">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <span key={idx} className="breadcrumb-item-wrapper">
                  {crumb.to && !isLast ? (
                    <Link to={crumb.to} className="breadcrumb-link" title={`Go to ${crumb.label}`}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={`breadcrumb-text ${isLast ? 'active' : ''}`}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span className="breadcrumb-sep">&gt;</span>}
                </span>
              );
            })}
          </div>

          {/* Right Header Controls */}
          <div className="header-actions">
            <div className="header-search-bar">
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                className="header-search-input"
                placeholder="Search leads, properties, bookings..."
              />
            </div>

            <button
              type="button"
              className="header-action-btn"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            {/* Profile Dropdown Container */}
            <div className="header-profile-container" ref={dropdownRef}>
              <div
                className="header-profile-menu"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                title="Profile Menu"
              >
                <div className="header-avatar">{avatarInitials}</div>
                <ChevronDown size={14} color="#64748b" />
              </div>

              {profileDropdownOpen && (
                <div className="profile-dropdown-card">
                  <div className="profile-dropdown-user">
                    <span className="dropdown-user-name">{displayName}</span>
                    <span className="dropdown-user-email">
                      {user?.email || 'sales@kosal.com'}
                    </span>
                    <span
                      className={`dropdown-role-pill ${
                        user?.role === 'ADMIN' ? 'admin' : 'sales'
                      }`}
                    >
                      {displayRole}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="dropdown-action-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <UserIcon size={16} />
                    <span>My Profile &amp; Settings</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-action-item logout"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="page-body-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;