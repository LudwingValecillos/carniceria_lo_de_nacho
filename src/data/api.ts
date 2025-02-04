import axios from 'axios';

const API_URL = 'https://api.jsonbin.io/v3/b/67a17aa9ad19ca34f8f96825'; // Reemplaza con tu URL de JSONBin
const API_KEY = '$2a$10$NX0Yf/TcCBMfxZyucoKoB.2IKTOWiCwjk.c0NL/o/nf78rg/UQ.ny'; // Solo si es privado

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-Master-Key': API_KEY, // Solo si es necesario
      }
    });
    
    // Transform the data to ensure it matches Product type
    const transformedProducts = response.data.record.map((product: any) => ({
      ...product,
      id: product.id?.toString() || crypto.randomUUID(), // Ensure id is a string
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/\./g, '')) 
        : product.price,
      active: product.active ?? true // Default to true if not specified
    }));

    console.log('Transformed Products:', transformedProducts); // Additional debug log
    return transformedProducts;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return [];
  }
};

export default fetchProducts;
