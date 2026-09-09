import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Clock,
  Building2,
  Check,
  User,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import dashboardService from '../services/dashboardService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [stats, setStats] = useState({
    totalLeads: 2845,
    newLeads: 850,
    contactedLeads: 620,
    siteVisitLeads: 410,
    interestedLeads: 280,
    negotiationLeads: 112,
    bookedLeads: 45,
    lostLeads: 25,
    totalProjects: 8,
    totalUnits: 112,
    availableUnits: 68,
    bookedUnits: 44,
    totalBookings: 18,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await dashboardService.getDashboardStats();
        if (data) {
          setStats((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Compute funnel percentages
  const maxFunnelVal = Math.max(
    stats.newLeads || 850,
    stats.contactedLeads || 620,
    stats.siteVisitLeads || 410,
    stats.interestedLeads || 280,
    stats.negotiationLeads || 112,
    stats.bookedLeads || 45,
    1
  );

  const getPercent = (val) => Math.min(100, Math.round(((val || 0) / maxFunnelVal) * 100));

  // Follow-ups list from screenshot
  const followups = [
    { id: 1, name: 'Priya Patel', due: 'Today, 03:00 PM', assignedTo: 'Neha S.', priority: 'high' },
    { id: 2, name: 'Sanjay Gupta', due: 'Today, 05:30 PM', assignedTo: 'Rajesh K.', priority: 'medium' },
    { id: 3, name: 'Ananya Iyer', due: 'Tomorrow, 10:00 AM', assignedTo: 'Neha S.', priority: 'high' },
    { id: 4, name: 'Rohan Mehta', due: 'Tomorrow, 11:30 AM', assignedTo: 'Amit P.', priority: 'low' },
  ];

  // Recent active updates from screenshot
  const updates = [
    {
      id: 1,
      name: 'Vikram Singh',
      action: 'Booked Kosal Heights 1205',
      time: '10 mins ago',
      type: 'booked',
    },
    {
      id: 2,
      name: 'Amit Sharma',
      action: 'Completed Site Visit with Neha S.',
      time: '45 mins ago',
      type: 'visit',
    },
    {
      id: 3,
      name: 'Pooja Reddy',
      action: 'Moved to Negotiation for Aurelia Villa 08',
      time: '2 hours ago',
      type: 'negotiation',
    },
    {
      id: 4,
      name: 'Karan Malhotra',
      action: 'New Lead created via MagicBricks',
      time: '3 hours ago',
      type: 'new',
    },
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="dashboard-container">
      {/* Role Indicator Banner */}
      <div className="dashboard-role-banner">
        {isAdmin ? (
          <div className="role-banner admin-banner">
            <span className="role-tag admin-tag">ADMINISTRATOR</span>
            <span className="role-banner-text">
              <strong>Executive Overview:</strong> Viewing organization-wide sales pipeline, global inventory, and team performance metrics.
            </span>
          </div>
        ) : (
          <div className="role-banner sales-banner">
            <span className="role-tag sales-tag">SALES EMPLOYEE</span>
            <span className="role-banner-text">
              <strong>My Portfolio:</strong> Showing your assigned leads, scheduled customer follow-ups, and individual sales performance.
            </span>
          </div>
        )}
      </div>

      {/* Top 4 Metrics Cards */}
      <section className="metrics-grid">
        {/* Card 1: Active Leads */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">{isAdmin ? 'Total Active Leads' : 'My Active Leads'}</span>
            <div className="metric-icon-box yellow">
              <Users size={18} />
            </div>
          </div>
          <div className="metric-main-stat">
            <span className="metric-value">
              {isAdmin ? (stats.totalLeads?.toLocaleString() || '2,845') : '48'}
            </span>
            <span className="metric-badge green">
              <ArrowUpRight size={12} /> {isAdmin ? '12%' : 'Active'}
            </span>
          </div>
          <span className="metric-subtitle">
            {isAdmin ? 'vs 2,540 last month across all projects' : 'Directly assigned to you'}
          </span>
        </div>

        {/* Card 2: Follow-ups Today */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">{isAdmin ? 'Team Follow-ups Today' : 'My Follow-ups Today'}</span>
            <div className="metric-icon-box blue">
              <Clock size={18} />
            </div>
          </div>
          <div className="metric-main-stat">
            <span className="metric-value">{isAdmin ? '48' : '8'}</span>
            <span className="metric-badge yellow">{isAdmin ? '12 Pending' : '3 Urgent'}</span>
          </div>
          <span className="metric-subtitle">
            {isAdmin ? 'Assigned to 6 sales reps' : 'Scheduled for today'}
          </span>
        </div>

        {/* Card 3: Bookings This Month */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">{isAdmin ? 'Bookings This Month' : 'My Bookings This Month'}</span>
            <div className="metric-icon-box green">
              <Building2 size={18} />
            </div>
          </div>
          <div className="metric-main-stat">
            <span className="metric-value">
              {isAdmin ? (stats.totalBookings || '18') : '4'}
            </span>
            <span className="metric-badge green">{isAdmin ? 'Target: 25' : 'Target: 5'}</span>
          </div>
          <span className="metric-subtitle">
            {isAdmin ? '72% of monthly company quota achieved' : '80% of personal target achieved'}
          </span>
        </div>

        {/* Card 4: Revenue Pipeline */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">{isAdmin ? 'Revenue Pipeline' : 'My Pipeline Value'}</span>
            <div className="metric-icon-box orange">
              <span style={{ fontWeight: 800, fontSize: 16 }}>₹</span>
            </div>
          </div>
          <div className="metric-main-stat">
            <span className="metric-value">{isAdmin ? '₹12.4 Cr' : '₹2.85 Cr'}</span>
            <span className="metric-badge orange">Weighted</span>
          </div>
          <span className="metric-subtitle">
            {isAdmin ? 'Across 112 qualified negotiations' : 'Across 8 active negotiations'}
          </span>
        </div>
      </section>

      {/* Middle Row: Leads Funnel + Recent Updates */}
      <section className="dashboard-row">
        {/* Leads Pipeline Stage Funnel */}
        <div className="funnel-card">
          <div className="card-header-row">
            <h3 className="funnel-title">Leads Pipeline Stage Funnel</h3>
            <Link to="/leads" className="view-details-link">
              View Details
            </Link>
          </div>

          <div className="funnel-stages-list">
            {/* New Leads */}
            <div className="funnel-stage-row">
              <span className="stage-name">New Leads</span>
              <div className="stage-bar-track">
                <div
                  className="stage-bar-fill bar-new"
                  style={{ width: `${getPercent(stats.newLeads || 850)}%` }}
                />
              </div>
              <span className="stage-count">{stats.newLeads || 850}</span>
            </div>

            {/* Contacted */}
            <div className="funnel-stage-row">
              <span className="stage-name">Contacted</span>
              <div className="stage-bar-track">
                <div
                  className="stage-bar-fill bar-contacted"
                  style={{ width: `${getPercent(stats.contactedLeads || 620)}%` }}
                />
              </div>
              <span className="stage-count">{stats.contactedLeads || 620}</span>
            </div>

            {/* Site Visit Scheduled */}
            <div className="funnel-stage-row">
              <span className="stage-name">Site Visit Scheduled</span>
              <div className="stage-bar-track">
                <div
                  className="stage-bar-fill bar-site-visit"
                  style={{ width: `${getPercent(stats.siteVisitLeads || 410)}%` }}
                />
              </div>
              <span className="stage-count">{stats.siteVisitLeads || 410}</span>
            </div>

            {/* Interested */}
            <div className="funnel-stage-row">
              <span className="stage-name">Interested</span>
              <div className="stage-bar-track">
                <div
                  className="stage-bar-fill bar-interested"
                  style={{ width: `${getPercent(stats.interestedLeads || 280)}%` }}
                />
              </div>
              <span className="stage-count">{stats.interestedLeads || 280}</span>
            </div>

            {/* Negotiation */}
            <div className="funnel-stage-row">
              <span className="stage-name">Negotiation</span>
              <div className="stage-bar-track">
                <div
                  className="stage-bar-fill bar-negotiation"
                  style={{ width: `${getPercent(stats.negotiationLeads || 112)}%` }}
                />
              </div>
              <span className="stage-count">{stats.negotiationLeads || 112}</span>
            </div>

            {/* Booked */}
            <div className="funnel-stage-row">
              <span className="stage-name">Booked</span>
              <div className="stage-bar-track">
                <div
                  className="stage-bar-fill bar-booked"
                  style={{ width: `${getPercent(stats.bookedLeads || 45)}%` }}
                />
              </div>
              <span className="stage-count">{stats.bookedLeads || 45}</span>
            </div>
          </div>
        </div>

        {/* Recent Active Updates */}
        <div className="updates-card">
          <h3 className="card-heading">Recent Active Updates</h3>
          <div className="updates-list">
            {updates.map((item) => (
              <div key={item.id} className="update-item">
                <div
                  className={`update-avatar-icon ${
                    item.type === 'booked' ? 'check' : 'user'
                  }`}
                >
                  {item.type === 'booked' ? (
                    <Check size={18} />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div className="update-content">
                  <span className="update-user-name">{item.name}</span>
                  <span className="update-description">{item.action}</span>
                  <span className="update-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Row: Upcoming Follow-ups + Monthly Bookings Trend */}
      <section className="dashboard-row">
        {/* Upcoming Follow-ups (Next 24h) */}
        <div className="followups-card">
          <h3 className="card-heading">Upcoming Follow-ups (Next 24h)</h3>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="followups-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Due Date</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {followups.map((row) => (
                  <tr key={row.id}>
                    <td className="lead-name-bold">{row.name}</td>
                    <td>{row.due}</td>
                    <td>{row.assignedTo}</td>
                    <td>
                      <span className={`priority-badge ${row.priority}`}>
                        {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Bookings Trend */}
        <div className="trend-card">
          <h3 className="card-heading">Monthly Bookings Trend</h3>
          <div className="chart-wrapper">
            <div className="chart-bar-group">
              <div className="trend-bar muted" style={{ height: '55%' }} />
              <span className="chart-label">May</span>
            </div>
            <div className="chart-bar-group">
              <div className="trend-bar muted" style={{ height: '70%' }} />
              <span className="chart-label">Jun</span>
            </div>
            <div className="chart-bar-group">
              <div className="trend-bar muted" style={{ height: '90%' }} />
              <span className="chart-label">Jul</span>
            </div>
            <div className="chart-bar-group">
              <div className="trend-bar muted" style={{ height: '65%' }} />
              <span className="chart-label">Aug</span>
            </div>
            <div className="chart-bar-group">
              <div className="trend-bar orange" style={{ height: '80%' }} />
              <span className="chart-label">Sep</span>
            </div>
            <div className="chart-bar-group">
              <div className="trend-bar green" style={{ height: '88%' }} />
              <span className="chart-label">Oct</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;