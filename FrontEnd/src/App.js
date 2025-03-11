import React from 'react';
import Header from './components/Header';


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Проснись джеси</h1>
        </section>
        <section className="mt-8 text-center text-gray-600">
          <p>Ты Рыба ёж</p>
        </section>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="mt-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Джесси {i + 1}</h2>
            <p className="mt-2 text-gray-600">
              Ты рыба ёж джеси
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;