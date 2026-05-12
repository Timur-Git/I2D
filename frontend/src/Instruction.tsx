// src/Instruction.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const Instruction: React.FC = () => {
  const navigate = useNavigate();

  // Данные для шагов инструкции
  const steps = [
    {
      number: "01",
      title: "Создайте аккаунт",
      description: "Когда вы создаете учетную запись i2D, мы запрашиваем некоторую персональную информацию. Регистрируясь, вы даёте нам право на обработку ваших персональных данных.",
      instructions: [
        "Нажмите кнопку \"Создать аккаунт\" в шапке.",
        "Введите свой адрес электронной почты.",
        "В поле \"Имя аккаунта\" введите свое имя.",
        "Введите и подтвердите свой пароль.",
        "Нажмите \"Создать аккаунт\"."
      ],
      buttonText: "Создать аккаунт",
      buttonLink: "/register"
    },
    {
      number: "02",
      title: "Загрузите свою фотографию",
      description: "Lorem ipsum dolor sit amet consectetur. Venenatis turpis neque nec purus faucibus aliquam scelerisque condimentum ac. Suscipit urna nibh amet fames urna quis fringilla congue. Facilisi leo quam justo senectus ultrices sed in dignissim maecenas. Amet mattis lorem gravida faucibus elit eu. In ac faucibus habitant elit. Scelerisque aliquam curabitur turpis nibh sed feugiat in vestibulum viverra. Sapien ac tortor arcu in feugiat lacus adipiscing.",
      buttonText: "Загрузить фото",
      buttonLink: "#"
    },
    {
      number: "03",
      title: "Нажмите на кнопку сгенерировать",
      description: "Lorem ipsum dolor sit amet consectetur. Donec donec vitae consectetur adipiscing senectus gravida. Hac nisl blandit arcu diam pretium orci nisi id volutpat. Sit placerat dolor eget leo tellus quis congue tellus diam. Eu arcu pharetra fringilla elit convallis odio. Tempor enim commodo fringilla aliquet eget. Velit amet non aliquam a. Odio consequat sed diam consectetur netus.",
      buttonText: "GENERATE",
      buttonLink: "#"
    },
    {
      number: "04",
      title: "Получите готовый результат",
      description: "Lorem ipsum dolor sit amet consectetur. Ac interdum eget suspendisse ut in molestie luctus. Egestas vitae morbi lobortis sit sit commodo. Massa risus vitae lorem nulla tincidunt mauris diam aliquet. In ut et dictumst aenean proin. Vel vitae ipsum lacus neque eleifend. Purus non mi nibh nisl orci. Ut vitae purus tempus ultricies massa habitant.",
      buttonText: "Ask to edit",
      buttonLink: "#"
    }
  ];

  return (
    <>
      {/* Навигация (копия из App.tsx) */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="logo">
              <svg width="134" height="38" viewBox="0 0 134 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.9133 2.74019L43.8265 15.9713V24.7655L21.9133 38L0 24.7655V15.9713L21.9133 2.74019Z" fill="#A5B4FC"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M0 15.9713L21.9133 2.74019L43.8265 15.9713V24.7655L21.9133 38L0 24.7655V15.9713ZM21.9132 32.3858L39.178 21.9587V18.7791L39.1771 18.7786L21.9132 29.2024L4.64934 18.7786L4.6485 21.9587L21.9132 32.3858ZM21.9132 24.3409L35.1504 16.3484L31.9257 14.4022L21.9132 20.4478L11.9007 14.4022L8.67608 16.3484L21.9132 24.3409ZM21.9132 15.5862L27.899 11.972L21.9132 8.35943L15.9274 11.972L21.9132 15.5862Z" fill="#651FFF"/>
                <path d="M21.9133 2.74019L0 15.9713V24.7655L21.9133 38V2.74019Z" fill="#A5B4FC" fillOpacity="0.3"/>
                <path d="M67.192 6.5281V2.17603L69.3435 4.35207V6.5281H67.192ZM67.192 19.5843V15.2322L69.3435 17.4083V19.5843H67.192ZM67.192 23.9364V19.5843L69.3435 21.7603V23.9364H67.192ZM67.192 28.2884V23.9364L69.3435 26.1124V28.2884H67.192ZM67.192 32.6405V28.2884L69.3435 30.4645V32.6405H67.192ZM56.4346 36.9926V2.17603L58.5861 0H69.3435V2.17603H58.5861V8.70414H65.0406V6.5281H67.192L69.3435 8.70414H67.192L65.0406 10.8802H67.192L69.3435 13.0562V15.2322H67.192V13.0562H58.5861V34.8165H67.192V32.6405L69.3435 34.8165L67.192 36.9926H56.4346Z" fill="#651FFF"/>
                <path d="M97.9459 15.2322V13.0562L100.097 15.2322H97.9459ZM67.8252 34.8165V30.4645L69.9766 28.2884V26.1124H72.1281L74.2796 23.9364V21.7603H78.5826L80.734 19.5843V17.4083H82.8855L85.037 15.2322V13.0562H82.8855V15.2322L80.734 17.4083H69.9766V8.70414L72.1281 6.5281V4.35207H76.4311L78.5826 2.17603H93.6429V4.35207H95.7944L97.9459 6.5281V8.70414L100.097 10.8802H97.9459L95.7944 8.70414V6.5281H93.6429L91.4915 4.35207H78.5826V6.5281H74.2796L72.1281 8.70414V15.2322H80.734V13.0562L82.8855 10.8802H87.1885V15.2322L85.037 17.4083V19.5843H82.8855L80.734 21.7603V23.9364H76.4311L74.2796 26.1124V28.2884H72.1281L69.9766 30.4645V34.8165H97.9459L100.097 36.9926H69.9766L67.8252 34.8165ZM89.34 26.1124L91.4915 23.9364V21.7603H93.6429L95.7944 19.5843V17.4083H97.9459L100.097 19.5843H97.9459L95.7944 21.7603V23.9364H93.6429L91.4915 26.1124H97.9459L100.097 28.2884H91.4915L89.34 26.1124ZM97.9459 32.6405V30.4645L100.097 32.6405H97.9459Z" fill="#651FFF"/>
                <path d="M131.849 15.2322V10.8802L134 13.0562V15.2322H131.849ZM131.849 19.5843V15.2322L134 17.4083V19.5843H131.849ZM131.849 23.9364V19.5843L134 21.7603V23.9364H131.849ZM131.849 28.2884V23.9364L134 26.1124V28.2884H131.849ZM114.637 26.1124H118.94V23.9364L121.091 21.7603V17.4083L118.94 15.2322V13.0562H114.637V26.1124ZM101.728 36.9926V2.17603H123.243L125.394 4.35207H129.697V6.5281L131.849 8.70414H134V10.8802H129.697V8.70414L127.546 6.5281H123.243V4.35207H103.879V34.8165H125.394V32.6405H129.697V28.2884H131.849L134 30.4645H131.849V34.8165H127.546L125.394 36.9926H101.728ZM112.485 28.2884V10.8802H118.94L121.091 13.0562V15.2322L123.243 17.4083V21.7603L121.091 23.9364V26.1124L118.94 28.2884H112.485Z" fill="#651FFF"/>
              </svg>
            </Link>
            <Link to="/instruction" className="nav-link">Инструкция</Link>
          </div>
          <div className="nav-buttons">
            <button onClick={() => navigate('/login')} className="nav-button nav-button-outline">Войти</button>
            <button onClick={() => navigate('/register')} className="nav-button nav-button-primary">Создать аккаунт</button>
          </div>
        </div>
      </nav>

      {/* Основной контент страницы инструкции */}
      <div className="main-content" style={{ backgroundColor: '#f8f9ff' }}>
        {/* Hero секция инструкции */}
        <header className="hero" style={{ paddingBottom: '40px' }}>
          <div className="container">
            <h1 className="hero-title">Узнайте, как использовать наш сервис шаг за шагом</h1>
            <p className="hero-description">
              Lorem ipsum dolor sit amet consectetur. Eget dolor id non nisi tellus vel cras ultricies. Ornare nunc vitae interdum risus nulla auctor ultricies.
            </p>
            <button onClick={() => navigate('/register')} className="button button-primary">Начать</button>
          </div>
        </header>

        {/* Шаги инструкции */}
        <section className="how-it-works" style={{ paddingTop: '40px' }}>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="instruction-step" style={{ marginBottom: '80px' }}>
                <div className="step-header" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                  <div className="step-icon" style={{ width: '64px', height: '64px', fontSize: '24px', margin: '0' }}>
                    {step.number}
                  </div>
                  <h2 className="step-title" style={{ marginBottom: '0', textAlign: 'left' }}>
                    {step.title}
                  </h2>
                </div>
                
                <p className="step-description" style={{ maxWidth: '100%', textAlign: 'left', marginBottom: '24px', fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
                  {step.description}
                </p>

                {/* Список инструкций для первого шага */}
                {step.instructions && (
                  <ul className="instruction-list" style={{ marginBottom: '32px', paddingLeft: '24px' }}>
                    {step.instructions.map((instruction, i) => (
                      <li key={i} style={{ marginBottom: '12px', fontFamily: 'Rubik', fontSize: '15px', color: '#444', lineHeight: '1.5' }}>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Кнопка действия */}
                <button 
                  onClick={() => navigate(step.buttonLink)} 
                  className="cta-button" 
                  style={{ 
                    padding: '12px 32px', 
                    fontSize: '16px',
                    backgroundColor: step.buttonText === 'GENERATE' ? '#1a1a1a' : undefined,
                    boxShadow: step.buttonText === 'GENERATE' ? 'none' : undefined
                  }}
                >
                  {step.buttonText}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Секция CTA внизу */}
        <section className="cta" style={{ paddingTop: '40px' }}>
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">Готовы начать?</h2>
              <p className="cta-description">Генерация заголовка и описания для товаров</p>
            </div>
            <button onClick={() => navigate('/register')} className="cta-button">Создать аккаунт</button>
          </div>
        </section>
      </div>

      {/* Футер (копия из App.tsx) */}
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

export default Instruction;