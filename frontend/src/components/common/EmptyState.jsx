import { UserPlus } from 'lucide-react';
import './CommonStates.css';

function EmptyState({
  title = 'No Leads Found',
  description = 'Start by adding your first lead to the CRM workspace.',
}) {
  return (
    <div className="empty-state-card">
      <div className="empty-state-circle">
        <UserPlus size={36} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
}

export default EmptyState;
