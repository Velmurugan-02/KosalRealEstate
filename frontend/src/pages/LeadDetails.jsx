import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  Building2,
} from 'lucide-react';
import leadService from '../services/leadService';
import leadActivityService from '../services/leadActivityService';
import './LeadDetails.css';

const STAGES = [
  { key: 'NEW', label: 'New' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'SITE_VISIT', label: 'Site Visit' },
  { key: 'INTERESTED', label: 'Interested' },
  { key: 'NEGOTIATION', label: 'Negotiation' },
  { key: 'BOOKED', label: 'Booked' },
  { key: 'LOST', label: 'Lost' },
];

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick action form states
  const [currentStage, setCurrentStage] = useState('SITE_VISIT');
  const [assignedAgent, setAssignedAgent] = useState('Neha S.');
  const [followUpDate, setFollowUpDate] = useState('2024-10-28T15:00');
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const leadData = await leadService.getLeadById(id);
        if (leadData) {
          setLead(leadData);
          setCurrentStage(leadData.stage || 'SITE_VISIT');
          setAssignedAgent(leadData.assignedToName || 'Neha S.');
          if (leadData.followUpDate) {
            setFollowUpDate(leadData.followUpDate);
          }
        }
        const acts = await leadActivityService.getActivities(id);
        setActivities(acts);
      } catch (err) {
        console.error('Failed to load lead details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleStageChange = async (newStage) => {
    setCurrentStage(newStage);
    try {
      await leadService.updateLead(id, {
        ...lead,
        stage: newStage,
      });
      setLead((prev) => ({ ...prev, stage: newStage }));
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      await leadService.updateLead(id, {
        ...lead,
        stage: currentStage,
        assignedToName: assignedAgent,
        followUpDate: followUpDate.split('T')[0],
      });
      setLead((prev) => ({
        ...prev,
        stage: currentStage,
        assignedToName: assignedAgent,
        followUpDate: followUpDate.split('T')[0],
      }));
      alert('Lead details updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update lead details.');
    } finally {
      setSavingDetails(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSavingNote(true);
    try {
      const added = await leadActivityService.addActivity(id, {
        type: 'NOTE',
        description: newNote,
      });
      setActivities((prev) => [added, ...prev]);
      setNewNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        Loading lead details...
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <div className="lead-details-grid">
      {/* Left Main Column (2/3) */}
      <div className="details-main-column">
        {/* 1. Lead Profile Header Card */}
        <div className="lead-profile-card">
          <div className="lead-profile-header">
            <div className="lead-identity-group">
              <div className="lead-large-avatar">
                {lead?.firstName?.[0] || 'A'}
                {lead?.lastName?.[0] || 'S'}
              </div>
              <div className="lead-identity-text">
                <div className="lead-identity-title-row">
                  <h2 className="lead-display-name">
                    {lead?.firstName} {lead?.lastName}
                  </h2>
                  <span className="stage-badge site-visit">
                    {STAGES.find((s) => s.key === currentStage)?.label || 'Site Visit Scheduled'}
                  </span>
                </div>
                <span className="lead-id-text">ID: #KSL-882{lead?.id || '1'}</span>
              </div>
            </div>

            <div className="lead-contact-actions">
              <a
                href={`tel:${lead?.phone}`}
                className="contact-round-btn"
                title="Call Lead"
              >
                <Phone size={18} />
              </a>
              <a
                href={`mailto:${lead?.email}`}
                className="contact-round-btn"
                title="Email Lead"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="lead-fields-grid">
            <div className="lead-field-item">
              <span className="field-label-muted">Phone Number</span>
              <span className="field-value-strong">{lead?.phone || '+91 98765 43210'}</span>
            </div>

            <div className="lead-field-item">
              <span className="field-label-muted">Source</span>
              <span className="field-value-strong">{lead?.source || 'MagicBricks Premium'}</span>
            </div>

            <div className="lead-field-item">
              <span className="field-label-muted">Email Address</span>
              <span className="field-value-strong">{lead?.email || 'amit.sharma@gmail.com'}</span>
            </div>

            <div className="lead-field-item">
              <span className="field-label-muted">Creation Date</span>
              <span className="field-value-strong">15 Oct 2024</span>
            </div>
          </div>
        </div>

        {/* 2. Leads Stage Pipeline Stepper */}
        <div className="pipeline-card">
          <h3 className="pipeline-title">Leads Stage Pipeline</h3>
          <div className="pipeline-stepper">
            {STAGES.map((step, idx) => {
              let stepStatus = 'upcoming';
              if (idx < currentStageIndex) stepStatus = 'passed';
              else if (idx === currentStageIndex) stepStatus = 'active';

              return (
                <button
                  key={step.key}
                  type="button"
                  className={`pipeline-step-btn ${stepStatus}`}
                  onClick={() => handleStageChange(step.key)}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Notes & Activity Timeline */}
        <div className="timeline-card">
          <div className="timeline-header-row">
            <h3 className="pipeline-title" style={{ margin: 0 }}>
              Notes &amp; Activity Timeline
            </h3>
          </div>

          <div className="timeline-items-list">
            {activities.map((act) => (
              <div key={act.id} className="timeline-entry">
                <div className="timeline-avatar">
                  {act.author ? act.author[0] : 'N'}
                </div>
                <div className="timeline-entry-content">
                  <div className="timeline-meta-row">
                    <div className="timeline-author-group">
                      <span className="timeline-author-name">
                        {act.author || 'Neha S.'}
                      </span>
                      <span className="timeline-author-role">
                        {act.role || 'Sales Rep'}
                      </span>
                    </div>
                    <span className="timeline-timestamp">
                      {act.time || 'Today, 11:30 AM'}
                    </span>
                  </div>

                  {act.typeLabel && (
                    <span className="timeline-activity-tag">
                      {act.typeLabel}
                    </span>
                  )}

                  <p className="timeline-note-text">{act.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="add-note-box">
            <textarea
              className="add-note-textarea"
              placeholder="Add an activity update or internal note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button
              type="submit"
              className="add-note-btn"
              disabled={savingNote || !newNote.trim()}
            >
              {savingNote ? 'Adding...' : 'Add Note'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side Column (1/3) */}
      <div className="details-side-column">
        {/* Quick Actions Card */}
        <div className="quick-actions-card">
          <h3 className="quick-actions-title">Quick Actions</h3>

          <form onSubmit={handleUpdateDetails}>
            <div className="action-form-group">
              <label className="action-form-label">Change Stage</label>
              <select
                className="action-form-select"
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value)}
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="SITE_VISIT">Site Visit Scheduled</option>
                <option value="INTERESTED">Interested</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="BOOKED">Booked</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            <div className="action-form-group">
              <label className="action-form-label">Assign to Agent</label>
              <select
                className="action-form-select"
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
              >
                <option value="Neha S.">Neha S. (Sales Executive)</option>
                <option value="Rajesh K.">Rajesh K. (Manager)</option>
                <option value="Amit P.">Amit P. (Sales Executive)</option>
                <option value="Suresh K.">Suresh K. (Admin Manager)</option>
              </select>
            </div>

            <div className="action-form-group">
              <label className="action-form-label">Schedule Next Follow-up</label>
              <input
                type="datetime-local"
                className="action-form-input"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="update-lead-btn"
              disabled={savingDetails}
            >
              {savingDetails ? 'Updating...' : 'Update Lead Details'}
            </button>
          </form>
        </div>

        {/* Linked Properties Interest Card */}
        <div className="interest-card">
          <h3 className="interest-title">Linked Properties Interest</h3>
          <div
            className="interest-property-box"
            onClick={() => navigate('/properties/1')}
            style={{ cursor: 'pointer' }}
          >
            <div className="interest-property-info">
              <div className="interest-property-img-placeholder">
                <Building2 size={24} />
              </div>
              <div className="interest-property-text">
                <span className="interest-property-name">Kosal Heights</span>
                <span className="interest-property-unit">Unit 402 • 3 BHK</span>
              </div>
            </div>
            <span className="interest-property-price">₹1.2 Cr</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetails;
