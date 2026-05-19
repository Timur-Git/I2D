import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  // Логотип
  const Logo = () => (
    <svg width="135" height="38" viewBox="0 0 135 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.0001 2.72L44 15.8536V24.583L22.0001 37.72L0 24.583V15.8537L22.0001 2.72Z" fill="#A5B4FC"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 15.8537L22.0001 2.72L44 15.8536V24.583L22.0001 37.72L0 24.583V15.8537ZM22 32.1471L39.3331 21.7969V18.6407L39.3322 18.6402L22 28.9872L4.66775 18.6402L4.6669 21.7969L22 32.1471ZM22 24.1615L35.2896 16.2279L32.0522 14.2961L22 20.2971L11.9478 14.2961L8.71043 16.2279L22 24.1615ZM22 15.4714L28.0095 11.8838L22 8.29784L15.9905 11.8838L22 15.4714Z" fill="#651FFF"/>
      <path d="M22.0001 2.72L0 15.8537V24.583L22.0001 37.72V2.72Z" fill="#A5B4FC" fillOpacity="0.3"/>
      <path d="M67.4581 6.48V2.16L69.6181 4.32V6.48H67.4581ZM67.4581 19.44V15.12L69.6181 17.28V19.44H67.4581ZM67.4581 23.76V19.44L69.6181 21.6V23.76H67.4581ZM67.4581 28.08V23.76L69.6181 25.92V28.08H67.4581ZM67.4581 32.4V28.08L69.6181 30.24V32.4H67.4581ZM56.6581 36.72V2.16L58.8181 0H69.6181V2.16H58.8181V8.64H65.2981V6.48H67.4581L69.6181 8.64H67.4581L65.2981 10.8H67.4581L69.6181 12.96V15.12H67.4581V12.96H58.8181V34.56H67.4581V32.4L69.6181 34.56L67.4581 36.72H56.6581Z" fill="#651FFF"/>
      <path d="M98.3337 15.12V12.96L100.494 15.12H98.3337ZM68.0938 34.56V30.24L70.2537 28.08V25.92H72.4137L74.5737 23.76V21.6H78.8937L81.0537 19.44V17.28H83.2138L85.3737 15.12V12.96H83.2138V15.12L81.0537 17.28H70.2537V8.64L72.4137 6.48V4.32H76.7337L78.8937 2.16H94.0137V4.32H96.1738L98.3337 6.48V8.64L100.494 10.8H98.3337L96.1738 8.64V6.48H94.0137L91.8538 4.32H78.8937V6.48H74.5737L72.4137 8.64V15.12H81.0537V12.96L83.2138 10.8H87.5338V15.12L85.3737 17.28V19.44H83.2138L81.0537 21.6V23.76H76.7337L74.5737 25.92V28.08H72.4137L70.2537 30.24V34.56H98.3337L100.494 36.72H70.2537L68.0938 34.56ZM89.6937 25.92L91.8538 23.76V21.6H94.0137L96.1738 19.44V17.28H98.3337L100.494 19.44H98.3337L96.1738 21.6V23.76H94.0137L91.8538 25.92H98.3337L100.494 28.08H91.8538L89.6937 25.92ZM98.3337 32.4V30.24L100.494 32.4H98.3337Z" fill="#651FFF"/>
      <path d="M132.371 15.12V10.8L134.531 12.96V15.12H132.371ZM132.371 19.44V15.12L134.531 17.28V19.44H132.371ZM132.371 23.76V19.44L134.531 21.6V23.76H132.371ZM132.371 28.08V23.76L134.531 25.92V28.08H132.371ZM115.091 25.92H119.411V23.76L121.571 21.6V17.28L119.411 15.12V12.96H115.091V25.92ZM102.131 36.72V2.16H123.731L125.891 4.32H130.211V6.48L132.371 8.64H134.531V10.8H130.211V8.64L128.051 6.48H123.731V4.32H104.291V34.56H125.891V32.4H130.211V28.08H132.371L134.531 30.24H132.371V34.56H128.051L125.891 36.72H102.131ZM112.931 28.08V10.8H119.411L121.571 12.96V15.12L123.731 17.28V21.6L121.571 23.76V25.92L119.411 28.08H112.931Z" fill="#651FFF"/>
    </svg>
  );

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F9F9FA',
      fontFamily: 'Rubik, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Навбар как на главной */}
      <nav style={{
        backgroundColor: '#F9F9FA',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Logo />
            </Link>
            <Link to="/instruction" style={{
              fontFamily: 'Rubik',
              textDecoration: 'none',
              color: '#666',
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#651FFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
              Инструкция
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => navigate('/login')} style={{
              fontFamily: 'Rubik',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: 'transparent',
              color: '#333',
              border: '2px solid #333'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#333';
            }}>
              Войти
            </button>
            <button onClick={() => navigate('/register')} style={{
              fontFamily: 'Rubik',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: '#651FFF',
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5200e6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#651FFF'}>
              Создать аккаунт
            </button>
          </div>
        </div>
      </nav>

      {/* Основной контент 404 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        backgroundColor: '#F9F9FA'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          {/* Большая цифра 404 */}
          <h1 style={{
            fontFamily: 'Rubik',
            fontSize: '120px',
            fontWeight: 700,
            color: '#651FFF',
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-0.02em'
          }}>
            404
          </h1>

          {/* Заголовок */}
          <h2 style={{
            fontFamily: 'Rubik',
            fontSize: '32px',
            fontWeight: 600,
            color: '#1a1a1a',
            marginTop: '24px',
            marginBottom: '16px'
          }}>
            Ой! Страница не найдена.
          </h2>

          {/* Описание */}
          <p style={{
            fontFamily: 'Rubik',
            fontSize: '16px',
            color: '#666',
            lineHeight: 1.6,
            marginBottom: '32px'
          }}>
            Приносим свои извинения! Страница, которую вы запрашивали, не найдена. 
            Пожалуйста, вернитесь на главную страницу.
          </p>

          {/* Кнопка "Главная" */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{
              fontFamily: 'Rubik',
              display: 'inline-block',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: '#651FFF',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(101, 31, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5200e6';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(101, 31, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#651FFF';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(101, 31, 255, 0.3)';
            }}>
              Главная
            </button>
          </Link>
        </div>
      </div>

      {/* Футер как на главной */}
      <footer style={{
        backgroundColor: '#1A284E',
        color: 'white',
        padding: '60px 0 40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '40px'
        }}>
          <div style={{
            flex: 1,
            maxWidth: '400px'
          }}>
            <h3 style={{
              fontFamily: 'Rubik',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              color: 'white'
            }}>
              Что такое i2D?
            </h3>
            <p style={{
              fontFamily: 'Rubik',
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: '24px',
              letterSpacing: '-0.02em',
              color: 'white',
              marginBottom: '32px'
            }}>
              Lorem ipsum dolor sit amet consectetur. Tempus nisl praesent a eget vitae nunc pulvinar phasellus. 
              Eleifend pulvinar suscipit accumsan at enim sed nulla nec. Amet semper nisl arcu in cursus nisl vel.
            </p>
            <div style={{
              fontFamily: 'Rubik',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: 'white'
            }}>
              <p>© 2026 i2D.</p>
            </div>
          </div>
          <div style={{
            textAlign: 'right'
          }}>
            <h3 style={{
              fontFamily: 'Rubik',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              color: 'white'
            }}>
              Наши ссылки
            </h3>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end',
              marginTop: '16px'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#231E1B',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" fill="white"/>
                </svg>
              </div>
              <div style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#0077FF',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.5 0H1.5C0.67 0 0 0.67 0 1.5V14.5C0 15.33 0.67 16 1.5 16H14.5C15.33 16 16 15.33 16 14.5V1.5C16 0.67 15.33 0 14.5 0ZM4.75 13.5H2.5V5.5H4.75V13.5ZM3.5 4.5C2.67 4.5 2 3.83 2 3C2 2.17 2.67 1.5 3.5 1.5C4.33 1.5 5 2.17 5 3C5 3.83 4.33 4.5 3.5 4.5ZM13.5 13.5H11.25V9.25C11.25 8.28 10.22 8 9.75 8C9.28 8 8.5 8.28 8.5 9.25V13.5H6.25V5.5H8.5V6.5C8.5 6.5 9.5 5.5 11 5.5C12.5 5.5 13.5 6.5 13.5 8.5V13.5Z" fill="white"/>
                </svg>
              </div>
              <div style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#27A6E5',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M16 3C15.4 3.3 14.8 3.4 14.1 3.5C14.8 3.1 15.3 2.5 15.5 1.7C14.9 2.1 14.2 2.3 13.5 2.5C12.8 1.8 11.9 1.3 10.8 1.3C8.8 1.3 7.1 3 7.1 5C7.1 5.3 7.1 5.6 7.2 5.9C4.7 5.8 2.4 4.5 0.8 2.5C0.4 3.1 0.2 3.8 0.2 4.5C0.2 5.9 0.9 7.1 2 7.8C1.5 7.8 1 7.6 0.5 7.4C0.5 7.4 0.5 7.4 0.5 7.5C0.5 9.3 1.8 10.8 3.5 11.2C3.1 11.3 2.7 11.3 2.3 11.3C2 11.3 1.7 11.3 1.5 11.2C2 12.7 3.4 13.8 5 13.8C3.7 14.8 2.1 15.4 0.3 15.4C0 15.4 -0.3 15.4 -0.5 15.4C1.2 16.5 3.1 17 5.1 17C10.8 17 14 12.2 14 7.9C14 7.7 14 7.6 14 7.4C14.7 6.9 15.3 6.2 15.8 5.5C15.2 5.8 14.5 5.9 13.9 6C14.6 5.6 15.1 5 15.3 4.2C14.6 4.6 13.9 4.8 13.1 4.9C13.9 4.4 14.5 3.6 14.7 2.6C14.6 2.9 13.9 3.2 13.5 3.5C13.1 3.8 12.6 4 12.1 4.1C11.4 3.3 10.3 2.8 9.1 2.8C6.7 2.8 4.7 4.8 4.7 7.2C4.7 7.5 4.7 7.8 4.8 8.1C3.1 8 1.5 7.2 0.3 5.9C0 6.4 -0.2 7 -0.2 7.6C-0.2 9.4 0.8 11 2.2 12C1.8 12 1.4 11.9 1 11.8C1 11.9 1 12 1 12.1C1 13.9 2.3 15.4 4 15.9C3.6 16 3.1 16 2.7 16C2.4 16 2.1 16 1.8 15.9C2.2 17.3 3.6 18.3 5.2 18.3C3.7 19.5 1.9 20.1 0 20.1C-0.3 20.1 -0.6 20.1 -0.9 20.1C0.9 21.3 3.1 22 5.4 22C10.7 22 13.6 17.5 13.6 13.5C13.6 13.4 13.6 13.2 13.6 13.1C14.2 12.7 14.8 12.2 15.2 11.6C14.7 11.9 14.1 12.1 13.5 12.2C14.1 11.8 14.6 11.3 15 10.7C14.4 11.1 13.8 11.4 13.1 11.5C14.5 10.5 15.5 9 15.8 7.3C15.1 8 14.3 8.5 13.5 8.8C13.4 8.9 13.2 8.9 13 8.9C12.6 8.9 12.2 8.7 11.9 8.4C11.6 8.1 11.5 7.7 11.5 7.3C11.5 6.4 12 5.6 12.7 5.2C13.5 4.8 14.4 4.9 15.1 5.2C15.1 4.6 15.1 4 14.9 3.4C14.8 2.9 14.5 2.5 14.1 2.2C14.2 2.3 14.3 2.6 14.4 2.9C14.5 3.2 14.6 3.5 14.7 3.8C15.2 3.5 15.6 3.1 16 2.6C15.9 2.8 15.8 2.9 15.7 3C15.6 3.1 15.5 3.2 15.4 3.3C15.3 3.2 15.2 3.1 15.1 3C15 2.9 14.9 2.8 14.8 2.7C14.9 2.6 15 2.5 15.1 2.4C15.2 2.3 15.3 2.2 15.4 2.1C15.2 2.3 15 2.5 14.8 2.6C14.6 2.7 14.4 2.8 14.2 2.9C13.9 2.5 13.5 2.1 13 1.8C12.5 1.5 11.9 1.3 11.3 1.3C9.3 1.3 7.6 3 7.6 5C7.6 5.3 7.6 5.6 7.7 5.9C5.2 5.8 2.9 4.5 1.3 2.5C0.9 3.1 0.7 3.8 0.7 4.5C0.7 5.9 1.4 7.1 2.5 7.8C2 7.8 1.5 7.6 1 7.4C1 7.4 1 7.4 1 7.5C1 9.3 2.3 10.8 4 11.2C3.6 11.3 3.2 11.3 2.8 11.3C2.5 11.3 2.2 11.3 2 11.2C2.5 12.7 3.9 13.8 5.5 13.8C4.2 14.8 2.6 15.4 0.8 15.4C0.5 15.4 0.2 15.4 0 15.4C1.7 16.5 3.6 17 5.6 17C11.3 17 14.5 12.2 14.5 7.9C14.5 7.7 14.5 7.6 14.5 7.4C15.2 6.9 15.8 6.2 16.3 5.5C15.7 5.8 15 5.9 14.4 6C15.1 5.6 15.6 5 15.8 4.2C15.1 4.6 14.4 4.8 13.6 4.9C14.4 4.4 15 3.6 15.2 2.6C15.1 2.9 14.4 3.2 14 3.5C13.6 3.8 13.1 4 12.6 4.1C11.9 3.3 10.8 2.8 9.6 2.8C7.2 2.8 5.2 4.8 5.2 7.2C5.2 7.5 5.2 7.8 5.3 8.1C3.6 8 2 7.2 0.8 5.9C0.5 6.4 0.3 7 0.3 7.6C0.3 9.4 1.3 11 2.7 12C2.3 12 1.9 11.9 1.5 11.8C1.5 11.9 1.5 12 1.5 12.1C1.5 13.9 2.8 15.4 4.5 15.9C4.1 16 3.6 16 3.2 16C2.9 16 2.6 16 2.3 15.9C2.7 17.3 4.1 18.3 5.7 18.3C4.2 19.5 2.4 20.1 0.5 20.1C0.2 20.1 -0.1 20.1 -0.4 20.1C1.4 21.3 3.6 22 5.9 22C11.2 22 14.1 17.5 14.1 13.5C14.1 13.4 14.1 13.2 14.1 13.1C14.7 12.7 15.3 12.2 15.7 11.6C15.2 11.9 14.6 12.1 14 12.2C14.6 11.8 15.1 11.3 15.5 10.7C14.9 11.1 14.3 11.4 13.6 11.5C15 10.5 16 9 16.3 7.3C15.6 8 14.8 8.5 14 8.8C13.9 8.9 13.7 8.9 13.5 8.9C13.1 8.9 12.7 8.7 12.4 8.4C12.1 8.1 12 7.7 12 7.3C12 6.4 12.5 5.6 13.2 5.2C14 4.8 14.9 4.9 15.6 5.2C15.6 4.6 15.6 4 15.4 3.4C15.3 2.9 15 2.5 14.6 2.2C14.7 2.3 14.8 2.6 14.9 2.9C15 3.2 15.1 3.5 15.2 3.8C15.7 3.5 16.1 3.1 16.5 2.6C16.4 2.8 16.3 2.9 16.2 3C16.1 3.1 16 3.2 15.9 3.3C15.8 3.2 15.7 3.1 15.6 3C15.5 2.9 15.4 2.8 15.3 2.7C15.4 2.6 15.5 2.5 15.6 2.4C15.7 2.3 15.8 2.2 15.9 2.1C15.7 2.3 15.5 2.5 15.3 2.6C15.1 2.7 14.9 2.8 14.7 2.9C14.4 2.5 14 2.1 13.5 1.8C13 1.5 12.4 1.3 11.8 1.3C9.8 1.3 8.1 3 8.1 5C8.1 5.3 8.1 5.6 8.2 5.9C5.7 5.8 3.4 4.5 1.8 2.5C1.4 3.1 1.2 3.8 1.2 4.5C1.2 5.9 1.9 7.1 3 7.8C2.5 7.8 2 7.6 1.5 7.4Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default NotFound;