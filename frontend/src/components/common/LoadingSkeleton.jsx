import './CommonStates.css';

function LoadingSkeleton() {
  return (
    <div className="skeleton-container">
      <div>
        <div className="skeleton-shimmer skeleton-header-box" />
        <div className="skeleton-shimmer skeleton-sub-box" style={{ marginTop: 8 }} />
      </div>

      <div className="skeleton-cards-row">
        <div className="skeleton-card-item">
          <div className="skeleton-shimmer skeleton-card-inner-top" />
          <div className="skeleton-shimmer skeleton-card-inner-bottom" />
        </div>
        <div className="skeleton-card-item">
          <div className="skeleton-shimmer skeleton-card-inner-top" />
          <div className="skeleton-shimmer skeleton-card-inner-bottom" />
        </div>
        <div className="skeleton-card-item">
          <div className="skeleton-shimmer skeleton-card-inner-top" />
          <div className="skeleton-shimmer skeleton-card-inner-bottom" />
        </div>
      </div>

      <div className="skeleton-table-box">
        <div className="skeleton-shimmer skeleton-table-header" />
        <div className="skeleton-shimmer skeleton-row-line" />
        <div className="skeleton-shimmer skeleton-row-line" />
        <div className="skeleton-shimmer skeleton-row-line" />
        <div className="skeleton-shimmer skeleton-row-line" />
      </div>
    </div>
  );
}

export default LoadingSkeleton;
