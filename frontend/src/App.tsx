import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './login';
import Instruction from './Instruction';
import AccountSettings from './AccountSettings';
import Generator from './Generator';
import GenerationHistory from './GenerationHistory';
import NotFound from './NotFound';

// Компонент логотипа
const Logo: React.FC = () => (
  <svg width="135" height="38" viewBox="0 0 135 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.0001 2.72L44 15.8536V24.583L22.0001 37.72L0 24.583V15.8537L22.0001 2.72Z" fill="#A5B4FC"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M0 15.8537L22.0001 2.72L44 15.8536V24.583L22.0001 37.72L0 24.583V15.8537ZM22 32.1471L39.3331 21.7969V18.6407L39.3322 18.6402L22 28.9872L4.66775 18.6402L4.6669 21.7969L22 32.1471ZM22 24.1615L35.2896 16.2279L32.0522 14.2961L22 20.2971L11.9478 14.2961L8.71043 16.2279L22 24.1615ZM22 15.4714L28.0095 11.8838L22 8.29784L15.9905 11.8838L22 15.4714Z" fill="#651FFF"/>
    <path d="M22.0001 2.72L0 15.8537V24.583L22.0001 37.72V2.72Z" fill="#A5B4FC" fillOpacity="0.3"/>
    <path d="M67.4581 6.48V2.16L69.6181 4.32V6.48H67.4581ZM67.4581 19.44V15.12L69.6181 17.28V19.44H67.4581ZM67.4581 23.76V19.44L69.6181 21.6V23.76H67.4581ZM67.4581 28.08V23.76L69.6181 25.92V28.08H67.4581ZM67.4581 32.4V28.08L69.6181 30.24V32.4H67.4581ZM56.6581 36.72V2.16L58.8181 0H69.6181V2.16H58.8181V8.64H65.2981V6.48H67.4581L69.6181 8.64H67.4581L65.2981 10.8H67.4581L69.6181 12.96V15.12H67.4581V12.96H58.8181V34.56H67.4581V32.4L69.6181 34.56L67.4581 36.72H56.6581Z" fill="#651FFF"/>
    <path d="M98.3337 15.12V12.96L100.494 15.12H98.3337ZM68.0938 34.56V30.24L70.2537 28.08V25.92H72.4137L74.5737 23.76V21.6H78.8937L81.0537 19.44V17.28H83.2138L85.3737 15.12V12.96H83.2138V15.12L81.0537 17.28H70.2537V8.64L72.4137 6.48V4.32H76.7337L78.8937 2.16H94.0137V4.32H96.1738L98.3337 6.48V8.64L100.494 10.8H98.3337L96.1738 8.64V6.48H94.0137L91.8538 4.32H78.8937V6.48H74.5737L72.4137 8.64V15.12H81.0537V12.96L83.2138 10.8H87.5338V15.12L85.3737 17.28V19.44H83.2138L81.0537 21.6V23.76H76.7337L74.5737 25.92V28.08H72.4137L70.2537 30.24V34.56H98.3337L100.494 36.72H70.2537L68.0938 34.56ZM89.6937 25.92L91.8538 23.76V21.6H94.0137L96.1738 19.44V17.28H98.3337L100.494 19.44H98.3337L96.1738 21.6V23.76H94.0137L91.8538 25.92H98.3337L100.494 28.08H91.8538L89.6937 25.92ZM98.3337 32.4V30.24L100.494 32.4H98.3337Z" fill="#651FFF"/>
    <path d="M132.371 15.12V10.8L134.531 12.96V15.12H132.371ZM132.371 19.44V15.12L134.531 17.28V19.44H132.371ZM132.371 23.76V19.44L134.531 21.6V23.76H132.371ZM132.371 28.08V23.76L134.531 25.92V28.08H132.371ZM115.091 25.92H119.411V23.76L121.571 21.6V17.28L119.411 15.12V12.96H115.091V25.92ZM102.131 36.72V2.16H123.731L125.891 4.32H130.211V6.48L132.371 8.64H134.531V10.8H130.211V8.64L128.051 6.48H123.731V4.32H104.291V34.56H125.891V32.4H130.211V28.08H132.371L134.531 30.24H132.371V34.56H128.051L125.891 36.72H102.131ZM112.931 28.08V10.8H119.411L121.571 12.96V15.12L123.731 17.28V21.6L121.571 23.76V25.92L119.411 28.08H112.931Z" fill="#651FFF"/>
  </svg>
);

