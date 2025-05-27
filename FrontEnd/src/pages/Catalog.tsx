import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AccordionFilters from '../components/AccordionFilters';
import { useProductStore } from '../store/productStore';
import { Product } from '../types';

function Catalog() {
  const { products } = useProductStore();
  const location = useLocation();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('popular');
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  
  // Для отладки - логируем примененные фильтры
  useEffect(() => {
    if (appliedFilters) {
      console.log('Applied filters in Catalog:', appliedFilters);
    }
  }, [appliedFilters]);

  // Функция для применения фильтров к списку товаров
  const getFilteredProducts = (): Product[] => {
    // В реальном приложении здесь бы была логика фильтрации на основе appliedFilters
    // Для демо просто возвращаем все товары
    return products;
  };

  const filteredProducts = getFilteredProducts();

  // Сортировка товаров
  const getSortedProducts = (products: Product[]): Product[] => {
    switch (sortOption) {
      case 'price-asc':
        return [...products].sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
      case 'price-desc':
        return [...products].sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'discount':
        return [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'popular':
      default:
        // Для демо просто возвращаем исходный массив
        return products;
    }
  };

  const sortedProducts = getSortedProducts(filteredProducts);

  // Обработчик изменения фильтров
  const handleFilterChange = (selectedFilters: Record<string, string[]>) => {
    // Закрываем мобильные фильтры при выборе фильтра
    setIsMobileFiltersOpen(false);
    
    // Здесь можно добавить логику применения фильтров
    console.log('Applied filters:', selectedFilters);
    setAppliedFilters(selectedFilters);
  };
  
  // Закрываем мобильные фильтры при прокрутке
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileFiltersOpen) {
        setIsMobileFiltersOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileFiltersOpen]);

  // Обработчик изменения сортировки
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold font-bezier text-gray-800 mb-6">Каталог товаров</h1>

      {/* Фильтры и сортировка для мобильных */}
      <div className="flex mb-4 md:hidden">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center justify-center flex-1 py-2 bg-white border border-gray-300 rounded-lg mr-2"
        >
          <span>Фильтры</span>
        </button>
        <div className="flex-1 relative">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="w-full py-2 px-3 bg-white border border-gray-300 rounded-lg appearance-none"
          >
            <option value="popular">Популярные</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="name">По названию</option>
            <option value="discount">По скидке</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Фильтры в виде аккордеона для десктопа */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <AccordionFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Список товаров */}
        <div className="flex-grow">
          {/* Верхняя панель с количеством товаров, сортировкой и переключением вида */}
          <div className="flex justify-between items-center mb-6 bg-gray-50 p-3 rounded-lg">
            <div className="px-4 py-1 bg-white border border-emerald-100 text-emerald-700 rounded-full text-sm font-medium font-bezier">
              Найдено: {sortedProducts.length} товаров
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-700">Сортировка:</label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={handleSortChange}
                    className="pl-3 pr-8 py-1 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="popular">Популярные</option>
                    <option value="price-asc">Сначала дешевле</option>
                    <option value="price-desc">Сначала дороже</option>
                    <option value="name">По названию</option>
                    <option value="discount">По скидке</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500'}`}
                  aria-label="Сетка"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500'}`}
                  aria-label="Список"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Сетка товаров */}
          {sortedProducts.length > 0 ? (
            <div className={`grid gap-3 sm:gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg mb-4">По вашему запросу ничего не найдено</p>
              <p className="text-gray-600">Попробуйте изменить параметры фильтрации или выбрать другую категорию</p>
            </div>
          )}
        </div>
      </div>

      {/* Мобильные фильтры */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Фильтры</h3>
            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <AccordionFilters onFilterChange={handleFilterChange} isMobile={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Catalog;