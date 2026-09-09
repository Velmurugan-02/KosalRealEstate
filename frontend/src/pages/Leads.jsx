import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  Eye,
  Edit2,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import leadService from '../services/leadService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import './Leads.css';

function Leads() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [salesRepFilter, setSalesRepFilter] = useState('ALL');
  const [selectedLeadIds, setSelectedLeadIds] = useState([1, 2, 8]); // matching screenshot initial selection
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    leadService.getAllLeads()
      .then((data) => {
        if (isMounted) {
          setLeads(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load leads:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const loadLeads = async () => {
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads:', err);
    }
  };

  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (!val.trim()) {
      loadLeads();
    } else {
      const results = await leadService.searchLeads(val);
      setLeads(results);
    }
  };

  // Filter leads in memory
  const filteredLeads = leads.filter((lead) => {
    if (stageFilter !== 'ALL' && lead.stage !== stageFilter) {
      return false;
    }
    if (isAdmin) {
      if (salesRepFilter !== 'ALL' && lead.assignedToName !== salesRepFilter) {
        return false;
      }
    }
    return true;
  });

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatStageClass = (stage) => {
    switch (stage) {
      case 'SITE_VISIT':
        return 'site-visit';
      case 'NEGOTIATION':
        return 'negotiation';
      case 'BOOKED':
        return 'booked';
      case 'NEW':
        return 'new';
      case 'INTERESTED':
        return 'interested';
      case 'CONTACTED':
        return 'contacted';
      case 'LOST':
        return 'lost';
      default:
        return 'new';
    }
  };

  const formatStageLabel = (stage) => {
    switch (stage) {
      case 'SITE_VISIT':
        return 'Site Visit';
      case 'NEGOTIATION':
        return 'Negotiation';
      case 'BOOKED':
        return 'Booked';
      case 'NEW':
        return 'New';
      case 'INTERESTED':
        return 'Interested';
      case 'CONTACTED':
        return 'Contacted';
      case 'LOST':
        return 'Lost';
      default:
        return stage;
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="leads-page-container">
      {/* Top Header Row */}
      <div className="leads-header-row">
        <div className="leads-title-wrapper">
          <h1 className="leads-page-title">Leads Management</h1>
          <span className="total-leads-badge">
            {isAdmin ? '2,845 Total (Global)' : '48 Assigned Leads'}
          </span>
        </div>
        <button
          type="button"
          className="add-lead-btn"
          onClick={() => navigate('/leads/new')}
        >
          <Plus size={18} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Role Notice Banner for Sales Employee */}
      {!isAdmin && (
        <div className="dashboard-role-banner" style={{ marginBottom: 16 }}>
          <div className="role-banner sales-banner">
            <span className="role-tag sales-tag">SALES EMPLOYEE</span>
            <span className="role-banner-text">
              <strong>Assigned Portfolio:</strong> Showing leads assigned to your account. Global pipeline and cross-rep reassignments require Admin Manager access.
            </span>
          </div>
        </div>
      )}

      {/* Filter Card */}
      <div className="leads-filters-card">
        <div className="filter-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-dropdown"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="ALL">All Stages</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="SITE_VISIT">Site Visit</option>
          <option value="INTERESTED">Interested</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="BOOKED">Booked</option>
          <option value="LOST">Lost</option>
        </select>

        {isAdmin ? (
          <select
            className="filter-dropdown"
            value={salesRepFilter}
            onChange={(e) => setSalesRepFilter(e.target.value)}
          >
            <option value="ALL">All Sales Reps</option>
            <option value="Rajesh K.">Rajesh K.</option>
            <option value="Neha S.">Neha S.</option>
            <option value="Amit P.">Amit P.</option>
          </select>
        ) : (
          <select className="filter-dropdown" disabled value="MINE">
            <option value="MINE">My Assigned Leads</option>
          </select>
        )}

        <button type="button" className="filter-date-btn">
          <span>Last 30 Days</span>
          <Calendar size={16} color="#64748b" />
        </button>
      </div>

      {/* Bulk Actions Banner (appears when leads are selected) */}
      {selectedLeadIds.length > 0 && (
        <div className="bulk-actions-banner">
          <div className="bulk-indicator">
            <div className="bulk-accent-box" />
            <span>{selectedLeadIds.length} leads selected</span>
          </div>
          <div className="bulk-btn-group">
            <button
              type="button"
              className="bulk-btn"
              onClick={() => alert(`Bulk assign ${selectedLeadIds.length} leads`)}
            >
              Bulk Assign
            </button>
            <button
              type="button"
              className="bulk-btn"
              onClick={() => alert(`Change stage for ${selectedLeadIds.length} leads`)}
            >
              Change Stage
            </button>
          </div>
        </div>
      )}

      {/* Leads Table Card */}
      <div className="leads-table-card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="leads-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      filteredLeads.length > 0 &&
                      selectedLeadIds.length === filteredLeads.length
                    }
                  />
                </th>
                <th>Lead Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Stage</th>
                <th>Assigned To</th>
                <th>Follow-up</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => toggleSelectRow(lead.id)}
                    />
                  </td>
                  <td className="lead-name-cell">
                    <Link to={`/leads/${lead.id}`} style={{ color: 'inherit' }}>
                      {lead.firstName} {lead.lastName}
                    </Link>
                  </td>
                  <td>{lead.phone}</td>
                  <td>{lead.email}</td>
                  <td>
                    <span className={`stage-badge ${formatStageClass(lead.stage)}`}>
                      {formatStageLabel(lead.stage)}
                    </span>
                  </td>
                  <td>{lead.assignedToName || 'Unassigned'}</td>
                  <td>{lead.followUpDate || '--'}</td>
                  <td>{lead.source}</td>
                  <td>
                    <div className="actions-cell">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="action-icon-link"
                        title="View Lead Details"
                      >
                        <Eye size={17} />
                      </Link>
                      <Link
                        to={`/leads/${lead.id}/edit`}
                        className="action-icon-link"
                        title="Edit Lead"
                      >
                        <Edit2 size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="pagination-row">
        <span className="pagination-info">
          Showing 1-{filteredLeads.length} of 2,845 leads
        </span>
        <div className="pagination-controls">
          <button
            type="button"
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(1)}
          >
            1
          </button>
          <button
            type="button"
            className={`page-btn ${currentPage === 2 ? 'active' : ''}`}
            onClick={() => setCurrentPage(2)}
          >
            2
          </button>
          <button
            type="button"
            className={`page-btn ${currentPage === 3 ? 'active' : ''}`}
            onClick={() => setCurrentPage(3)}
          >
            3
          </button>
          <button
            type="button"
            className="page-btn"
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Leads;
