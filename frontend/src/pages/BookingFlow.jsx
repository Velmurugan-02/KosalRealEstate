import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Building2 } from 'lucide-react';
import propertyService from '../services/propertyService';
import bookingService from '../services/bookingService';
import leadService from '../services/leadService';
import './BookingFlow.css';

function BookingFlow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(2); // In screenshot, Step 2 is active
  const [unit, setUnit] = useState({
    id: id || 1,
    project: 'Emerald Heights',
    building: 'Tower B',
    unitNumber: '4B-302',
    floor: '3',
    type: '2 BHK',
    area: '1,250 sq ft',
    basePrice: '₹78,50,000',
    amountNum: 7850000,
  });

  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState({
    id: 1,
    name: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    stage: 'Interested',
  });

  const [paymentPlan, setPaymentPlan] = useState('Construction-Linked Plan (CLP)');
  const [bookingDate, setBookingDate] = useState('2026-10-28');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      if (id) {
        try {
          const u = await propertyService.getUnitById(id);
          if (u) {
            setUnit({
              id: u.id,
              project: u.project || 'Emerald Heights',
              building: u.building || 'Tower B',
              unitNumber: u.unitNumber || '4B-302',
              floor: u.floor || '3',
              type: u.type === 'Apartment' ? '2 BHK' : u.type,
              area: u.area || '1,250 sq ft',
              basePrice: u.priceDisplay || '₹78,50,000',
              amountNum: u.price || 7850000,
              status: u.status || 'AVAILABLE',
              image: u.image || '/properties/apartment-1.jpg',
            });
          }
        } catch (err) {
          console.error('Failed to load unit:', err);
        }
      }

      try {
        const leadList = await leadService.getAllLeads();
        if (leadList && leadList.length > 0) {
          setLeads(leadList);
          const first = leadList[0];
          setSelectedLead({
            id: first.id,
            name: `${first.firstName} ${first.lastName}`,
            phone: first.phone,
            stage: 'Interested',
          });
        }
      } catch (err) {
        console.error('Failed to load leads:', err);
      }
    }
    loadData();
  }, [id]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!agreedTerms) {
      alert('Please agree to the builder buyer agreement terms to proceed.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const bookingPayload = {
      leadId: selectedLead.id,
      unitId: unit.id,
      bookingAmount: unit.amountNum,
    };

    const res = await bookingService.createBooking(bookingPayload);

    setSubmitting(false);

    if (res.success) {
      alert(`Success! Unit ${unit.unitNumber} has been booked and locked for ${selectedLead.name}.`);
      navigate('/bookings');
    } else if (res.conflict) {
      setErrorMessage(res.error);
    } else {
      setErrorMessage(res.error || 'Failed to confirm booking. Please try again.');
    }
  };

  return (
    <div className="booking-flow-container">
      {/* 1. Top Warning Alert Banner */}
      {unit.status === 'BOOKED' ? (
        <div
          className="booking-warning-banner"
          style={{
            backgroundColor: '#fee2e2',
            borderColor: '#fecaca',
            color: '#b91c1c',
          }}
        >
          <AlertCircle size={20} style={{ color: '#dc2626' }} />
          <span>
            This unit is already <strong>BOOKED</strong> and locked. It is no longer available for booking.
          </span>
        </div>
      ) : (
        <div className="booking-warning-banner">
          <AlertCircle size={20} className="warning-icon" />
          <span>
            This unit is currently Available. Once booked, it will be locked for other users.
          </span>
        </div>
      )}

      {/* 2. Three-Step Stepper Cards */}
      <div className="booking-stepper-row">
        <div
          className={`booking-step-card ${step > 1 ? 'completed' : 'active'}`}
          onClick={() => setStep(1)}
        >
          <div className="step-num-bubble green">1</div>
          <span>Select Lead</span>
        </div>

        <div
          className={`booking-step-card ${step === 2 ? 'active' : ''}`}
          onClick={() => setStep(2)}
        >
          <div className="step-num-bubble orange">2</div>
          <span>Review Details</span>
        </div>

        <div className="booking-step-card">
          <div className="step-num-bubble gray">3</div>
          <span>Confirm Booking</span>
        </div>
      </div>

      {/* Error Message if 409 Conflict */}
      {errorMessage && (
        <div className="conflict-error-box" role="alert">
          {errorMessage}
        </div>
      )}

      {/* 3. Main Content: 2-Column Split (1:1) */}
      <div className="booking-content-grid">
        {/* Left Column: Booking Summary Card */}
        <div className="booking-summary-card">
          <h2 className="booking-card-title">Booking Summary</h2>

          <div className="summary-hero-row">
            <div className="summary-thumbnail" style={{ overflow: 'hidden', padding: 0 }}>
              {unit.image ? (
                <img
                  src={unit.image}
                  alt={unit.project}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Building2 size={28} />
              )}
            </div>
            <div className="summary-prop-titles">
              <h3 className="summary-prop-name">{unit.project}</h3>
              <span className="summary-prop-sub">
                {unit.building} • Premium Facing
              </span>
            </div>
          </div>

          <table className="summary-specs-table">
            <tbody>
              <tr>
                <td>Project</td>
                <td>{unit.project}</td>
              </tr>
              <tr>
                <td>Building</td>
                <td>{unit.building}</td>
              </tr>
              <tr>
                <td>Unit</td>
                <td>{unit.unitNumber}</td>
              </tr>
              <tr>
                <td>Floor</td>
                <td>{unit.floor}</td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{unit.type}</td>
              </tr>
              <tr>
                <td>Area</td>
                <td>{unit.area}</td>
              </tr>
              <tr>
                <td>Base Price</td>
                <td style={{ color: 'var(--primary)', fontSize: 16 }}>
                  {unit.basePrice}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Select Customer & Plan Card */}
        <div className="booking-form-card">
          <h2 className="booking-card-title">Select Customer &amp; Plan</h2>

          {/* Selected Customer Box or Lead Picker */}
          {step === 1 && leads.length > 0 ? (
            <div className="plan-group" style={{ marginBottom: 16 }}>
              <label className="plan-label">Choose Lead for Unit Booking</label>
              <select
                className="plan-select"
                value={selectedLead.id}
                onChange={(e) => {
                  const found = leads.find((l) => String(l.id) === e.target.value);
                  if (found) {
                    setSelectedLead({
                      id: found.id,
                      name: `${found.firstName} ${found.lastName}`,
                      phone: found.phone,
                      stage: found.stage,
                    });
                    setStep(2);
                  }
                }}
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.firstName} {l.lastName} ({l.phone})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="selected-customer-box">
              <div className="customer-info-col">
                <span className="customer-name">{selectedLead.name}</span>
                <span className="customer-phone">{selectedLead.phone}</span>
              </div>
              <span className="customer-badge">{selectedLead.stage}</span>
            </div>
          )}

          <form onSubmit={handleConfirmBooking}>
            <div className="plan-group">
              <label className="plan-label">Payment Plan</label>
              <select
                className="plan-select"
                value={paymentPlan}
                onChange={(e) => setPaymentPlan(e.target.value)}
              >
                <option value="Construction-Linked Plan (CLP)">
                  Construction-Linked Plan (CLP)
                </option>
                <option value="Down Payment Plan (10:80:10)">
                  Down Payment Plan (10:80:10)
                </option>
                <option value="Flexi Payment Plan">Flexi Payment Plan</option>
              </select>
            </div>

            <div className="plan-group">
              <label className="plan-label">Select Booking Date</label>
              <input
                type="date"
                className="plan-date-input"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </div>

            <div className="terms-agreement-row">
              <input
                id="agree-terms"
                type="checkbox"
                className="terms-checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
              />
              <label htmlFor="agree-terms" style={{ cursor: 'pointer' }}>
                I agree to the builder buyer agreement terms.
              </label>
            </div>

            <button
              type="submit"
              className="confirm-lock-btn"
              disabled={submitting || unit.status === 'BOOKED'}
              style={
                unit.status === 'BOOKED'
                  ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#94a3b8' }
                  : {}
              }
            >
              {unit.status === 'BOOKED'
                ? 'Unit Already Booked'
                : submitting
                ? 'Locking Unit...'
                : 'Confirm Booking & Lock Unit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingFlow;
