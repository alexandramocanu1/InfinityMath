import React, { useState } from 'react';
import { BookOpen, User } from 'lucide-react';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
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
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {/* Header */}
        <header style={headerStyle}>
          <div style={navStyle}>
            <div style={logoStyle} onClick={() => setCurrentPage('home')}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <BookOpen style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <div>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: '1.5rem', 
                  color: '#1f2937',
                  fontWeight: '700' 
                }}>
                </h1>
                <p style={{ 
                  margin: 0, 
                  color: '#6b7280', 
                  fontSize: '0.875rem' 
                }}>
                  Matematică Online
                </p>
              </div>
            </div>
            
            <nav style={menuStyle}>
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

        {/* Content */}
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

        {/* CSS pentru animații */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </AuthProvider>
  );
}

export default App;