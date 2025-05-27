import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface FilterOption {
  id: string;
  name: string;
  count?: number;
  link?: string;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

// Данные для фильтров в виде аккордеона
const filterGroups: FilterGroup[] = [
  {
    id: 'pet_type',
    title: 'Тип животного',
    options: [
      { id: 'dogs', name: 'Собаки', count: 124, link: '/catalog/dogs' },
      { id: 'cats', name: 'Кошки', count: 98, link: '/catalog/cats' },
      { id: 'birds', name: 'Птицы', count: 45, link: '/catalog/birds' },
      { id: 'rodents', name: 'Грызуны', count: 32, link: '/catalog/rodents' },
      { id: 'fish', name: 'Рыбы', count: 18, link: '/catalog/fish' },
    ]
  },
  {
    id: 'medicine',
    title: 'Лекарственные препараты',
    options: [
      { id: 'antibiotics', name: 'Антибиотики', count: 37, link: '/catalog/antibiotics' },
      { id: 'antiparasitic', name: 'Противопаразитарные', count: 42, link: '/catalog/antiparasitic' },
      { id: 'anti-inflammatory', name: 'Противовоспалительные', count: 29, link: '/catalog/anti-inflammatory' },
      { id: 'digestive', name: 'Для пищеварения', count: 33, link: '/catalog/digestive' },
      { id: 'vitamins', name: 'Витамины и минералы', count: 56, link: '/catalog/vitamins' },
    ]
  },
  {
    id: 'food',
    title: 'Корма и диеты',
    options: [
      { id: 'dry-food', name: 'Сухие корма', count: 65, link: '/catalog/dry-food' },
      { id: 'wet-food', name: 'Влажные корма', count: 43, link: '/catalog/wet-food' },
      { id: 'therapeutic-diets', name: 'Лечебные диеты', count: 28, link: '/catalog/therapeutic-diets' },
      { id: 'treats', name: 'Лакомства', count: 19, link: '/catalog/treats' },
    ]
  },
  {
    id: 'care',
    title: 'Средства по уходу',
    options: [
      { id: 'shampoos', name: 'Шампуни и кондиционеры', count: 34, link: '/catalog/shampoos' },
      { id: 'ears-eyes', name: 'Для ушей и глаз', count: 27, link: '/catalog/ears-eyes' },
      { id: 'dental-care', name: 'Средства для зубов', count: 21, link: '/catalog/dental-care' },
      { id: 'odor-control', name: 'Средства от запаха', count: 18, link: '/catalog/odor-control' },
    ]
  },
  {
    id: 'grooming',
    title: 'Гигиена и груминг',
    options: [
      { id: 'brushes', name: 'Щетки и расчески', count: 23, link: '/catalog/brushes' },
      { id: 'clippers', name: 'Машинки для стрижки', count: 16, link: '/catalog/clippers' },
      { id: 'claw-cutters', name: 'Когтерезы', count: 14, link: '/catalog/claw-cutters' },
      { id: 'diapers', name: 'Пеленки и подгузники', count: 22, link: '/catalog/diapers' },
    ]
  },
  {
    id: 'accessories',
    title: 'Товары для дома',
    options: [
      { id: 'beds', name: 'Лежаки и домики', count: 45, link: '/catalog/beds' },
      { id: 'bowls', name: 'Миски и поилки', count: 38, link: '/catalog/bowls' },
      { id: 'toys', name: 'Игрушки', count: 29, link: '/catalog/toys' },
      { id: 'carriers', name: 'Переноски', count: 27, link: '/catalog/carriers' },
    ]
  },
  {
    id: 'brands',
    title: 'Производитель',
    options: [
      { id: 'royal-canin', name: 'Royal Canin', count: 32, link: '/catalog/brand/royal-canin' },
      { id: 'hills', name: 'Hill\'s', count: 28, link: '/catalog/brand/hills' },
      { id: 'purina', name: 'Purina', count: 25, link: '/catalog/brand/purina' },
      { id: 'bayer', name: 'Bayer', count: 20, link: '/catalog/brand/bayer' },
      { id: 'zoetis', name: 'Zoetis', count: 18, link: '/catalog/brand/zoetis' },
    ]
  }
];

interface AccordionFiltersProps {
  onFilterChange?: (selectedFilters: Record<string, string[]>) => void;
  isMobile?: boolean;
}

const AccordionFilters: React.FC<AccordionFiltersProps> = ({ onFilterChange, isMobile = false }) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([filterGroups[0].id]); // Первая группа открыта по умолчанию
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const location = useLocation();

  // Закрываем фильтры при прокрутке страницы (только на десктопе)
  useEffect(() => {
    if (!isMobile) {
      const handleScroll = () => {
        if (window.scrollY > 200) {
          setExpandedGroups([]);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]);

  // Закрываем фильтры при изменении маршрута
  useEffect(() => {
    setExpandedGroups([]);
    setSelectedFilters({});
  }, [location.pathname]);

  // Переключатель раскрытия группы
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Обработчик выбора фильтра
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>, groupId: string, optionId: string) => {
    const isChecked = event.target.checked;
    
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      // Если такой группы еще нет, создаем
      if (!newFilters[groupId]) {
        newFilters[groupId] = [];
      }
      
      if (isChecked) {
        // Добавляем опцию, если ее еще нет
        if (!newFilters[groupId].includes(optionId)) {
          newFilters[groupId] = [...newFilters[groupId], optionId];
        }
      } else {
        // Убираем опцию
        newFilters[groupId] = newFilters[groupId].filter(id => id !== optionId);
        
        // Если в группе не осталось выбранных опций, удаляем группу
        if (newFilters[groupId].length === 0) {
          delete newFilters[groupId];
        }
      }
      
      return newFilters;
    });
  };

  // Применение фильтров
  const applyFilters = () => {
    if (onFilterChange) {
      console.log('Applying filters:', selectedFilters);
      onFilterChange(selectedFilters);
    }
  };

  // Сброс фильтров
  const resetFilters = () => {
    setSelectedFilters({});
  };

  // Счетчик выбранных фильтров
  const countSelectedFilters = () => {
    let count = 0;
    Object.values(selectedFilters).forEach(group => {
      count += group.length;
    });
    return count;
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 mt-16">
      <div className="text-lg font-medium font-bezier p-4 border-b border-gray-200">
        Фильтры
      </div>
      {filterGroups.map((group) => (
        <div key={group.id} className="border-b border-gray-200 last:border-b-0">
          <button
            className="flex justify-between items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            onClick={() => toggleGroup(group.id)}
          >
            <span className="font-medium font-bezier text-gray-800">{group.title}</span>
            {expandedGroups.includes(group.id) 
              ? <ChevronUp className="w-5 h-5 text-gray-500" />
              : <ChevronDown className="w-5 h-5 text-gray-500" />
            }
          </button>
          
          <AnimatePresence>
            {expandedGroups.includes(group.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-gray-50"
              >
                <div className="p-4">
                  <ul className="space-y-3">
                    {group.options.map((option) => (
                      <li key={option.id}>
                        <div className="flex items-center justify-between py-1">
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              name={`${group.id}-${option.id}`}
                              checked={selectedFilters[group.id]?.includes(option.id) || false}
                              onChange={(e) => handleFilterChange(e, group.id, option.id)}
                              className="form-checkbox h-5 w-5 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500"
                            />
                            <span className="ml-3 text-gray-700 group-hover:text-emerald-600 transition-colors">
                              {option.name}
                            </span>
                          </label>
                          {option.count !== undefined && (
                            <span className="text-gray-500 text-sm rounded-full bg-white px-2 py-0.5 border border-gray-200">{option.count}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      
      {/* Кнопки применения и сброса фильтров */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button
            onClick={resetFilters}
            className={`px-4 py-2 border rounded-md transition-colors ${
              countSelectedFilters() > 0
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={countSelectedFilters() === 0}
          >
            Сбросить
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Применить{countSelectedFilters() > 0 ? ` (${countSelectedFilters()})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccordionFilters;