import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Page components
import HomePage from "./pages/Home";
import CausesPage from "./pages/Causes";
import AboutUsPage from "./pages/About";
import ContactPage from "./pages/Contact";
import { ProfileDashboard } from './pages/ProfileDashboard'; 
import DonationHistoryPage from './pages/DonationHistoryPage'; // 1. Import the new page

// Auth components
import LoginPage from "./components/auth/LoginForm";
import SignupPage from "./components/auth/SignupForm";
import PrivateRoute from "./components/auth/PrivateRoute";

// Dashboard components
import DonorDashboard from "./components/dashboard/DonorDashboard";
import NgoDashboard from "./components/dashboard/NgoDashboard";
import AdminDashboard from './components/dashboard/AdminDashboard';

// Common components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Donation component
import DonationForm from "./components/Donation/DonationForm";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/causes" element={<CausesPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Protected Routes */}
              <Route path="/profile" element={<PrivateRoute><ProfileDashboard /></PrivateRoute>} />
              <Route path="/dashboard/donor" element={<PrivateRoute><DonorDashboard /></PrivateRoute>} />
              <Route path="/dashboard/ngo" element={<PrivateRoute><NgoDashboard /></PrivateRoute>} />
              <Route path="/dashboard/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/donate/:id" element={<PrivateRoute><DonationForm /></PrivateRoute>} />
              {/* 2. Add the new route for donation history */}
              <Route path="/donations/history" element={<PrivateRoute><DonationHistoryPage /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
