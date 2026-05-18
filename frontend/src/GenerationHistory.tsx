// src/GenerationHistory.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HistoryDetail from './HistoryDetail';

const GenerationHistory: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // Данные для поиска и фильтрации
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByDate, setSortByDate] = useState<'newest' | 'oldest'>('newest');
  const [sortByModified, setSortByModified] = useState<'recent' | 'older'>('recent');
  const [sortByTitle, setSortByTitle] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const itemsPerPage = 8;

  // Данные истории генераций с изображениями
  interface HistoryItem {
    id: number;
    title: string;
    createdAt: string;
    modifiedAt: string | null;
    description: string;
    imageUrl: string;
  }

  const [historyItems] = useState<HistoryItem[]>([
    { id: 1, title: 'Lorem ipsum', createdAt: '09.12.2013', modifiedAt: '15.07.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop1/400/200' },
    { id: 2, title: 'Lorem ipsum', createdAt: '09.12.2013', modifiedAt: '15.02.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop2/400/200' },
    { id: 3, title: 'Lorem ipsum', createdAt: '09.12.2013', modifiedAt: null, description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop3/400/200' },
    { id: 4, title: 'Lorem ipsum', createdAt: '10.01.2014', modifiedAt: '20.03.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop4/400/200' },
    { id: 5, title: 'Lorem ipsum', createdAt: '15.02.2014', modifiedAt: '01.04.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop5/400/200' },
    { id: 6, title: 'Lorem ipsum', createdAt: '20.03.2014', modifiedAt: '10.05.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop6/400/200' },
    { id: 7, title: 'Lorem ipsum', createdAt: '05.04.2014', modifiedAt: null, description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop7/400/200' },
    { id: 8, title: 'Lorem ipsum', createdAt: '12.05.2014', modifiedAt: '18.06.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop8/400/200' },
    { id: 9, title: 'Lorem ipsum', createdAt: '18.06.2014', modifiedAt: '22.07.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop9/400/200' },
    { id: 10, title: 'Lorem ipsum', createdAt: '25.07.2014', modifiedAt: '30.08.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop10/400/200' },
    { id: 11, title: 'Lorem ipsum', createdAt: '03.08.2014', modifiedAt: '05.09.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop11/400/200' },
    { id: 12, title: 'Lorem ipsum', createdAt: '10.09.2014', modifiedAt: null, description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop12/400/200' },
    { id: 13, title: 'Lorem ipsum', createdAt: '15.10.2014', modifiedAt: '20.11.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop13/400/200' },
    { id: 14, title: 'Lorem ipsum', createdAt: '22.11.2014', modifiedAt: '25.12.2027', description: 'Lorem ipsum dolor sit amet consectetur. Et sollicitudin scelerisque enim at donec purus varius sed. Amet arcu nec arcu eu laoreet lorem proin eu. Sit suspendisse proin tempor molestie mauris aliquet aenean nam egestas. Faucibus nunc semper venenatis tellus ante in at. Hendrerit potenti tincidunt lacus dis enim ipsum.', imageUrl: 'https://picsum.photos/seed/laptop14/400/200' },
  ]);

  const openDetail = (item: HistoryItem) => {
    setSelectedItem(item);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  // Фильтрация и сортировка
  const getFilteredAndSortedItems = () => {
    let filtered = [...historyItems];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(item => {
        const itemDate = item.createdAt.split('.').reverse().join('-');
        return itemDate === selectedDate;
      });
    }

    if (sortByDate === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt.split('.').reverse().join('-')).getTime() - new Date(a.createdAt.split('.').reverse().join('-')).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.createdAt.split('.').reverse().join('-')).getTime() - new Date(b.createdAt.split('.').reverse().join('-')).getTime());
    }

    if (sortByModified === 'recent') {
      filtered.sort((a, b) => {
        if (!a.modifiedAt && !b.modifiedAt) return 0;
        if (!a.modifiedAt) return 1;
        if (!b.modifiedAt) return -1;
        return new Date(b.modifiedAt.split('.').reverse().join('-')).getTime() - new Date(a.modifiedAt.split('.').reverse().join('-')).getTime();
      });
    } else {
      filtered.sort((a, b) => {
        if (!a.modifiedAt && !b.modifiedAt) return 0;
        if (!a.modifiedAt) return 1;
        if (!b.modifiedAt) return -1;
        return new Date(a.modifiedAt.split('.').reverse().join('-')).getTime() - new Date(b.modifiedAt.split('.').reverse().join('-')).getTime();
      });
    }

    if (sortByTitle === 'asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleClearHistory = () => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю генераций? Это действие нельзя отменить.')) {
      alert('История очищена!');
    }
  };

  const handleDeleteItem = (id: number, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Удалить "${title}" из истории?`)) {
      alert(`"${title}" удален!`);
    }
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return 'Дата';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  };

  // Иконки
  const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2260_1107)">
        <path d="M6.41667 11.0833C8.994 11.0833 11.0833 8.994 11.0833 6.41667C11.0833 3.83934 8.994 1.75 6.41667 1.75C3.83934 1.75 1.75 3.83934 1.75 6.41667C1.75 8.994 3.83934 11.0833 6.41667 11.0833Z" stroke="#5C5F6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.2499 12.2499L9.7124 9.7124" stroke="#5C5F6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_2260_1107">
          <rect width="14" height="14" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  const RadioIcon = ({ selected }: { selected: boolean }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2265_1166)">
        <path d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {selected && (
          <circle cx="7.5" cy="7.5" r="4.5" fill="#A5B4FD" stroke="#651FFF" strokeWidth="2"/>
        )}
      </g>
      <defs>
        <clipPath id="clip0_2265_1166">
          <rect width="15" height="15" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="14" height="12" rx="2" stroke="#5C5F6E" strokeWidth="1.5"/>
      <path d="M6 2V6" stroke="#5C5F6E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 2V6" stroke="#5C5F6E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 9H16" stroke="#5C5F6E" strokeWidth="1.5"/>
    </svg>
  );

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

  const ChevronLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ChevronRightPaginationIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 15L12.5 10L7.5 5" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4.5H4.5H15" stroke="#DC2222" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5M6 4.5V3C6 2.80109 6.07902 2.61032 6.21967 2.46967C6.36032 2.32902 6.55109 2.25 6.75 2.25H11.25C11.4489 2.25 11.6397 2.32902 11.7803 2.46967C11.921 2.61032 12 2.80109 12 3V4.5" stroke="#DC2222" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 7.5V12" stroke="#DC2222" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 7.5V12" stroke="#DC2222" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  if (selectedItem) {
    return <HistoryDetail item={selectedItem} onBack={closeDetail} />;
  }

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
      {/* Верхний хэдэр - 72px */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'absolute',
          left: '344px',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="#C4C7CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: 'Rubik',
            fontWeight: 500,
            fontSize: '16px',
            color: '#5C5F6E'
          }}>
            История генераций
          </span>
        </div>

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
          <span style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>М</span>
        </div>
      </div>

      {/* Левое узкое меню (80px) */}
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

        <div onClick={() => navigate('/history')} style={{
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          backgroundColor: '#ECECFE',
          cursor: 'pointer'
        }}>
          <UserNavIcon color="#651FFF" />
        </div>

        <Link to="/settings" style={{
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease',
          marginTop: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ECECFE';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}>
          <SettingsIcon />
        </Link>
      </div>

      {/* Боковое меню профиля с фильтрами */}
      <div style={{
        position: 'absolute',
        left: '80px',
        top: 0,
        width: '280px',
        height: '900px',
        backgroundColor: '#F9F9FA',
        zIndex: 15
      }}>
        <div style={{
          position: 'absolute',
          left: '24px',
          top: '24px',
          width: '232px'
        }}>
          <span style={{
            fontFamily: 'Rubik', fontWeight: 500, fontSize: '20px', lineHeight: '24px',
            letterSpacing: '-0.868235px', color: '#5C5F6E'
          }}>
            Профиль
          </span>
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '72px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '22px', backgroundColor: '#651FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
          }}>
            <span style={{ fontSize: '20px', fontWeight: 500, color: '#fff' }}>М</span>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#1F2937', marginBottom: '4px' }}>MIKS</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>miks@gmail.com</div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          width: '130px',
          height: '15px',
          left: '24px',
          top: '152px',
          fontFamily: 'Rubik',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '13px',
          lineHeight: '15px',
          color: '#000000'
        }}>
          Поиск по заголовку
        </div>

        <div style={{
          position: 'absolute',
          width: '176px',
          height: '32px',
          left: '24px',
          top: '172px',
          background: '#E9E9E9',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 10px'
        }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Ввести..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontFamily: 'Rubik',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '11px',
              lineHeight: '13px',
              color: '#5C5F6E'
            }}
          />
        </div>

        <div style={{
          position: 'absolute',
          width: '61px',
          height: '15px',
          left: '24px',
          top: '234px',
          fontFamily: 'Rubik',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '13px',
          lineHeight: '15px',
          color: '#000000'
        }}>
          Фильтры
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '262px',
          fontFamily: 'Rubik',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '12px',
          lineHeight: '14px',
          color: '#5C5F6E'
        }}>
          По дате создания
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '282px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }} onClick={() => setSortByDate('newest')}>
          <RadioIcon selected={sortByDate === 'newest'} />
          <span style={{
            fontFamily: 'Rubik',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '11px',
            lineHeight: '13px',
            color: '#000000'
          }}>Сначала новые</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '307px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }} onClick={() => setSortByDate('oldest')}>
          <RadioIcon selected={sortByDate === 'oldest'} />
          <span style={{
            fontFamily: 'Rubik',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '11px',
            lineHeight: '13px',
            color: '#000000'
          }}>Сначала старые</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '342px',
          fontFamily: 'Rubik',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '12px',
          lineHeight: '14px',
          color: '#5C5F6E'
        }}>
          Дата
        </div>

        <div style={{
          position: 'relative',
          width: '176px',
          height: '32px',
          left: '24px',
          top: '360px',
        }}>
          <div
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{
              width: '100%',
              height: '100%',
              background: '#E9E9E9',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 10px',
              cursor: 'pointer'
            }}
          >
            <CalendarIcon />
            <span style={{
              fontFamily: 'Rubik',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '11px',
              lineHeight: '13px',
              color: selectedDate ? '#000000' : '#5C5F6E'
            }}>
              {selectedDate ? formatDateForDisplay(selectedDate) : 'Дата'}
            </span>
          </div>
          
          {showDatePicker && (
            <div style={{
              position: 'absolute',
              top: '40px',
              left: 0,
              zIndex: 100,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              padding: '12px'
            }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowDatePicker(false);
                }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontFamily: 'Rubik',
                  fontSize: '12px'
                }}
              />
            </div>
          )}
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '417px',
          fontFamily: 'Rubik',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '12px',
          lineHeight: '14px',
          color: '#5C5F6E'
        }}>
          По дате изменения
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '437px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }} onClick={() => setSortByModified('recent')}>
          <RadioIcon selected={sortByModified === 'recent'} />
          <span style={{
            fontFamily: 'Rubik',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '11px',
            lineHeight: '13px',
            color: '#000000'
          }}>Сначала недавние</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '462px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }} onClick={() => setSortByModified('older')}>
          <RadioIcon selected={sortByModified === 'older'} />
          <span style={{
            fontFamily: 'Rubik',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '11px',
            lineHeight: '13px',
            color: '#000000'
          }}>Сначала давние</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '492px',
          fontFamily: 'Rubik',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '12px',
          lineHeight: '14px',
          color: '#5C5F6E'
        }}>
          По названию заголовка
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '512px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }} onClick={() => setSortByTitle('asc')}>
          <RadioIcon selected={sortByTitle === 'asc'} />
          <span style={{
            fontFamily: 'Rubik',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '11px',
            lineHeight: '13px',
            color: '#000000'
          }}>От А до Я</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '537px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }} onClick={() => setSortByTitle('desc')}>
          <RadioIcon selected={sortByTitle === 'desc'} />
          <span style={{
            fontFamily: 'Rubik',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '11px',
            lineHeight: '13px',
            color: '#000000'
          }}>От Я до А</span>
        </div>

        <div style={{
          position: 'absolute',
          left: '24px',
          top: '590px',
          width: '176px'
        }}>
          <button
            onClick={handleClearHistory}
            style={{
              width: '100%',
              height: '36px',
              background: '#FEE2E2',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Rubik',
              fontWeight: 500,
              fontSize: '13px',
              color: '#DC2626',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FECACA'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
          >
            Очистить историю
          </button>
        </div>
      </div>

      {/* Основной контент с карточками */}
      <div style={{
        position: 'absolute',
        left: '360px',
        top: '96px',
        right: '24px',
        bottom: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '28px 32px',
        boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.05)',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openDetail(item)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                border: '1px solid #F3F4F6'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: '100%',
                height: '140px',
                background: `url(${item.imageUrl}) center/cover`,
                backgroundColor: '#E5E7EB'
              }} />
              
              <div style={{
                padding: '16px',
                position: 'relative'
              }}>
                <div style={{
                  fontFamily: 'Rubik',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#1F2937',
                  marginBottom: '8px',
                  wordBreak: 'break-word'
                }}>
                  {item.title}
                </div>
                
                <div style={{
                  fontFamily: 'Rubik',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  color: '#6B7280',
                  height: '54px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {item.description}
                </div>

                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #F3F4F6'
                }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>
                    Дата создания: {item.createdAt}
                  </div>
                  {item.modifiedAt && (
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px' }}>
                      Дата изменения: {item.modifiedAt}
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#651FFF',
                    fontFamily: 'Rubik'
                  }}>
                    Подробнее
                  </span>
                  <button
                    onClick={(e) => handleDeleteItem(item.id, item.title, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '32px'
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: currentPage === 1 ? 'default' : 'pointer', 
                padding: '8px',
                opacity: currentPage === 1 ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeftIcon />
            </button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Rubik',
              fontSize: '14px',
              color: '#1F2937'
            }}>
              <span style={{ fontWeight: 600 }}>{currentPage}</span>
              <span style={{ color: '#6B7280' }}>из {totalPages}</span>
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: currentPage === totalPages ? 'default' : 'pointer', 
                padding: '8px',
                opacity: currentPage === totalPages ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronRightPaginationIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationHistory;