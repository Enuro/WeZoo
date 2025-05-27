import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Heart, User, MapPin, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import CatalogMenu from './CatalogMenu';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [city, setCity] = useState('Загрузка...');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCatalogOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`
          );
          const data = await response.json();
          setCity(data.city || 'Город не определен');
        } catch (error) {
          console.error('Ошибка определения города:', error);
          setCity('Город не определен');
        }
      }, () => {
        setCity('Город не определен');
      });
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (window.scrollY > 100) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsCatalogOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      navigate('/profile');
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleCatalogToggle = () => {
    setIsCatalogOpen(!isCatalogOpen);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'
      } font-gothampro`}> {/* применяем шрифт для всего сайта */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="WeZoo логотип" className="h-8 sm:h-10 w-auto" />
              </Link>
              <div className="hidden md:flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate max-w-[120px]">{city}</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-5">
              <button 
                className={`flex items-center px-5 py-2 rounded-full border border-emerald-600 transition-colors ${
                  isCatalogOpen 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white text-emerald-600 hover:bg-emerald-50'
                } font-bold font-bezier`}
                onClick={handleCatalogToggle}
              >
                <span className="mr-1 font-medium font-bezier">Каталог</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCatalogOpen ? 'transform rotate-180' : ''}`} />
              </button>
              <Link to="/promotions" className="text-gray-600 hover:text-emerald-600 px-3 py-1 rounded-full hover:bg-emerald-50">Акции</Link>
              <Link to="/delivery" className="text-gray-600 hover:text-emerald-600 px-3 py-1 rounded-full hover:bg-emerald-50">Доставка</Link>
              <Link to="/contacts" className="text-gray-600 hover:text-emerald-600 px-3 py-1 rounded-full hover:bg-emerald-50">Контакты</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-5">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Поиск лекарств..."
                      className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-emerald-500"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                className="text-gray-600 hover:text-emerald-600 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Поиск"
              >
                <Search className="w-6 h-6" />
              </button>
              <button 
                className="text-gray-600 hover:text-emerald-600 p-2 rounded-full hover:bg-gray-100"
                onClick={handleProfileClick}
                aria-label="Профиль"
              >
                <User className="w-6 h-6" />
              </button>
              <button 
                className="text-gray-600 hover:text-emerald-600 p-2 rounded-full hover:bg-gray-100"
                aria-label="Избранное"
              >
                <Heart className="w-6 h-6" />
              </button>
              <button 
                className="text-gray-600 hover:text-emerald-600 p-2 rounded-full hover:bg-gray-100"
                onClick={() => navigate('/cart')}
                aria-label="Корзина"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>
            </div>

            <button
              className="md:hidden inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-600 bg-white text-emerald-600"
              onClick={handleCatalogToggle}
            >
              <span className="text-sm font-medium">Каталог</span>
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isCatalogOpen ? 'transform rotate-180' : ''}`} />
            </button>

            <button
              className="md:hidden text-gray-600 p-2"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isCatalogOpen) setIsCatalogOpen(false);
              }}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-lg overflow-hidden"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                <div className="flex items-center py-2 text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{city}</span>
                </div>
                <div className="py-2">
                  <input
                    type="text"
                    placeholder="Поиск..."
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <Link 
                  to="/promotions" 
                  className="block py-2 text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Акции
                </Link>
                <Link 
                  to="/delivery" 
                  className="block py-2 text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Доставка
                </Link>
                <Link 
                  to="/contacts" 
                  className="block py-2 text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Контакты
                </Link>
                <div className="flex space-x-4 py-2">
                  <button 
                    className="text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    onClick={handleProfileClick}
                    aria-label="Профиль"
                  >
                    <User className="w-6 h-6" />
                  </button>
                  <button 
                    className="text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    aria-label="Избранное"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                  <button 
                    className="text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    onClick={() => {
                      navigate('/cart');
                      setIsMenuOpen(false);
                    }}
                    aria-label="Корзина"
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CatalogMenu 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)}
      />
    </>
  );
};

export default Header;
