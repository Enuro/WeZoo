import React from 'react';
import { Trash2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateCartItemQuantity, removeFromCart } = useProductStore();

  // Расчет итоговой суммы
  const total = cartItems.reduce((sum, item) => {
    // Учитываем скидку, если она есть
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);
  
  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' ₽';
  };

  // Если корзина пуста, показываем соответствующее сообщение
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Корзина</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-6">Ваша корзина пуста</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Корзина</h1>
      
      <div className="space-y-4">
        {cartItems.map((item) => {
          // Вычисляем цену с учетом скидки
          const finalPrice = item.discount 
            ? item.price * (1 - item.discount / 100) 
            : item.price;
          
          return (
            <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              />
              
              <div className="flex-grow">
                <h3 
                  className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-emerald-600"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.name}
                </h3>
                <div className="flex items-center mt-1">
                  <p className="text-emerald-600 font-bold">{formatPrice(finalPrice)}</p>
                  {item.discount && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    className="px-3 py-1 hover:bg-gray-100"
                    onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                  <button 
                    className="px-3 py-1 hover:bg-gray-100"
                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="p-2 text-gray-500 hover:text-red-500"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Итого:</span>
          <span className="text-2xl font-bold text-emerald-600">{formatPrice(total)}</span>
        </div>
        
        <button className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

export default Cart;