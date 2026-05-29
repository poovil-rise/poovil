import React from 'react';
import { useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Toast from './components/Toast';
import FloralBackground from './components/FloralBackground';

// Pages
import Login from './pages/Login';
import About from './pages/About';
import Consultants from './pages/Consultants';
import GamesHub from './pages/GamesHub';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Queries from './pages/Queries';
import ReachUs from './pages/ReachUs';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import LettersNeverSent from './pages/LettersNeverSent';
import ThoughtBloom from './pages/ThoughtBloom';
import ThoughtInvaders from './pages/ThoughtInvaders';
import HeartbeatDrummer from './pages/HeartbeatDrummer';
import PopPressure from './pages/PopPressure';
const App = () => {
  const { activeSection } = useApp();
  
  const isGame = ['letters', 'bloom', 'invaders', 'heartbeat', 'pop_pressure'].includes(activeSection);

  return (
    <>
      {/* 3D ANIMATED FLORAL BACKGROUND */}
      <FloralBackground />

      {/* TOAST SYSTEM */}
      <Toast />

      {/* CORE ROUTER / COORDINATOR */}
      {activeSection === 'login' ? (
        <Login />
      ) : activeSection === 'admin' ? (
        <AdminDashboard />
      ) : (
        <div id="userApp" className="page active" style={{ flexDirection: 'column', height: isGame ? '100vh' : 'auto', overflow: isGame ? 'hidden' : 'auto' }}>
          <Navigation />
          
          <main style={{ flex: 1, position: 'relative', zIndex: 1, overflow: isGame ? 'hidden' : 'visible' }}>
            {activeSection === 'about' && <About />}
            {activeSection === 'consultants' && <Consultants />}
            {activeSection === 'booking' && <Booking />}
            {activeSection === 'games_hub' && <GamesHub />}
            {activeSection === 'letters' && <LettersNeverSent />}
            {activeSection === 'bloom' && <ThoughtBloom />}
            {activeSection === 'invaders' && <ThoughtInvaders />}
            {activeSection === 'heartbeat' && <HeartbeatDrummer />}
            {activeSection === 'pop_pressure' && <PopPressure />}
            {activeSection === 'mybookings' && <MyBookings />}
            {activeSection === 'queries' && <Queries />}
            {activeSection === 'reachus' && <ReachUs />}
            {activeSection === 'services' && <Services />}
            {activeSection === 'blog' && <Blog />}
          </main>

          {!isGame && <Footer />}
        </div>
      )}
    </>
  );
};

export default App;
