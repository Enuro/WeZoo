import React, { useState } from 'react';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useProductStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' ₽';
  };
  
  // Вычисляем итоговую цену с учетом скидки
  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  // Обработчик клика по карточке товара
  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };
  
  // Обработчик добавления в корзину
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем переход на страницу товара
    
    setIsAddingToCart(true);
    
    // Имитация задержки запроса для демонстрации загрузки
    setTimeout(() => {
      addToCart(product.id, 1);
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      
      // Сбрасываем состояние "добавлено" через 1.5 секунды
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 1500);
    }, 500);
  };

  // Обработчик добавления в избранное
  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем переход на страницу товара
    // Тут будет логика добавления в избранное
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 group border border-gray-100"
      onClick={handleProductClick}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            -{product.discount}%
          </div>
        )}
        {product.isPromo && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Акция
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h3>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xl font-bold text-emerald-600">
              {formatPrice(finalPrice)}
            </span>
            {product.discount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 flex-wrap sm:flex-nowrap">
          <motion.button 
            className={`flex-1 py-2 px-3 sm:px-4 rounded-full flex items-center justify-center font-medium transition-colors text-sm sm:text-base ${
              isAddedToCart
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
            }`}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            disabled={isAddingToCart || isAddedToCart}
          >
            {isAddingToCart ? (
              <span className="inline-block animate-spin mr-1">⟳</span>
            ) : isAddedToCart ? (
              <Check className="w-4 h-4 mr-1" />
            ) : (
              <ShoppingCart className="w-4 h-4 mr-1" />
            )}
            <span>{isAddedToCart ? 'Добавлено' : 'В корзину'}</span>
          </motion.button>
          
          <motion.button 
            className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
            onClick={handleAddToFavorites}
            whileTap={{ scale: 0.9 }}
            aria-label="Добавить в избранное"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;