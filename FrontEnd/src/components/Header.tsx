import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Heart, User, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [city, setCity] = useState('Загрузка...');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

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
      if (window.scrollY > 50) {
        setIsSearchOpen(false);
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
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-emerald-600">
              Наша Аптека
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{city}</span>
            </div>
            <Link to="/" className="text-gray-600 hover:text-emerald-600">Каталог</Link>
            <Link to="/" className="text-gray-600 hover:text-emerald-600">Акции</Link>
            <Link to="/" className="text-gray-600 hover:text-emerald-600">Контакты</Link>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
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
              className="text-gray-600 hover:text-emerald-600"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-6 h-6" />
            </button>
            <button 
              className="text-gray-600 hover:text-emerald-600"
              onClick={handleProfileClick}
            >
              <User className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-emerald-600">
              <Heart className="w-6 h-6" />
            </button>
            <button 
              className="text-gray-600 hover:text-emerald-600"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
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
              <Link to="/" className="block py-2 text-gray-600">Каталог</Link>
              <Link to="/" className="block py-2 text-gray-600">Акции</Link>
              <Link to="/" className="block py-2 text-gray-600">Контакты</Link>
              <div className="flex space-x-4 py-2">
                <button 
                  className="text-gray-600"
                  onClick={handleProfileClick}
                >
                  <User className="w-6 h-6" />
                </button>
                <button className="text-gray-600">
                  <Heart className="w-6 h-6" />
                </button>
                <button 
                  className="text-gray-600"
                  onClick={() => {
                    navigate('/cart');
                    setIsMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;