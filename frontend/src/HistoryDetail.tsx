import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface HistoryItem {
  id: number;
  title: string;
  createdAt: string;
  modifiedAt: string | null;
  description: string;
  imageUrls: string[]; // Массив URL фото
}

interface HistoryDetailProps {
  item: HistoryItem;
  onBack: () => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ item, onBack }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleCopy = () => {
    const textToCopy = `${item.title}\n\n${item.description}`;
    navigator.clipboard.writeText(textToCopy);
    alert('Текст скопирован в буфер обмена!');
  };

  const handleRegenerate = () => {
    alert('Генерация нового описания...');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Изменения сохранены!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(item.title);
    setEditedDescription(item.description);
  };

  const nextPhoto = () => {
    if (currentPhotoIndex < item.imageUrls.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const SettingsIcon = ({ size = 20, color = "#5C5F6E" }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" fill="transparent"/>
      <path d="M9.99984 6.66666C9.34057 6.66666 8.6961 6.86215 8.14794 7.22842C7.59977 7.5947 7.17253 8.11529 6.92024 8.72438C6.66795 9.33347 6.60194 10.0037 6.73055 10.6503C6.85917 11.2969 7.17664 11.8908 7.64282 12.357C8.10899 12.8232 8.70293 13.1407 9.34954 13.2693C9.99614 13.3979 10.6664 13.3319 11.2755 13.0796C11.8845 12.8273 12.4051 12.4001 12.7714 11.8519C13.1377 11.3037 13.3332 10.6593 13.3332 9.99999C13.3332 9.11594 12.982 8.26809 12.3569 7.64297C11.7317 7.01785 10.8839 6.66666 9.99984 6.66666ZM9.99984 11.6667C9.6702 11.6667 9.34797 11.5689 9.07389 11.3858C8.79981 11.2026 8.58619 10.9423 8.46004 10.6378C8.33389 10.3333 8.30089 9.99814 8.3652 9.67484C8.42951 9.35154 8.58824 9.05457 8.82133 8.82148C9.05442 8.58839 9.35139 8.42966 9.67469 8.36535C9.99799 8.30104 10.3331 8.33404 10.6376 8.46019C10.9422 8.58634 11.2025 8.79996 11.3856 9.07404C11.5688 9.34812 11.6665 9.67035 11.6665 9.99999C11.6665 10.442 11.4909 10.8659 11.1784 11.1785C10.8658 11.4911 10.4419 11.6667 9.99984 11.6667Z" fill={color}/>
      <path d="M17.7452 11.5833L17.3752 11.37C17.5417 10.4637 17.5417 9.53463 17.3752 8.62833L17.7452 8.415C18.0297 8.25085 18.2791 8.03226 18.4792 7.77172C18.6792 7.51118 18.826 7.21378 18.9111 6.89651C18.9962 6.57925 19.018 6.24832 18.9753 5.92263C18.9325 5.59694 18.826 5.28286 18.6618 4.99833C18.4977 4.7138 18.2791 4.46439 18.0185 4.26434C17.758 4.06428 17.4606 3.91751 17.1433 3.83239C16.8261 3.74726 16.4951 3.72547 16.1695 3.76824C15.8438 3.81101 15.5297 3.91751 15.2452 4.08167L14.8743 4.29583C14.1739 3.69743 13.369 3.23354 12.5002 2.9275V2.5C12.5002 1.83696 12.2368 1.20107 11.7679 0.732233C11.2991 0.263392 10.6632 0 10.0002 0C9.33712 0 8.70123 0.263392 8.23239 0.732233C7.76355 1.20107 7.50016 1.83696 7.50016 2.5V2.9275C6.63131 3.23464 5.8267 3.69967 5.12682 4.29917L4.75432 4.08333C4.17969 3.75181 3.49689 3.66214 2.85614 3.83405C2.21539 4.00596 1.66918 4.42536 1.33766 5C1.00614 5.57464 0.916468 6.25743 1.08838 6.89818C1.26028 7.53893 1.67969 8.08515 2.25432 8.41667L2.62432 8.63C2.45775 9.5363 2.45775 10.4654 2.62432 11.3717L2.25432 11.585C1.67969 11.9165 1.26028 12.4627 1.08838 13.1035C0.916468 13.7442 1.00614 14.427 1.33766 15.0017C1.66918 15.5763 2.21539 15.9957 2.85614 16.1676C3.49689 16.3395 4.17969 16.2499 4.75432 15.9183L5.12516 15.7042C5.8258 16.3027 6.63098 16.7666 7.50016 17.0725V17.5C7.50016 18.163 7.76355 18.7989 8.23239 19.2678C8.70123 19.7366 9.33712 20 10.0002 20C10.6632 20 11.2991 19.7366 11.7679 19.2678C12.2368 18.7989 12.5002 18.163 12.5002 17.5V17.0725C13.369 16.7654 14.1736 16.3003 14.8735 15.7008L15.246 15.9158C15.8206 16.2474 16.5034 16.337 17.1442 16.1651C17.7849 15.9932 18.3311 15.5738 18.6627 14.9992C18.9942 14.4245 19.0838 13.7417 18.9119 13.101C18.74 12.4602 18.3206 11.914 17.746 11.5825L17.7452 11.5833ZM15.6218 8.43667C15.904 9.45922 15.904 10.5391 15.6218 11.5617C15.5726 11.7396 15.5838 11.9289 15.6538 12.0998C15.7238 12.2707 15.8485 12.4135 16.0085 12.5058L16.9118 13.0275C17.1033 13.138 17.2431 13.3201 17.3004 13.5336C17.3577 13.7472 17.3277 13.9747 17.2172 14.1663C17.1067 14.3578 16.9247 14.4975 16.7111 14.5548C16.4976 14.6121 16.27 14.5822 16.0785 14.4717L15.1735 13.9483C15.0134 13.8556 14.827 13.8188 14.6437 13.8437C14.4604 13.8686 14.2906 13.9538 14.161 14.0858C13.4193 14.843 12.4848 15.3833 11.4585 15.6483C11.2794 15.6944 11.1206 15.7987 11.0073 15.9449C10.894 16.0911 10.8326 16.2709 10.8327 16.4558V17.5C10.8327 17.721 10.7449 17.933 10.5886 18.0893C10.4323 18.2455 10.2203 18.3333 9.99932 18.3333C9.77831 18.3333 9.56635 18.2455 9.41007 18.0893C9.25379 17.933 9.16599 17.721 9.16599 17.5V16.4567C9.16608 16.2717 9.10464 16.092 8.99133 15.9458C8.87802 15.7996 8.7193 15.6952 8.54016 15.6492C7.51378 15.3831 6.5796 14.8416 5.83849 14.0833C5.70893 13.9513 5.53911 13.8661 5.35579 13.8412C5.17247 13.8163 4.98608 13.8531 4.82599 13.9458L3.92266 14.4683C3.82785 14.5239 3.72298 14.5602 3.6141 14.5751C3.50521 14.59 3.39445 14.5832 3.2882 14.5551C3.18195 14.527 3.08231 14.4782 2.99501 14.4114C2.90771 14.3446 2.83447 14.2613 2.77952 14.1661C2.72457 14.0709 2.68899 13.9658 2.67482 13.8568C2.66066 13.7479 2.66819 13.6372 2.69698 13.5311C2.72578 13.425 2.77527 13.3257 2.8426 13.2389C2.90994 13.152 2.99379 13.0793 3.08932 13.025L3.99266 12.5033C4.15262 12.411 4.27739 12.2682 4.34737 12.0973C4.41736 11.9264 4.4286 11.7371 4.37932 11.5592C4.09712 10.5366 4.09712 9.45672 4.37932 8.43417C4.42771 8.25657 4.41594 8.06795 4.34584 7.89774C4.27574 7.72754 4.15125 7.58534 3.99182 7.49333L3.08849 6.97167C2.89698 6.86116 2.75722 6.6791 2.69994 6.46555C2.64266 6.25199 2.67257 6.02442 2.78307 5.83292C2.89358 5.64141 3.07564 5.50164 3.2892 5.44437C3.50275 5.38709 3.73032 5.41699 3.92182 5.5275L4.82682 6.05083C4.98647 6.14376 5.17248 6.18101 5.3556 6.15672C5.53872 6.13244 5.70858 6.048 5.83849 5.91667C6.58023 5.15945 7.51468 4.61918 8.54099 4.35417C8.72069 4.30797 8.87982 4.20313 8.99319 4.05625C9.10655 3.90938 9.16766 3.72887 9.16683 3.54333V2.5C9.16683 2.27899 9.25462 2.06702 9.4109 1.91074C9.56718 1.75446 9.77914 1.66667 10.0002 1.66667C10.2212 1.66667 10.4331 1.75446 10.5894 1.91074C10.7457 2.06702 10.8335 2.27899 10.8335 2.5V3.54333C10.8334 3.7283 10.8948 3.90804 11.0082 4.05423C11.1215 4.20043 11.2802 4.30478 11.4593 4.35083C12.486 4.61679 13.4205 5.15824 14.1618 5.91667C14.2914 6.04872 14.4612 6.13391 14.6445 6.15881C14.8278 6.1837 15.0142 6.14689 15.1743 6.05417L16.0777 5.53167C16.1725 5.47609 16.2773 5.43981 16.3862 5.42492C16.4951 5.41003 16.6059 5.41683 16.7121 5.44492C16.8184 5.47301 16.918 5.52184 17.0053 5.58859C17.0926 5.65535 17.1658 5.73872 17.2208 5.83389C17.2757 5.92907 17.3113 6.03417 17.3255 6.14316C17.3397 6.25214 17.3321 6.36285 17.3033 6.46891C17.2745 6.57497 17.225 6.67429 17.1577 6.76114C17.0904 6.848 17.0065 6.92068 16.911 6.975L16.0077 7.49667C15.8485 7.58892 15.7244 7.73123 15.6546 7.90141C15.5848 8.07159 15.5733 8.26008 15.6218 8.4375V8.43667Z" fill={color}/>
    </svg>
  );

  const HomeIcon = ({ color = "#5C5F6E" }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 7.5L10 1.66667L17.5 7.5V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V7.5Z" stroke={color} strokeWidth="1.5"/>
      <path d="M7.5 18.3333V10H12.5V18.3333" stroke={color} strokeWidth="1.5"/>
    </svg>
  );

  const UserNavIcon = ({ color = "#5C5F6E" }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke={color} strokeWidth="1.5"/>
      <path d="M2 18V16C2 14.9391 2.42143 13.9217 3.17157 13.1716C3.92172 12.4214 4.93913 12 6 12H14C15.0609 12 16.0783 12.4214 16.8284 13.1716C17.5786 13.9217 18 14.9391 18 16V18" stroke={color} strokeWidth="1.5"/>
    </svg>
  );

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

  const RefreshIcon = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.25 5V12.5H8.75" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28.75 25V17.5H21.25" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M25.6125 11.25C24.9785 9.45845 23.9011 7.85673 22.4807 6.59425C21.0602 5.33176 19.3432 4.44968 17.4896 4.0303C15.6361 3.61091 13.7066 3.6679 11.881 4.19594C10.0555 4.72398 8.39343 5.70586 7.05 7.04997L1.25 12.5M28.75 17.5L22.95 22.95C21.6066 24.2941 19.9445 25.276 18.119 25.804C16.2934 26.332 14.3639 26.389 12.5104 25.9697C10.6568 25.5503 8.93975 24.6682 7.51933 23.4057C6.09892 22.1432 5.02146 20.5415 4.3875 18.75" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const EditIcon = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.75 5H5C4.33696 5 3.70107 5.26339 3.23223 5.73223C2.76339 6.20107 2.5 6.83696 2.5 7.5V25C2.5 25.663 2.76339 26.2989 3.23223 26.7678C3.70107 27.2366 4.33696 27.5 5 27.5H22.5C23.163 27.5 23.7989 27.2366 24.2678 26.7678C24.7366 26.2989 25 25.663 25 25V16.25" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23.125 3.12504C23.6223 2.62776 24.2967 2.34839 25 2.34839C25.7033 2.34839 26.3777 2.62776 26.875 3.12504C27.3723 3.62232 27.6516 4.29678 27.6516 5.00004C27.6516 5.7033 27.3723 6.37776 26.875 6.87504L15 18.75L10 20L11.25 15L23.125 3.12504Z" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CopyIcon = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 11.25H13.75C12.3693 11.25 11.25 12.3693 11.25 13.75V25C11.25 26.3807 12.3693 27.5 13.75 27.5H25C26.3807 27.5 27.5 26.3807 27.5 25V13.75C27.5 12.3693 26.3807 11.25 25 11.25Z" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.25 18.75H5C4.33696 18.75 3.70107 18.4866 3.23223 18.0178C2.76339 17.5489 2.5 16.913 2.5 16.25V5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H16.25C16.913 2.5 17.5489 2.76339 18.0178 3.23223C18.4866 3.70107 18.75 4.33696 18.75 5V6.25" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 10H5" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 14L5 10L9 6" stroke="#651FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const scrollbarStyles = `
    .custom-scroll::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #651FFF;
      border-radius: 100px;
    }
    .custom-scroll {
      scrollbar-width: thin;
      scrollbar-color: #651FFF transparent;
    }
  `;

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
      <style>{scrollbarStyles}</style>

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
        padding: '0 32px 0 104px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: '16px', color: '#5C5F6E', cursor: 'default' }}>Главная</span>
          <span style={{ fontFamily: 'Rubik', fontWeight: 600, fontSize: '16px', color: '#651FFF', borderBottom: '2px solid #651FFF', paddingBottom: '4px' }}>История генераций</span>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: '22px', backgroundColor: '#651FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>М</span>
        </div>
      </div>

      {/* Левое меню */}
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
        <div style={{ width: '45px', height: '36px', marginBottom: '98px' }}><LogoIcon /></div>
        <Link to="/generator" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', textDecoration: 'none', transition: 'background-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ECECFE'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}><HomeIcon color="#5C5F6E" /></Link>
        <Link to="/history" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', backgroundColor: '#ECECFE', textDecoration: 'none' }}><UserNavIcon color="#651FFF" /></Link>
        <Link to="/settings" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', textDecoration: 'none', transition: 'background-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ECECFE'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}><SettingsIcon size={20} color="#5C5F6E" /></Link>
      </div>

      {/* Основной контент */}
      <div style={{
        position: 'absolute',
        width: '1256px',
        height: '715px',
        left: '104px',
        top: '105px',
        background: '#FFFFFF',
        boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.05)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px'
      }}>
        {/* Левая часть с изображением */}
        <div style={{
          boxSizing: 'border-box',
          width: '571px',
          height: '665px',
          background: `url(${item.imageUrls[currentPhotoIndex]})`,
          backgroundColor: '#E9E9E9',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '5px solid #E9E9E9',
          boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.05)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {item.imageUrls.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                disabled={currentPhotoIndex === 0}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPhotoIndex === 0 ? 'default' : 'pointer',
                  opacity: currentPhotoIndex === 0 ? 0.3 : 1,
                  zIndex: 10
                }}
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={nextPhoto}
                disabled={currentPhotoIndex === item.imageUrls.length - 1}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPhotoIndex === item.imageUrls.length - 1 ? 'default' : 'pointer',
                  opacity: currentPhotoIndex === item.imageUrls.length - 1 ? 0.3 : 1,
                  zIndex: 10
                }}
              >
                <ChevronRightIcon />
              </button>
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '20px',
                padding: '4px 12px',
                color: '#fff',
                fontSize: '12px',
                fontFamily: 'Rubik',
                zIndex: 10
              }}>
                {currentPhotoIndex + 1} / {item.imageUrls.length}
              </div>
            </>
          )}
        </div>

        {/* Правая часть с контентом */}
        <div style={{
          position: 'relative',
          width: '600px',
          height: '665px',
          borderRadius: '16px'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#E9E9E9',
            borderRadius: '16px',
            padding: '24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Белый блок с текстом */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Заголовок */}
              <div style={{
                width: '100%',
                height: '32px',
                backgroundColor: '#E9E9E9',
                boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontFamily: 'Rubik',
                  fontWeight: 600,
                  fontSize: '16px',
                  textAlign: 'center',
                  color: '#000000'
                }}>Заголовок</span>
              </div>
              
              {/* Текст заголовка - редактируемый или обычный */}
              <div style={{
                padding: '0 16px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    style={{
                      width: '100%',
                      fontFamily: 'Rubik',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: '#000000',
                      border: '1px solid #651FFF',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                ) : (
                  <span style={{
                    fontFamily: 'Rubik',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#000000'
                  }}>{item.title}</span>
                )}
              </div>

              {/* Описание */}
              <div style={{
                width: '100%',
                height: '32px',
                backgroundColor: '#E9E9E9',
                boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontFamily: 'Rubik',
                  fontWeight: 600,
                  fontSize: '16px',
                  textAlign: 'center',
                  color: '#000000'
                }}>Описание</span>
              </div>
              
              {/* Блок с текстом описания - редактируемый или обычный */}
              <div className="custom-scroll" style={{
                backgroundColor: 'transparent',
                flex: 1,
                overflowY: 'auto',
                paddingRight: '12px'
              }}>
                {isEditing ? (
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '300px',
                      fontFamily: 'Rubik',
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#000000',
                      border: '1px solid #651FFF',
                      borderRadius: '8px',
                      padding: '12px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                ) : (
                  <p style={{
                    fontFamily: 'Rubik',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#000000',
                    margin: 0
                  }}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            {/* Кнопки действий */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div onClick={handleRegenerate} style={{ cursor: 'pointer' }}><RefreshIcon /></div>
                <div onClick={handleEdit} style={{ cursor: 'pointer' }}><EditIcon /></div>
                <div onClick={handleCopy} style={{ cursor: 'pointer' }}><CopyIcon /></div>
              </div>
              <div>
                <button 
                  onClick={onBack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: '#ECECFE',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Rubik',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#651FFF',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DCDCFE'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ECECFE'}
                >
                  <BackIcon />
                  Назад
                </button>
              </div>
            </div>

            {/* Кнопка "Готово" при редактировании - по центру */}
            {isEditing && (
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '16px'
              }}>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#FEE2E2',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Rubik',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#DC2626',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#651FFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Rubik',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  Сохранить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;