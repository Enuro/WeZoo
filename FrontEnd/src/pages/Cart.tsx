import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../types';

function Cart() {
  // Демо-данные для корзины
  const [cartItems] = React.useState<CartItem[]>([
    {
      id: 1,
      name: "Vitamin C Complex",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      quantity: 2
    },
    {
      id: 2,
      name: "Omega-3 Fish Oil",
      price: 24.99,
      image: "https://avatars.mds.yandex.net/i?id=fde21b14355402df71ef0e644df3618de3622dc7-10455853-images-thumbs&n=13",
      quantity: 1
    }
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Корзина</h1>
      
      {cartItems.length > 0 ? (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-emerald-600 font-bold">${item.price}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button className="px-3 py-1 hover:bg-gray-100">-</button>
                    <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                    <button className="px-3 py-1 hover:bg-gray-100">+</button>
                  </div>
                  
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Итого:</span>
              <span className="text-2xl font-bold text-emerald-600">${total.toFixed(2)}</span>
            </div>
            
            <button className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
              Оформить заказ
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Ваша корзина пуста</p>
        </div>
      )}
    </div>
  );
}

export default Cart;