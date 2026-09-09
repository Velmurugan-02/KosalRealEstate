import { AlertTriangle } from 'lucide-react';
import './CommonStates.css';

function ErrorState({
  title = '500 — Something went wrong',
  description = "We couldn't load this property right now. Please try again.",
  onRetry,
  onGoBack,
}) {
  return (
    <div className="error-state-card">
      <div className="error-state-circle">
        <AlertTriangle size={32} />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-desc">{description}</p>
      <div className="error-action-row">
        {onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            Retry Connection
          </button>
        )}
        {onGoBack && (
          <button type="button" className="back-link-btn" onClick={onGoBack}>
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
