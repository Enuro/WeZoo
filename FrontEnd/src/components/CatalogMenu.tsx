import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Типы данных для категорий каталога
interface SubCategory {
  id: number;
  name: string;
  link: string;
}

interface Category {
  id: number;
  name: string;
  icon?: React.ReactNode;
  subCategories: SubCategory[];
}

// Демо-данные для категорий (можно будет заменить на данные из API)
const categories: Category[] = [
  {
    id: 1,
    name: 'Лекарственные препараты',
    subCategories: [
      { id: 101, name: 'Антибиотики', link: '/catalog/antibiotics' },
      { id: 102, name: 'Противопаразитарные', link: '/catalog/antiparasitic' },
      { id: 103, name: 'Противовоспалительные', link: '/catalog/anti-inflammatory' },
      { id: 104, name: 'Для пищеварения', link: '/catalog/digestive' },
      { id: 105, name: 'Витамины и минералы', link: '/catalog/vitamins' },
    ]
  },
  {
    id: 2,
    name: 'Корма и диеты',
    subCategories: [
      { id: 201, name: 'Сухие корма', link: '/catalog/dry-food' },
      { id: 202, name: 'Влажные корма', link: '/catalog/wet-food' },
      { id: 203, name: 'Лечебные диеты', link: '/catalog/therapeutic-diets' },
      { id: 204, name: 'Лакомства', link: '/catalog/treats' },
    ]
  },
  {
    id: 3,
    name: 'Средства по уходу',
    subCategories: [
      { id: 301, name: 'Шампуни и кондиционеры', link: '/catalog/shampoos' },
      { id: 302, name: 'Для ушей и глаз', link: '/catalog/ears-eyes' },
      { id: 303, name: 'Средства для зубов', link: '/catalog/dental-care' },
      { id: 304, name: 'Средства от запаха', link: '/catalog/odor-control' },
    ]
  },
  {
    id: 4,
    name: 'Гигиена и груминг',
    subCategories: [
      { id: 401, name: 'Щетки и расчески', link: '/catalog/brushes' },
      { id: 402, name: 'Машинки для стрижки', link: '/catalog/clippers' },
      { id: 403, name: 'Когтерезы', link: '/catalog/claw-cutters' },
      { id: 404, name: 'Пеленки и подгузники', link: '/catalog/diapers' },
    ]
  },
  {
    id: 5,
    name: 'Товары для дома',
    subCategories: [
      { id: 501, name: 'Лежаки и домики', link: '/catalog/beds' },
      { id: 502, name: 'Миски и поилки', link: '/catalog/bowls' },
      { id: 503, name: 'Игрушки', link: '/catalog/toys' },
      { id: 504, name: 'Переноски', link: '/catalog/carriers' },
    ]
  },
];

// Категории для мобильной версии
const petTypes = ['Собаки', 'Кошки', 'Птицы', 'Грызуны', 'Рептилии', 'Рыбы'];

interface CatalogMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CatalogMenu: React.FC<CatalogMenuProps> = ({ isOpen, onClose }) => {
  // Состояния для мобильных подменю
  const [activeTab, setActiveTab] = React.useState<number | null>(null);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = React.useState(false);

  // Обработчик для открытия подменю на мобильных устройствах
  const handleMobileTabClick = (id: number) => {
    if (activeTab === id) {
      setActiveTab(null);
      setIsMobileSubmenuOpen(false);
    } else {
      setActiveTab(id);
      setIsMobileSubmenuOpen(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Контейнер меню */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 inset-x-0 bg-white z-50 shadow-xl md:top-16"
          >
            {/* Панель выбора типа животного (только на мобильных) */}
            <div className="md:hidden bg-gray-100 p-4">
              <div className="flex overflow-x-auto space-x-3 pb-2">
                {petTypes.map((pet, index) => (
                  <button 
                    key={index}
                    className="px-4 py-2 bg-white rounded-full text-sm whitespace-nowrap border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-600"
                  >
                    {pet}
                  </button>
                ))}
              </div>
            </div>

            {/* Основной контент меню */}
            <div className="max-w-7xl mx-auto p-4">
              {/* Десктопная версия */}
              <div className="hidden md:grid md:grid-cols-5 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <h3 className="text-lg font-medium font-bezier text-gray-800">{category.name}</h3>
                    <ul className="space-y-2">
                      {category.subCategories.map((sub) => (
                        <li key={sub.id}>
                          <Link 
                            to={sub.link} 
                            className="text-gray-600 hover:text-emerald-600 block"
                            onClick={onClose}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link 
                      to={`/catalog/${category.id}`} 
                      className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center text-sm"
                      onClick={onClose}
                    >
                      Все товары
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Мобильная версия */}
              <div className="md:hidden space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="border-b border-gray-200 last:border-b-0">
                    <button
                      className={`flex items-center justify-between w-full py-3 text-left ${
                        activeTab === category.id ? 'text-emerald-600 font-medium' : 'text-gray-800'
                      }`}
                      onClick={() => handleMobileTabClick(category.id)}
                    >
                      <span>{category.name}</span>
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        activeTab === category.id ? 'transform rotate-90' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeTab === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul className="pl-4 pb-3 space-y-2">
                            {category.subCategories.map((sub) => (
                              <li key={sub.id}>
                                <Link 
                                  to={sub.link} 
                                  className="text-gray-600 block py-1"
                                  onClick={onClose}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link 
                                to={`/catalog/${category.id}`} 
                                className="text-emerald-600 font-medium block py-1"
                                onClick={onClose}
                              >
                                Все товары
                              </Link>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Нижняя панель с акциями и т.д. */}
            <div className="bg-emerald-50 p-4">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="space-x-6">
                  <Link 
                    to="/special-offers" 
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                    onClick={onClose}
                  >
                    Акции
                  </Link>
                  <Link 
                    to="/new-products" 
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                    onClick={onClose}
                  >
                    Новинки
                  </Link>
                  <Link 
                    to="/best-sellers" 
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                    onClick={onClose}
                  >
                    Хиты продаж
                  </Link>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CatalogMenu;