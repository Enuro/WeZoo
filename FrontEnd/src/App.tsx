import Header from './components/Header';
import Footer from './components/Footer';
import PromoSlider from './components/PromoSlider';
import ProductGrid from './components/ProductGrid';
import { Product } from './types';

// Simulated product data (in a real app, this would come from an API)
const promoProducts: Product[] = [
  {
    id: 1,
    name: "Vitamin C Complex",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 20,
    isPromo: true
  },
  {
    id: 2,
    name: "Omega-3 Fish Oil",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 15,
    isPromo: true
  },
  {
    id: 3,
    name: "Multivitamin Pack",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 25,
    isPromo: true
  },
  {
    id: 4,
    name: "Probiotics",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 10,
    isPromo: true
  }
];

const regularProducts: Product[] = [
  {
    id: 5,
    name: "Aspirin",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Bandages",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "First Aid Kit",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Pain Relief Gel",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Hero Section */}
        <div className="h-[400px] rounded-xl overflow-hidden my-8 relative">
          <img
            src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Pharmacy Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-transparent flex items-center">
            <div className="max-w-lg ml-12 text-white">
              <h1 className="text-4xl font-bold mb-4">Your Health is Our Priority</h1>
              <p className="text-lg mb-6">Discover our wide range of healthcare products and professional services.</p>
              <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Promo Products Slider */}
        <PromoSlider products={promoProducts} />

        {/* Regular Products Grid */}
        <ProductGrid products={regularProducts} title="Featured Products" />
      </main>

      <Footer />
    </div>
  );
}

export default App;