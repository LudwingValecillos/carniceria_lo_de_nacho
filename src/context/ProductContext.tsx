import React, {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  Dispatch,
  useCallback,
} from 'react';
import { Product } from '../types';
import {
  updateProductPrice,
  toggleProductStatus,
  fetchProducts,
  toggleProductOffer,
  updateProductName,
  deleteProduct,
} from '../data/api';
import { toast, Id, ToastOptions } from 'react-toastify';

// Define el tipo de estado
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Define los tipos de acciones
type ProductAction =
  | { type: 'FETCH_PRODUCTS_START' }
  | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_PRODUCTS_FAILURE'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'TOGGLE_PRODUCT_STATUS_START'; payload: string }
  | { type: 'TOGGLE_PRODUCT_STATUS_SUCCESS'; payload: Product[] }
  | { type: 'TOGGLE_PRODUCT_STATUS_FAILURE'; payload: string }
  | { type: 'UPDATE_PRODUCT_PRICE_START'; payload: { id: string; price: number } }
  | { type: 'UPDATE_PRODUCT_PRICE_SUCCESS'; payload: Product[] }
  | { type: 'UPDATE_PRODUCT_PRICE_FAILURE'; payload: string }
  | { type: 'TOGGLE_PRODUCT_OFFER_START'; payload: string }
  | { type: 'TOGGLE_PRODUCT_OFFER_SUCCESS'; payload: Product[] }
  | { type: 'TOGGLE_PRODUCT_OFFER_FAILURE'; payload: string }
  | { type: 'UPDATE_PRODUCT_NAME_START'; payload: { id: string; name: string } }
  | { type: 'UPDATE_PRODUCT_NAME_SUCCESS'; payload: Product[] }
  | { type: 'UPDATE_PRODUCT_NAME_FAILURE'; payload: string }
  | { type: 'DELETE_PRODUCT_START'; payload: string }
  | { type: 'DELETE_PRODUCT_SUCCESS'; payload: Product[] }
  | { type: 'DELETE_PRODUCT_FAILURE'; payload: string };

// Define el tipo del contexto
interface ProductContextType {
  state: ProductState;
  dispatch: Dispatch<ProductAction>;
  fetchProductsAction: () => Promise<void>;
  toggleProductStatusAction: (productId: string) => Promise<void>;
  updateProductPriceAction: (productId: string, newPrice: number) => Promise<void>;
  toggleProductOfferAction: (productId: string) => Promise<void>;
  updateProductNameAction: (productId: string, newName: string) => Promise<void>;
  deleteProductAction: (productId: string) => Promise<void>;
  safeToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

// Reducer
const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_PRODUCTS_SUCCESS':
      return { ...state, products: action.payload, loading: false, error: null };
    case 'FETCH_PRODUCTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [
          ...state.products,
          { ...action.payload, id: action.payload.id || Date.now().toString() },
        ],
      };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      };
    case 'TOGGLE_PRODUCT_STATUS_START':
      return { ...state, loading: true, error: null };
    case 'TOGGLE_PRODUCT_STATUS_SUCCESS':
      return { ...state, products: action.payload, loading: false, error: null };
    case 'TOGGLE_PRODUCT_STATUS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_PRODUCT_PRICE_START':
      return { ...state, loading: true, error: null };
    case 'UPDATE_PRODUCT_PRICE_SUCCESS':
      return { ...state, products: action.payload, loading: false, error: null };
    case 'UPDATE_PRODUCT_PRICE_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'TOGGLE_PRODUCT_OFFER_START':
      return { ...state, loading: true, error: null };
    case 'TOGGLE_PRODUCT_OFFER_SUCCESS':
      return { ...state, products: action.payload, loading: false, error: null };
    case 'TOGGLE_PRODUCT_OFFER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_PRODUCT_NAME_START':
      return { ...state, loading: true, error: null };
    case 'UPDATE_PRODUCT_NAME_SUCCESS':
      return { ...state, products: action.payload, loading: false, error: null };
    case 'UPDATE_PRODUCT_NAME_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_PRODUCT_START':
      return { ...state, loading: true, error: null };
    case 'DELETE_PRODUCT_SUCCESS':
      return { ...state, products: action.payload, loading: false, error: null };
    case 'DELETE_PRODUCT_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Crea el contexto con un valor por defecto
export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

// Exportar la función safeToast de manera independiente
export const safeToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // Limpiar toasts existentes antes de mostrar uno nuevo
  toast.dismiss();

  const toastConfig: ToastOptions = {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    limit: 3, // Limitar el número de toasts simultáneos
    toastId: `toast-${type}-${Date.now()}`, // Garantizar ID único
  };

  switch (type) {
    case 'success':
      return toast.success(message, toastConfig);
    case 'error':
      return toast.error(message, toastConfig);
    default:
      return toast.info(message, toastConfig);
  }
};

