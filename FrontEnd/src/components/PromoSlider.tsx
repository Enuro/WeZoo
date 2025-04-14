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
  const [progress, setProgress] = useState(0);
  
  const carousel = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<number>(0);
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
  
  // Обновляем прогресс для индикатора
  const updateProgress = (newProgress: number) => {
    progressRef.current = newProgress;
    setProgress(newProgress);
  };
  
  // Автоматическая прокрутка с использованием requestAnimationFrame
  useEffect(() => {
    if (!autoplay || isDragging || width <= 0) return;
    
    const startTime = Date.now();
    const duration = 20000; // 20 секунд на полный цикл прокрутки
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const loopProgress = (elapsed % duration) / duration;
      
      // Текущая позиция для прокрутки
      const position = -width * loopProgress;
      
      // Обновляем позицию и прогресс
      controls.set({ x: position });
      updateProgress(loopProgress * 100);
      
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
    
    // Получаем текущую позицию через стиль transform
    let currentX = 0;
    if (carousel.current && carousel.current.firstChild) {
      const transform = (carousel.current.firstChild as HTMLElement).style.transform;
      const match = transform.match(/translateX\((.+?)px\)/);
      if (match && match[1]) {
        currentX = parseFloat(match[1]);
      }
    }
    
    // Прокручиваем на 300px влево (или до начала)
    const newPosition = Math.min(0, currentX + 300);
    controls.start({ 
      x: newPosition,
      transition: { duration: 0.5 }
    });
    
    // Обновляем индикатор прогресса
    const newProgress = Math.max(0, Math.min(100, (-newPosition / width) * 100));
    updateProgress(newProgress);
    
    startAutoplay();
  };
  
  const handleNext = () => {
    setAutoplay(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Получаем текущую позицию через стиль transform
    let currentX = 0;
    if (carousel.current && carousel.current.firstChild) {
      const transform = (carousel.current.firstChild as HTMLElement).style.transform;
      const match = transform.match(/translateX\((.+?)px\)/);
      if (match && match[1]) {
        currentX = parseFloat(match[1]);
      }
    }
    
    // Прокручиваем на 300px вправо (или до конца)
    const newPosition = Math.max(-width, currentX - 300);
    controls.start({ 
      x: newPosition,
      transition: { duration: 0.5 }
    });
    
    // Обновляем индикатор прогресса
    const newProgress = Math.max(0, Math.min(100, (-newPosition / width) * 100));
    updateProgress(newProgress);
    
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
      
      {/* Индикатор прокрутки */}
      <div className="flex justify-center mt-4">
        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-600"
            style={{ width: `${autoplay ? progress : progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PromoSlider;