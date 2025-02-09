import React, { useState, useMemo, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Product } from '../types';
import { PencilIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useProductContext } from '../context/ProductContext';

export const AdminProducts: React.FC = () => {
  const {
    state,
    toggleProductStatusAction,
    updateProductPriceAction,
    fetchProductsAction,
    toggleProductOfferAction,
    updateProductNameAction,
  } = useProductContext();
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProductsAction();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleToggleProductStatus = (productId: string) => {
    toggleProductStatusAction(productId);
  };

  const handleUpdateProductPrice = (productId: string) => {
    const numericPrice = parseFloat(newPrice.replace(/\./g, ''));
    if (!isNaN(numericPrice)) {
      updateProductPriceAction(productId, numericPrice);
      setEditingPriceId(null);
    }
  };

  const handleUpdateProductName = (productId: string) => {
    if (newName.trim()) {
      updateProductNameAction(productId, newName.trim());
      setEditingNameId(null);
    }
  };

  const handleToggleProductOffer = (productId: string) => {
    toggleProductOfferAction(productId);
  };

  const filteredProducts = useMemo(() => {
    return state.products.filter((product) => 
      (selectedCategory === null || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [state.products, searchTerm, selectedCategory]);

  if (state.error) {
    return <div className="text-center text-red-500">Error: {state.error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Administración de Productos
      </h1>
      {/* Barra de búsqueda y filtro de categoría */}
      <div className="mb-4 flex items-center space-x-4">
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
        <div className="relative">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full  py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            {[
              'vacuno',
              'cerdo',
              'pollo',
              'anchuras',
              'fiambres',
              'congelados',
              'carbon',
              'bebidas'
            ].map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Grid de productos */}
      {state.loading ? (
        <div className="text-center">Cargando productos...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`border rounded p-2 ${product.active ? 'bg-white' : 'bg-gray-200'} flex flex-col`}
            >
              {/* Status and Offer Buttons Section */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleProductStatus(product.id)}
                    className={`px-1 sm:px-2 py-1 rounded text-xs ${
                      product.active ? 'bg-red-500' : 'bg-green-500'
                    } text-white`}
                  >
                    {product.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleToggleProductOffer(product.id)}
                    className={`px-1 sm:px-2 py-1 rounded text-xs ${
                      product.offer ? 'bg-yellow-500' : 'bg-gray-300'
                    } text-white`}
                  >
                    <SparklesIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Name Section */}
              <div className="flex justify-between items-center mb-2">
                {editingNameId === product.id ? (
                  <div className="flex items-center w-full">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full p-1 border rounded text-xs mr-2"
                      placeholder="Nuevo nombre"
                    />
                    <button
                      onClick={() => handleUpdateProductName(product.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center w-full">
                    <h2 className="text-xs sm:text-2xl font-semibold truncate flex-grow">
                      {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
                    </h2>
                    <button
                      onClick={() => {
                        setEditingNameId(product.id);
                        setNewName(product.name);
                      }}
                      className="text-blue-500 hover:text-blue-700 ml-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Section */}
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
                      onClick={() => handleUpdateProductPrice(product.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <p className="font-bold text-xs sm:text-sm">
                    ${' '}
                    {formatPrice(
                      typeof product.price === 'number'
                        ? product.price
                        : parseFloat(product.price)
                    )}
                  </p>
                )}
                {editingPriceId !== product.id && (
                  <button
                    onClick={() => {
                      setEditingPriceId(product.id);
                      setNewPrice(
                        formatPrice(
                          typeof product.price === 'number'
                            ? product.price
                            : parseFloat(product.price)
                        )
                      );
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Status Text */}
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Estado: {product.active ? 'Activo' : 'Inactivo'} {product.offer && ' • En Oferta'}
              </p>
            </div>
          ))}
        </div>
      )}
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No se encontraron productos que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
};
