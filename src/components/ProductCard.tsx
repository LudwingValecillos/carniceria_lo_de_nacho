import { Plus } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// Función para formatear precios con separadores de miles
const formatPrice = (price: number): string => {
  return price.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Función para capitalizar la primera letra
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden md:w-56 h-72">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-contain" // Cambiado a object-contain
      />
      <div className="p-2 md:p-4">
        <h3 className="md:text-lg font-semibold text-gray-800">
          {capitalizeFirstLetter(product.name)}
        </h3>
        <div className="flex items-center justify-between">
          <span className="md:text-xl font-bold text-red-600 mr-2">
            ${formatPrice(product.price)}/kg
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
