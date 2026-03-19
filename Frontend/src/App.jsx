import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';

// Layouts
import UserLayout from './components/shared/UserLayout';
import AdminLayout from './components/shared/AdminLayout';

// User Pages
import Home from './modules/user/pages/Home';
import Rooms from './modules/user/pages/Rooms';
import Wallet from './modules/user/pages/Wallet';
import TransactionHistory from './modules/user/pages/TransactionHistory';
import About from './modules/user/pages/About';
import Gallery from './modules/user/pages/Gallery';
import Contact from './modules/user/pages/Contact';
import Login from './modules/user/pages/Login';
import Signup from './modules/user/pages/Signup';
import Profile from './modules/user/pages/Profile';
import MyBookings from './modules/user/pages/MyBookings';
import AccountDetails from './modules/user/pages/AccountDetails';
import BookingFlow from './modules/user/pages/BookingFlow';
import Stay from './modules/user/pages/Stay';
import Dine from './modules/user/pages/Dine';
import Dip from './modules/user/pages/Dip';
import Care from './modules/user/pages/Care';

// Admin Pages
import Dashboard from './modules/admin/pages/Dashboard';
import AdminLogin from './modules/admin/pages/AdminLogin';
import RoomMgmt from './modules/admin/pages/RoomMgmt';
import VariantMgmt from './modules/admin/pages/VariantMgmt';
import Bookings from './modules/admin/pages/Bookings';
import Users from './modules/admin/pages/Users';
import Discounts from './modules/admin/pages/Discounts';
import Transactions from './modules/admin/pages/Transactions';
import MediaMgmt from './modules/admin/pages/MediaMgmt';
import ServiceMgmt from './modules/admin/pages/ServiceMgmt';

// Admin Inventory & Setup
import Availability from './modules/admin/pages/inventory/Availability';
import Rates from './modules/admin/pages/inventory/Rates';
import Taxes from './modules/admin/pages/setup/Taxes';
import Charges from './modules/admin/pages/setup/Charges';
import RatePlans from './modules/admin/pages/setup/RatePlans';
import Property from './modules/admin/pages/setup/Property';

// Route Guards
const AdminRoute = ({ children }) => {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return role === 'admin' ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router>
          <Routes>
            {/* User Module */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="wallet/history" element={<TransactionHistory />} />
              <Route path="about" element={<About />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/bookings" element={<MyBookings />} />
              <Route path="profile/details" element={<AccountDetails />} />
              <Route path="book" element={<BookingFlow />} />
              <Route path="stay" element={<Stay />} />
              <Route path="dine" element={<Dine />} />
              <Route path="dip" element={<Dip />} />
              <Route path="care" element={<Care />} />
            </Route>

            {/* Admin Module */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="rooms" element={<RoomMgmt />} />
              <Route path="rooms/variants" element={<VariantMgmt />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="users" element={<Users />} />
              <Route path="discounts" element={<Discounts />} />
              <Route path="wallet" element={<Transactions />} />
              <Route path="media" element={<MediaMgmt />} />
              <Route path="services" element={<ServiceMgmt />} />

              {/* Inventory Management */}
              <Route path="inventory/availability" element={<Availability />} />
              <Route path="inventory/rates" element={<Rates />} />

              {/* System Setup */}
              <Route path="setup/taxes" element={<Taxes />} />
              <Route path="setup/charges" element={<Charges />} />
              <Route path="setup/rate-plans" element={<RatePlans />} />
              <Route path="setup/property" element={<Property />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;

