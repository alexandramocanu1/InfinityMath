export const contactPageStyles = {
  // Container principal - cu același fundal ca FAQ
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
    padding: '6rem 1rem 4rem',
    position: 'relative',
    overflow: 'hidden',
    // Mobile responsive
    '@media (max-width: 768px)': {
      padding: '4rem 1rem 2rem'
    }
  },

  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10
  },

  // Header
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
    // Mobile responsive
    '@media (max-width: 768px)': {
      marginBottom: '2rem'
    }
  },

  title: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#000000',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    letterSpacing: '-0.02em',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '2.5rem'
    },
    '@media (max-width: 480px)': {
      fontSize: '2rem'
    }
  },

  subtitle: {
    fontSize: '1.2rem',
    color: '#000000',
    maxWidth: '600px',
    margin: '0 auto',
    fontWeight: '500',
    opacity: '0.8',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      padding: '0 1rem'
    }
  },

  // Main grid - responsiv
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'start',
    // Mobile responsive - o singură coloană
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem'
    }
  },

  // Cards - cu fundal glassmorphism ca în FAQ
  contactInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      padding: '1.5rem'
    }
  },

  contactFormCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      padding: '1.5rem'
    }
  },

  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '2rem',
    color: '#000000',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
      marginBottom: '1.5rem'
    }
  },

  // Contact info items
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(5px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      padding: '1rem',
      marginBottom: '1.5rem'
    }
  },

  contactIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    flexShrink: 0, // Previne shrinking pe mobile
    // Mobile responsive
    '@media (max-width: 768px)': {
      width: '40px',
      height: '40px'
    }
  },

  contactItemTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.25rem 0',
    color: '#000000',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '1rem'
    }
  },

  contactLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    wordBreak: 'break-all', // Pentru email-uri lungi pe mobile
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '0.9rem'
    }
  },

  contactText: {
    color: '#374151',
    margin: '0',
    fontSize: '1rem',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '0.9rem'
    }
  },

  // Messages
  successMessage: {
    backgroundColor: 'rgba(240, 249, 255, 0.9)',
    border: '2px solid #10b981',
    color: '#065f46',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    backdropFilter: 'blur(5px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
      padding: '0.75rem'
    }
  },

  errorMessage: {
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    border: '2px solid #ef4444',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    backdropFilter: 'blur(5px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
      padding: '0.75rem'
    }
  },

  // Form
  form: {
    display: 'grid',
    gap: '1.5rem',
    // Mobile responsive
    '@media (max-width: 768px)': {
      gap: '1rem'
    }
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    // Mobile responsive - o singură coloană
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '1rem'
    }
  },

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#374151',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '0.9rem'
    }
  },

  input: {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: '16px' // Previne zoom pe iOS
    }
  },

  select: {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: '16px' // Previne zoom pe iOS
    }
  },

  textarea: {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: '16px', // Previne zoom pe iOS
      minHeight: '120px'
    }
  },

  // Submit button - cu gradient ca în FAQ
  submitButton: {
    base: {
      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      color: 'white',
      border: 'none',
      padding: '1.2rem 2rem',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
      // Mobile responsive
      '@media (max-width: 768px)': {
        padding: '1rem 1.5rem',
        fontSize: '1rem'
      }
    },
    hover: {
      background: 'linear-gradient(135deg, #e55a2b, #e6851a)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)',
      // Mobile responsive - reducere efect hover pe mobile
      '@media (max-width: 768px)': {
        transform: 'none'
      }
    }
  },

  // Decorațiuni de fundal - adaptate pentru mobile
  backgroundDecoration1: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    zIndex: 1,
    // Mobile responsive
    '@media (max-width: 768px)': {
      width: '150px',
      height: '150px',
      top: '-30px',
      right: '-30px'
    }
  },

  backgroundDecoration2: {
    position: 'absolute',
    bottom: '-100px',
    left: '-100px',
    width: '300px',
    height: '300px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    zIndex: 1,
    // Mobile responsive
    '@media (max-width: 768px)': {
      width: '200px',
      height: '200px',
      bottom: '-50px',
      left: '-50px'
    }
  },

  backgroundDecoration3: {
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: '150px',
    height: '150px',
    background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
    borderRadius: '50%',
    opacity: '0.1',
    filter: 'blur(50px)',
    zIndex: 1,
    // Mobile responsive
    '@media (max-width: 768px)': {
      width: '100px',
      height: '100px',
      right: '5%'
    }
  },

  backgroundDecoration4: {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    width: '200px',
    height: '200px',
    background: 'linear-gradient(45deg, #ffcd3c, #dc2626)',
    borderRadius: '50%',
    opacity: '0.1',
    filter: 'blur(60px)',
    zIndex: 1,
    // Mobile responsive
    '@media (max-width: 768px)': {
      width: '120px',
      height: '120px',
      left: '5%'
    }
  },

  // Setup instructions
  setupInstructions: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(5px)',
    // Mobile responsive
    '@media (max-width: 768px)': {
      padding: '1rem',
      marginTop: '1.5rem'
    }
  },

  setupTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#374151',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '0.9rem'
    }
  },

  setupList: {
    margin: '0',
    paddingLeft: '1.5rem',
    color: '#6b7280',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    // Mobile responsive
    '@media (max-width: 768px)': {
      fontSize: '0.8rem',
      paddingLeft: '1rem'
    }
  },

  setupLink: {
    color: '#2563eb',
    textDecoration: 'underline'
  }
};