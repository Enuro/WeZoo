import React, { useState, useEffect } from 'react';
import './Header.css';
import jezlLogo from '../assets/jezl.png';
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaHeart, FaUser, FaBars } from 'react-icons/fa';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [userLocation, setUserLocation] = useState('Загрузка...');

 
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`
            );
            
            if (response.ok) {
              const data = await response.json();
              const city = data.address.city || 
                          data.address.town || 
                          data.address.village || 
                          data.address.hamlet || 
                          'Неизвестный город';
              
              setUserLocation(city);
            } else {
              setUserLocation('Город'); 
            }
          }, 
          (error) => {
            console.error("Ошибка получения геопозиции:", error);
            setUserLocation('Город'); 
          });
        } else {
          console.log("Геолокация не поддерживается вашим браузером");
          setUserLocation('Город'); 
        }
      } catch (error) {
        console.error("Ошибка при определении локации:", error);
        setUserLocation('Город'); 
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100); 
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <header className={`header ${isSticky ? 'sticky' : ''}`}>
      <div className="header-container">
        <div className="left-section">
          <div className="location-selector">
            <FaMapMarkerAlt className="location-icon" />
            <span>{userLocation}</span>
          </div>

          <div className="logo" onClick={handleLogoClick}>
            <img src={jezlLogo} alt="Jezl Logo" className="logo-image" />
            <span className="logo-text">Аптека</span>
          </div>
        </div>

        <button className="catalog-button">
          <FaBars className="catalog-icon" />
          <span>Каталог</span>
        </button>

        <div className="search-container desktop-search">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Искать от холестерина, омега 3, Витамин Д, для суставов..."
              className="search-input"
            />
            <button className="search-button">
              <FaSearch className="search-icon" />
            </button>
          </div>
        </div>

        <div className="nav-icons">
          <button className="nav-icon-button">
            <FaShoppingCart className="nav-icon" />
            <span className="nav-icon-text">Корзина</span>
          </button>
          <button className="nav-icon-button">
            <FaHeart className="nav-icon" />
            <span className="nav-icon-text">Избранное</span>
          </button>
          <button className="nav-icon-button">
            <FaUser className="nav-icon" />
            <span className="nav-icon-text">Войти</span>
          </button>
        </div>
      </div>

      <div className="search-container mobile-search">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Искать от холестерина, омега 3, Витамин Д..."
            className="search-input"
          />
          <button className="search-button">
            <FaSearch className="search-icon" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;