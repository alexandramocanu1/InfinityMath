export const contactPageStyles = {
  // Container principal - cu același fundal ca FAQ
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
    padding: '6rem 1rem 4rem',
    position: 'relative',
    overflow: 'hidden'
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
    marginBottom: '4rem'
  },

  title: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#000000',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    letterSpacing: '-0.02em'
  },

  subtitle: {
    fontSize: '1.2rem',
    color: '#000000',
    maxWidth: '600px',
    margin: '0 auto',
    fontWeight: '500',
    opacity: '0.8'
  },

  // Main grid
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'start'
  },

  // Cards - cu fundal glassmorphism ca în FAQ
  contactInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)'
  },

  contactFormCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)'
  },

  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '2rem',
    color: '#000000'
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
    backdropFilter: 'blur(5px)'
  },

  contactIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
  },

  contactItemTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.25rem 0',
    color: '#000000'
  },

  contactLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500'
  },

  contactText: {
    color: '#374151',
    margin: '0',
    fontSize: '1rem'
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
    backdropFilter: 'blur(5px)'
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
    backdropFilter: 'blur(5px)'
  },

  // Form
  form: {
    display: 'grid',
    gap: '1.5rem'
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#374151'
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
    backdropFilter: 'blur(5px)'
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
    backdropFilter: 'blur(5px)'
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
    backdropFilter: 'blur(5px)'
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
      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)'
    },
    hover: {
      background: 'linear-gradient(135deg, #e55a2b, #e6851a)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)'
    }
  },

  // Decorațiuni de fundal - la fel ca în FAQ
  backgroundDecoration1: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    zIndex: 1
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
    zIndex: 1
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
    zIndex: 1
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
    zIndex: 1
  },

  // Setup instructions
  setupInstructions: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(5px)'
  },

  setupTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#374151'
  },

  setupList: {
    margin: '0',
    paddingLeft: '1.5rem',
    color: '#6b7280',
    fontSize: '0.9rem',
    lineHeight: '1.6'
  },

  setupLink: {
    color: '#2563eb',
    textDecoration: 'underline'
  }
};