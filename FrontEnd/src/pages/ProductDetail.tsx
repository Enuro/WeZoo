import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useProductStore } from '../store/productStore';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Получаем методы и данные из хранилища
  const { getProduct, getProductDetails, addToCart } = useProductStore();
  
  // Находим товар по ID
  const product = getProduct(Number(id));
  const productDetails = getProductDetails(Number(id));

  // Эффект для прокрутки страницы вверх при загрузке деталей товара
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Если товар не найден
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Товар не найден</h1>
        <p className="text-gray-600 mb-6">К сожалению, запрашиваемый товар не существует или был удален.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  // Вычисляем итоговую цену с учетом скидки
  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  // Обработчики для изменения количества
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Обработчик добавления в корзину
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Имитация задержки запроса
    setTimeout(() => {
      addToCart(product.id, quantity);
      setIsAddingToCart(false);
      
      // Можем добавить уведомление об успешном добавлении здесь
    }, 500);
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' ₽';
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
      {/* Кнопка назад */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-emerald-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span>Назад</span>
      </button>

      {/* Информация о товаре */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Изображение товара */}
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto rounded-lg object-cover"
          />
          {product.discount && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
              -{product.discount}%
            </div>
          )}
          {product.isPromo && (
            <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full font-semibold">
              Акция
            </div>
          )}
        </div>

        {/* Детали товара */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-emerald-600">
              {formatPrice(finalPrice)}
            </span>
            {product.discount && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Количество:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={decreaseQuantity}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={isAddingToCart}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={isAddingToCart}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center disabled:bg-emerald-400"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    <span>Добавление...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span>В корзину</span>
                  </>
                )}
              </button>
              <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная информация о товаре */}
      {productDetails && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Информация о товаре</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Производитель</h3>
                <p className="text-gray-600">{productDetails.manufacturer}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Страна</h3>
                <p className="text-gray-600">{productDetails.country}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Активные компоненты</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {productDetails.activeIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Показания к применению</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {productDetails.indications.map((indication, index) => (
                    <li key={index}>{indication}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Противопоказания</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {productDetails.contraindications.map((contraindication, index) => (
                    <li key={index}>{contraindication}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Способ применения</h3>
                <p className="text-gray-600">{productDetails.howToUse}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Условия хранения</h3>
                <p className="text-gray-600">{productDetails.storageConditions}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Срок годности</h3>
                <p className="text-gray-600">{productDetails.expirationDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;