const App: React.FC = () => {
  // Данные для плашек преимуществ
  const advantages = [
    {
      title: "Lorem ipsum",
      description: "Lorem ipsum dolor sit amet consectetur. Duis platea mi accumsan tristique cursus blandit lorem. Nec in sapien ipsum amet et."
    },
    {
      title: "Lorem ipsum",
      description: "Lorem ipsum dolor sit amet consectetur. Eu augue scelerisque arcu purus risus arcu nullam. Et fermentum bibendum quam semper ornare."
    },
    {
      title: "Lorem ipsum",
      description: "Lorem ipsum dolor sit amet consectetur. Dis pharetra tortor est aenean et duis pretium. Purus condimentum donec fames scelerisque nisi morbi egestas tempus at."
    }
  ];

  // Данные для шагов "Как это работает"
  const steps = [
    {
      number: "01",
      title: "Создайте аккаунт",
      description: "Создайте аккаунт, чтобы начать пользоваться нашим сервисом."
    },
    {
      number: "02",
      title: "Загрузите фото товара",
      description: "Загрузите фото вашего товара, затем нажмите кнопку сгенерировать и дождитесь результата."
    },
    {
      number: "03",
      title: "Получите готовый результат",
      description: "После некоторого времени, вы получите готовый заголовок и описания для товара, которые вы можете использовать для маркетплейсов."
    }
  ];

  const HomePage = () => {
    const navigate = useNavigate();
    
    return (
      <>
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-left">
              <Link to="/" className="logo">
                <Logo />
              </Link>
              <Link to="/instruction" className="nav-link">Инструкция</Link>
            </div>
            <div className="nav-buttons">
              <button onClick={() => navigate('/login')} className="nav-button nav-button-outline">Войти</button>
              <button onClick={() => navigate('/register')} className="nav-button nav-button-primary">Создать аккаунт</button>
            </div>
          </div>
        </nav>

        <div className="main-content">
          <header className="hero">
            <div className="container">
              <h1 className="hero-title">Генератор для описания товаров</h1>
              <p className="hero-description">
                i2D - это онлайн сервис, который позволит вам быстро сгенерировать название заголовки и описание к вашему товару по фото.
              </p>
              <button onClick={() => navigate('/register')} className="button button-primary">Начать</button>
            </div>
          </header>

          <section className="advantages">
            <div className="container">
              <h2 className="section-title">Наши преимущества</h2>
              <p className="section-subtitle">
                Lorem ipsum dolor sit amet consectetur. Sit sagittis mauris a mauris tellus a vel. Integer magna iaculis ultricies vitae eu massa viverra viverra.
              </p>
              <div className="advantages-grid">
                {advantages.map((item, index) => (
                  <div key={index} className="advantage-card">
                    <div className="advantage-icon">
                      <div className="icon-circle"></div>
                    </div>
                    <h3 className="advantage-title">{item.title}</h3>
                    <p className="advantage-description">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="how-it-works">
            <div className="steps-container">
              <h2 className="how-it-works-title">Как это работает?</h2>
              <p className="how-it-works-subtitle">
                Lorem ipsum dolor sit amet consectetur. Curabitur faucibus adipiscing quis nulla leo senectus rhoncus ut. A porttitor rutrum elementum neque ante mauris.
              </p>
              <div className="steps-wrapper">
                {steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-icon">{step.number}</div>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="cta">
            <div className="cta-container">
              <div className="cta-content">
                <h2 className="cta-title">Готовы начать?</h2>
                <p className="cta-description">Генерация заголовка и описания для товаров</p>
              </div>
              <button onClick={() => navigate('/register')} className="cta-button">Создать аккаунт</button>
            </div>
          </section>
        </div>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-left">
              <h3 className="footer-title">Что такое i2D?</h3>
              <p className="footer-description">
                Lorem ipsum dolor sit amet consectetur. Tempus nisl praesent a eget vitae nunc pulvinar phasellus. Eleifend pulvinar suscipit accumsan at enim sed nulla nec. Amet semper nisl arcu in cursus nisl vel.
              </p>
              <div className="footer-copyright">
                <p>© 2026 i2D.</p>
              </div>
            </div>
            <div className="footer-right">
              <h3 className="footer-links-title">Наши ссылки</h3>
              <div className="social-links">
                <div className="social-link github"></div>
                <div className="social-link linkedin"></div>
                <div className="social-link twitter"></div>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  };

  const InstructionPage = () => {
    const navigate = useNavigate();
    
    return (
      <>
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-left">
              <Link to="/" className="logo">
                <Logo />
              </Link>
              <Link to="/instruction" className="nav-link">Инструкция</Link>
            </div>
            <div className="nav-buttons">
              <button onClick={() => navigate('/login')} className="nav-button nav-button-outline">Войти</button>
              <button onClick={() => navigate('/register')} className="nav-button nav-button-primary">Создать аккаунт</button>
            </div>
          </div>
        </nav>
        
        <div className="main-content" style={{ minHeight: '60vh', padding: '80px 0' }}>
          <div className="container">
            <h1 className="hero-title">Инструкция по использованию</h1>
            <p className="hero-description">Здесь будет инструкция по работе с сервисом</p>
          </div>
        </div>
        
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-left">
              <h3 className="footer-title">Что такое i2D?</h3>
              <p className="footer-description">
                Lorem ipsum dolor sit amet consectetur. Tempus nisl praesent a eget vitae nunc pulvinar phasellus.
              </p>
              <div className="footer-copyright">
                <p>© 2026 i2D.</p>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/forgot-password" element={<Login />} />
        <Route path="/instruction" element={<Instruction />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/account" element={<GenerationHistory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;