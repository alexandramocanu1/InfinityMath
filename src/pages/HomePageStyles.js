export const homePageStyles = {
  globalStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    * {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    input, textarea, select {
      box-sizing: border-box;
    }
    
    input:focus, textarea:focus, select:focus {
      outline: none;
      border: 2px solid #ea580c !important;
      box-shadow: 0 0 0 2px #ea580c20;
    }
    
    input::placeholder, textarea::placeholder {
      color: #9ca3af;
      opacity: 1;
    }

    /* Mobile Media Queries */
    @media (max-width: 768px) {
      .mobile-stack {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
      }
      
      .mobile-text-sm {
        font-size: 1.8rem !important;
      }
      
      .mobile-text-lg {
        font-size: 2.5rem !important;
      }
      
      .mobile-padding {
        padding: 2rem 1rem !important;
      }
      
      .mobile-padding-sm {
        padding: 1.5rem 1rem !important;
      }
    }

    @media (max-width: 480px) {
      .mobile-text-xs {
        font-size: 1.5rem !important;
      }
      
      .mobile-text-md {
        font-size: 2rem !important;
      }
    }
  `,
 heroSection: {
    padding: '8rem 2rem',
    textAlign: 'center',
    backgroundImage: 'url(/images/bk_04.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      padding: '4rem 1rem',
      minHeight: '80vh'
    }
  },

    heroTitle: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    fontFamily: 'Poppins, serif',
    position: 'relative',
    zIndex: 2
  },

heroOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 1
},


heroSubtitle: {
  fontSize: '1.5rem',
  color: 'white',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
  marginBottom: '2rem',
  position: 'relative',
  zIndex: 2
},

  heroButton: {
    base: {
      backgroundColor: '#ea580c',
      color: 'white',
      border: 'none',
      padding: '1.2rem 3rem',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      letterSpacing: '0.05em',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
    },
    hover: {
      transform: 'translateY(-2px)',
      backgroundColor: '#c2410c',
      boxShadow: '0 6px 20px rgba(234, 88, 12, 0.4)'
    }
  },

  // Services Section
  servicesSection: {
    padding: '6rem 1rem',
    backgroundColor: '#f8fafc'
  },

  sectionHeader: {
    textAlign: 'center',
    marginBottom: '5rem'
  },

  sectionTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#1f2937'
  },

  sectionSubtitle: {
    fontSize: '1.2rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto'
  },

  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    justifyContent: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },

  serviceCard: {
    base: {
      backgroundColor: 'white',
      padding: '2.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      border: '1px solid #e5e7eb'
    },
    hover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
    }
  },

  serviceIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    margin: '0 auto 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  serviceTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },

  serviceDescription: {
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },

  servicePricing: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },

  servicePrice: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem'
  },

  serviceDuration: {
    fontSize: '0.9rem',
    color: '#6b7280'
  },

  serviceButton: {
    base: {
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      width: '100%'
    }
  },

  // About Section
  aboutSection: {
    padding: '6rem 1rem',
    backgroundColor: '#f5f5dc'
  },

  aboutTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '4rem',
    color: '#1f2937',
    textAlign: 'center'
  },

  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '4rem',
    alignItems: 'center'
  },

  aboutImageContainer: {
    textAlign: 'center'
  },

  aboutImage: {
    width: '300px',
    height: '300px',
    borderRadius: '12px',
    objectFit: 'cover',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
  },

  aboutImageFallback: {
    width: '300px',
    height: '300px',
    borderRadius: '12px',
    backgroundColor: '#f3f4f6',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    color: '#6b7280',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
  },

  aboutText: {
    fontSize: '1.2rem',
    lineHeight: '1.8',
    color: '#374151',
    marginBottom: '2rem'
  },

  aboutDivider: {
    width: '100px',
    height: '3px',
    backgroundColor: '#ea580c',
    margin: '2rem 0'
  },

  // How Section (Ce, când și cum)
  howSection: {
    padding: '6rem 1rem',
    backgroundColor: '#f8fafc'
  },

  howContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center'
  },

  howTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '3rem',
    color: '#1f2937'
  },

  howText: {
    fontSize: '1.3rem',
    lineHeight: '1.8',
    color: '#374151',
    marginBottom: '3rem',
    maxWidth: '800px',
    margin: '0 auto 3rem'
  },

  howButton: {
    base: {
      backgroundColor: 'transparent',
      color: '#ea580c',
      border: '2px solid #ea580c',
      padding: '1rem 2.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    hover: {
      backgroundColor: '#ea580c',
      color: 'white'
    }
  },

  // Reviews Section - primu comentat e gradientu 
  reviewsSection: {
  // background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
  backgroundImage: 'url(/images/bk_08.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '6rem 1rem',
  position: 'relative',
  overflow: 'hidden',
  // overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1
  }
},

  reviewsBackground: {
    decoration1: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      width: '200px',
      height: '200px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      filter: 'blur(40px)'
    },
    decoration2: {
      position: 'absolute',
      bottom: '-100px',
      left: '-100px',
      width: '300px',
      height: '300px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%',
      filter: 'blur(60px)'
    }
  },

  reviewsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10
  },

  reviewsTitle: {
    fontSize: '4rem',
    fontWeight: '800',
    marginBottom: '4rem',
    color: '#000000',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    letterSpacing: '-0.02em'
  },

  reviewsGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem'
},


  reviewItem: {
  base: {
    transition: 'all 0.3s ease',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    transform: 'rotate(0deg)'
  },
  hover: {
    transform: 'scale(1.05) rotate(0deg)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
    zIndex: 10
  }
},

  reviewImage: {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease'
},

  // Contact Form Section
  contactSection: {
    padding: '6rem 1rem',
    backgroundColor: '#1f2937',
    color: 'white'
  },

  contactContainer: {
    maxWidth: '800px',
    margin: '0 auto'
  },

  contactTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '3rem',
    textAlign: 'center'
  },

  contactForm: {
    display: 'grid',
    gap: '1.5rem'
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },

  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500'
  },

  formInput: {
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    backgroundColor: 'white',
    color: '#1f2937'
  },

  formTextarea: {
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    backgroundColor: 'white',
    color: '#1f2937',
    resize: 'vertical'
  },

  submitButton: {
    base: {
      backgroundColor: '#ea580c',
      color: 'white',
      border: 'none',
      padding: '1.2rem 2rem',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    hover: {
      backgroundColor: '#c2410c'
    }
  },

  // Modal Styles
  modal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },

    closeButton: {
      position: 'absolute',
      top: '2rem',
      right: '2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },

    prevButton: {
      position: 'absolute',
      left: '2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },

    nextButton: {
      position: 'absolute',
      right: '2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },

    imageContainer: {
      maxWidth: '90%',
      maxHeight: '90%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    image: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      borderRadius: '8px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },

    counter: {
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem'
    },

    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1
    }
  }
};