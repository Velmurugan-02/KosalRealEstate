import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import LeadForm from './pages/LeadForm';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import BookingFlow from './pages/BookingFlow';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Leads */}
              <Route path="/leads" element={<Leads />} />
              <Route path="/leads/new" element={<LeadForm />} />
              <Route path="/leads/:id" element={<LeadDetails />} />
              <Route path="/leads/:id/edit" element={<LeadForm />} />

              {/* Properties & Inventory */}
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/properties/:id/book" element={<BookingFlow />} />

              {/* Bookings */}
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/new" element={<BookingFlow />} />

              {/* Settings & Permissions */}
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;