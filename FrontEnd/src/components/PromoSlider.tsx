import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface PromoSliderProps {
  products: Product[];
}

const PromoSlider: React.FC<PromoSliderProps> = ({ products }) => {
  return (
    <div className="w-full overflow-hidden py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Deals</h2>
      <motion.div
        className="flex space-x-6"
        animate={{
          x: [-100, 0],
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-72 flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default PromoSlider;