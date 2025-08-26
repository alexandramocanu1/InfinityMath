import React, { useState } from 'react';
import { BookOpen, User } from 'lucide-react';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState('');

  const headerStyle = {
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer'
  };

  const menuStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  };

  const buttonStyle = {
    background: 'transparent',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const getButtonStyle = (page) => ({
    ...buttonStyle,
    backgroundColor: currentPage === page ? '#2563eb' : 'transparent',
    color: currentPage === page ? 'white' : '#374151'
  });

  return (
    <AuthProvider>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={headerStyle}>
          <div style={navStyle} className="header-nav">
            <div style={logoStyle} className="logo-container" onClick={() => setCurrentPage('home')}>
              <img 
                src="/images/logo_VIII_1.png" 
                alt="Infinity Math" 
                className="logo-image"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: '1.5rem', 
                  color: '#1f2937',
                  fontWeight: '700' 
                }}>
                  Infinity Math
                </h1>
                <p style={{ 
                  margin: 0, 
                  color: '#6b7280', 
                  fontSize: '0.875rem' 
                }}>
                  Matematică pentru toți
                </p>
              </div>
            </div>
            
            <nav style={menuStyle} className="header-menu">
              <button 
                onClick={() => setCurrentPage('home')}
                style={getButtonStyle('home')}
                onMouseOver={(e) => {
                  if (currentPage !== 'home') {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== 'home') {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Acasă
              </button>
              
              <button 
                onClick={() => setCurrentPage('services')}
                style={getButtonStyle('services')}
                onMouseOver={(e) => {
                  if (currentPage !== 'services') {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== 'services') {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Cursuri
              </button>
              
              <button 
                onClick={() => setCurrentPage('faq')}
                style={getButtonStyle('faq')}
                onMouseOver={(e) => {
                  if (currentPage !== 'faq') {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== 'faq') {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                FAQ
              </button>
              
              <button 
                onClick={() => setCurrentPage('contact')}
                style={getButtonStyle('contact')}
                onMouseOver={(e) => {
                  if (currentPage !== 'contact') {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== 'contact') {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Contact
              </button>
              
              <button 
                onClick={() => setCurrentPage('profile')}
                style={{
                  ...getButtonStyle('profile'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  if (currentPage !== 'profile') {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== 'profile') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <User style={{ width: '1rem', height: '1rem' }} />
                Profilul Meu
              </button>
            </nav>
          </div>
        </header>

        {/* Content - flex: 1 pentru a ocupa spațiul disponibil */}
        <main style={{ flex: 1 }}>
          {currentPage === 'home' && (
            <HomePage 
              setCurrentPage={setCurrentPage} 
              setSelectedService={setSelectedService}
            />
          )}
          
          {currentPage === 'services' && (
            <ServicesPage 
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              setCurrentPage={setCurrentPage}
            />
          )}
          
          {currentPage === 'faq' && <FAQPage />}
          {currentPage === 'contact' && <ContactPage />}
          {currentPage === 'profile' && <ProfilePage />}
        </main>

        {/* Footer */}
        <Footer />

        {/* CSS pentru animații și responsive */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            /* Mobile responsive styles */
            @media (max-width: 768px) {
              .header-nav {
                flex-direction: column !important;
                gap: 1rem !important;
                padding: 0 0.5rem !important;
              }
              
              .header-menu {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 0.5rem !important;
                width: 100% !important;
              }
              
              .header-menu button {
                padding: 0.5rem 0.75rem !important;
                font-size: 0.85rem !important;
                text-align: center !important;
              }
              
              .logo-container {
                justify-content: center !important;
              }
              
              .logo-container h1 {
                font-size: 1.25rem !important;
              }
              
              .logo-container p {
                font-size: 0.8rem !important;
              }
              
              .logo-image {
                width: 40px !important;
                height: 40px !important;
              }
            }
            
            @media (max-width: 480px) {
              .header-menu {
                grid-template-columns: 1fr !important;
                gap: 0.5rem !important;
              }
              
              .header-menu button {
                padding: 0.75rem !important;
                font-size: 0.9rem !important;
              }
            }
          `}
        </style>
      </div>
    </AuthProvider>
  );
}

export default App;