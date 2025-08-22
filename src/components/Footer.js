import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import NTPLogo from 'ntp-logo-react';

const Footer = () => {
  const documents = [
    {
      name: 'Termeni și Condiții',
      file: 'Termeni_si_Conditii_InfinityMath.pdf', // ✅ Schimbat la .pdf
      icon: <FileText style={{ width: '1rem', height: '1rem' }} />
    },
    {
      name: 'Politica de Returnare',
      file: 'Politica_Retur.pdf', // ✅ Schimbat la .pdf
      icon: <FileText style={{ width: '1rem', height: '1rem' }} />
    },
    {
      name: 'Politica de Confidențialitate',
      file: 'Politica_Confidentialitate.pdf', // ✅ Schimbat la .pdf
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
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
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
    }
  };

  const handleDocumentClick = (fileName) => {
    // Pentru PDF-uri: deschide într-o pagină nouă
    const fileUrl = `/documents/${fileName}`;
    
    // Deschide PDF-ul într-un tab nou ca viewer în browser
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
                    
          <div style={footerStyles.logoSection}>
            {/* Logo-uri ANPC cu linkuri */}
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
            
            {/* Logo NTP */}
            <div style={footerStyles.ntpContainer}>
              <NTPLogo 
                color="#ffffff" 
                version="orizontal" 
                secret="154714" 
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;