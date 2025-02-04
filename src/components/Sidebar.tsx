import { X, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: string | null) => void;
}

export function Sidebar({ isOpen, onClose, onCategorySelect }: SidebarProps) {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const categories = [
    'Todos',
    'Vacuno',
    'Cerdo',
    'Pollo',
    'Embutidos',
    'Anchuras',
    'Bebidas'
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-600">Menú</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="py-2">
              <Link
                to="/"
                className="block px-4 py-3 text-lg hover:bg-gray-100"
                onClick={onClose}
              >
                Inicio
              </Link>

              <div className="border-t border-gray-200">
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="w-full px-4 py-3 text-lg flex justify-between items-center hover:bg-gray-100"
                >
                  Productos
                  {isProductsOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {isProductsOpen && (
                  <div className="bg-gray-50 py-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          onCategorySelect(category === 'Todos' ? null : category);
                          onClose();
                        }}
                        className="w-full px-8 py-2 text-left hover:bg-gray-100 text-gray-700"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200">
                <Link
                  to="/nosotros"
                  className="block px-4 py-3 text-lg hover:bg-gray-100"
                  onClick={onClose}
                >
                  Nosotros
                </Link>
              </div>

              <div className="border-t border-gray-200">
                <Link
                  to="/contacto"
                  className="block px-4 py-3 text-lg hover:bg-gray-100"
                  onClick={onClose}
                >
                  Contacto
                </Link>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t">
            <div className="flex justify-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-pink-600"> <Settings /> </Link>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}