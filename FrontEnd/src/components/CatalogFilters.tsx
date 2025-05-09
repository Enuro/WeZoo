import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Search, Filter, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterGroup {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: FilterOption[];
  range?: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

// Примерные данные фильтров для демонстрации
const filterGroups: FilterGroup[] = [
  {
    id: 'petType',
    title: 'Тип животного',
    type: 'checkbox',
    options: [
      { id: 'dog', label: 'Собаки', count: 124 },
      { id: 'cat', label: 'Кошки', count: 98 },
      { id: 'bird', label: 'Птицы', count: 45 },
      { id: 'rodent', label: 'Грызуны', count: 32 },
      { id: 'fish', label: 'Рыбы', count: 18 },
    ]
  },
  {
    id: 'category',
    title: 'Категория',
    type: 'checkbox',
    options: [
      { id: 'medicine', label: 'Лекарства', count: 87 },
      { id: 'food', label: 'Корма', count: 65 },
      { id: 'accessories', label: 'Аксессуары', count: 53 },
      { id: 'toys', label: 'Игрушки', count: 41 },
      { id: 'hygiene', label: 'Гигиена', count: 38 },
    ]
  },
  {
    id: 'brand',
    title: 'Производитель',
    type: 'checkbox',
    options: [
      { id: 'royal-canin', label: 'Royal Canin', count: 32 },
      { id: 'hill-s', label: 'Hill\'s', count: 28 },
      { id: 'purina', label: 'Purina', count: 25 },
      { id: 'bayer', label: 'Bayer', count: 20 },
      { id: 'zoetis', label: 'Zoetis', count: 18 },
    ]
  },
  {
    id: 'price',
    title: 'Цена',
    type: 'range',
    range: {
      min: 0,
      max: 10000,
      step: 100,
      unit: '₽'
    }
  },
];

interface CatalogFiltersProps {
  onFilterChange?: (filters: any) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({ 
  onFilterChange, 
  isMobile = false,
  onCloseMobile 
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    filterGroups.map(group => group.id) // По умолчанию все группы развернуты
  );
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [searchQuery, setSearchQuery] = useState('');

  // Переключение развернутости группы фильтров
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Обработчик изменения чекбоксов
  const handleCheckboxChange = (groupId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const group = prev[groupId] || [];
      
      // Если опция уже выбрана, удаляем её
      if (group.includes(optionId)) {
        const newGroup = group.filter(id => id !== optionId);
        
        // Если группа стала пустой, удаляем её из объекта
        if (newGroup.length === 0) {
          const { [groupId]: _, ...rest } = prev;
          return rest;
        }
        
        return { ...prev, [groupId]: newGroup };
      }
      
      // Если опция не выбрана, добавляем её
      return { ...prev, [groupId]: [...group, optionId] };
    });
  };

  // Обработчик изменения радио-кнопок
  const handleRadioChange = (groupId: string, optionId: string) => {
    setSelectedFilters(prev => ({ ...prev, [groupId]: [optionId] }));
  };

  // Обработчик изменения диапазона цен
  const handlePriceRangeChange = (index: number, value: number) => {
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      
      // Убедимся, что минимальное значение не превышает максимальное
      if (index === 0 && value > newRange[1]) {
        newRange[1] = value;
      } else if (index === 1 && value < newRange[0]) {
        newRange[0] = value;
      }
      
      return newRange as [number, number];
    });
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setSelectedFilters({});
    setPriceRange([0, 10000]);
    setSearchQuery('');
  };

  // Применение фильтров
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        filters: selectedFilters,
        priceRange,
        searchQuery
      });
    }
    
    // Закрываем мобильные фильтры, если нужно
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  // Проверяем, есть ли выбранные фильтры
  const hasActiveFilters = Object.keys(selectedFilters).length > 0 || 
                          priceRange[0] > 0 || 
                          priceRange[1] < 10000 ||
                          searchQuery !== '';

  // Считаем количество активных фильтров
  const countActiveFilters = () => {
    let count = 0;
    
    // Считаем чекбоксы/радио
    Object.values(selectedFilters).forEach(group => {
      count += group.length;
    });
    
    // Считаем диапазон цен, если он не по умолчанию
    if (priceRange[0] > 0 || priceRange[1] < 10000) {
      count += 1;
    }
    
    // Считаем поиск, если он не пустой
    if (searchQuery) {
      count += 1;
    }
    
    return count;
  };

  // Получаем название фильтра по ID
  const getFilterNameById = (groupId: string, optionId: string): string => {
    const group = filterGroups.find(g => g.id === groupId);
    if (!group || !group.options) return optionId;
    
    const option = group.options.find(o => o.id === optionId);
    return option ? option.label : optionId;
  };

  // Рендер для мобильной версии фильтров
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Фильтры</h2>
          <button 
            onClick={onCloseMobile}
            className="p-2 text-gray-500"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Поиск */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по фильтрам..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-10 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Группы фильтров */}
          <div className="space-y-4">
            {filterGroups.map(group => (
              <div key={group.id} className="border-b border-gray-200 pb-4">
                <button
                  className="flex justify-between items-center w-full py-2"
                  onClick={() => toggleGroup(group.id)}
                >
                  <span className="font-medium">{group.title}</span>
                  {expandedGroups.includes(group.id) ? 
                    <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                
                <AnimatePresence>
                  {expandedGroups.includes(group.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {group.type === 'checkbox' && group.options && (
                        <div className="pt-2 space-y-2">
                          {group.options.map(option => (
                            <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFilters[group.id]?.includes(option.id) || false}
                                onChange={() => handleCheckboxChange(group.id, option.id)}
                                className="form-checkbox h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                              />
                              <span className="text-gray-700">{option.label}</span>
                              {option.count !== undefined && (
                                <span className="text-gray-500 text-sm">({option.count})</span>
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {group.type === 'range' && group.range && (
                        <div className="pt-2">
                          <div className="flex justify-between mb-2">
                            <span>{priceRange[0]} {group.range.unit}</span>
                            <span>{priceRange[1]} {group.range.unit}</span>
                          </div>
                          <div className="space-y-4">
                            <input
                              type="range"
                              min={group.range.min}
                              max={group.range.max}
                              step={group.range.step}
                              value={priceRange[0]}
                              onChange={e => handlePriceRangeChange(0, Number(e.target.value))}
                              className="w-full accent-emerald-600"
                            />
                            <input
                              type="range"
                              min={group.range.min}
                              max={group.range.max}
                              step={group.range.step}
                              value={priceRange[1]}
                              onChange={e => handlePriceRangeChange(1, Number(e.target.value))}
                              className="w-full accent-emerald-600"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-3">
            <button
              onClick={resetFilters}
              className="flex-1 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50"
              disabled={!hasActiveFilters}
            >
              Сбросить
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700"
            >
              Показать {hasActiveFilters ? `(${countActiveFilters()})` : ''}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Рендер для десктопной версии фильтров
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Сбросить все
          </button>
        )}
      </div>
      
      {/* Поиск */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-10 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Выбранные фильтры */}
      {hasActiveFilters && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Выбранные фильтры:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([groupId, optionIds]) => (
              optionIds.map(optionId => (
                <button
                  key={`${groupId}-${optionId}`}
                  onClick={() => handleCheckboxChange(groupId, optionId)}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm hover:bg-emerald-100"
                >
                  {getFilterNameById(groupId, optionId)}
                  <X className="w-4 h-4 ml-1" />
                </button>
              ))
            ))}
            
            {(priceRange[0] > 0 || priceRange[1] < 10000) && (
              <button
                onClick={() => setPriceRange([0, 10000])}
                className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm hover:bg-emerald-100"
              >
                {priceRange[0]} ₽ - {priceRange[1]} ₽
                <X className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Группы фильтров */}
      <div className="space-y-6">
        {filterGroups.map(group => (
          <div key={group.id}>
            <button
              className="flex justify-between items-center w-full mb-3"
              onClick={() => toggleGroup(group.id)}
            >
              <span className="font-medium">{group.title}</span>
              {expandedGroups.includes(group.id) ? 
                <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </button>
            
            <AnimatePresence>
              {expandedGroups.includes(group.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {group.type === 'checkbox' && group.options && (
                    <div className="space-y-2 mb-4">
                      {group.options.map(option => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedFilters[group.id]?.includes(option.id) || false}
                              onChange={() => handleCheckboxChange(group.id, option.id)}
                              className="opacity-0 absolute h-5 w-5 cursor-pointer"
                            />
                            <div className={`border w-5 h-5 rounded flex items-center justify-center ${
                              selectedFilters[group.id]?.includes(option.id)
                                ? 'bg-emerald-600 border-emerald-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedFilters[group.id]?.includes(option.id) && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-gray-700 text-sm">{option.label}</span>
                          {option.count !== undefined && (
                            <span className="text-gray-500 text-xs ml-auto">({option.count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {group.type === 'range' && group.range && (
                    <div className="mb-4">
                      <div className="flex justify-between mb-2 text-sm text-gray-700">
                        <span>{priceRange[0]} {group.range.unit}</span>
                        <span>{priceRange[1]} {group.range.unit}</span>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="range"
                          min={group.range.min}
                          max={group.range.max}
                          step={group.range.step}
                          value={priceRange[0]}
                          onChange={e => handlePriceRangeChange(0, Number(e.target.value))}
                          className="w-full accent-emerald-600"
                        />
                        <input
                          type="range"
                          min={group.range.min}
                          max={group.range.max}
                          step={group.range.step}
                          value={priceRange[1]}
                          onChange={e => handlePriceRangeChange(1, Number(e.target.value))}
                          className="w-full accent-emerald-600"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Кнопка применения фильтров */}
      <button
        onClick={applyFilters}
        className="w-full py-2 mt-6 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
      >
        Применить фильтры
      </button>
    </div>
  );
};

export default CatalogFilters;