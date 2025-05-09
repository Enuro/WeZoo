import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Определение интерфейсов для фильтров категорий
interface FilterOption {
  id: number;
  name: string;
  link?: string;
}

interface FilterCategory {
  id: number;
  name: string;
  options: FilterOption[];
}

// Демо-данные для фильтров
const petTypes: FilterOption[] = [
  { id: 1, name: 'Собаки', link: '/catalog/dogs' },
  { id: 2, name: 'Кошки', link: '/catalog/cats' },
  { id: 3, name: 'Птицы', link: '/catalog/birds' },
  { id: 4, name: 'Грызуны', link: '/catalog/rodents' },
  { id: 5, name: 'Рептилии', link: '/catalog/reptiles' },
  { id: 6, name: 'Рыбы', link: '/catalog/fish' },
];

const categories: FilterCategory[] = [
  {
    id: 1,
    name: 'Категории',
    options: [
      { id: 101, name: 'Лекарства', link: '/catalog/medicine' },
      { id: 102, name: 'Корма', link: '/catalog/food' },
      { id: 103, name: 'Уход', link: '/catalog/care' },
      { id: 104, name: 'Гигиена', link: '/catalog/hygiene' },
      { id: 105, name: 'Аксессуары', link: '/catalog/accessories' },
    ]
  },
  {
    id: 2,
    name: 'Назначение',
    options: [
      { id: 201, name: 'Антибиотики', link: '/catalog/antibiotics' },
      { id: 202, name: 'Противовирусные', link: '/catalog/antiviral' },
      { id: 203, name: 'Антипаразитарные', link: '/catalog/antiparasitic' },
      { id: 204, name: 'Добавки', link: '/catalog/supplements' },
      { id: 205, name: 'Витамины', link: '/catalog/vitamins' },
    ]
  },
  {
    id: 3,
    name: 'Цены',
    options: [
      { id: 301, name: 'До 500 ₽', link: '/catalog/price-up-to-500' },
      { id: 302, name: '500-1000 ₽', link: '/catalog/price-500-1000' },
      { id: 303, name: '1000-3000 ₽', link: '/catalog/price-1000-3000' },
      { id: 304, name: 'От 3000 ₽', link: '/catalog/price-from-3000' },
    ]
  },
];

interface CategoryFiltersProps {
  title?: string;
  showTitle?: boolean;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
  title = "Категории товаров",
  showTitle = true 
}) => {
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<number>(1); // По умолчанию первая категория активна

  const handlePetSelect = (id: number) => {
    setSelectedPet(id === selectedPet ? null : id);
  };

  return (
    <div className="py-8">
      <div className="overflow-hidden">
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        )}
        
        {/* Фильтр по типу животного */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Выберите питомца</h3>
          <div className="flex flex-wrap gap-3">
            {petTypes.map((pet) => (
              <button
                key={pet.id}
                onClick={() => handlePetSelect(pet.id)}
                className={`px-5 py-2 rounded-full border transition-colors ${
                  selectedPet === pet.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-600 hover:text-emerald-600'
                }`}
              >
                {pet.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Вкладки категорий */}
        <div className="mb-4 border-b border-gray-200">
          <div className="flex overflow-x-auto space-x-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategoryTab(category.id)}
                className={`pb-2 px-1 text-base font-medium relative whitespace-nowrap ${
                  activeCategoryTab === category.id
                    ? 'text-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                {category.name}
                {activeCategoryTab === category.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Содержимое активной вкладки */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {categories
            .find(category => category.id === activeCategoryTab)?.options
            .map((option) => (
              <Link
                key={option.id}
                to={option.link || '#'}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50 text-center transition-colors text-sm"
              >
                {option.name}
              </Link>
            ))}
        </div>
        
        {/* Кнопка "Показать все" */}
        <div className="text-center">
          <Link
            to="/catalog"
            className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium"
          >
            Показать все товары
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;