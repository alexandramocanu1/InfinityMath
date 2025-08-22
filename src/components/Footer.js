import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

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
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '0.875rem',
      color: '#9ca3af',
      textAlign: 'center'
    },
    copyright: {
      margin: 0
    }
  };

  const handleDocumentClick = (fileName) => {
    window.open(`/documents/${fileName}`, '_blank');
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

        {/* <div style={footerStyles.divider}></div>

        <div style={footerStyles.bottom}>
          <p style={footerStyles.copyright}>
            © 2025 Infinity Math. Toate drepturile rezervate.
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;