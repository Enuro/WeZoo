import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface PromoSliderProps {
  products: Product[];
}

// Дополняем массив товаров для бесконечной прокрутки
const extendProducts = (products: Product[], count: number = 10): Product[] => {
  if (products.length === 0) return [];
  const extended = [...products];
  
  // Дублируем товары, пока не получим нужное количество
  while (extended.length < count) {
    const additionalProducts = products.map((product) => ({
      ...product,
      id: product.id + extended.length // Создаем уникальные ID для дубликатов
    }));
    extended.push(...additionalProducts);
  }
  
  return extended;
};

const PromoSlider: React.FC<PromoSliderProps> = ({ products }) => {
  // Расширенный список продуктов для плавной бесконечной прокрутки
  const extendedProducts = extendProducts(products);
  
  const [width, setWidth] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  const carousel = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Рассчитываем ширину карусели для анимации
  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [extendedProducts.length]);
  
  // Функция для запуска автопрокрутки
  const startAutoplay = () => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
    
    autoplayTimeoutRef.current = setTimeout(() => {
      setAutoplay(true);
    }, 2000); // Возобновить автопрокрутку через 2 секунды после взаимодействия
  };
  
  // Получение текущей позиции слайдера из DOM
  const getCurrentPosition = (): number => {
    if (!carousel.current || !carousel.current.firstChild) return 0;
    
    const transform = (carousel.current.firstChild as HTMLElement).style.transform;
    const match = transform.match(/translateX\((.+?)px\)/);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
    return 0;
  };
  
  // Автоматическая прокрутка с использованием requestAnimationFrame
  useEffect(() => {
    if (!autoplay || isDragging || width <= 0) return;
    
    const startTime = Date.now();
    const duration = 40000; // 40 секунд на полный цикл прокрутки (замедлили с 20 до 40 секунд)
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const loopProgress = (elapsed % duration) / duration;
      
      // Текущая позиция для прокрутки
      const position = -width * loopProgress;
      
      // Обновляем позицию
      controls.set({ x: position });
      
      // Продолжаем анимацию
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Запускаем анимацию
    animationRef.current = requestAnimationFrame(animate);
    
    // Очистка при размонтировании
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoplay, isDragging, width, controls]);
  
  // Обработчики перетаскивания
  const handleDragStart = () => {
    setIsDragging(true);
    setAutoplay(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    startAutoplay();
  };
  
  // Обработчики для кнопок навигации
  const handlePrev = () => {
    setAutoplay(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Получаем текущую позицию
    const currentX = getCurrentPosition();
    
    // Прокручиваем на 300px влево (или до начала)
    const newPosition = Math.min(0, currentX + 300);
    controls.start({ 
      x: newPosition,
      transition: { duration: 0.5 }
    });
    
    startAutoplay();
  };
  
  const handleNext = () => {
    setAutoplay(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Получаем текущую позицию
    const currentX = getCurrentPosition();
    
    // Прокручиваем на 300px вправо (или до конца)
    const newPosition = Math.max(-width, currentX - 300);
    controls.start({ 
      x: newPosition,
      transition: { duration: 0.5 }
    });
    
    startAutoplay();
  };
  
  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Акции дня</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNext}
            className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden cursor-grab" ref={carousel}>
        <motion.div 
          className="flex space-x-6"
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          dragElastic={0.1}
          animate={controls}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onMouseDown={() => {
            setAutoplay(false);
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
          }}
          onTouchStart={() => {
            setAutoplay(false);
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
          }}
          onMouseUp={() => startAutoplay()}
          onTouchEnd={() => startAutoplay()}
        >
          {extendedProducts.map((product) => (
            <motion.div 
              key={product.id} 
              className="min-w-[250px] sm:min-w-[280px] lg:min-w-[300px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PromoSlider;