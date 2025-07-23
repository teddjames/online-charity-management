import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your page components
import HomePage from './pages/Home';
import LoginPage from './components/auth/LoginForm'; 
import CausesPage from './pages/Causes';
import SignupPage from './components/auth/SignupForm';
import DonorDashboard from './components/dashboard/DonorDashboard';
import NgoDashboard from './components/dashboard/NgoDashboard';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AboutUsPage from './pages/About';
import DonatePage from "./pages/DonatePage";
import ContactPage from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/causes" element={<CausesPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard/donor" element={<DonorDashboard />} />
            <Route path="/dashboard/ngo" element={<NgoDashboard />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/donate/:causeId" element={<DonatePage />} />
            {/* Add other routes here as you build them */}
            {/* <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/causes" element={<CausesPage />} />
            <Route path="/donate/:causeId" element={<DonatePage />} />
            <Route path="*" element={<NotFoundPage />} /> 
            */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
