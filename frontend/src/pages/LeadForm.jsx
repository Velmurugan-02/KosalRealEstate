import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import leadService from '../services/leadService';
import leadActivityService from '../services/leadActivityService';
import './LeadForm.css';

function LeadForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    firstName: isEditing ? '' : 'Rahul',
    lastName: isEditing ? '' : 'Verma',
    email: isEditing ? '' : 'rahul.verma@example.com',
    phone: '',
    source: 'MagicBricks',
    stage: 'NEW',
    assignedToName: 'Neha S.',
    assignedToId: 2,
    interestedProperty: 'Kosal Heights',
    notes: isEditing
      ? ''
      : 'Interested in a premium 2 BHK facing the east gardens. Requested a weekend visit scheduled for next Saturday afternoon.',
    followUpDate: '2026-11-02',
  });

  const [phoneError, setPhoneError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      async function loadExisting() {
        try {
          const data = await leadService.getLeadById(id);
          if (data) {
            setFormData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              phone: data.phone || '',
              source: data.source || 'MagicBricks',
              stage: data.stage || 'NEW',
              assignedToName: data.assignedToName || 'Neha S.',
              assignedToId: data.assignedToId || 2,
              interestedProperty: 'Kosal Heights',
              notes: '',
              followUpDate: data.followUpDate || '2026-11-02',
            });
          }
        } catch (err) {
          console.error('Failed to load lead for edit:', err);
        }
      }
      loadExisting();
    }
  }, [id, isEditing]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (field === 'phone' && val.trim()) {
      setPhoneError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone.trim()) {
      setPhoneError(true);
      return;
    }

    setSaving(true);

    try {
      if (isEditing) {
        await leadService.updateLead(id, formData);
        alert('Lead updated successfully!');
        navigate(`/leads/${id}`);
      } else {
        const created = await leadService.createLead(formData);
        // If initial notes entered, add activity
        if (formData.notes && created?.id) {
          await leadActivityService.addActivity(created.id, {
            type: 'NOTE',
            description: formData.notes,
          });
        }
        alert('New lead created successfully!');
        navigate('/leads');
      }
    } catch (err) {
      console.error('Failed to save lead:', err);
      alert('Error saving lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lead-form-container">
      <div className="lead-form-card">
        <div className="form-header-block">
          <h2 className="form-main-heading">
            {isEditing ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <p className="form-subheading-text">
            {isEditing
              ? 'Update lead details and stage information'
              : 'Create a fresh profile to start tracking real estate sales inquiries'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: First Name & Last Name */}
          <div className="lead-grid-row">
            <div className="field-group">
              <label className="field-label">First Name *</label>
              <input
                type="text"
                className="field-input"
                placeholder="Rahul"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Last Name</label>
              <input
                type="text"
                className="field-input"
                placeholder="Verma"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Email Address & Phone Number */}
          <div className="lead-grid-row">
            <div className="field-group">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                className="field-input"
                placeholder="rahul.verma@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" style={{ color: phoneError ? '#ef4444' : 'inherit' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                className={`field-input ${phoneError ? 'has-error' : ''}`}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              {phoneError && (
                <span className="field-error-helper">
                  Phone number is required to save lead.
                </span>
              )}
            </div>
          </div>

          {/* Row 3: Source & Assigned To */}
          <div className="lead-grid-row">
            <div className="field-group">
              <label className="field-label">Source</label>
              <select
                className="field-select"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
              >
                <option value="MagicBricks">MagicBricks</option>
                <option value="Housing.com">Housing.com</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Google Search">Google Search</option>
                <option value="Direct Walk-in">Direct Walk-in</option>
                <option value="PropertyWala">PropertyWala</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Assigned To</label>
              <select
                className="field-select"
                value={formData.assignedToName}
                onChange={(e) => handleChange('assignedToName', e.target.value)}
              >
                <option value="Neha S.">Neha S.</option>
                <option value="Rajesh K.">Rajesh K.</option>
                <option value="Amit P.">Amit P.</option>
              </select>
            </div>
          </div>

          {/* Row 4: Initial Stage & Interested Properties */}
          <div className="lead-grid-row">
            <div className="field-group">
              <label className="field-label">Initial Stage</label>
              <select
                className="field-select"
                value={formData.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="SITE_VISIT">Site Visit</option>
                <option value="INTERESTED">Interested</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="BOOKED">Booked</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Interested Properties</label>
              <select
                className="field-select"
                value={formData.interestedProperty}
                onChange={(e) => handleChange('interestedProperty', e.target.value)}
              >
                <option value="Kosal Heights">Kosal Heights</option>
                <option value="Aurelia Villas">Aurelia Villas</option>
                <option value="Prime Plots">Prime Plots</option>
                <option value="Emerald Heights">Emerald Heights</option>
              </select>
            </div>
          </div>

          {/* Row 5: Initial Remarks / Notes */}
          <div className="field-group" style={{ marginBottom: 20 }}>
            <label className="field-label">Initial Remarks / Notes</label>
            <textarea
              className="field-textarea"
              placeholder="Add client preferences, specific floor or facing requirements..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          {/* Row 6: Scheduled Follow-up Date */}
          <div className="field-group" style={{ marginBottom: 10 }}>
            <label className="field-label">Scheduled Follow-up Date</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="field-input"
                value={formData.followUpDate}
                onChange={(e) => handleChange('followUpDate', e.target.value)}
              />
              <Calendar size={18} className="date-icon-indicator" />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="form-action-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/leads')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save-lead"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeadForm;
