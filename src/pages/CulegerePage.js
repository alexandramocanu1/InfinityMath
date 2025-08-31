import React from 'react';

const CulegerePage = () => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '1.5rem 1rem' // Redus de la 3rem la 1.5rem
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Imaginea în stânga */}
        <div style={{
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
        <div style={{
          padding: '1rem 0', // Redus de la 2rem la 1rem
          fontFamily: "'Poppins', sans-serif"
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '1rem',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Matematică - Teste pentru Evaluarea Națională
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#718096',
            marginBottom: '2rem',
            fontWeight: '500'
          }}>
            Clasa a VIII-a • Ediția 2025 - 2026
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '1rem',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Ce conține culegerea:
            </h2>

            <div style={{
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

          <div style={{ marginBottom: '2rem' }}>
                       
            <a 
              href="https://www.editurauniversitara.ro/preuniversitaria-1/matematic%C4%83-teste-pentru-evaluarea-na%C5%A3ional%C4%83-clasa-a-viii-a.html?srsltid=AfmBOoqptyyecK3_33ffVjX90oklfU_OYT-FMxd6jtXCMeZYGu-Nvpgf"
              target="_blank"
              rel="noopener noreferrer"
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
                fontFamily: "'Poppins', sans-serif"
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

      {/* Responsive pentru mobile */}
      <style>
        {`
          @media (max-width: 768px) {
            .culegere-container {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CulegerePage;