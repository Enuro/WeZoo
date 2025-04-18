import { create } from 'zustand';
import { Product, CartItem } from '../types';

// Дополнение типов для Product
interface ProductDetails {
  id: number;
  manufacturer: string;
  country: string;
  activeIngredients: string[];
  indications: string[];
  contraindications: string[];
  howToUse: string;
  storageConditions: string;
  expirationDate: string;
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  cartItems: CartItem[];
  productDetails: ProductDetails[];
  
  // Методы для работы с корзиной
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Методы для получения данных
  getProduct: (id: number) => Product | undefined;
  getProductDetails: (id: number) => ProductDetails | undefined;
}

// Демо-данные для товаров
const productsData: Product[] = [
  {
    id: 1,
    name: "Vitamin C Complex",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 20,
    isPromo: true,
    description: "Витаминный комплекс с высоким содержанием витамина C для поддержки иммунной системы и общего здоровья. Помогает организму бороться с вирусами и укрепляет защитные функции."
  },
  {
    id: 2,
    name: "Omega-3 Fish Oil",
    price: 24.99,
    image: "https://avatars.mds.yandex.net/i?id=fde21b14355402df71ef0e644df3618de3622dc7-10455853-images-thumbs&n=13",
    discount: 15,
    isPromo: true,
    description: "Рыбий жир с Омега-3 жирными кислотами для поддержки здоровья сердца, мозга и суставов. Содержит ЭПК и ДГК, необходимые для нормального функционирования организма."
  },
  {
    id: 3,
    name: "Multivitamin Pack",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 25,
    isPromo: true,
    description: "Комплексный мультивитаминный препарат, содержащий все необходимые витамины и минералы для ежедневной поддержки здоровья. Разработан для восполнения дефицита питательных веществ."
  },
  {
    id: 4,
    name: "Probiotics",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 10,
    isPromo: true,
    description: "Пробиотики для здоровья кишечника и укрепления иммунитета. Содержат полезные бактерии, которые помогают поддерживать здоровую микрофлору кишечника и улучшают пищеварение."
  },
  {
    id: 5,
    name: "Aspirin",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Противовоспалительное и жаропонижающее средство для снятия боли и снижения температуры. Также используется для профилактики сердечно-сосудистых заболеваний."
  },
  {
    id: 6,
    name: "Bandages",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Стерильные повязки для обработки ран и порезов. Защищают рану от инфекций и ускоряют процесс заживления. В упаковке содержатся бинты разных размеров."
  },
  {
    id: 7,
    name: "First Aid Kit",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Набор первой помощи, включающий все необходимые средства для оказания неотложной помощи в домашних условиях. Содержит бинты, антисептики, пластыри и другие медицинские принадлежности."
  },
  {
    id: 8,
    name: "Pain Relief Gel",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Гель для снятия боли в мышцах и суставах. Обладает противовоспалительным и обезболивающим действием. Быстро впитывается и не оставляет жирного следа."
  }
];

