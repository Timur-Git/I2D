// src/AccountSettings.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService, { UserProfile } from './services/auth.service';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  
  // Состояния для данных пользователя
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accountName, setAccountName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Данные для безопасности
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSection, setActiveSection] = useState<'settings' | 'security'>('settings');

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setAccountName(userData.account_name);
      setEmail(userData.email);
      if (userData.avatar_url) {
        setProfilePhoto(userData.avatar_url);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Не удалось загрузить данные пользователя');
      // Если ошибка авторизации - перенаправляем на логин
      if (!authService.isAuthenticated()) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик загрузки фото
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера файла (например, макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, загрузите изображение');
      return;
    }

    try {
      setIsSaving(true);
      // Показываем превью сразу
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Отправляем на сервер
      const response = await authService.updateAvatar(file);
      // Обновляем данные пользователя
      if (user) {
        setUser({ ...user, avatar_url: response.avatar_url });
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      alert('Не удалось загрузить фото');
      // Возвращаем старое фото при ошибке
      if (user?.avatar_url) {
        setProfilePhoto(user.avatar_url);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Сохранение настроек
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountName.trim()) {
      alert('Имя аккаунта не может быть пустым');
      return;
    }

    try {
      setIsSaving(true);
      const updatedUser = await authService.updateProfile({
        account_name: accountName,
        email: email,
      });
      
      setUser(updatedUser);
      setAccountName(updatedUser.account_name);
      setEmail(updatedUser.email);
      alert('Настройки аккаунта сохранены!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Не удалось сохранить настройки');
    } finally {
      setIsSaving(false);
    }
  };

  // Сохранение пароля
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Пароль должен содержать минимум 6 символов');
      return;
    }
    alert('Пароль успешно изменен!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Выход из аккаунта
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Всё равно перенаправляем на логин даже при ошибке
      navigate('/login');
    }
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <div style={{
        width: '1440px',
        height: '900px',
        backgroundColor: '#F9F9FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Rubik, sans-serif'
      }}>
        <div style={{ fontSize: '16px', color: '#5C5F6E' }}>
          Загрузка данных...
        </div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div style={{
        width: '1440px',
        height: '900px',
        backgroundColor: '#F9F9FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: 'Rubik, sans-serif'
      }}>
        <div style={{ fontSize: '16px', color: '#DC2222' }}>
          {error}
        </div>
        <button
          onClick={loadUserData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#651FFF',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'Rubik'
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  // Получаем первую букву имени для аватара
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // Красивая иконка настроек (шестеренка)
  const SettingsIcon = ({ size = 20, color = "#5C5F6E" }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" fill="transparent"/>
      <path d="M9.99984 6.66666C9.34057 6.66666 8.6961 6.86215 8.14794 7.22842C7.59977 7.5947 7.17253 8.11529 6.92024 8.72438C6.66795 9.33347 6.60194 10.0037 6.73055 10.6503C6.85917 11.2969 7.17664 11.8908 7.64282 12.357C8.10899 12.8232 8.70293 13.1407 9.34954 13.2693C9.99614 13.3979 10.6664 13.3319 11.2755 13.0796C11.8845 12.8273 12.4051 12.4001 12.7714 11.8519C13.1377 11.3037 13.3332 10.6593 13.3332 9.99999C13.3332 9.11594 12.982 8.26809 12.3569 7.64297C11.7317 7.01785 10.8839 6.66666 9.99984 6.66666ZM9.99984 11.6667C9.6702 11.6667 9.34797 11.5689 9.07389 11.3858C8.79981 11.2026 8.58619 10.9423 8.46004 10.6378C8.33389 10.3333 8.30089 9.99814 8.3652 9.67484C8.42951 9.35154 8.58824 9.05457 8.82133 8.82148C9.05442 8.58839 9.35139 8.42966 9.67469 8.36535C9.99799 8.30104 10.3331 8.33404 10.6376 8.46019C10.9422 8.58634 11.2025 8.79996 11.3856 9.07404C11.5688 9.34812 11.6665 9.67035 11.6665 9.99999C11.6665 10.442 11.4909 10.8659 11.1784 11.1785C10.8658 11.4911 10.4419 11.6667 9.99984 11.6667Z" fill={color}/>
      <path d="M17.7452 11.5833L17.3752 11.37C17.5417 10.4637 17.5417 9.53463 17.3752 8.62833L17.7452 8.415C18.0297 8.25085 18.2791 8.03226 18.4792 7.77172C18.6792 7.51118 18.826 7.21378 18.9111 6.89651C18.9962 6.57925 19.018 6.24832 18.9753 5.92263C18.9325 5.59694 18.826 5.28286 18.6618 4.99833C18.4977 4.7138 18.2791 4.46439 18.0185 4.26434C17.758 4.06428 17.4606 3.91751 17.1433 3.83239C16.8261 3.74726 16.4951 3.72547 16.1695 3.76824C15.8438 3.81101 15.5297 3.91751 15.2452 4.08167L14.8743 4.29583C14.1739 3.69743 13.369 3.23354 12.5002 2.9275V2.5C12.5002 1.83696 12.2368 1.20107 11.7679 0.732233C11.2991 0.263392 10.6632 0 10.0002 0C9.33712 0 8.70123 0.263392 8.23239 0.732233C7.76355 1.20107 7.50016 1.83696 7.50016 2.5V2.9275C6.63131 3.23464 5.8267 3.69967 5.12682 4.29917L4.75432 4.08333C4.17969 3.75181 3.49689 3.66214 2.85614 3.83405C2.21539 4.00596 1.66918 4.42536 1.33766 5C1.00614 5.57464 0.916468 6.25743 1.08838 6.89818C1.26028 7.53893 1.67969 8.08515 2.25432 8.41667L2.62432 8.63C2.45775 9.5363 2.45775 10.4654 2.62432 11.3717L2.25432 11.585C1.67969 11.9165 1.26028 12.4627 1.08838 13.1035C0.916468 13.7442 1.00614 14.427 1.33766 15.0017C1.66918 15.5763 2.21539 15.9957 2.85614 16.1676C3.49689 16.3395 4.17969 16.2499 4.75432 15.9183L5.12516 15.7042C5.8258 16.3027 6.63098 16.7666 7.50016 17.0725V17.5C7.50016 18.163 7.76355 18.7989 8.23239 19.2678C8.70123 19.7366 9.33712 20 10.0002 20C10.6632 20 11.2991 19.7366 11.7679 19.2678C12.2368 18.7989 12.5002 18.163 12.5002 17.5V17.0725C13.369 16.7654 14.1736 16.3003 14.8735 15.7008L15.246 15.9158C15.8206 16.2474 16.5034 16.337 17.1442 16.1651C17.7849 15.9932 18.3311 15.5738 18.6627 14.9992C18.9942 14.4245 19.0838 13.7417 18.9119 13.101C18.74 12.4602 18.3206 11.914 17.746 11.5825L17.7452 11.5833ZM15.6218 8.43667C15.904 9.45922 15.904 10.5391 15.6218 11.5617C15.5726 11.7396 15.5838 11.9289 15.6538 12.0998C15.7238 12.2707 15.8485 12.4135 16.0085 12.5058L16.9118 13.0275C17.1033 13.138 17.2431 13.3201 17.3004 13.5336C17.3577 13.7472 17.3277 13.9747 17.2172 14.1663C17.1067 14.3578 16.9247 14.4975 16.7111 14.5548C16.4976 14.6121 16.27 14.5822 16.0785 14.4717L15.1735 13.9483C15.0134 13.8556 14.827 13.8188 14.6437 13.8437C14.4604 13.8686 14.2906 13.9538 14.161 14.0858C13.4193 14.843 12.4848 15.3833 11.4585 15.6483C11.2794 15.6944 11.1206 15.7987 11.0073 15.9449C10.894 16.0911 10.8326 16.2709 10.8327 16.4558V17.5C10.8327 17.721 10.7449 17.933 10.5886 18.0893C10.4323 18.2455 10.2203 18.3333 9.99932 18.3333C9.77831 18.3333 9.56635 18.2455 9.41007 18.0893C9.25379 17.933 9.16599 17.721 9.16599 17.5V16.4567C9.16608 16.2717 9.10464 16.092 8.99133 15.9458C8.87802 15.7996 8.7193 15.6952 8.54016 15.6492C7.51378 15.3831 6.5796 14.8416 5.83849 14.0833C5.70893 13.9513 5.53911 13.8661 5.35579 13.8412C5.17247 13.8163 4.98608 13.8531 4.82599 13.9458L3.92266 14.4683C3.82785 14.5239 3.72298 14.5602 3.6141 14.5751C3.50521 14.59 3.39445 14.5832 3.2882 14.5551C3.18195 14.527 3.08231 14.4782 2.99501 14.4114C2.90771 14.3446 2.83447 14.2613 2.77952 14.1661C2.72457 14.0709 2.68899 13.9658 2.67482 13.8568C2.66066 13.7479 2.66819 13.6372 2.69698 13.5311C2.72578 13.425 2.77527 13.3257 2.8426 13.2389C2.90994 13.152 2.99379 13.0793 3.08932 13.025L3.99266 12.5033C4.15262 12.411 4.27739 12.2682 4.34737 12.0973C4.41736 11.9264 4.4286 11.7371 4.37932 11.5592C4.09712 10.5366 4.09712 9.45672 4.37932 8.43417C4.42771 8.25657 4.41594 8.06795 4.34584 7.89774C4.27574 7.72754 4.15125 7.58534 3.99182 7.49333L3.08849 6.97167C2.89698 6.86116 2.75722 6.6791 2.69994 6.46555C2.64266 6.25199 2.67257 6.02442 2.78307 5.83292C2.89358 5.64141 3.07564 5.50164 3.2892 5.44437C3.50275 5.38709 3.73032 5.41699 3.92182 5.5275L4.82682 6.05083C4.98647 6.14376 5.17248 6.18101 5.3556 6.15672C5.53872 6.13244 5.70858 6.048 5.83849 5.91667C6.58023 5.15945 7.51468 4.61918 8.54099 4.35417C8.72069 4.30797 8.87982 4.20313 8.99319 4.05625C9.10655 3.90938 9.16766 3.72887 9.16683 3.54333V2.5C9.16683 2.27899 9.25462 2.06702 9.4109 1.91074C9.56718 1.75446 9.77914 1.66667 10.0002 1.66667C10.2212 1.66667 10.4331 1.75446 10.5894 1.91074C10.7457 2.06702 10.8335 2.27899 10.8335 2.5V3.54333C10.8334 3.7283 10.8948 3.90804 11.0082 4.05423C11.1215 4.20043 11.2802 4.30478 11.4593 4.35083C12.486 4.61679 13.4205 5.15824 14.1618 5.91667C14.2914 6.04872 14.4612 6.13391 14.6445 6.15881C14.8278 6.1837 15.0142 6.14689 15.1743 6.05417L16.0777 5.53167C16.1725 5.47609 16.2773 5.43981 16.3862 5.42492C16.4951 5.41003 16.6059 5.41683 16.7121 5.44492C16.8184 5.47301 16.918 5.52184 17.0053 5.58859C17.0926 5.65535 17.1658 5.73872 17.2208 5.83389C17.2757 5.92907 17.3113 6.03417 17.3255 6.14316C17.3397 6.25214 17.3321 6.36285 17.3033 6.46891C17.2745 6.57497 17.225 6.67429 17.1577 6.76114C17.0904 6.848 17.0065 6.92068 16.911 6.975L16.0077 7.49667C15.8485 7.58892 15.7244 7.73123 15.6546 7.90141C15.5848 8.07159 15.5733 8.26008 15.6218 8.4375V8.43667Z" fill={color}/>
    </svg>
  );

  // Иконка пользователя
  const UserIcon = ({ color = "#5C5F6E" }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.2503 4.5C11.2503 2.01825 9.23201 0 6.75026 0C4.26851 0 2.25026 2.01825 2.25026 4.5C2.25026 6.98175 4.26851 9 6.75026 9C9.23201 9 11.2503 6.98175 11.2503 4.5ZM6.75026 7.5C5.09576 7.5 3.75026 6.1545 3.75026 4.5C3.75026 2.8455 5.09576 1.5 6.75026 1.5C8.40476 1.5 9.75026 2.8455 9.75026 4.5C9.75026 6.1545 8.40476 7.5 6.75026 7.5ZM6.74426 11.2035C6.79526 11.6145 6.50426 11.9888 6.09251 12.0405C3.47426 12.3675 1.49951 14.6062 1.49951 17.25C1.49951 17.664 1.16351 18 0.749512 18C0.335512 18 -0.000488281 17.664 -0.000488281 17.25C-0.000488281 13.8517 2.53901 10.9725 5.90651 10.5525C6.31301 10.5007 6.69176 10.7925 6.74351 11.2043L6.74426 11.2035ZM17.0223 14.3497L16.2918 13.9282C16.4163 13.5555 16.5003 13.164 16.5003 12.7493C16.5003 12.3345 16.417 11.943 16.2918 11.5702L17.0223 11.1488C17.3808 10.9417 17.5038 10.4827 17.2968 10.1242C17.089 9.765 16.6315 9.64125 16.2723 9.84975L15.5425 10.2712C15.0138 9.67575 14.3095 9.24 13.5003 9.07575V8.25C13.5003 7.836 13.1643 7.5 12.7503 7.5C12.3363 7.5 12.0003 7.836 12.0003 8.25V9.07575C11.191 9.24075 10.4868 9.6765 9.95801 10.2712L9.22826 9.84975C8.86826 9.642 8.41076 9.765 8.20376 10.1242C7.99676 10.4835 8.11976 10.9417 8.47826 11.1488L9.20876 11.5702C9.08426 11.943 9.00026 12.3345 9.00026 12.7493C9.00026 13.164 9.08351 13.5555 9.20876 13.9282L8.47826 14.3497C8.11976 14.5567 7.99676 15.0158 8.20376 15.3743C8.34326 15.615 8.59451 15.7493 8.85401 15.7493C8.98076 15.7493 9.10976 15.717 9.22826 15.6488L9.95801 15.2272C10.4868 15.8228 11.191 16.2585 12.0003 16.4227V17.2485C12.0003 17.6625 12.3363 17.9985 12.7503 17.9985C13.1643 17.9985 13.5003 17.6625 13.5003 17.2485V16.4227C14.3095 16.2577 15.0138 15.822 15.5425 15.2272L16.2723 15.6488C16.3908 15.717 16.5198 15.7493 16.6465 15.7493C16.906 15.7493 17.158 15.615 17.2968 15.3743C17.5038 15.015 17.3808 14.5567 17.0223 14.3497ZM12.7503 14.9993C11.5098 14.9993 10.5003 13.9898 10.5003 12.7493C10.5003 11.5087 11.5098 10.4992 12.7503 10.4992C13.9908 10.4992 15.0003 11.5087 15.0003 12.7493C15.0003 13.9898 13.9908 14.9993 12.7503 14.9993Z" fill={color}/>
    </svg>
  );

  // Иконка замка (для безопасности/пароля)
  const LockIcon = ({ color = "#5C5F6E" }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2253_873)">
        <path d="M17.25 12.75C17.664 12.75 18 12.414 18 12C18 11.586 17.664 11.25 17.25 11.25H16.527L16.6065 10.5893C16.656 10.1783 16.3627 9.80475 15.951 9.75525C15.5422 9.70125 15.1665 9.999 15.117 10.4107L15.0165 11.25H12.6652L12.7448 10.5893C12.7943 10.1783 12.501 9.80475 12.0892 9.75525C11.6797 9.70125 11.3048 9.999 11.2552 10.4107L11.1547 11.25H10.125C9.711 11.25 9.375 11.586 9.375 12C9.375 12.414 9.711 12.75 10.125 12.75H10.9748L10.7048 15H9.75075C9.33675 15 9.00075 15.336 9.00075 15.75C9.00075 16.164 9.33675 16.5 9.75075 16.5H10.5247L10.4452 17.1608C10.3958 17.5718 10.6417 18.012 11.1908 18C11.565 18 11.8882 17.7202 11.934 17.3392L12.0345 16.5H14.3857L14.3063 17.1608C14.2568 17.5718 14.547 18.0045 15.0518 18C15.426 18 15.7492 17.7202 15.795 17.3392L15.8955 16.5H16.8743C17.2882 16.5 17.6243 16.164 17.6243 15.75C17.6243 15.336 17.2882 15 16.8743 15H16.0755L16.3455 12.75H17.2485H17.25ZM14.5658 15H12.2145L12.4845 12.75H14.8358L14.5658 15ZM8.25 11.25V12.75C8.25 13.164 7.914 13.5 7.5 13.5C7.086 13.5 6.75 13.164 6.75 12.75V11.25C6.75 10.836 7.086 10.5 7.5 10.5C7.914 10.5 8.25 10.836 8.25 11.25ZM6.75 16.5H3.75C2.5095 16.5 1.5 15.4905 1.5 14.25V9.75C1.5 8.5095 2.5095 7.5 3.75 7.5H11.25C11.937 7.5 12.5767 7.8075 13.0065 8.34375C13.2652 8.667 13.7377 8.718 14.061 8.46C14.3842 8.20125 14.436 7.72875 14.1772 7.4055C13.7902 6.9225 13.299 6.55575 12.75 6.3165V5.25C12.75 2.355 10.395 0 7.5 0C4.605 0 2.25 2.355 2.25 5.25V6.318C0.92775 6.8985 0 8.21625 0 9.75V14.25C0 16.3177 1.68225 18 3.75 18H6.75C7.164 18 7.5 17.664 7.5 17.25C7.5 16.836 7.164 16.5 6.75 16.5ZM3.75 5.25C3.75 3.18225 5.43225 1.5 7.5 1.5C9.56775 1.5 11.25 3.18225 11.25 5.25V6H3.75V5.25Z" fill={color}/>
      </g>
      <defs>
        <clipPath id="clip0_2253_873">
          <rect width="18" height="18" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  // Иконка дома
  const HomeIcon = ({ color = "#5C5F6E" }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 7.5L10 1.66667L17.5 7.5V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V7.5Z" stroke={color} strokeWidth="1.5"/>
      <path d="M7.5 18.3333V10H12.5V18.3333" stroke={color} strokeWidth="1.5"/>
    </svg>
  );

  // Иконка пользователя для левого меню
  const UserNavIcon = ({ color = "#5C5F6E" }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke={color} strokeWidth="1.5"/>
      <path d="M2 18V16C2 14.9391 2.42143 13.9217 3.17157 13.1716C3.92172 12.4214 4.93913 12 6 12H14C15.0609 12 16.0783 12.4214 16.8284 13.1716C17.5786 13.9217 18 14.9391 18 16V18" stroke={color} strokeWidth="1.5"/>
    </svg>
  );

  // Иконка выхода
  const LogoutIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.25 12.25H2.91667C2.65145 12.25 2.3971 12.1446 2.20954 11.9571C2.02197 11.7695 1.91667 11.5152 1.91667 11.25V2.75C1.91667 2.48478 2.02197 2.23043 2.20954 2.04287C2.3971 1.85531 2.65145 1.75 2.91667 1.75H5.25" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M9.33333 9.91667L12.25 7L9.33333 4.08333" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M12.25 7H5.25" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );

  // Логотип
  const LogoIcon = () => (
    <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
      <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2252_334)">
          <path d="M22.5001 0L45 13.5088V22.4877L22.5001 36L0 22.4877V13.5089L22.5001 0Z" fill="#A5B4FC"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M0 13.5088L22.5 0L45 13.5088V22.4877L22.5 36L0 22.4877V13.5088ZM22.5 30.2679L40.227 19.622V16.3756L40.2261 16.375L22.5 27.0177L4.77383 16.375L4.77297 16.3756V19.622L22.5 30.2679ZM22.5 22.0541L36.0916 13.8938L32.7806 11.9068L22.5 18.0793L12.2194 11.9068L8.9084 13.8938L22.5 22.0541ZM22.5 13.1157L28.6461 9.42561L22.5 5.7372L16.3539 9.42561L22.5 13.1157Z" fill="#651FFF"/>
          <path d="M22.5001 0L0 13.5089V22.4877L22.5 36L22.5001 0Z" fill="#A5B4FC" fillOpacity="0.3"/>
        </g>
        <defs>
          <clipPath id="clip0_2252_334">
            <rect width="45" height="36" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );

  return (
    <div style={{
      width: '1440px',
      height: '900px',
      backgroundColor: '#F9F9FA',
      fontFamily: 'Rubik, sans-serif',
      overflow: 'hidden',
      position: 'relative',
      margin: '0 auto'
    }}>
      {/* Верхний хэдэр */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        backgroundColor: '#F9F9FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px 0 104px',
        zIndex: 10
      }}>
        {/* Центральная часть хэдэра */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'absolute',
          left: '344px',
        }}>
          <span style={{
            fontFamily: 'Rubik',
            fontWeight: 500,
            fontSize: '16px',
            color: '#5C5F6E'
          }}>
            Аккаунт
          </span>
          
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="#C4C7CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          <span style={{
            fontFamily: 'Rubik',
            fontWeight: 500,
            fontSize: '16px',
            color: '#5C5F6E'
          }}>
            Настройки
          </span>
        </div>

        {/* Аватар справа - используем реальные данные */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '22px',
          backgroundColor: '#651FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer'
        }}>
          {profilePhoto ? (
            <img 
              src={profilePhoto} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setProfilePhoto(null)} // Если фото не загрузилось, показываем букву
            />
          ) : (
            <span style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>
              {getInitial(accountName)}
            </span>
          )}
        </div>
      </div>

      {/* Левое меню проекта (80px x 900px) */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '80px',
        height: '900px',
        backgroundColor: '#F9F9FA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '18px',
        gap: '8px',
        zIndex: 20
      }}>
        <div style={{
          width: '45px',
          height: '36px',
          marginBottom: '98px'
        }}>
          <LogoIcon />
        </div>

        <Link to="/generator" style={{
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ECECFE';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}>
          <HomeIcon color="#5C5F6E" />
        </Link>

        <Link to="/settings" style={{
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ECECFE';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}>
          <UserNavIcon color="#5C5F6E" />
        </Link>

        <div style={{
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          backgroundColor: '#ECECFE',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ECECFE';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ECECFE';
        }}>
          <SettingsIcon size={20} color="#651FFF" />
        </div>
      </div>

      {/* Боковое меню аккаунта */}
      <div style={{
        position: 'absolute',
        left: '80px',
        top: 0,
        width: '224px',
        height: '900px',
        backgroundColor: '#F9F9FA',
        padding: '24px 0 0 24px',
        zIndex: 15
      }}>
        <div style={{
          marginBottom: '24px',
          paddingLeft: '16px'
        }}>
          <span style={{
            fontFamily: 'Rubik',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '20px',
            lineHeight: '24px',
            letterSpacing: '-0.868235px',
            color: '#5C5F6E'
          }}>
            Общие настройки
          </span>
        </div>

        {/* Информация о пользователе - реальные данные */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          paddingLeft: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '22px',
            backgroundColor: '#651FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setProfilePhoto(null)}
              />
            ) : (
              <span style={{ fontSize: '20px', fontWeight: 500, color: '#fff' }}>
                {getInitial(accountName)}
              </span>
            )}
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#5C5F6E',
              marginBottom: '4px'
            }}>
              {accountName || 'Пользователь'}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#5C5F6E'
            }}>
              {email || 'email@example.com'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setActiveSection('settings')}
            style={{
              width: '176px',
              background: activeSection === 'settings' ? '#ECECFE' : '#F9F9FA',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              fontFamily: 'Rubik',
              fontSize: '13px',
              fontWeight: activeSection === 'settings' ? 500 : 400,
              color: activeSection === 'settings' ? '#651FFF' : '#5C5F6E',
              height: '32px',
              transition: 'background-color 0.2s ease'
            }}
          >
            <SettingsIcon size={16} color={activeSection === 'settings' ? '#651FFF' : '#5C5F6E'} />
            Настройки
          </button>

          <button
            onClick={() => setActiveSection('security')}
            style={{
              width: '176px',
              background: activeSection === 'security' ? '#ECECFE' : '#F9F9FA',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              fontFamily: 'Rubik',
              fontSize: '13px',
              fontWeight: activeSection === 'security' ? 500 : 400,
              color: activeSection === 'security' ? '#651FFF' : '#5C5F6E',
              height: '32px',
              transition: 'background-color 0.2s ease'
            }}
          >
            <LockIcon color={activeSection === 'security' ? '#651FFF' : '#5C5F6E'} />
            Безопасность
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '176px',
              background: 'rgba(247, 100, 100, 0.19)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              fontFamily: 'Rubik',
              fontSize: '13px',
              fontWeight: 400,
              color: '#DC2222',
              marginTop: '8px',
              height: '33.43px',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <LogoutIcon />
            Выйти
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div style={{
        position: 'absolute',
        left: '304px',
        top: '96px',
        width: '977px',
        height: '552px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '28px 32px',
        boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.05)',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        {activeSection === 'settings' ? (
          <form onSubmit={handleSaveSettings} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* ... заголовок формы ... */}

            <div style={{ marginBottom: '20px', flexShrink: 0 }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: 600, 
                marginBottom: '6px',
                color: '#5C5F6E'
              }}>
                Имя аккаунта
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                disabled={isSaving}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Rubik',
                  boxSizing: 'border-box',
                  backgroundColor: isSaving ? '#E0E0E0' : '#F9F9FA',
                  color: '#5C5F6E',
                  cursor: isSaving ? 'not-allowed' : 'text'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px', flexShrink: 0 }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: 600, 
                marginBottom: '6px',
                color: '#5C5F6E'
              }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSaving}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Rubik',
                  boxSizing: 'border-box',
                  backgroundColor: isSaving ? '#E0E0E0' : '#F9F9FA',
                  color: '#5C5F6E',
                  cursor: isSaving ? 'not-allowed' : 'text'
                }}
              />
            </div>

            <div style={{ marginBottom: '28px', flexShrink: 0 }}>
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: 600, 
                marginBottom: '12px',
                color: '#5C5F6E'
              }}>
                Фото профиля
              </label>
              <div style={{
                width: '100%',
                backgroundColor: '#F9F9FA',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                flexWrap: 'wrap',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#651FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => setProfilePhoto(null)}
                    />
                  ) : (
                    <span style={{ fontSize: '48px', fontWeight: 500, color: '#fff' }}>
                      {getInitial(accountName)}
                    </span>
                  )}
                </div>
                
                <label style={{
                  padding: '8px 24px',
                  backgroundColor: isSaving ? '#C4C7CF' : '#ECECFE',
                  borderRadius: '8px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: isSaving ? '#888' : '#651FFF',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isSaving ? 0.6 : 1,
                  pointerEvents: isSaving ? 'none' : 'auto'
                }}>
                  {isSaving ? 'Загрузка...' : 'Загрузить фото'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isSaving}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', flexShrink: 0 }}>
              <button 
                type="submit" 
                disabled={isSaving}
                style={{
                  padding: '10px 24px',
                  backgroundColor: isSaving ? '#C4C7CF' : '#651FFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontFamily: 'Rubik',
                  minWidth: '196px',
                  whiteSpace: 'nowrap',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexShrink: 0 }}>
              <LockIcon color="#5C5F6E" />
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 500, 
                color: '#5C5F6E',
                letterSpacing: '-0.868235px',
                margin: 0
              }}>
                Поменять пароль
              </h2>
            </div>

            <form onSubmit={handleSavePassword} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '20px', flexShrink: 0 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  marginBottom: '6px',
                  color: '#5C5F6E'
                }}>
                  Текущий пароль
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Rubik',
                    boxSizing: 'border-box',
                    backgroundColor: '#F9F9FA',
                    color: '#5C5F6E'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px', flexShrink: 0 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  marginBottom: '6px',
                  color: '#5C5F6E'
                }}>
                  Новый пароль
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Rubik',
                    boxSizing: 'border-box',
                    backgroundColor: '#F9F9FA',
                    color: '#5C5F6E'
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px', flexShrink: 0 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  marginBottom: '6px',
                  color: '#5C5F6E'
                }}>
                  Подтвердите новый пароль
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите новый пароль"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Rubik',
                    boxSizing: 'border-box',
                    backgroundColor: '#F9F9FA',
                    color: '#5C5F6E'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', flexShrink: 0 }}>
                <button 
                  type="submit" 
                  style={{
                    width: '259px',
                    height: '44px',
                    backgroundColor: '#651FFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Rubik',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  Сохранить новый пароль
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;