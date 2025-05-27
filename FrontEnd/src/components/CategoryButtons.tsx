import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Bone, Heart, Scissors, Award, CakeSlice } from 'lucide-react';

interface CategoryButton {
  id: number;
  name: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const categories: CategoryButton[] = [
  {
    id: 1,
    name: 'Лекарства',
    icon: <Pill className="w-6 h-6" />,
    link: '/catalog/medicine',
    color: 'bg-red-500'
  },
  {
    id: 2,
    name: 'Корма',
    icon: <Bone className="w-6 h-6" />,
    link: '/catalog/food',
    color: 'bg-yellow-500'
  },
  {
    id: 3,
    name: 'Витамины',
    icon: <CakeSlice className="w-6 h-6" />,
    link: '/catalog/vitamins',
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: 'Здоровье',
    icon: <Heart className="w-6 h-6" />,
    link: '/catalog/health',
    color: 'bg-emerald-500'
  },
  {
    id: 5,
    name: 'Груминг',
    icon: <Scissors className="w-6 h-6" />,
    link: '/catalog/grooming',
    color: 'bg-blue-500'
  },
  {
    id: 6,
    name: 'Премиум',
    icon: <Award className="w-6 h-6" />,
    link: '/catalog/premium',
    color: 'bg-amber-500'
  }
];

const CategoryButtons: React.FC = () => {
  return (
    <div className="py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={category.link}
            className="flex flex-col items-center"
          >
            <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-2 hover:scale-110 transition-transform`}>
              {category.icon}
            </div>
            <span className="text-gray-700 text-sm font-medium font-bezier">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;