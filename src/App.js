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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const hamburgerStyle = {
    display: 'none',
    flexDirection: 'column',
    cursor: 'pointer',
    padding: '0.5rem',
    gap: '4px'
  };

  const hamburgerLineStyle = {
    width: '24px',
    height: '3px',
    backgroundColor: '#374151',
    borderRadius: '2px',
    transition: 'all 0.3s ease'
  };

  const mobileOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: isMobileMenuOpen ? 'flex' : 'none'
  };

  const mobileMenuStyle = {
    position: 'fixed',
    top: 0,
    right: isMobileMenuOpen ? 0 : '-300px',
    width: '280px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
    transition: 'right 0.3s ease',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column'
  };

  const mobileMenuHeaderStyle = {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const mobileMenuItemStyle = {
    padding: '1rem',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'background-color 0.2s ease'
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuItemClick = (page) => {
    setCurrentPage(page);
    closeMobileMenu();
  };

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
          <div style={navStyle}>
            <div style={logoStyle} onClick={() => setCurrentPage('home')}>
              <img 
                src="/images/logo_VIII_1.png" 
                alt="Infinity Math" 
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
            
            {/* Desktop Navigation */}
            <nav style={menuStyle} className="desktop-menu">
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

            {/* Mobile Hamburger Menu */}
            <div 
              style={hamburgerStyle} 
              className="mobile-hamburger"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <div style={hamburgerLineStyle}></div>
              <div style={hamburgerLineStyle}></div>
              <div style={hamburgerLineStyle}></div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div style={mobileOverlayStyle} onClick={closeMobileMenu}>
          <div style={mobileMenuStyle} onClick={(e) => e.stopPropagation()}>
            <div style={mobileMenuHeaderStyle}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Meniu</h3>
              <button 
                onClick={closeMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div onClick={() => handleMobileMenuItemClick('home')} style={{
              ...mobileMenuItemStyle,
              backgroundColor: currentPage === 'home' ? '#f0f9ff' : 'transparent',
              color: currentPage === 'home' ? '#2563eb' : '#374151'
            }}>
              🏠 Acasă
            </div>
            
            <div onClick={() => handleMobileMenuItemClick('services')} style={{
              ...mobileMenuItemStyle,
              backgroundColor: currentPage === 'services' ? '#f0f9ff' : 'transparent',
              color: currentPage === 'services' ? '#2563eb' : '#374151'
            }}>
              📚 Cursuri
            </div>
            
            <div onClick={() => handleMobileMenuItemClick('faq')} style={{
              ...mobileMenuItemStyle,
              backgroundColor: currentPage === 'faq' ? '#f0f9ff' : 'transparent',
              color: currentPage === 'faq' ? '#2563eb' : '#374151'
            }}>
              ❓ FAQ
            </div>
            
            <div onClick={() => handleMobileMenuItemClick('contact')} style={{
              ...mobileMenuItemStyle,
              backgroundColor: currentPage === 'contact' ? '#f0f9ff' : 'transparent',
              color: currentPage === 'contact' ? '#2563eb' : '#374151'
            }}>
              📞 Contact
            </div>
            
            <div onClick={() => handleMobileMenuItemClick('profile')} style={{
              ...mobileMenuItemStyle,
              backgroundColor: currentPage === 'profile' ? '#f0f9ff' : 'transparent',
              color: currentPage === 'profile' ? '#2563eb' : '#374151'
            }}>
              👤 Profilul Meu
            </div>
          </div>
        </div>

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
              .desktop-menu {
                display: none !important;
              }
              
              .mobile-hamburger {
                display: flex !important;
              }
            }
            
            @media (min-width: 769px) {
              .mobile-hamburger {
                display: none !important;
              }
            }
          `}
        </style>
      </div>
    </AuthProvider>
  );
}

export default App;