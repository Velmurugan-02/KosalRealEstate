import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import bookingService from '../services/bookingService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await bookingService.getAllBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="leads-page-container">
      <div className="leads-header-row">
        <div className="leads-title-wrapper">
          <h1 className="leads-page-title">Unit Bookings &amp; Contracts</h1>
          <span className="total-leads-badge">{bookings.length} Bookings</span>
        </div>
        <button
          type="button"
          className="add-lead-btn"
          onClick={() => navigate('/properties')}
        >
          <Plus size={18} />
          <span>New Unit Booking</span>
        </button>
      </div>

      <div className="leads-table-card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="leads-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Lead / Customer</th>
                <th>Unit &amp; Tower</th>
                <th>Project</th>
                <th>Booking Amount</th>
                <th>Booked By</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>
                    #BK-{b.id}
                  </td>
                  <td className="lead-name-cell">{b.leadName}</td>
                  <td>{b.unitNumber} • {b.buildingName}</td>
                  <td>{b.projectName}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{Number(b.bookingAmount || 0).toLocaleString()}
                  </td>
                  <td>{b.bookedByName || 'Rajesh Sharma'}</td>
                  <td>
                    <span className="stage-badge booked">
                      {b.status || 'CONFIRMED'}
                    </span>
                  </td>
                  <td>
                    {b.bookingDate
                      ? new Date(b.bookingDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Recently'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Bookings;