// Proveedor del contexto
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    loading: false,
    error: null,
  });

  // Acción para obtener productos
  const fetchProductsAction = async () => {
    // Prevent multiple simultaneous fetches
    if (state.loading) return;

    dispatch({ type: 'FETCH_PRODUCTS_START' });
    try {
      const products = await fetchProducts();
      
      // Validate products before dispatching
      if (Array.isArray(products)) {
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
      } else {
        throw new Error('Invalid products data');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al cargar productos';
      
      // Only dispatch error if not already in error state
      if (!state.error) {
        dispatch({ 
          type: 'FETCH_PRODUCTS_FAILURE', 
          payload: errorMessage 
        });
        
        // Use a unique toast ID to prevent multiple toasts
        safeToast('No se pudieron cargar los productos', 'error');
      }
    }
  };

  // Acción para cambiar el estado del producto
  const toggleProductStatusAction = async (productId: string) => {
    dispatch({ type: 'TOGGLE_PRODUCT_STATUS_START', payload: productId });
    try {
      const updatedProducts = await toggleProductStatus(productId);
      dispatch({ type: 'TOGGLE_PRODUCT_STATUS_SUCCESS', payload: updatedProducts });

      const product = updatedProducts.find((p: Product) => p.id === productId);
      const productName = product?.name || 'Producto';
      const statusMessage = product?.active ? 'activado' : 'desactivado';

      safeToast(`${productName} ${statusMessage}`, 'info');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al cambiar estado';
      dispatch({ type: 'TOGGLE_PRODUCT_STATUS_FAILURE', payload: errorMessage });
      safeToast('No se pudo cambiar el estado del producto', 'error');
    }
  };

  // Acción para actualizar el precio del producto
  const updateProductPriceAction = async (productId: string, newPrice: number) => {
    dispatch({ type: 'UPDATE_PRODUCT_PRICE_START', payload: { id: productId, price: newPrice } });
    try {
      const updatedProducts = await updateProductPrice(productId, newPrice);
      dispatch({ type: 'UPDATE_PRODUCT_PRICE_SUCCESS', payload: updatedProducts });
      safeToast('Precio de producto actualizado', 'success');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar precio';
      dispatch({ type: 'UPDATE_PRODUCT_PRICE_FAILURE', payload: errorMessage });
      safeToast('No se pudo actualizar el precio del producto', 'error');
    }
  };

  // Acción para cambiar el estado de oferta del producto
  const toggleProductOfferAction = async (productId: string) => {
    dispatch({ type: 'TOGGLE_PRODUCT_OFFER_START', payload: productId });
    try {
      const updatedProducts = await toggleProductOffer(productId);
      dispatch({ type: 'TOGGLE_PRODUCT_OFFER_SUCCESS', payload: updatedProducts });

      const product = updatedProducts.find((p: Product) => p.id === productId);
      if (product) {
        const productName = product.name || 'Producto';
        const offerMessage = product.offer ? 'en oferta' : 'fuera de oferta';
        safeToast(`${productName} ${offerMessage}`, 'info');
      } else {
        safeToast('No se encontró el producto', 'error');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al cambiar estado de oferta';
      dispatch({ type: 'TOGGLE_PRODUCT_OFFER_FAILURE', payload: errorMessage });
      safeToast('No se pudo cambiar el estado de oferta del producto', 'error');
    }
  };

  // Acción para actualizar el nombre del producto
  const updateProductNameAction = async (productId: string, newName: string) => {
    dispatch({ type: 'UPDATE_PRODUCT_NAME_START', payload: { id: productId, name: newName } });
    try {
      const updatedProducts = await updateProductName(productId, newName);
      dispatch({ type: 'UPDATE_PRODUCT_NAME_SUCCESS', payload: updatedProducts });
      safeToast('Nombre de producto actualizado', 'success');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar nombre';
      dispatch({ type: 'UPDATE_PRODUCT_NAME_FAILURE', payload: errorMessage });
      safeToast('No se pudo actualizar el nombre del producto', 'error');
    }
  };

  // Acción para eliminar un producto
  const deleteProductAction = useCallback(async (productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT_START', payload: productId });
    try {
      const updatedProducts = await deleteProduct(productId);
      dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: updatedProducts });
      safeToast('Producto eliminado exitosamente', 'success');
    } catch (error) {
      dispatch({ 
        type: 'DELETE_PRODUCT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error al eliminar el producto' 
      });
      safeToast('Error al eliminar el producto', 'error');
    }
  }, [dispatch]);

  return (
    <ProductContext.Provider
      value={{
        state,
        dispatch,
        fetchProductsAction,
        toggleProductStatusAction,
        updateProductPriceAction,
        toggleProductOfferAction,
        updateProductNameAction,
        deleteProductAction,
        safeToast,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
