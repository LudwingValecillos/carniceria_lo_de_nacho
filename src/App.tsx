import React, { useState, useMemo, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Carousel } from './components/Carousel';
import { Sidebar } from './components/Sidebar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Product, CartItem } from './types';
import { Search, Menu, MessageCircle } from 'lucide-react';
import { AdminProducts } from './pages/AdminProducts';

// Simulated product data
import { products } from './data/products';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Memoize filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = !selectedCategory || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Memoize cart-related handlers to prevent unnecessary re-renders
  const handleAddToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 0.5 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleWhatsAppContact = useCallback(() => {
    window.open('https://wa.me/1234567890', '_blank');
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleCategorySelect = useCallback((category: string | null) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleSidebar()}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-6 h-6 text-blue-600" />
            </button>
            <h1 className="hidden md:block text-2xl font-bold text-red-600">Carnicería Lo De Nacho</h1>
          </div>
          <div className="flex-1 justify-center items-center max-w-xl mx-4">
            <div className="relative pr-16 md:pr-0">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCategorySelect={handleCategorySelect}
      />

      {/* Main Content */}
      <div className="mt-16">
        <Routes>
          <Route path="/" element={
            <>
              {!selectedCategory && <Carousel />}
              <main className="flex-1 p-6">
                <div className="max-w-7xl mx-auto">
                  {selectedCategory && (
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Categoría: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                      </h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              </main>
            </>
          } />
          <Route path="/admin/productos" element={<AdminProducts />} />
          <Route path="/nosotros" element={
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
              <p className="text-lg mb-4">
                Somos una carnicería con más de 30 años de experiencia...
              </p>
            </div>
          } />
          <Route path="/contacto" element={
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-3xl font-bold mb-6">Contacto</h2>
              <p className="text-lg mb-4">
                Encuentranos en...
              </p>
            </div>
          } />
        </Routes>
      </div>

      {/* Fixed WhatsApp Button */}
      <button
        onClick={handleWhatsAppContact}
        className="fixed bottom-6 right-6 z-40 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <a href="tel:+541161405595">Teléfono: 11 6145-0595</a>
              <p>Email: info@carniceria.com</p>
              <p>Dirección: Cayetano Beliera 5005, La Lonja,Pilar.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horarios</h3>
              <p>Lunes a Sábados: 09:00 - 14:00 hs / 16:30 - 20:00 hs</p>
              <p>Domingos: 09:00 - 13:30 hs</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                
                <a href="https://www.instagram.com/lodenachocarniceria/" className="hover:text-blue-400">Instagram</a>
               
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 Carnicería Lo de Nacho. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default React.memo(App);