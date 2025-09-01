// ContactPageStyles.js - Exportă stilurile cu background bk_09 și 67% zoom

export const contactPageStyles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url(/images/bk_09.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    
    padding: '4rem 0.67rem 2.67rem', // 67%
    position: 'relative',
    overflow: 'hidden',
    
    '@media (max-width: 768px)': {
      padding: '2.67rem 0.67rem 1.33rem' 
    }
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    zIndex: 1
  },

  content: {
    maxWidth: '804px', // 67% din 1200px
    margin: '0 auto',
    position: 'relative',
    zIndex: 10
  },

  header: {
    textAlign: 'center',
    marginBottom: '2.67rem', // 67%
    '@media (max-width: 768px)': {
      marginBottom: '1.33rem' 
    }
  },

  title: {
  fontSize: '2.67rem', 
  fontWeight: '800',
  color: '#000000', // Text negru
  marginBottom: '0.67rem', 
  textShadow: '2px 2px 0px #ffffff, -2px -2px 0px #ffffff, 2px -2px 0px #ffffff, -2px 2px 0px #ffffff', // Margini albe
  letterSpacing: '-0.02em',
  '@media (max-width: 768px)': {
    fontSize: '1.67rem' 
  },
  '@media (max-width: 480px)': {
    fontSize: '1.33rem' 
  }
},

subtitle: {
  fontSize: '0.8rem', 
  color: '#000000', 
  maxWidth: '402px', 
  margin: '0 auto',
  fontWeight: '500',
  textShadow: '1px 1px 0px #ffffff, -1px -1px 0px #ffffff, 1px -1px 0px #ffffff, -1px 1px 0px #ffffff', // Margini albe
  '@media (max-width: 768px)': {
    fontSize: '0.67rem', 
    padding: '0 0.67rem' 
  }
},

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem', 
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '1.33rem' 
    }
  },

  contactInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '1.67rem', // 67%
    borderRadius: '10.67px', // 67%
    boxShadow: '0 5.33px 21.33px rgba(0, 0, 0, 0.1)', 
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    '@media (max-width: 768px)': {
      padding: '1rem'
    }
  },

  contactFormCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '1.67rem', // 67%
    borderRadius: '10.67px', 
    boxShadow: '0 5.33px 21.33px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    '@media (max-width: 768px)': {
      padding: '1rem'
    }
  },

  cardTitle: {
    fontSize: '1.2rem', // 67%
    fontWeight: '600',
    marginBottom: '1.33rem', 
    color: '#000000',
    '@media (max-width: 768px)': {
      fontSize: '1rem', 
      marginBottom: '1rem' 
    }
  },

  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.67rem', // 67%
    marginBottom: '1.33rem', 
    padding: '1rem', // 67%
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: '8px', // 67%
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      padding: '0.67rem', 
      marginBottom: '1rem' 
    }
  },

  contactIcon: {
    width: '33.5px', // 67%
    height: '33.5px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2.67px 10.67px rgba(0, 0, 0, 0.2)', 
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: '26.8px', // 67%
      height: '26.8px'
    }
  },

  contactItemTitle: {
    fontSize: '0.74rem', // 67% din 1.1rem
    fontWeight: '600',
    margin: '0 0 0.17rem 0', // 67% din 0.25rem
    color: '#000000',
    '@media (max-width: 768px)': {
      fontSize: '0.67rem' // 67% din 1rem
    }
  },

  contactLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '0.67rem', // 67% din 1rem
    fontWeight: '500',
    wordBreak: 'break-all',
    '@media (max-width: 768px)': {
      fontSize: '0.6rem' // 67% din 0.9rem
    }
  },

  contactText: {
    color: '#374151',
    margin: '0',
    fontSize: '0.67rem', // 67% din 1rem
    '@media (max-width: 768px)': {
      fontSize: '0.6rem' // 67% din 0.9rem
    }
  },

  successMessage: {
    backgroundColor: 'rgba(240, 249, 255, 0.9)',
    border: '2px solid #10b981',
    color: '#065f46',
    padding: '0.67rem', // 67% din 1rem
    borderRadius: '8px', // 67% din 12px
    marginBottom: '1rem', // 67% din 1.5rem
    fontSize: '0.64rem', // 67% din 0.95rem
    fontWeight: '500',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      fontSize: '0.6rem', // 67% din 0.9rem
      padding: '0.5rem' // 67% din 0.75rem
    }
  },

  errorMessage: {
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    border: '2px solid #ef4444',
    color: '#dc2626',
    padding: '0.67rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.64rem',
    fontWeight: '500',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      fontSize: '0.6rem',
      padding: '0.5rem'
    }
  },

  form: {
    display: 'grid',
    gap: '1rem', // 67% din 1.5rem
    '@media (max-width: 768px)': {
      gap: '0.67rem'
    }
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.67rem', // 67% din 1rem
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '0.67rem'
    }
  },

  label: {
    display: 'block',
    marginBottom: '0.34rem', // 67% din 0.5rem
    fontWeight: '600',
    color: '#374151',
    fontSize: '0.67rem', // 67% din 1rem
    '@media (max-width: 768px)': {
      fontSize: '0.6rem' // 67% din 0.9rem
    }
  },

  input: {
    width: '100%',
    padding: '0.67rem', // 67%
    borderRadius: '8px', 
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '0.67rem', 
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      padding: '0.5rem', 
      fontSize: '10.67px' 
    }
  },

  select: {
    width: '100%',
    padding: '0.67rem',
    borderRadius: '8px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '0.67rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      padding: '0.5rem',
      fontSize: '10.67px'
    }
  },

  textarea: {
    width: '100%',
    padding: '0.67rem',
    borderRadius: '8px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    fontSize: '0.67rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    '@media (max-width: 768px)': {
      padding: '0.5rem',
      fontSize: '10.67px',
      minHeight: '80.4px' 
    }
  },

  submitButton: {
    base: {
      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.33rem', // 67%
      borderRadius: '8px', // 67%
      fontSize: '0.73rem', // 67%
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.33rem', // 67%
      marginTop: '0.67rem', // 67%
      boxShadow: '0 5.33px 21.33px rgba(255, 107, 53, 0.3)',
      '@media (max-width: 768px)': {
        padding: '0.67rem 1rem',
        fontSize: '0.67rem'
      }
    },
    hover: {
      background: 'linear-gradient(135deg, #e55a2b, #e6851a)',
      transform: 'translateY(-1px)', // Redus pentru 67%
      boxShadow: '0 8px 27px rgba(255, 107, 53, 0.4)' // 67%
    }
  }
};