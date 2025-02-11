import { Plus } from "lucide-react";
import { Product } from "../types";
import clsx from "clsx";

// Función para formatear precios con separadores de miles
const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "0.00"; // Manejar valores nulos o indefinidos
  return price.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Función para capitalizar la primera letra
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOffer =
    product.offer ||
    product.name.includes("x") ||
    product.name.includes("X") ||
    product.name.includes("por");

  return (
    <div
      className={clsx(
        "flex flex-col justify-between bg-white overflow-hidden md:w-56 h-80 md:h-[22rem] border border-black rounded-lg shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]  md:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
        {
          "h-72": true,
          "md:h-80": true,
        }
      )}
    >
      {/* Imagen del producto */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 border-b border-black"
      />

      {/* Contenido del producto */}
      <div className="flex flex-col justify-between p-2 md:p-4">
        {/* Nombre del producto */}
        <h3 className="text-gray-800 md:text-lg font-semibold ">
          {capitalizeFirstLetter(product.name)}
        </h3>

        {/* Precio y botón de agregar al carrito */}
        {/* <div className="flex items-center justify-between h-full"> */}
        {/* Precio */}
        <span
          className={clsx("md:text-xl font-bold", {
            "text-red-600": isOffer,
            "text-gray-800": !isOffer,
          })}
        >
          {isOffer
            ? `$${formatPrice(product.price)}`
            : `$${formatPrice(product.price)}/kg`}
        </span>

        {/* Botón de agregar al carrito */}
        <div className="flex items-center justify-end">
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
