import { Plus } from "lucide-react";
import { Product } from "../types";
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// Función para formatear precios con separadores de miles
const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return '0.00';  // Handle null or undefined
  return price.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Función para capitalizar la primera letra
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className={clsx('bg-white rounded-lg shadow-md overflow-hidden md:w-56', {
      'h-72': true,
      'md:h-80': true
    })}>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-contain"
      />
      <div className={clsx('flex flex-col justify-between', {
        'p-2': true,
        'md:p-4': true
      })}>
        <h3 className={clsx('md:text-lg font-semibold', {
          'text-gray-800': true
        })}>
          {capitalizeFirstLetter(product.name)}
        </h3>
        <div className={clsx('flex items-center justify-between', {
          'h-full': true
        })}>
          <span className={clsx('md:text-xl font-bold', {
            'text-red-600': product.offer,
            'text-gray-800': !product.offer
          })}>
            {product.offer || product.name.includes('x') || product.name.includes('X') || product.name.includes('por') ? ` $${formatPrice(product.price)}`: ` $${formatPrice(product.price)}/kg` }
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className={clsx('text-white p-2 rounded-full hover:bg-blue-700 transition-colors', {
              'bg-blue-600': true
            })}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
