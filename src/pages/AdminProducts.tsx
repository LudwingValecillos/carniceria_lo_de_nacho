import React, { useState, useMemo, useEffect } from 'react';
import { ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Product } from '../types';
import { PencilIcon, MagnifyingGlassIcon, SparklesIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { safeToast } from '../context/ProductContext';
import {
  fetchProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
} from '../data/api';
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

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductOffer, setNewProductOffer] = useState(false);
  const [deleteModalProductId, setDeleteModalProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar productos');
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleToggleProductStatus = async (productId: string) => {
    try {
      const updatedProducts = await updateProduct(productId, { 
        active: !products.find(p => p.id === productId)?.active 
      });
      setProducts(updatedProducts);
      safeToast('Estado del producto actualizado', 'success');
    } catch (error) {
      safeToast('Error al actualizar el estado', 'error');
    }
  };

  const handleUpdateProductPrice = async (productId: string) => {
    const numericPrice = parseFloat(newPrice.replace(/\./g, ''));
    if (!isNaN(numericPrice)) {
      try {
        const updatedProducts = await updateProduct(productId, { price: numericPrice });
        setProducts(updatedProducts);
        setEditingPriceId(null);
        safeToast('Precio actualizado', 'success');
      } catch (error) {
        safeToast('Error al actualizar el precio', 'error');
      }
    }
  };

  const handleUpdateProductName = async (productId: string) => {
    if (newName.trim()) {
      try {
        const updatedProducts = await updateProduct(productId, { name: newName.trim() });
        setProducts(updatedProducts);
        setEditingNameId(null);
        safeToast('Nombre actualizado', 'success');
      } catch (error) {
        safeToast('Error al actualizar el nombre', 'error');
      }
    }
  };

  const handleToggleProductOffer = async (productId: string) => {
    try {
      const updatedProducts = await updateProduct(productId, { 
        offer: !products.find(p => p.id === productId)?.offer 
      });
      setProducts(updatedProducts);
      safeToast('Estado de oferta actualizado', 'success');
    } catch (error) {
      safeToast('Error al actualizar la oferta', 'error');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProductImage(file);
    }
  };

  const handleAddProduct = async () => {
    if (isAddingProduct) return;
    
    if (!newProductName || !newProductPrice || !newProductCategory || !newProductImage) {
      safeToast('Por favor, complete todos los campos', 'error');
      return;
    }

    setIsAddingProduct(true);

    try {
      const newProduct = await addNewProduct({
        name: newProductName,
        price: newProductPrice,
        category: newProductCategory,
        image: newProductImage,
        offer: newProductOffer
      });

      if (newProduct) {
        setProducts(prevProducts => [...prevProducts, newProduct]);
        setIsModalOpen(false);
        setNewProductName('');
        setNewProductPrice('');
        setNewProductCategory('');
        setNewProductImage(null);
        setNewProductOffer(false);
        safeToast('Producto agregado exitosamente', 'success');
      }
    } catch (error) {
      safeToast('Error al agregar el producto', 'error');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setDeleteModalProductId(productId);
  };

  const confirmDeleteProduct = async () => {
    if (deleteModalProductId) {
      try {
        const updatedProducts = await deleteProduct(deleteModalProductId);
        setProducts(updatedProducts);
        setDeleteModalProductId(null);
        safeToast('Producto eliminado', 'success');
      } catch (error) {
        safeToast('Error al eliminar el producto', 'error');
      }
    }
  };

  const cancelDeleteProduct = () => {
    setDeleteModalProductId(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => 
      (selectedCategory === null || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm, selectedCategory]);

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
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
      {loading ? (
        <div className="text-center">Cargando productos...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-2 sm:p-4 relative flex flex-col"
            >
              {/* Product Image */}
              <div className="relative mb-2 sm:mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 sm:h-48 object-cover rounded-md"
                />
                {/* Offer Badge */}
                {product.offer && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Oferta
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                {editingNameId === product.id ? (
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      defaultValue={product.name}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateProductName(product.id);
                      }}
                    />
                    <button
                      onClick={() => handleUpdateProductName(product.id)}
                      className="ml-2 text-green-500"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm sm:text-base font-semibold">
                      {product.name}
                    </h3>
                    <PencilIcon
                      onClick={() => {
                        setEditingNameId(product.id);
                        setNewName(product.name);
                      }}
                      className="h-4 w-4 text-gray-500 cursor-pointer"
                    />
                  </div>
                )}

                {editingPriceId === product.id ? (
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      defaultValue={formatPrice(Number(product.price))}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateProductPrice(product.id);
                      }}
                    />
                    <button
                      onClick={() => handleUpdateProductPrice(product.id)}
                      className="ml-2 text-green-500"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm sm:text-base font-bold text-blue-600">
                      ${formatPrice(Number(product.price))}
                    </p>
                    <PencilIcon
                      onClick={() => {
                        setEditingPriceId(product.id);
                        setNewPrice(formatPrice(Number(product.price)));
                      }}
                      className="h-4 w-4 text-gray-500 cursor-pointer"
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  {product.category}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleProductStatus(product.id)}
                    className={clsx(
                      "px-2 py-1 text-xs rounded-full",
                      product.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {product.active ? "Activo" : "Inactivo"}
                  </button>
                  <button
                    onClick={() => handleToggleProductOffer(product.id)}
                    className={clsx(
                      "px-2 py-1 text-xs rounded-full",
                      product.offer
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {product.offer ? "En Oferta" : "Sin Oferta"}
                  </button>
                </div>
                <TrashIcon
                  onClick={() => handleDeleteProduct(product.id)}
                  className="h-5 w-5 text-red-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
            <input
              type="text"
              placeholder="Nombre del producto"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Precio"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <select
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
            >
              <option value="">Seleccionar Categoría</option>
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
            <div className="flex items-center mb-2">
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full"
                accept="image/*"
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={newProductOffer}
                onChange={() => setNewProductOffer(!newProductOffer)}
                className="mr-2"
              />
              <label>Producto en Oferta</label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                disabled={isAddingProduct}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {isAddingProduct ? 'Agregando...' : 'Agregar Producto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este producto?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={cancelDeleteProduct}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminProducts;
