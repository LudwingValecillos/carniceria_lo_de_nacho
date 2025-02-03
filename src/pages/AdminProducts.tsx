import React, { useState, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import productsData from '../data/products.json';
import { Product } from '../types';
import { PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'; 

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsData.map(p => ({
    ...p,
    id: p.id.toString(),
    price: parseFloat(p.price.replace(/\./g, '')),
    active: true
  })));
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const toggleProductStatus = (productId: string) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, active: !product.active }
        : product
    );
    
    setProducts(updatedProducts);
    toast.info(`Producto ${products.find(p => p.id === productId)?.name} ${updatedProducts.find(p => p.id === productId)?.active ? 'activado' : 'desactivado'}`);
  };

  const updateProductPrice = (productId: string) => {
    const numericPrice = parseFloat(newPrice.replace(/\./g, ''));
    if (!isNaN(numericPrice)) {
      const updatedProducts = products.map(product => 
        product.id === productId 
          ? { ...product, price: numericPrice }
          : product
      );
      
      setProducts(updatedProducts);
      setEditingPriceId(null);
      toast.success(`Precio de producto actualizado`);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  }, [products, searchTerm]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Administración de Productos</h1>
      
      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className={`border rounded p-2 ${product.active ? 'bg-white' : 'bg-gray-200'} flex flex-col`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs sm:text-2xl font-semibold truncate">{product.name}</h2>
              <button 
                onClick={() => toggleProductStatus(product.id)}
                className={`px-1 sm:px-2 py-1 rounded text-xs ${product.active ? 'bg-red-500' : 'bg-green-500'} text-white`}
              >
                {product.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              {editingPriceId === product.id ? (
                <div className="flex items-center">
                  <input 
                    type="text" 
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-20 sm:w-24 p-1 border rounded text-xs mr-2"
                    placeholder="Nuevo precio"
                  />
                  <button 
                    onClick={() => updateProductPrice(product.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <p className="font-bold text-xs sm:text-sm">
                  ${formatPrice(typeof product.price === 'number' ? product.price : parseFloat(product.price))}
                </p>
              )}
              {editingPriceId !== product.id && (
                <button 
                  onClick={() => {
                    setEditingPriceId(product.id);
                    setNewPrice(formatPrice(typeof product.price === 'number' ? product.price : parseFloat(product.price)));
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Estado: {product.active ? 'Activo' : 'Inactivo'}
            </p>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No se encontraron productos que coincidan con la búsqueda.
        </div>
      )}

      <ToastContainer />
    </div>
  );
};