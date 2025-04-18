import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useProductStore();
  
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
    addToCart(product.id, 1);
  };

  // Обработчик добавления в избранное
  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем переход на страницу товара
    // Тут будет логика добавления в избранное
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex justify-between items-center">
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
          <div className="flex space-x-2">
            <button 
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              onClick={handleAddToFavorites}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;