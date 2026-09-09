import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';
import './PropertyDetails.css';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [fitMode, setFitMode] = useState('cover');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await propertyService.getUnitById(id);
        setUnit(data);
        setActivePhotoIndex(0);
      } catch (err) {
        console.error('Failed to load unit details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        Loading property details...
      </div>
    );
  }

  const isAvailable = unit?.status === 'AVAILABLE';

  const allPhotos = [
    {
      id: 0,
      label: 'Exterior View',
      src: unit?.gallery?.[0] || unit?.image || '/properties/apartment-1.jpg',
    },
    {
      id: 1,
      label: 'Living & Dining',
      src: unit?.gallery?.[1] || '/properties/dining-and-living.jpg',
    },
    {
      id: 2,
      label: 'Master Bedroom',
      src: unit?.gallery?.[2] || '/properties/bedroom-1.jpg',
    },
    {
      id: 3,
      label: 'Balcony & View',
      src: unit?.gallery?.[3] || '/properties/balcony-1.jpg',
    },
  ];

  const currentPhoto = allPhotos[activePhotoIndex] || allPhotos[0];
  const otherPhotos = allPhotos.filter((_, idx) => idx !== activePhotoIndex);

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="property-details-container">
      {/* 1. Hero Gallery Grid (Main Viewport + 3 Responsive Thumbnails) */}
      <div className="gallery-layout-grid">
        <div className="gallery-main-viewport">
          {/* Ambient blurred backdrop for luxury framing of portrait & landscape photos */}
          <img
            src={currentPhoto.src}
            alt=""
            className="gallery-main-bg-blur"
            aria-hidden="true"
          />

          {/* Crisp foreground image */}
          <img
            src={currentPhoto.src}
            alt={`${unit?.project || 'Property'} - ${unit?.unitNumber || ''} - ${currentPhoto.label}`}
            className={`gallery-main-img ${fitMode}`}
          />

          {/* Navigation Controls */}
          <button
            type="button"
            className="gallery-nav-btn prev"
            onClick={handlePrevPhoto}
            aria-label="Previous Photo"
            title="Previous Photo"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="gallery-nav-btn next"
            onClick={handleNextPhoto}
            aria-label="Next Photo"
            title="Next Photo"
          >
            &#8250;
          </button>

          {/* Photo Information & Counter Badge */}
          <div className="gallery-counter-badge">
            <span className="gallery-counter-dot"></span>
            <span>
              {currentPhoto.label} &bull; {activePhotoIndex + 1} of {allPhotos.length}
            </span>
          </div>

          {/* Framing / Fit Mode Toggle Button */}
          <button
            type="button"
            className="gallery-fit-btn"
            onClick={() => setFitMode((prev) => (prev === 'contain' ? 'cover' : 'contain'))}
            title={fitMode === 'contain' ? 'Fill frame' : 'Fit entire photo'}
          >
            {fitMode === 'contain' ? '⛶ Fill' : '↔ Fit'}
          </button>
        </div>

        {/* 3 Thumbnails Column (Seamlessly swaps when clicked) */}
        <div className="gallery-thumbnails-column">
          {otherPhotos.map((photo) => (
            <div
              key={photo.id}
              className="gallery-thumbnail-box"
              onClick={() => setActivePhotoIndex(photo.id)}
              title={`Switch to ${photo.label}`}
            >
              <img
                src={photo.src}
                alt={photo.label}
                className="gallery-thumb-img"
              />
              <span className="gallery-thumb-tag">{photo.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Details Grid (2/3 Main + 1/3 Side) */}
      <div className="property-body-grid">
        {/* Left Column */}
        <div className="prop-main-info-col">
          {/* Specifications Card */}
          <div className="specs-detail-card">
            <h2 className="specs-title">
              Property Details - {unit?.unitNumber || 'Unit 402'}
            </h2>

            <div className="specs-keyvalue-grid">
              <div className="spec-entry">
                <span className="spec-entry-label">Project</span>
                <span className="spec-entry-value">{unit?.project || 'Kosal Heights'}</span>
              </div>

              <div className="spec-entry">
                <span className="spec-entry-label">Super Built-up Area</span>
                <span className="spec-entry-value">
                  {unit?.superBuiltUpArea || '1,450 Sq.Ft.'}
                </span>
              </div>

              <div className="spec-entry">
                <span className="spec-entry-label">Building / Tower</span>
                <span className="spec-entry-value">{unit?.building || 'Tower B'}</span>
              </div>

              <div className="spec-entry">
                <span className="spec-entry-label">Facing Direction</span>
                <span className="spec-entry-value">{unit?.facing || 'East Facing'}</span>
              </div>

              <div className="spec-entry">
                <span className="spec-entry-label">Floor Level</span>
                <span className="spec-entry-value">{unit?.floor || '4th Floor'}</span>
              </div>

              <div className="spec-entry">
                <span className="spec-entry-label">Furnishing Status</span>
                <span className="spec-entry-value">
                  {unit?.furnishing || 'Semi-Furnished'}
                </span>
              </div>

              <div className="spec-entry">
                <span className="spec-entry-label">Unit Type</span>
                <span className="spec-entry-value">
                  {unit?.type === 'Apartment' ? '3 BHK Apartment' : unit?.type}
                </span>
              </div>

              <div className="spec-entry">
                <span className="spec-entry-label">Parking Slots</span>
                <span className="spec-entry-value">
                  {unit?.parking || '1 Covered Space'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Payment Structure Card */}
          <div className="pricing-structure-card">
            <h2 className="pricing-title">Pricing &amp; Payment Structure</h2>

            <div className="pricing-rows-list">
              <div className="pricing-row-item">
                <span>Base Price ({unit?.basePriceRate || '₹7,930 / Sq.Ft.'})</span>
                <span className="pricing-row-val">{unit?.basePrice || '₹1,15,00,000'}</span>
              </div>

              <div className="pricing-row-item">
                <span>Floor Rise Premium</span>
                <span className="pricing-row-val">{unit?.floorRise || '₹5,00,000'}</span>
              </div>
            </div>

            <div className="total-price-banner">
              <span className="total-price-label">Total Outright Price</span>
              <span className="total-price-val">
                {unit?.priceDisplay || '₹1,20,00,000'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="prop-side-action-col">
          {/* Availability Status & Book Action Card */}
          <div className="action-box-card">
            <span className="action-status-label">Availability Status</span>

            <div
              className={`status-banner-pill ${
                unit?.status === 'AVAILABLE'
                  ? 'available'
                  : unit?.status === 'RESERVED'
                  ? 'reserved'
                  : 'booked'
              }`}
            >
              {unit?.status === 'AVAILABLE'
                ? 'UNIT AVAILABLE'
                : unit?.status === 'RESERVED'
                ? 'UNIT RESERVED'
                : 'UNIT BOOKED'}
            </div>

            {isAvailable ? (
              <button
                type="button"
                className="book-unit-btn"
                onClick={() => navigate(`/properties/${unit?.id || id}/book`)}
              >
                Book This Unit
              </button>
            ) : (
              <button
                type="button"
                className="book-unit-btn"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#94a3b8' }}
              >
                {unit?.status === 'BOOKED' ? 'Unit Already Booked' : 'Unit Reserved'}
              </button>
            )}
          </div>

          {/* Recent Unit Transactions Card */}
          <div className="transactions-card">
            <h3 className="transactions-title">Recent Unit Transactions</h3>
            <div className="transaction-item">
              <span className="transaction-title-text">Token Released</span>
              <p className="transaction-desc-text">
                Reserved briefly on 12 Oct by Rajesh Sharma
              </p>
              <span className="transaction-status-tag">
                Status: Expired / Released
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
