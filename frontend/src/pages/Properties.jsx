import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
  Building2,
  X,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import propertyService from '../services/propertyService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import './Properties.css';

function Properties() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [units, setUnits] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [loading, setLoading] = useState(true);

  // Add Property Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProp, setNewProp] = useState({
    project: 'Kosal Heights',
    building: 'Tower B',
    unitNumber: '',
    type: 'Apartment',
    unitType: 'THREE_BHK',
    area: '1450',
    floor: '4th Floor',
    facing: 'East Facing',
    furnishing: 'Semi-Furnished',
    parking: '1 Covered Space',
    price: '12000000',
    status: 'AVAILABLE',
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await propertyService.getAllUnits();
        setUnits(data);
      } catch (err) {
        console.error('Failed to load properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!newProp.unitNumber.trim()) {
      alert('Please enter a Unit Number (e.g. Unit 504)');
      return;
    }
    try {
      const created = await propertyService.addPropertyUnit(newProp);
      setUnits((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewProp({
        project: 'Kosal Heights',
        building: 'Tower B',
        unitNumber: '',
        type: 'Apartment',
        unitType: 'THREE_BHK',
        area: '1450',
        floor: '4th Floor',
        facing: 'East Facing',
        furnishing: 'Semi-Furnished',
        parking: '1 Covered Space',
        price: '12000000',
        status: 'AVAILABLE',
      });
      alert(`Property unit ${created.unitNumber} (${created.project}) added successfully!`);
    } catch (err) {
      console.error('Failed to add property:', err);
      alert('Failed to add property unit. Please try again.');
    }
  };

  const filteredUnits = units.filter((u) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        u.project.toLowerCase().includes(q) ||
        u.unitNumber.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (typeFilter !== 'ALL' && u.type !== typeFilter) return false;
    if (projectFilter !== 'ALL' && u.project !== projectFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (u.price > maxPrice) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="stage-badge booked">Available</span>;
      case 'RESERVED':
        return <span className="stage-badge site-visit">Reserved</span>;
      case 'BOOKED':
      case 'SOLD':
        return <span className="stage-badge negotiation">Sold</span>;
      default:
        return <span className="stage-badge new">{status}</span>;
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="properties-page-container">
      {/* Top Header Row */}
      <div className="properties-header-row">
        <div className="properties-title-group">
          <h1 className="properties-page-title">Inventory &amp; Properties</h1>
          <span className="units-count-badge">112 Units</span>
        </div>

        <div className="properties-actions-group">
          <div className="view-toggle-box">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <ListIcon size={17} />
            </button>
          </div>

          {isAdmin ? (
            <button
              type="button"
              className="add-property-btn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} />
              <span>Add Property</span>
            </button>
          ) : (
            <span
              className="sales-view-badge"
              title="Sales Representative view: Browse inventory & book units for leads"
            >
              Inventory Catalog (Sales View)
            </span>
          )}
        </div>
      </div>

      {/* Filter Controls Card */}
      <div className="properties-filter-card">
        <div className="prop-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            className="prop-search-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="prop-filter-dropdown"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Property Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
        </select>

        <select
          className="prop-filter-dropdown"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="ALL">All Projects</option>
          <option value="Kosal Heights">Kosal Heights</option>
          <option value="Aurelia Villas">Aurelia Villas</option>
          <option value="Prime Plots">Prime Plots</option>
          <option value="Emerald Heights">Emerald Heights</option>
        </select>

        <select
          className="prop-filter-dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Availability</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="BOOKED">Sold / Booked</option>
        </select>

        <div className="price-slider-group">
          <span className="price-slider-label">Price: ₹50L - ₹5Cr</span>
          <input
            type="range"
            className="price-slider-track"
            min="5000000"
            max="50000000"
            step="1000000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Properties Cards Grid */}
      <div className="properties-grid">
        {filteredUnits.map((item) => (
          <div
            key={item.id}
            className="property-card"
            onClick={() => navigate(`/properties/${item.id}`)}
          >
            <div className="property-card-image-box">
              {item.image ? (
                <img src={item.image} alt={item.project} className="property-card-img" />
              ) : (
                <div className="property-img-fallback">
                  <Building2 size={36} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.project}</span>
                </div>
              )}
            </div>

            <div className="property-card-body">
              <div className="property-card-main-info">
                <div className="property-card-title-row">
                  <h3 className="property-card-name">{item.project}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <span className="property-card-subtitle">
                  {item.unitNumber} • {item.type}
                </span>
              </div>

              <div className="property-specs-footer">
                <div className="spec-item">
                  <span className="spec-label">Area</span>
                  <span className="spec-val">{item.area}</span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Floor</span>
                  <span className="spec-val">{item.floor}</span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Price</span>
                  <span className="spec-val price">{item.priceDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property / Unit Modal Dialog */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="property-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <h2 className="modal-title">Add Property / Unit to Inventory</h2>
                <span className="modal-subtitle">
                  Configure project details, specifications, and pricing
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
                title="Close Modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProperty}>
              <div className="modal-body">
                {/* Section 1: Project & Location Info */}
                <div className="modal-section-group">
                  <div className="modal-section-title">
                    1. Project &amp; Building Details
                  </div>
                  <div className="modal-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Project Name *</label>
                      <select
                        className="modal-input-field"
                        value={newProp.project}
                        onChange={(e) =>
                          setNewProp({ ...newProp, project: e.target.value })
                        }
                        required
                      >
                        <option value="Kosal Heights">Kosal Heights</option>
                        <option value="Aurelia Villas">Aurelia Villas</option>
                        <option value="Prime Plots">Prime Plots</option>
                        <option value="Emerald Heights">Emerald Heights</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tower / Building *</label>
                      <input
                        type="text"
                        className="modal-input-field"
                        placeholder="e.g. Tower B or Phase 1"
                        value={newProp.building}
                        onChange={(e) =>
                          setNewProp({ ...newProp, building: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Unit Specifications */}
                <div className="modal-section-group">
                  <div className="modal-section-title">
                    2. Unit Specifications &amp; Layout
                  </div>
                  <div className="modal-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Unit Number *</label>
                      <input
                        type="text"
                        className="modal-input-field"
                        placeholder="e.g. Unit 504, Villa 12"
                        value={newProp.unitNumber}
                        onChange={(e) =>
                          setNewProp({ ...newProp, unitNumber: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Property Type *</label>
                      <select
                        className="modal-input-field"
                        value={newProp.type}
                        onChange={(e) =>
                          setNewProp({ ...newProp, type: e.target.value })
                        }
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Plot">Plot</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Configuration *</label>
                      <select
                        className="modal-input-field"
                        value={newProp.unitType}
                        onChange={(e) =>
                          setNewProp({ ...newProp, unitType: e.target.value })
                        }
                      >
                        <option value="ONE_BHK">1 BHK</option>
                        <option value="TWO_BHK">2 BHK</option>
                        <option value="THREE_BHK">3 BHK</option>
                        <option value="FOUR_BHK">4 BHK</option>
                        <option value="VILLA">Luxury Villa</option>
                        <option value="PLOT">Residential Plot</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Super Built-up Area (Sq.Ft.) *</label>
                      <input
                        type="number"
                        className="modal-input-field"
                        placeholder="e.g. 1450"
                        value={newProp.area}
                        onChange={(e) =>
                          setNewProp({ ...newProp, area: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Floor Level</label>
                      <input
                        type="text"
                        className="modal-input-field"
                        placeholder="e.g. 5th Floor, G+1"
                        value={newProp.floor}
                        onChange={(e) =>
                          setNewProp({ ...newProp, floor: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Facing Direction</label>
                      <input
                        type="text"
                        className="modal-input-field"
                        placeholder="e.g. East Facing, North-East"
                        value={newProp.facing}
                        onChange={(e) =>
                          setNewProp({ ...newProp, facing: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="modal-grid-2col">
                    <div className="form-group">
                      <label className="form-label">Furnishing Status</label>
                      <select
                        className="modal-input-field"
                        value={newProp.furnishing}
                        onChange={(e) =>
                          setNewProp({ ...newProp, furnishing: e.target.value })
                        }
                      >
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Initial Status</label>
                      <select
                        className="modal-input-field"
                        value={newProp.status}
                        onChange={(e) =>
                          setNewProp({ ...newProp, status: e.target.value })
                        }
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="RESERVED">Reserved</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Pricing */}
                <div className="modal-section-group">
                  <div className="modal-section-title">
                    3. Pricing &amp; Commercials
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Price (in ₹ INR) *</label>
                    <div className="modal-input-with-prefix">
                      <span className="modal-input-prefix">₹</span>
                      <input
                        type="number"
                        className="modal-input-field prefixed"
                        placeholder="12000000 (₹1.20 Cr)"
                        value={newProp.price}
                        onChange={(e) =>
                          setNewProp({ ...newProp, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="lead-cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="lead-submit-btn">
                  Save &amp; Publish Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties;
