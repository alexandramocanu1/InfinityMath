import React from 'react';

const CulegerePage = () => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <div className="culegere-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Imaginea în stânga */}
        <div className="image-container" style={{
          position: 'sticky',
          top: '2rem'
        }}>
          <img 
            src="/images/culegere.png" 
            alt="Culegere de Matematică"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback pentru imagine */}
          <div style={{
            width: '100%',
            height: '500px',
            backgroundColor: '#f7fafc',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#718096',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Culegere de Matematică</p>
            <p style={{ fontSize: '0.9rem' }}>Imaginea se va încărca aici</p>
          </div>
        </div>

        {/* Textul în dreapta */}
        <div className="content-container" style={{
          padding: '1rem 0',
          fontFamily: "'Poppins', sans-serif"
        }}>
          <h1 className="main-title" style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '1rem',
            fontFamily: "'Poppins', sans-serif",
            lineHeight: '1.2'
          }}>
            Matematică - Teste pentru Evaluarea Națională
          </h1>
          
          <p className="subtitle" style={{
            fontSize: '1.1rem',
            color: '#718096',
            marginBottom: '2rem',
            fontWeight: '500'
          }}>
            Clasa a VIII-a • Ediția 2025 - 2026
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h2 className="section-title" style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '1rem',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Ce conține culegerea:
            </h2>

            <div className="features" style={{
              fontSize: '1rem',
              lineHeight: '1.7',
              color: '#2d3748',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '1.5rem'
            }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                <strong>Teste pentru Evaluarea Națională</strong><br />
                Simulări complete pentru pregătirea examenului de clasa a VIII-a
              </p>
              
              <p style={{ margin: '0 0 1rem 0' }}>
                <strong>Soluții detaliate</strong><br />
                Rezolvări pas cu pas pentru toate testele incluse
              </p>
              
              <p style={{ margin: '0' }}>
                <strong>Structură oficială</strong><br />
                Respectă formatul și cerințele Evaluării Naționale 2025
              </p>
            </div>
          </div>

          <div className="cta-container" style={{ marginBottom: '2rem' }}>
            <a 
              href="https://www.editurauniversitara.ro/preuniversitaria-1/matematic%C4%83-teste-pentru-evaluarea-na%C5%A3ional%C4%83-clasa-a-viii-a.html?srsltid=AfmBOoqptyyecK3_33ffVjX90oklfU_OYT-FMxd6jtXCMeZYGu-Nvpgf"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #15803d, #16a34a)',
                color: 'white',
                textDecoration: 'none',
                padding: '1.25rem 2.5rem',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 24px rgba(21, 128, 61, 0.3)',
                fontFamily: "'Poppins', sans-serif",
                textAlign: 'center',
                width: 'auto'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 10px 32px rgba(21, 128, 61, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 24px rgba(21, 128, 61, 0.3)';
              }}
            >
              Cumpără acum
            </a>
          </div>
        </div>
      </div>

      {/* CSS Responsive complet */}
      <style>
        {`
          /* Import Poppins font */
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
          
          /* Aplicare globală Poppins */
          * {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
          }
          /* Tablete (768px - 1024px) */
          @media (max-width: 1024px) {
            .culegere-container {
              grid-template-columns: 300px 1fr !important;
              gap: 2rem !important;
            }
            
            .main-title {
              font-size: 2.2rem !important;
            }
            
            .section-title {
              font-size: 1.4rem !important;
            }
          }

          /* Mobile mare (481px - 768px) */
          @media (max-width: 768px) {
            .culegere-container {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
            
            .image-container {
              position: static !important;
              order: 1;
            }
            
            .content-container {
              order: 2;
              padding: 0 !important;
            }
            
            .main-title {
              font-size: 2rem !important;
              text-align: center;
              margin-bottom: 1.5rem !important;
            }
            
            .subtitle {
              text-align: center;
              font-size: 1rem !important;
            }
            
            .section-title {
              font-size: 1.3rem !important;
              text-align: center;
            }
            
            .features {
              font-size: 0.95rem !important;
            }
            
            .cta-container {
              text-align: center;
            }
            
            .cta-button {
              padding: 1rem 2rem !important;
              font-size: 1.1rem !important;
              width: 100% !important;
              max-width: 300px;
            }
          }

          /* Mobile mic (max 480px) */
          @media (max-width: 480px) {
            div[style*="padding: '1rem'"] {
              padding: 0.5rem !important;
            }
            
            .main-title {
              font-size: 1.8rem !important;
              line-height: 1.3 !important;
              margin-bottom: 1rem !important;
            }
            
            .subtitle {
              font-size: 0.9rem !important;
              margin-bottom: 1.5rem !important;
            }
            
            .section-title {
              font-size: 1.2rem !important;
              margin-bottom: 0.8rem !important;
            }
            
            .features {
              font-size: 0.9rem !important;
              line-height: 1.6 !important;
            }
            
            .features p {
              margin-bottom: 1.2rem !important;
            }
            
            .cta-button {
              padding: 0.9rem 1.5rem !important;
              font-size: 1rem !important;
              border-radius: 10px !important;
            }
            
            /* Ajustare imagine pe mobile foarte mic */
            .image-container img,
            .image-container > div {
              border-radius: 12px !important;
              height: 350px !important;
            }
          }

          /* Extra mic (max 360px) */
          @media (max-width: 360px) {
            .main-title {
              font-size: 1.6rem !important;
            }
            
            .features {
              font-size: 0.85rem !important;
            }
            
            .cta-button {
              font-size: 0.95rem !important;
              padding: 0.8rem 1.2rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CulegerePage;