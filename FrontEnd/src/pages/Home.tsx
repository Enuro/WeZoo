import PromoSlider from '../components/PromoSlider';
import ProductGrid from '../components/ProductGrid';
import CategoryButtons from '../components/CategoryButtons';
import ProductCard from '../components/ProductCard'; // Добавляем импорт ProductCard
import { useProductStore } from '../store/productStore';

function Home() {
  // Получаем данные из хранилища
  const { products, featuredProducts } = useProductStore();
  
  // Фильтруем продукты для разных секций
  const regularProducts = products.filter(product => !product.isPromo);

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[400px] rounded-xl overflow-hidden my-8 relative">
        <img
          src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Pharmacy Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-transparent flex items-center">
          <div className="max-w-lg ml-12 text-white">
            <h1 className="text-4xl font-bold mb-4">Ваше здоровье - наш приоритет</h1>
            <p className="text-lg mb-6">Откройте для себя широкий ассортимент товаров для здоровья питомцев и профессиональных услуг.</p>
            <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
              Купить сейчас
            </button>
          </div>
        </div>
      </div>

      {/* Promo Products Slider */}
      <PromoSlider products={featuredProducts} />

      {/* Regular Products Grid */}
      <ProductGrid products={regularProducts} title="Хиты продаж" />
      
      {/* Новинки */}
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Новинки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {regularProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Информационные блоки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="bg-emerald-50 rounded-lg p-6">
          <div className="text-emerald-600 text-xl font-semibold mb-3">Доставка в день заказа</div>
          <p className="text-gray-600">Заказывайте до 18:00 и получайте лекарства для вашего питомца в тот же день</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-6">
          <div className="text-emerald-600 text-xl font-semibold mb-3">Консультация ветеринара</div>
          <p className="text-gray-600">Получите профессиональный совет по выбору препаратов для вашего питомца</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-6">
          <div className="text-emerald-600 text-xl font-semibold mb-3">Гарантия качества</div>
          <p className="text-gray-600">Все товары сертифицированы и хранятся в соответствии с требованиями</p>
        </div>
      </div>
    </div>
  );
}

export default Home;