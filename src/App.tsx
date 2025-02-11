import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Product, CartItem } from './types';
import { Search, Menu, MessageCircle } from 'lucide-react';
import { useProductContext } from './context/ProductContext';
import logo from './images/logolodenacho.png';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProducts } from './data/api';  
import { PrivateRoute } from './components/PrivateRoute';
import clsx from 'clsx';

const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const App: React.FC = () => {
  const { state, fetchProductsAction } = useProductContext(); // Use global state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        fetchProductsAction(fetchedProducts);
      } catch (error) {
        toast.error('Error al cargar productos', toastConfig);
        console.error('Error fetching products:', error);
      }
    };

    loadProducts();
  }, []);

  // Memoize filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    return state.products.filter(product => {
      // Validate product object
      if (!product || !product.name || !product.category) {
        console.warn('Invalid product:', product);
        return false;
      }

      const matchesCategory = !selectedCategory || 
        (selectedCategory === 'Ofertas' 
          ? product.offer === true 
          : product.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Only show active products
      return (product.active === true) && matchesCategory && matchesSearch;
    });
  }, [state.products, selectedCategory, searchQuery]);

  // Memoize cart-related handlers to prevent unnecessary re-renders
  const handleAddToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        // Use a single, unique toast ID for cart updates
        toast.info(`Se agregó 0.5 kg de ${product.name} al carrito`, {
          ...toastConfig,
          toastId: 'cart-update'
        });
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 0.5 }
            : item
        );
      }
      
      // Use a unique toast ID for new cart items
      toast.success(`Se agregó ${product.name} al carrito`, {
        ...toastConfig,
        toastId: 'cart-add'
      });
      
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
    window.open('https://wa.me/91161450595?text=Hola%2C%20me%20gustar%C3%ADa%20hacer%20un%20pedido.', '_blank');
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleCategorySelect = useCallback((category: string | null) => {
    setSelectedCategory(category);
    const productSection = document.getElementById('product-section');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const location = useLocation();
  const showSearch = location.pathname !== '/admin/productos';
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
            <Link to="/" className='flex items-center justify-center' onClick={() => setSelectedCategory(null)}>
            <h1 className="hidden md:block text-2xl font-bold text-red-600">
              Carnicería Lo De Nacho
            </h1>
            <img src={logo} alt="Logo" className="w-20 h-18 ml-2" />
            </Link>
          </div>
          <div className="flex-1 justify-center items-center max-w-xl mx-4 md:mr-24">
            {showSearch && (
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
            )}
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
        <Outlet /> {/* This will render nested routes */}
      </div>

      {/* Products Section */}
      {showSearch && (
        <div id="product-section" className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {state.loading ? (
              <div className="flex flex-col justify-center items-center ">
                <h2 className="text-2xl font-bold text-red-600 text-center">Cargando productos...</h2>
                <img 
                  src="https://img1.picmix.com/output/stamp/normal/7/3/8/2/1932837_7022c.gif" 
                  alt="Cargando productos" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            ) : state.error ? (
              <div className="text-center text-red-500">
                Error: {state.error}
              </div>
            ) : (
              <>
              {selectedCategory !== null  ?
                <h2 className="text-2xl font-bold mb-4 sm:mb-6 text-center border-b border-gray-300">
                 Categoria: {selectedCategory}
              </h2>
              : 
              <div className="flex justify-center space-y-2 items-center flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4 sm:mb-6 rounded-xl p-2 border border-black">
                <h2 className="font-lobster text-xl text-center text-red-600 md:text-4xl tracking-wide animate-pulse hover:scale-105 transition-transform duration-300 ease-in-out">
                  ¡Aprovecha todas las ofertas que tenemos para vos!
                </h2>
                <button onClick={() => handleCategorySelect('Ofertas')} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                  Ver todas las ofertas
                </button>
                </div>
              }
                
                <div className="grid justify-items-center items-center grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart} 
                      className={clsx({
                        'opacity-50': !product.active,
                        'hover:scale-105': product.active
                      })}
                    />
                  ))}
                </div>
              </>
            )}
            {filteredProducts.length === 0 && !state.loading && (
              <div className="text-center text-gray-500 mt-8">
                No se encontraron productos.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed WhatsApp Button */}
      {window.location.href.includes('admin') ? null : <button
        onClick={handleWhatsAppContact}
        className="fixed bottom-6 right-6 z-40 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>}
      

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Carnicería Lo De Nacho</h3>
              <p className="text-sm text-gray-300">
                Proveemos los mejores cortes de carne fresca y de alta calidad para tu hogar.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-sm text-gray-300">
                Teléfono: 11 6145-0595
                <br />
                Envios gratis a toda la zona.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horarios</h3>
              <p className="text-sm text-gray-300">
                Lunes a Sabado: 9:00 - 13:00 / 17:00 - 21:00    
                <br />
                Domingos y Feriados: 9:00 - 13:00
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Carnicería Lo De Nacho. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      <ToastContainer {...toastConfig} />
    </div>
  );
};

export default React.memo(App);