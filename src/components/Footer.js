import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import NTPLogo from 'ntp-logo-react';

import { Instagram } from 'lucide-react';

const TikTokIcon = ({ style }) => (
  <svg 
    viewBox="0 0 24 24" 
    style={style}
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const FacebookIcon = ({ style }) => (
  <svg 
    viewBox="0 0 24 24" 
    style={style}
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Footer = () => {
  const documents = [
    {
      name: 'Termeni și Condiții',
      file: 'Termeni_si_Conditii_InfinityMath.pdf',
      icon: <FileText style={{ width: '1rem', height: '1rem' }} />
    },
    {
      name: 'Politica de Returnare',
      file: 'Politica_Retur.pdf',
      icon: <FileText style={{ width: '1rem', height: '1rem' }} />
    },
    {
      name: 'Politica de Confidențialitate',
      file: 'Politica_Confidentialitate.pdf',
      icon: <FileText style={{ width: '1rem', height: '1rem' }} />
    }
  ];

  const footerStyles = {
    footer: {
      backgroundColor: '#1f2937',
      color: '#ffffff',
      padding: '3rem 1rem 2rem',
      marginTop: 'auto'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    content: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '3rem',
      marginBottom: '2rem'
    },
    section: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#f9fafb'
    },
    linksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#d1d5db',
      textDecoration: 'none',
      fontSize: '0.95rem',
      transition: 'color 0.2s ease',
      cursor: 'pointer',
      padding: '0.25rem 0'
    },
    contactInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    contactItem: {
      color: '#d1d5db',
      lineHeight: '1.6',
      margin: 0,
      fontSize: '0.95rem'
    },
    divider: {
      height: '1px',
      backgroundColor: '#374151',
      margin: '2rem 0 1.5rem'
    },
    bottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      fontSize: '0.875rem',
      color: '#9ca3af'
    },
    copyright: {
      margin: 0
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap'
    },
    anpcImage: {
      height: '40px',
      width: 'auto',
      opacity: 0.8,
      transition: 'opacity 0.2s ease'
    },
    ntpContainer: {
      height: '35px',
      display: 'flex',
      alignItems: 'center'
    },
    socialLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginLeft: 'auto' // Împinge linkurile sociale în dreapta
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      color: '#9ca3af',
      textDecoration: 'none',
      transition: 'color 0.2s ease, transform 0.2s ease'
    }
  };

  const handleDocumentClick = (fileName) => {
    const fileUrl = `/documents/${fileName}`;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        <div style={footerStyles.content}>
          {/* Documentele legale */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.title}>Documente Legale</h3>
            <div style={footerStyles.linksList}>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  style={footerStyles.link}
                  onClick={() => handleDocumentClick(doc.file)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                    e.currentTarget.style.transform = 'translateX(0px)';
                  }}
                >
                  {doc.icon}
                  <span>{doc.name}</span>
                  <ExternalLink style={{ width: '0.8rem', height: '0.8rem', opacity: 0.7 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Date de contact */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.title}>Contact</h3>
            <div style={footerStyles.contactInfo}>
              <p style={footerStyles.contactItem}>
                <strong>Radu Mihai Ordean</strong>
              </p>
              <p style={footerStyles.contactItem}>
                📞 +40799932522
              </p>
              <p style={footerStyles.contactItem}>
                ✉️ raduordean@gmail.com
              </p>
              <p style={footerStyles.contactItem}>
                🏢 CUI: 52319674
              </p>
            </div>
          </div>
        </div>

        <div style={footerStyles.divider}></div>

        <div style={footerStyles.bottom}>
          {/* Secțiunea din stânga cu logo-urile ANPC */}
          <div style={footerStyles.leftSection}>
            <a 
              href="https://anpc.ro/ce-este-sal/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img 
                src="/images/ANPC.jpeg" 
                alt="ANPC - Soluționarea Alternativă a Litigiilor" 
                style={footerStyles.anpcImage}
                onMouseOver={(e) => e.target.style.opacity = '1'}
                onMouseOut={(e) => e.target.style.opacity = '0.8'}
              />
            </a>
            
            <a 
              href="https://ec.europa.eu/consumers/odr" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img 
                src="/images/ANPC2.jpeg" 
                alt="ANPC - Soluționarea Online a Litigiilor" 
                style={footerStyles.anpcImage}
                onMouseOver={(e) => e.target.style.opacity = '1'}
                onMouseOut={(e) => e.target.style.opacity = '0.8'}
              />
            </a>
          </div>

          {/* Linkurile sociale în dreapta */}
          <div style={footerStyles.socialLinks}>
            <a 
              href="https://www.facebook.com/people/Infinity-math/100063583206537/"
              target="_blank"
              rel="noopener noreferrer"
              style={footerStyles.socialLink}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#1877F2'; // Facebook color
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <FacebookIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            </a>

            <a 
              href="https://www.instagram.com/_infinity_math/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              style={footerStyles.socialLink}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#E4405F'; // Instagram color
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <Instagram style={{ width: '1.5rem', height: '1.5rem' }} />
            </a>
            
            <a 
              href="https://www.tiktok.com/@_infinity_math?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              style={footerStyles.socialLink}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#ff0050'; // TikTok color
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <TikTokIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;