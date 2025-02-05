import React, { createContext, useReducer, ReactNode, useContext, Dispatch } from 'react';
import { Product } from '../types';
import { updateProductPrice, toggleProductStatus, fetchProducts, toggleProductOffer } from '../data/api';
import { toast } from 'react-toastify';

// Define the state type
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Define action types
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
  | { type: 'TOGGLE_PRODUCT_OFFER_FAILURE'; payload: string };

// Define the context type
interface ProductContextType {
  state: ProductState;
  dispatch: Dispatch<ProductAction>;
  fetchProductsAction: () => Promise<void>;
  toggleProductStatusAction: (productId: string) => Promise<void>;
  updateProductPriceAction: (productId: string, newPrice: number) => Promise<void>;
  toggleProductOfferAction: (productId: string) => Promise<void>;
}

// Reducer function
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
        products: [...state.products, { ...action.payload, id: action.payload.id || Date.now().toString() }]
      };
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
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
    default:
      return state;
  }
};

// Create the context with a default value
export const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Create a provider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, { 
    products: [], 
    loading: false, 
    error: null 
  });

  // Fetch products action
  const fetchProductsAction = async () => {
    dispatch({ type: 'FETCH_PRODUCTS_START' });
    try {
      const products = await fetchProducts();
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_PRODUCTS_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error fetching products' 
      });
      toast.error('No se pudieron cargar los productos');
    }
  };

  // Toggle product status action
  const toggleProductStatusAction = async (productId: string) => {
    dispatch({ type: 'TOGGLE_PRODUCT_STATUS_START', payload: productId });
    try {
      const updatedProducts = await toggleProductStatus(productId);
      dispatch({ type: 'TOGGLE_PRODUCT_STATUS_SUCCESS', payload: updatedProducts });
      
      const product = updatedProducts.find((p: Product) => p.id === productId);
      toast.info(`Producto ${product?.name} ${product?.active ? 'activado' : 'desactivado'}`);
    } catch (error) {
      dispatch({ 
        type: 'TOGGLE_PRODUCT_STATUS_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error toggling product status' 
      });
      toast.error('No se pudo cambiar el estado del producto');
    }
  };

  // Update product price action
  const updateProductPriceAction = async (productId: string, newPrice: number) => {
    dispatch({ type: 'UPDATE_PRODUCT_PRICE_START', payload: { id: productId, price: newPrice } });
    try {
      const updatedProducts = await updateProductPrice(productId, newPrice);
      dispatch({ type: 'UPDATE_PRODUCT_PRICE_SUCCESS', payload: updatedProducts });
      toast.success('Precio de producto actualizado');
    } catch (error) {
      dispatch({ 
        type: 'UPDATE_PRODUCT_PRICE_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error updating product price' 
      });
      toast.error('No se pudo actualizar el precio del producto');
    }
  };

  // Toggle product offer status action
  const toggleProductOfferAction = async (productId: string) => {
    dispatch({ type: 'TOGGLE_PRODUCT_OFFER_START', payload: productId });
    try {
      const updatedProducts = await toggleProductOffer(productId);
      dispatch({ type: 'TOGGLE_PRODUCT_OFFER_SUCCESS', payload: updatedProducts });
      
      const product = updatedProducts.find((p: Product) => p.id === productId);
      toast.info(`Producto ${product?.name} ${product?.offer ? 'en oferta' : 'fuera de oferta'}`);
    } catch (error) {
      dispatch({ 
        type: 'TOGGLE_PRODUCT_OFFER_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error toggling product offer status' 
      });
      toast.error('No se pudo cambiar el estado de oferta del producto');
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        state, 
        dispatch, 
        fetchProductsAction, 
        toggleProductStatusAction, 
        updateProductPriceAction,
        toggleProductOfferAction
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the ProductContext
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};