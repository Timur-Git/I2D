import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getCurrentPage = () => {
    if (location.pathname === '/register') return 'register';
    if (location.pathname === '/forgot-password') return 'forgot';
    return 'login';
  };

  const [currentPage] = useState(getCurrentPage());
  const [email, setEmail] = useState('');
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage === 'register') {
      if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      alert('Регистрация успешна!');
      navigate('/login');
    } else if (currentPage === 'login') {
      alert('Вход выполнен!');
      navigate('/');
    } else {
      alert('Письмо отправлено на email');
      navigate('/login');
    }
  };

  return (
    <div className="auth-layout">
      {/* Левая часть с логотипом I2D */}
      <div className="auth-brand">
        <svg width="300" height="84" viewBox="0 0 300 84" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M49.0597 6.05727L98.1189 35.3049V54.7448L49.0597 84L0 54.7448V35.3051L49.0597 6.05727Z" fill="#A5B4FC"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M0 35.3051L49.0597 6.05727L98.1189 35.3049V54.7448L49.0597 84L0 54.7448V35.3051ZM49.0595 71.5896L87.7118 48.5403V41.5117L87.7099 41.5105L49.0595 64.5527L10.409 41.5105L10.4071 48.5403L49.0595 71.5896ZM49.0595 53.8062L78.6949 36.1385L71.4755 31.8364L49.0595 45.2003L26.6434 31.8364L19.4241 36.1385L49.0595 53.8062ZM49.0595 34.4538L62.4605 26.4644L49.0595 18.4787L35.6584 26.4644L49.0595 34.4538Z" fill="#651FFF"/>
          <path d="M49.0597 6.05727L0 35.3051V54.7448L49.0597 84V6.05727Z" fill="#A5B4FC" fillOpacity="0.3"/>
          <path d="M150.43 14.4305V4.81018L155.247 9.62036V14.4305H150.43ZM150.43 43.2916V33.6713L155.247 38.4814V43.2916H150.43ZM150.43 52.912V43.2916L155.247 48.1018V52.912H150.43ZM150.43 62.5323V52.912L155.247 57.7222V62.5323H150.43ZM150.43 72.1527V62.5323L155.247 67.3425V72.1527H150.43ZM126.346 81.7731V4.81018L131.163 0H155.247V4.81018H131.163V19.2407H145.613V14.4305H150.43L155.247 19.2407H150.43L145.613 24.0509H150.43L155.247 28.8611V33.6713H150.43V28.8611H131.163V76.9629H150.43V72.1527L155.247 76.9629L150.43 81.7731H126.346Z" fill="#651FFF"/>
          <path d="M219.282 33.6713V28.8611L224.099 33.6713H219.282ZM151.847 76.9629V67.3425L156.664 62.5323V57.7222H161.481L166.298 52.912V48.1018H175.931L180.748 43.2916V38.4814H185.565L190.381 33.6713V28.8611H185.565V33.6713L180.748 38.4814H156.664V19.2407L161.481 14.4305V9.62036H171.114L175.931 4.81018H209.648V9.62036H214.465L219.282 14.4305V19.2407L224.099 24.0509H219.282L214.465 19.2407V14.4305H209.648L204.832 9.62036H175.931V14.4305H166.298L161.481 19.2407V33.6713H180.748V28.8611L185.565 24.0509H195.198V33.6713L190.381 38.4814V43.2916H185.565L180.748 48.1018V52.912H171.114L166.298 57.7222V62.5323H161.481L156.664 67.3425V76.9629H219.282L224.099 81.7731H156.664L151.847 76.9629ZM200.015 57.7222L204.832 52.912V48.1018H209.648L214.465 43.2916V38.4814H219.282L224.099 43.2916H219.282L214.465 48.1018V52.912H209.648L204.832 57.7222H219.282L224.099 62.5323H204.832L200.015 57.7222ZM219.282 72.1527V67.3425L224.099 72.1527H219.282Z" fill="#651FFF"/>
          <path d="M295.183 33.6713V24.0509L300 28.8611V33.6713H295.183ZM295.183 43.2916V33.6713L300 38.4814V43.2916H295.183ZM295.183 52.912V43.2916L300 48.1018V52.912H295.183ZM295.183 62.5323V52.912L300 57.7222V62.5323H295.183ZM256.649 57.7222H266.283V52.912L271.1 48.1018V38.4814L266.283 33.6713V28.8611H256.649V57.7222ZM227.749 81.7731V4.81018H275.916L280.733 9.62036H290.367V14.4305L295.183 19.2407H300V24.0509H290.367V19.2407L285.55 14.4305H275.916V9.62036H232.566V76.9629H280.733V72.1527H290.367V62.5323H295.183L300 67.3425H295.183V76.9629H285.55L280.733 81.7731H227.749ZM251.833 62.5323V24.0509H266.283L271.1 28.8611V33.6713L275.916 38.4814V48.1018L271.1 52.912V57.7222L266.283 62.5323H251.833Z" fill="#651FFF"/>
        </svg>
      </div>

      {/* Правая часть с формами */}
      <div className="auth-form-wrapper">
        
        {/* Форма входа - по дизайну */}
        {currentPage === 'login' && (
          <div className="auth-form">
            <h2 className="form-question">ВЫ, nickname?</h2>
            <p className="form-hint">Введите пароль от аккаунта</p>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                className="auth-input"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="auth-btn">
                Войти
              </button>
            </form>

            <div className="form-footer">
              <button onClick={() => navigate('/forgot-password')} className="footer-link">
                Забыли пароль?
              </button>
            </div>
          </div>
        )}

        {/* Форма регистрации */}
        {currentPage === 'register' && (
          <div className="auth-form">
            <h2 className="form-question">Создать аккаунт</h2>
            <p className="form-hint">Пожалуйста, пройдите регистрацию</p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="auth-input"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="text"
                className="auth-input"
                placeholder="Имя аккаунта"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />

              <input
                type="password"
                className="auth-input"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                className="auth-input"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <p className="terms-text">
                Нажимая на кнопку "Создать аккаунт", вы соглашаетесь с условиями предоставления услуг и политикой конфиденциальности.
              </p>

              <button type="submit" className="auth-btn">
                Создать аккаунт
              </button>
            </form>

            <div className="form-footer">
              <button onClick={() => navigate('/login')} className="footer-link">
                Уже есть аккаунт? Войти
              </button>
            </div>
          </div>
        )}

        {/* Форма восстановления пароля - по дизайну */}
        {currentPage === 'forgot' && (
          <div className="auth-form">
            <h2 className="form-question">Забыли пароль?</h2>
            <p className="form-hint">Получите письмо с новым паролем</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="auth-input"
                placeholder="Введите вашу логин"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" className="auth-btn">
                Отправить
              </button>
            </form>

            <div className="form-footer">
              <button onClick={() => navigate('/login')} className="footer-link">
                Вспомнили пароль? Войти.
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;