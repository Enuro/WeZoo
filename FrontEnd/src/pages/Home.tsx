import PromoSlider from '../components/PromoSlider';
import ProductGrid from '../components/ProductGrid';
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
            <p className="text-lg mb-6">Откройте для себя широкий ассортимент товаров для здоровья и профессиональных услуг.</p>
            <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
              Купить сейчас
            </button>
          </div>
        </div>
      </div>

      {/* Promo Products Slider */}
      <PromoSlider products={featuredProducts} />

      {/* Regular Products Grid */}
      <ProductGrid products={regularProducts} title="Популярные товары" />
    </div>
  );
}

export default Home;