// Детальная информация о продуктах
const productDetailsData: ProductDetails[] = [
  {
    id: 1,
    manufacturer: "VitaHealth Laboratories",
    country: "США",
    activeIngredients: ["Аскорбиновая кислота", "Биофлавоноиды цитрусовых", "Шиповник (экстракт)"],
    indications: ["Профилактика и лечение дефицита витамина C", "Поддержка иммунной системы", "Повышение сопротивляемости организма"],
    contraindications: ["Индивидуальная непереносимость компонентов", "Мочекаменная болезнь", "Повышенная свертываемость крови"],
    howToUse: "По 1 таблетке 1-2 раза в день во время еды.",
    storageConditions: "Хранить в сухом, защищенном от света месте при температуре не выше 25°C.",
    expirationDate: "2 года с даты изготовления"
  },
  {
    id: 2,
    manufacturer: "NordicNaturals",
    country: "Норвегия",
    activeIngredients: ["Докозагексаеновая кислота (ДГК)", "Эйкозапентаеновая кислота (ЭПК)", "Витамин E"],
    indications: ["Профилактика сердечно-сосудистых заболеваний", "Поддержка когнитивной функции", "Снижение воспалительных процессов"],
    contraindications: ["Индивидуальная непереносимость рыбы и морепродуктов", "Нарушения свертываемости крови", "Период перед хирургическими вмешательствами"],
    howToUse: "По 1 капсуле 2 раза в день во время еды.",
    storageConditions: "Хранить в прохладном, защищенном от света месте при температуре не выше 20°C.",
    expirationDate: "18 месяцев с даты изготовления"
  },
  {
    id: 3,
    manufacturer: "Pharma Complex",
    country: "Германия",
    activeIngredients: ["Витамин A", "Витамин D", "Витамин E", "Витамин C", "Витамины группы B", "Цинк", "Селен", "Магний"],
    indications: ["Профилактика авитаминоза", "Повышение иммунитета", "Период восстановления после болезни"],
    contraindications: ["Индивидуальная непереносимость компонентов", "Гипервитаминоз", "Тяжелые нарушения функции почек"],
    howToUse: "По 1 таблетке 1 раз в день во время еды.",
    storageConditions: "Хранить в сухом, защищенном от света месте при температуре не выше 25°C.",
    expirationDate: "2 года с даты изготовления"
  },
  {
    id: 4,
    manufacturer: "BioBalance Health",
    country: "Швейцария",
    activeIngredients: ["Lactobacillus acidophilus", "Bifidobacterium lactis", "Lactobacillus rhamnosus", "Инулин"],
    indications: ["Восстановление микрофлоры кишечника", "Профилактика дисбактериоза", "После приема антибиотиков"],
    contraindications: ["Индивидуальная непереносимость компонентов", "Иммунодефицитные состояния", "Грудное вскармливание"],
    howToUse: "По 1 капсуле 1-2 раза в день во время еды.",
    storageConditions: "Хранить в холодильнике при температуре от 2°C до 8°C.",
    expirationDate: "1 год с даты изготовления"
  },
  {
    id: 5,
    manufacturer: "Bayer Healthcare",
    country: "Германия",
    activeIngredients: ["Ацетилсалициловая кислота"],
    indications: ["Снижение температуры", "Уменьшение боли", "Профилактика тромбозов"],
    contraindications: ["Язвенная болезнь желудка", "Повышенная кровоточивость", "Бронхиальная астма", "Детский возраст до 12 лет"],
    howToUse: "По 1 таблетке при болях или повышении температуры, но не более 3 таблеток в сутки.",
    storageConditions: "Хранить в сухом, защищенном от света месте при температуре не выше 25°C.",
    expirationDate: "3 года с даты изготовления"
  },
  {
    id: 6,
    manufacturer: "Johnson & Johnson",
    country: "США",
    activeIngredients: ["Стерильный материал", "Адгезивный материал"],
    indications: ["Обработка ран", "Защита от инфекций", "Остановка кровотечений"],
    contraindications: ["Индивидуальная непереносимость компонентов"],
    howToUse: "Очистить рану, наложить повязку, менять повязку по мере загрязнения.",
    storageConditions: "Хранить в сухом, защищенном от света месте при комнатной температуре.",
    expirationDate: "5 лет с даты изготовления"
  },
  {
    id: 7,
    manufacturer: "RedCross Medical",
    country: "Канада",
    activeIngredients: ["Стерильные бинты", "Антисептики", "Пластыри", "Медицинские ножницы", "Пинцет"],
    indications: ["Первая помощь при травмах", "Обработка ран", "Экстренные ситуации"],
    contraindications: ["Отсутствуют"],
    howToUse: "Использовать в соответствии с инструкциями для конкретных компонентов набора.",
    storageConditions: "Хранить в сухом, защищенном от света месте при комнатной температуре.",
    expirationDate: "4 года с даты изготовления"
  },
  {
    id: 8,
    manufacturer: "MedPharma",
    country: "Франция",
    activeIngredients: ["Диклофенак", "Ментол", "Камфора"],
    indications: ["Боли в мышцах", "Боли в суставах", "Растяжения", "Ушибы"],
    contraindications: ["Индивидуальная непереносимость компонентов", "Повреждения кожи в месте нанесения", "Беременность и лактация"],
    howToUse: "Нанести тонким слоем на болезненную область 2-3 раза в день и втереть легкими массирующими движениями.",
    storageConditions: "Хранить в сухом, защищенном от света месте при температуре не выше 25°C.",
    expirationDate: "2 года с даты изготовления"
  }
];

export const useProductStore = create<ProductState>((set, get) => ({
  products: productsData,
  featuredProducts: productsData.filter(product => product.isPromo),
  productDetails: productDetailsData,
  cartItems: [],
  
  // Методы для работы с корзиной
  addToCart: (productId: number, quantity: number = 1) => {
    const product = get().products.find(p => p.id === productId);
    if (!product) return;
    
    set(state => {
      // Проверяем, есть ли товар уже в корзине
      const existingItem = state.cartItems.find(item => item.id === productId);
      
      if (existingItem) {
        // Если товар уже в корзине, обновляем количество
        return {
          cartItems: state.cartItems.map(item => 
            item.id === productId 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          )
        };
      } else {
        // Если товара нет в корзине, добавляем его
        return {
          cartItems: [...state.cartItems, { ...product, quantity }]
        };
      }
    });
  },
  
  removeFromCart: (productId: number) => {
    set(state => ({
      cartItems: state.cartItems.filter(item => item.id !== productId)
    }));
  },
  
  updateCartItemQuantity: (productId: number, quantity: number) => {
    set(state => ({
      cartItems: state.cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    }));
  },
  
  clearCart: () => {
    set({ cartItems: [] });
  },
  
  // Методы для получения данных
  getProduct: (id: number) => {
    return get().products.find(product => product.id === id);
  },
  
  getProductDetails: (id: number) => {
    return get().productDetails.find(details => details.id === id);
  }
}));