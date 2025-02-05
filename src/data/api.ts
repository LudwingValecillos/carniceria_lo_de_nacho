import axios from 'axios';
import { Product } from '../types';

const API_URL = 'https://api.jsonbin.io/v3/b/67a17aa9ad19ca34f8f96825'; // Reemplaza con tu URL de JSONBin
const API_KEY = '$2a$10$NX0Yf/TcCBMfxZyucoKoB.2IKTOWiCwjk.c0NL/o/nf78rg/UQ.ny'; // Solo si es privado

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-Master-Key': API_KEY, // Solo si es necesario
      },
    });

    // Determina la fuente correcta de datos
    const productsData =
      response.data.record?.record || response.data.record || response.data || [];

    // Asegura que productsData sea un array
    const productsList = Array.isArray(productsData) ? productsData : [productsData];

    // Transforma los datos para que coincidan con el tipo Product
    const transformedProducts = productsList.map((product: any) => ({
      ...product,
      id: product.id?.toString() || crypto.randomUUID(), // Asegura que id sea string
      price:
        typeof product.price === 'string'
          ? parseFloat(product.price.replace(/\./g, ''))
          : product.price,
      active: product.active ?? true, // Valor por defecto true si no se especifica
      offer: product.offer ?? false, // Valor por defecto false si no se especifica
    }));

    console.log('Transformed Products:', transformedProducts);
    return transformedProducts;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return [];
  }
};

export const updateProductPrice = async (productId: string, newPrice: number) => {
  try {
    // Obtiene los productos actuales
    const response = await axios.get(API_URL, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });

    // Actualiza el precio del producto específico
    const updatedProducts = response.data.record.map((product: Product) =>
      product.id === productId ? { ...product, price: newPrice } : product
    );

    // Envía los productos actualizados
    await axios.put(API_URL, updatedProducts, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    return updatedProducts;
  } catch (error) {
    console.error('Error updating product price:', error);
    throw error;
  }
};

export const toggleProductStatus = async (productId: string) => {
  try {
    // Obtiene los productos actuales
    const response = await axios.get(API_URL, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });

    // Cambia el estado (active) del producto específico
    const updatedProducts = response.data.record.map((product: Product) =>
      product.id === productId ? { ...product, active: !product.active } : product
    );

    // Envía los productos actualizados
    await axios.put(API_URL, updatedProducts, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    return updatedProducts;
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }
};

export const toggleProductOffer = async (productId: string) => {
  try {
    // Obtiene los productos actuales
    const response = await axios.get(API_URL, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });

    // Determina la fuente correcta de datos
    const productsData =
      response.data.record?.record || response.data.record || response.data || [];

    // Asegura que productsData sea un array
    const currentProducts = Array.isArray(productsData) ? productsData : [productsData];

    // Cambia el estado de oferta del producto
    const updatedProducts = currentProducts.map((product: Product) => {
      if (product.id === productId) {
        const currentOfferStatus = product.offer ?? false;
        return { ...product, offer: !currentOfferStatus };
      }
      return product;
    });

    // Envía los productos actualizados
    await axios.put(API_URL, { record: updatedProducts }, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    return updatedProducts;
  } catch (error) {
    console.error('Error toggling product offer status:', error);
    throw error;
  }
};

export default fetchProducts;
