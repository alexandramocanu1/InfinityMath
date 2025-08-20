export const servicesPageStyles = {
  // Global styles function
  getGlobalStyles: (currentColor) => `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    
    * {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    input::placeholder,
    textarea::placeholder {
      color: #9ca3af;
      opacity: 1;
    }
    
    input:focus,
    textarea:focus {
      outline: none;
      border-color: ${currentColor || '#f59e0b'};
      box-shadow: 0 0 0 2px ${currentColor || '#f59e0b'}20;
    }
  `,

  // Container and layout - cu fundal colorat ca în FAQ și Contact
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
    padding: '2rem 1rem',
    position: 'relative',
    overflow: 'hidden'
  },

  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10
  },

  // Header styles
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },

  backButton: {
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#000000',
      border: 'none',
      cursor: 'pointer',
      marginBottom: '2rem',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      backdropFilter: 'blur(5px)'
    },
    hover: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      color: '#000000'
    }
  },

  mainTitle: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#000000',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    letterSpacing: '-0.02em'
  },

  // Progress bar
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },

  progressStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.9rem',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
  },

  progressLine: {
    width: '60px',
    height: '2px'
  },

  stepDescription: {
    fontSize: '1rem',
    color: '#000000',
    marginBottom: '1rem',
    fontWeight: '500',
    opacity: '0.8'
  },

  // Content card - glassmorphism ca în FAQ
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '3rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    maxWidth: '1000px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)'
  },

  // Step titles
  stepTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#1f2937',
    textAlign: 'center',
    fontWeight: '600'
  },

  // Service selection grid - MODIFICAT pentru a centra doar 2 servicii
  servicesGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap'
  },

  // Service cards - MODIFICAT pentru a arăta mai bine centrate
  serviceCard: {
    base: {
      backgroundColor: 'rgba(248, 250, 252, 0.8)',
      borderRadius: '16px',
      padding: '2.5rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '350px', // Lățime fixă pentru consistență
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    hover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    }
  },

  serviceIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
  },

  serviceTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },

  serviceDescription: {
    color: '#6b7280',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    lineHeight: '1.5'
  },

  servicePricing: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '1.2rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(5px)'
  },

  servicePrice: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.25rem'
  },

  serviceDuration: {
    fontSize: '0.85rem',
    color: '#6b7280'
  },

  serviceAvailability: {
    fontSize: '0.85rem',
    color: '#6b7280',
    marginBottom: '1.5rem'
  },

  serviceSelectButton: {
    padding: '1rem',
    color: 'white',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
  },

  // Service unavailable states
  serviceUnavailable: {
    pricing: {
      backgroundColor: 'rgba(249, 250, 251, 0.8)',
      padding: '1.2rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '1px solid rgba(209, 213, 219, 0.5)',
      backdropFilter: 'blur(5px)'
    },
    price: {
      fontSize: '1.4rem',
      fontWeight: '600',
      color: '#9ca3af',
      marginBottom: '0.25rem'
    },
    duration: {
      fontSize: '0.85rem',
      color: '#6b7280'
    },
    availability: {
      fontSize: '0.85rem',
      color: '#9ca3af',
      marginBottom: '1.5rem'
    },
    button: {
      padding: '1rem',
      backgroundColor: '#d1d5db',
      color: '#6b7280',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600'
    }
  },

  // Info boxes
  infoBox: {
    backgroundColor: 'rgba(240, 249, 255, 0.9)',
    border: '1px solid',
    borderRadius: '12px',
    padding: '1.2rem',
    marginBottom: '2rem',
    textAlign: 'center',
    backdropFilter: 'blur(5px)'
  },

  infoBoxHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },

  infoBoxText: {
    margin: '0',
    fontSize: '0.95rem',
    color: '#475569'
  },

  // Schedule grid
  schedulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },

  // Schedule cards
  scheduleCard: {
    base: {
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    hover: {
      backgroundColor: 'rgba(241, 245, 249, 0.9)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
    }
  },

  scheduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },

  scheduleDay: {
    fontSize: '1.3rem',
    fontWeight: '600'
  },

  scheduleStatus: {
    padding: '0.3rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },

  scheduleTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },

  scheduleTimeText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#374151'
  },

  // Empty state
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280'
  },

  emptyStateIcon: {
    width: '3rem',
    height: '3rem',
    margin: '0 auto 1rem',
    color: '#d1d5db'
  },

  emptyStateTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    color: '#1f2937'
  },

  emptyStateText: {
    margin: '0'
  },

  // Summary boxes
  summaryBox: {
    backgroundColor: 'rgba(240, 249, 255, 0.9)',
    border: '2px solid',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    backdropFilter: 'blur(5px)'
  },

  summaryTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    fontWeight: '600'
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },

  summaryLabel: {
    color: '#6b7280',
    fontSize: '0.9rem'
  },

  summaryValue: {
    fontWeight: '600',
    color: '#1f2937'
  },

  summaryPrice: {
    fontWeight: '600',
    fontSize: '1.1rem'
  },

  // Forms
  form: {
    display: 'grid',
    gap: '1.5rem'
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },

  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#374151',
    fontWeight: '500'
  },

  formInput: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid rgba(209, 213, 219, 0.5)',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#1f2937',
    backdropFilter: 'blur(5px)'
  },

  formTextarea: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid rgba(209, 213, 219, 0.5)',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#1f2937',
    backdropFilter: 'blur(5px)'
  },

  // Final summary
  finalSummary: {
    backgroundColor: 'rgba(240, 249, 255, 0.9)',
    border: '2px solid',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    backdropFilter: 'blur(5px)'
  },

  finalSummaryTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.2rem',
    textAlign: 'center',
    fontWeight: '600'
  },

  finalSummaryContent: {
    display: 'grid',
    gap: '1rem'
  },

  finalSummaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  finalSummaryLabel: {
    color: '#6b7280'
  },

  finalSummaryValue: {
    fontWeight: '600',
    color: '#1f2937'
  },

  finalSummaryMessage: {
    fontWeight: '600',
    color: '#1f2937',
    marginTop: '0.5rem'
  },

  divider: {
    border: 'none',
    borderTop: '1px solid rgba(229, 231, 235, 0.5)',
    margin: '0.5rem 0'
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  totalLabel: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937'
  },

  totalPrice: {
    fontSize: '1.5rem',
    fontWeight: '700'
  },

  confirmationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    textAlign: 'center',
    border: '1px solid',
    backdropFilter: 'blur(5px)'
  },

  termsBox: {
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    fontSize: '0.8rem',
    color: '#6b7280',
    lineHeight: '1.4',
    border: '1px solid rgba(229, 231, 235, 0.5)',
    backdropFilter: 'blur(5px)'
  },

  // Spinner
  spinner: {
    width: '1rem',
    height: '1rem',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  // Navigation buttons
  navigationButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  },

  // Button styles
  buttons: {
    backButton: {
      base: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#000000',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        backdropFilter: 'blur(5px)'
      },
      hover: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        color: '#000000'
      }
    },

    back: {
      base: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'rgba(243, 244, 246, 0.8)',
        color: '#374151',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(5px)'
      },
      hover: {
        backgroundColor: 'rgba(229, 231, 235, 0.9)'
      }
    },

    continue: {
      base: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
      }
    },

    confirm: {
      base: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: 'white',
        border: 'none',
        padding: '1.2rem 2rem',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
      }
    }
  },

  // Modal styles
  modal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    },

    content: {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      padding: '3rem',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      maxWidth: '500px',
      margin: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative',
      maxHeight: '90vh',
      overflowY: 'auto',
      backdropFilter: 'blur(20px)'
    },

    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6b7280',
      width: '2rem',
      height: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    icon: {
      width: '80px',
      height: '80px',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 2rem',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
    },

    title: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '1rem'
    },

    authSubtitle: {
      color: '#6b7280',
      marginBottom: '2rem',
      lineHeight: '1.6',
      fontSize: '0.95rem'
    },

    message: {
      color: '#6b7280',
      marginBottom: '2rem',
      lineHeight: '1.6'
    },

    errorMessage: {
      backgroundColor: 'rgba(254, 242, 242, 0.9)',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontSize: '0.9rem',
      textAlign: 'left',
      backdropFilter: 'blur(5px)'
    },

    form: {
      display: 'grid',
      gap: '1.5rem',
      textAlign: 'left'
    },

    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },

    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      color: '#374151'
    },

    inputWrapper: {
      position: 'relative'
    },

    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1rem',
      height: '1rem',
      color: '#666'
    },

    input: {
      width: '100%',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid rgba(209, 213, 219, 0.5)',
      fontSize: '1rem',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)'
    },

    inputWithIcon: {
      width: '100%',
      padding: '1rem 1rem 1rem 3rem',
      borderRadius: '8px',
      border: '1px solid rgba(209, 213, 219, 0.5)',
      fontSize: '1rem',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)'
    },

    submitButton: {
      color: 'white',
      border: 'none',
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
    },

    authSwitch: {
      textAlign: 'center',
      marginTop: '2rem'
    },

    authSwitchButton: {
      background: 'none',
      border: 'none',
      color: '#2563eb',
      cursor: 'pointer',
      fontSize: '0.9rem',
      textDecoration: 'underline'
    },

    button: {
      base: {
        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)'
      },
      hover: {
        background: 'linear-gradient(135deg, #e55a2b, #e6851a)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)'
      }
    }
  },

  // Decorațiuni de fundal - la fel ca în FAQ și Contact
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
  }
};