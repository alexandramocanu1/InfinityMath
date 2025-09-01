export const getProfilePageStyles = (isMobile) => ({
  // Animation styles
  spinnerAnimation: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,

  // Auth page styles
  authContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '1rem' : '2rem'
  },

  authCard: {
    backgroundColor: 'white',
    padding: isMobile ? '1rem' : '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '650px',
    margin: isMobile ? '0 0.5rem' : '0'
  },

  authTitle: {
    fontSize: isMobile ? '1.5rem' : '1.8rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: isMobile ? '1rem' : '1.5rem',
    color: '#000000'
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '0.75rem' : '1rem'
  },

  input: {
    width: '100%',
    padding: isMobile ? '0.875rem' : '1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: isMobile ? '16px' : '1rem', // 16px previne zoom pe iOS
    boxSizing: 'border-box'
  },

  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: isMobile ? '16px' : '0.9rem', // 16px previne zoom pe iOS
    boxSizing: 'border-box',
    backgroundColor: 'white'
  },

  mainContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: isMobile ? '0.5rem' : '1rem'
  },

  header: {
    backgroundColor: 'white',
    padding: isMobile ? '1rem' : '2rem',
    borderRadius: '12px',
    marginBottom: isMobile ? '1rem' : '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '1rem' : '0'
  },

  headerLogoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: isMobile ? '0.625rem 1rem' : '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: isMobile ? '100%' : 'auto',
    justifyContent: isMobile ? 'center' : 'flex-start'
  },

  card: {
    backgroundColor: 'white',
    padding: isMobile ? '1rem' : '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginBottom: isMobile ? '1rem' : '2rem'
  },

  scheduleFormRow: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
    gap: isMobile ? '0.75rem' : '1rem'
  },

  scheduleInfo: {
    display: isMobile ? 'grid' : 'flex',
    alignItems: 'center',
    gap: isMobile ? '0.5rem' : '1rem',
    color: '#666',
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    gridTemplateColumns: isMobile ? '1fr' : 'none'
  },

  linkEditForm: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center'
  },

  linkContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center'
  },

  linkActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: isMobile ? 'center' : 'flex-start'
  },

  addLinkButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    width: isMobile ? '100%' : 'auto',
    justifyContent: isMobile ? 'center' : 'flex-start'
  },

  courseLinkAvailable: {
    backgroundColor: '#f0fdf4',
    border: '2px solid #22c55e',
    borderRadius: '8px',
    padding: isMobile ? '1rem' : '1.5rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '0.75rem' : '1rem',
    flexDirection: isMobile ? 'column' : 'row',
    textAlign: isMobile ? 'center' : 'left'
  },

  courseLinkActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center'
  },

  joinCourseButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    padding: isMobile ? '0.875rem 1rem' : '1rem 2rem',
    borderRadius: '8px',
    fontSize: isMobile ? '0.9rem' : '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '0 auto',
    width: isMobile ? '100%' : 'auto',
    justifyContent: 'center'
  },

  startLearningButton: {
    backgroundColor: '#eab308',
    color: 'white',
    border: 'none',
    padding: isMobile ? '0.875rem 1rem' : '1rem 2rem',
    borderRadius: '8px',
    fontSize: isMobile ? '1rem' : '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '0 auto',
    transition: 'background-color 0.3s ease',
    width: isMobile ? '100%' : 'auto',
    justifyContent: 'center'
  },

  // Toate celelalte stiluri rămân la fel...
  errorMessage: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  },
  
  form: {
    display: 'grid',
    gap: '1.2rem'
  },
  
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500'
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
  
  inputWithIcon: {
    paddingLeft: '3rem'
  },
  
  submitButton: {
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
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
  
  loadingContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  
  loadingCard: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%'
  },
  
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #10b981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 2rem'
  },
  
  loadingTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#10b981'
  },
  
  loadingText: {
    color: '#666',
    margin: '0 0 2rem 0',
    fontSize: '1rem',
    lineHeight: '1.5'
  },
  
  statusBox: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'left',
    fontSize: '0.9rem',
    color: '#666'
  },
  
  actionButtons: {
    display: 'grid',
    gap: '1rem'
  },
  
  fixButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '2px solid #ef4444',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  userName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0',
    color: '#000000'
  },
  
  userType: {
    margin: '0.25rem 0 0 0',
    color: '#666',
    fontSize: '0.9rem'
  },
  
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  adminContent: {
    display: 'grid',
    gap: '2rem'
  },
  
  scheduleForm: {
    display: 'grid',
    gap: '1rem'
  },
  
  addScheduleButton: {
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center'
  },
  
  schedulesList: {
    display: 'grid',
    gap: '1rem'
  },
  
  scheduleItem: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  
  scheduleHeader: {
    marginBottom: '1rem'
  },
  
  scheduleTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0'
  },
  
  scheduleInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  
  linkSection: {
    marginTop: '1rem'
  },
  
  linkInput: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '0.9rem'
  },
  
  linkEditButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  
  saveButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  
  cancelButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  
  linkDisplay: {
    width: '100%'
  },
  
  linkText: {
    backgroundColor: 'white',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '0.8rem',
    color: '#666',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    flex: 1
  },
  
  copyButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  
  openButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  
  editButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    fontStyle: 'italic'
  },
  
  studentContent: {
    display: 'grid',
    gap: '2rem'
  },
  
  enrollmentsList: {
    display: 'grid',
    gap: '1.5rem'
  },
  
  enrollmentItem: {
    backgroundColor: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  
  enrollmentHeader: {
    marginBottom: '1.5rem'
  },
  
  enrollmentTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 0.75rem 0'
  },
  
  enrollmentInfo: {
    display: 'grid',
    gap: '0.5rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  
  enrollmentInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  courseLink: {
    marginTop: '1.5rem'
  },
  
  courseLinkTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0',
    color: '#15803d'
  },
  
  courseLinkSubtitle: {
    margin: '0.25rem 0 0 0',
    color: '#16a34a',
    fontSize: '0.9rem'
  },
  
  courseLinkContainer: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    marginBottom: '1rem'
  },
  
  courseLinkInput: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '0.9rem',
    backgroundColor: '#f9fafb'
  },
  
  courseLinkPending: {
    backgroundColor: '#fef3c7',
    border: '2px solid #f59e0b',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    marginTop: '1.5rem'
  },
  
  courseLinkPendingTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#92400e'
  },
  
  courseLinkPendingText: {
    margin: '0',
    color: '#a16207',
    fontSize: '0.9rem'
  },
  
  noEnrollments: {
    backgroundColor: '#fefdf2',
    border: '2px solid #eab308',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center'
  },
  
  noEnrollmentsTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#a16207'
  },
  
  noEnrollmentsText: {
    margin: '0 0 2rem 0',
    color: '#92400e',
    fontSize: '1rem'
  }
});