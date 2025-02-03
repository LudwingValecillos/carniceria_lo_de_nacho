import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Carousel } from './components/Carousel';
import { Sidebar } from './components/Sidebar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Product, CartItem } from './types';
import { Search, Menu, MessageCircle } from 'lucide-react';

// Simulated product data
// const generateProducts = (): Product[] => {
//   const types = ['Vacuno', 'Cerdo', 'Pollo', 'Embutidos', 'Achuras', 'Fiambres', 'Carbón', 'Bebidas'];
//   const products: Product[] = [];

//   for (let i = 1; i <= 200; i++) {
//     const category = types[Math.floor(Math.random() * types.length)];
//     products.push({
//       id: `prod-${i}`,
//       name: `${category} Premium ${i}`,
//       price: Math.random() * (1000 - 100) + 100,
//       category,
//       image: `https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=400`,
//       description: `Delicioso ${category.toLowerCase()} de alta calidad`
//     });
//   }

//   return products;
// };

const products = [
  {
    "id": 1,
    "name": "lomo",
    "price": 18900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/12b/c70/5c012bc701bc6093929461.jpg",
    "category": "vacuno"
  },
  {
    "id": 2,
    "name": "milanesa de peceto",
    "price": 11500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ba/80e/fe5/5ba80efe55de3917473922.jpg",
    "category": "vacuno"
  },
  {
    "id": 3,
    "name": "vacio",
    "price": 14900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/12c/94d/5c012c94d2cc1811727844.jpg",
    "category": "vacuno"
  },
  {
    "id": 4,
    "name": "tapa nalga",
    "price": 9490,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ba/80f/227/5ba80f227d0d6097591241.jpg",
    "category": "vacuno"
  },
  {
    "id": 5,
    "name": "tapa asada",
    "price": 9490,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5e5/fe9/f11/5e5fe9f114615742071366.png",
    "category": "vacuno"
  },
  {
    "id": 6,
    "name": "Road beef",
    "price": 6990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5be/dae/f4c/5bedaef4c69ca864510588.jpg",
    "category": "vacuno"
  },
  {
    "id": 7,
    "name": "picada",
    "price": 14900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/12d/0a2/5c012d0a23a43230246542.jpg",
    "category": "vacuno"
  },
  {
    "id": 8,
    "name": "peceto",
    "price": 12900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ba/817/c0e/5ba817c0e974d136656108.jpg",
    "category": "vacuno"
  },
  {
    "id": 9,
    "name": "paleta",
    "price": 7990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5f2/97d/d53/5f297dd5349f0926407798.png",
    "category": "vacuno"
  },
  {
    "id": 10,
    "name": "palomita",
    "price": 7990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9a9/107/5c49a9107e4f8587757557.png",
    "category": "vacuno"
  },
  {
    "id": 11,
    "name": "osobuco",
    "price": 3990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ba/817/e6c/5ba817e6c47b0247002700.jpg",
    "category": "vacuno"
  },
  {
    "id": 12,
    "name": "ojo de bife",
    "price": 18900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9aa/662/5c49aa6625fa8068512095.png",
    "category": "vacuno"
  },
  {
    "id": 13,
    "name": "nalga",
    "price": 10990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9aa/ca5/5c49aaca5397d377878701.png",
    "category": "vacuno"
  },
  {
    "id": 14,
    "name": "matambre",
    "price": 10900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ba/818/11a/5ba81811a9382549289697.jpg",
    "category": "vacuno"
  },
  {
    "id": 15,
    "name": "falda parrillera",
    "price": 5990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/12d/817/5c012d817dc2d367217191.jpg",
    "category": "vacuno"
  },
  {
    "id": 16,
    "name": "entraña",
    "price": 19900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/12e/395/5c012e3950d46195111498.jpg",
    "category": "vacuno"
  },
  {
    "id": 17,
    "name": "cuadril",
    "price": 8990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9ab/513/5c49ab5132520537851766.png",
    "category": "vacuno"
  },
  {
    "id": 18,
    "name": "cuadrada",
    "price": 9990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9ac/440/5c49ac44012d0223045177.png",
    "category": "vacuno"
  },
  {
    "id": 19,
    "name": "colita de cuadril",
    "price": 13900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/12e/cc5/5c012ecc58832664492795.jpg",
    "category": "vacuno"
  },
  {
    "id": 20,
    "name": "bide angosto",
    "price": 7990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5eb/976/b62/5eb976b62ed6c509387942.png",
    "category": "vacuno"
  },
  {
    "id": 21,
    "name": "bola de lomo",
    "price": 9990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5e5/fec/296/5e5fec296ba10082221051.png",
    "category": "vacuno"
  },
  {
    "id": 22,
    "name": "bife mediano",
    "price": 7990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5e5/fec/cfa/5e5feccfaa69c408441711.png",
    "category": "vacuno"
  },
  {
    "id": 23,
    "name": "bife de chorizo",
    "price": 15490,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/12f/dd8/5c012fdd8b03f484808268.jpg",
    "category": "vacuno"
  },
  {
    "id": 24,
    "name": "bife ancho",
    "price": 7490,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5e5/fee/32b/5e5fee32b902a893413530.png",
    "category": "vacuno"
  },
  {
    "id": 25,
    "name": "asado",
    "price": 7990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/130/5d5/5c01305d5ff22931872975.jpg",
    "category": "vacuno"
  },
  {
    "id": 26,
    "name": "bife americano",
    "price": 11900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d3/be0/5bc5d3be0ee32128858150.jpg",
    "category": "vacuno"
  },
  {
    "id": 27,
    "name": "ezpinazo",
    "price": 2000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d3/cfc/5bc5d3cfcdec7228297339.jpg",
    "category": "vacuno"
  },
  {
    "id": 28,
    "name": "falda puchero",
    "price": 4000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d3/ef3/5bc5d3ef336b7390882128.jpg",
    "category": "vacuno"
  },
  {
    "id": 29,
    "name": "hamburguesa",
    "price": 11500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5e5/ff0/563/5e5ff05636e0e751581642.png",
    "category": "vacuno"
  },
  {
    "id": 30,
    "name": "milanesa de carne",
    "price": 6800,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d4/186/5bc5d4186e871142316605.jpg",
    "category": "vacuno"
  },
  {
    "id": 31,
    "name": "tortuguita",
    "price": 7990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d4/564/5bc5d45649ffd305962521.jpg",
    "category": "vacuno"
  },
  {
    "id": 32,
    "name": "picada",
    "price": 7990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/130/cb7/5c0130cb743a8525416518.jpg",
    "category": "vacuno"
  },
  {
    "id": 33,
    "name": "picada especial",
    "price": 9990,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d4/715/5bc5d47155f80129087678.jpg",
    "category": "vacuno"
  },
  {
    "id": 34,
    "name": "osobuco por 2 kg",
    "price": 5800,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c1/8f9/986/5c18f998675c9575871293.png",
    "category": "vacuno"
  },
  {
    "id": 35,
    "name": "espinazo por 3kg",
    "price": 20000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c1/8fc/e32/5c18fce32e806322850765.png",
    "category": "vacuno"
  },
  {
    "id": 36,
    "name": "hamburguesa x2 kg",
    "price": 21000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c6/6bc/fd9/5c66bcfd91774706135719.png",
    "category": "vacuno"
  },
  {
    "id": 37,
    "name": "chivito",
    "price": 16900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/610/bdc/bb5/610bdcbb53e90966349372.png",
    "category": "vacuno"
  },
  {
    "id": 38,
    "name": "tapa de bife x2kg",
    "price": 10000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/619/28e/c31/61928ec313525498776503.png",
    "category": "vacuno"
  },
  {
    "id": 39,
    "name": "cordero",
    "price": 15900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/620/be8/a56/620be8a5608d4414105650.png",
    "category": "vacuno"
  },
  {
    "id": 40,
    "name": "carre",
    "price": 7500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/131/5ba/5c01315bafcfe936141897.jpg",
    "category": "cerdo"
  },
  {
    "id": 41,
    "name": "pechito",
    "price": 7500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ba/80a/96e/5ba80a96e179f481956329.jpg",
    "category": "cerdo"
  },
  {
    "id": 42,
    "name": "matambirto",
    "price": 15900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ba/80a/b2a/5ba80ab2a68f7605117063.jpg",
    "category": "cerdo"
  },
  {
    "id": 43,
    "name": "churrasquito",
    "price": 11900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9a7/391/5c49a7391a2d7002275080.png",
    "category": "cerdo"
  },
  {
    "id": 44,
    "name": "lechon",
    "price": 15900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ef/359/4df/5ef3594df0654710883544.png",
    "category": "cerdo"
  },
  {
    "id": 45,
    "name": "bondiola",
    "price": 9900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/62b/a44/b1a/62ba44b1a466d250957046.jpg",
    "category": "cerdo"
  },
  {
    "id": 46,
    "name": "mila de cerdo x2",
    "price": 10500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/64a/6e9/9e8/64a6e99e8f281747615755.png",
    "category": "cerdo"
  },
  {
    "id": 47,
    "name": "supremas",
    "price": 8490,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9a6/a56/5c49a6a5695fd126537712.png",
    "category": "pollo"
  },
  {
    "id": 48,
    "name": "pollo",
    "price": 3490,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ba/80d/c35/5ba80dc355698198410054.jpg",
    "category": "pollo"
  },
  {
    "id": 49,
    "name": "pata/muslo",
    "price": 3500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9a6/3a4/5c49a63a46cf5686156897.png",
    "category": "pollo"
  },
  {
    "id": 50,
    "name": "alitas",
    "price": 1500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9a6/070/5c49a6070d3a1467322422.png",
    "category": "pollo"
  },
  {
    "id": 51,
    "name": "pechuga",
    "price": 5000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5eb/55a/64e/5eb55a64ed704327466033.png",
    "category": "pollo"
  },
    {
    "id": 52,
    "name": "milanesa de pollo",
    "price": 6900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d7/512/5bc5d75123a84556024608.jpg",
    "category": "pollo"
  },
  {
    "id": 53,
    "name": "suprema por 2kg",
    "price": 15000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c6/e93/7cb/5c6e937cbfdca562609937.png",
    "category": "pollo"
  },
  {
    "id": 54,
    "name": "milanesa de pollo por 2 kg",
    "price": 12000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c6/e93/bab/5c6e93bab2291947054797.png",
    "category": "pollo"
  },
  {
    "id": 55,
    "name": "pollo(especial)",
    "price": 4800,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5ef/358/b74/5ef358b74a0c3159617863.png",
    "category": "pollo"
  },
  {
    "id": 56,
    "name": "mochilla (vasca)",
    "price": 9900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bb/bef/f9d/5bbbeff9dc0b4145095445.jpg",
    "category": "embutidos"
  },
  {
    "id": 57,
    "name": "chorizo (común)",
    "price": 8690,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bb/bf0/055/5bbbf00556c4e653005771.jpg",
    "category": "embutidos"
  },
  {
    "id": 58,
    "name": "chorizo (mezcla)",
    "price": 8290,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bb/bf0/0e8/5bbbf00e84631302816750.jpg",
    "category": "embutidos"
  },
  {
    "id": 59,
    "name": "salchicha parrilleta",
    "price": 10500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bb/bf0/16b/5bbbf016b7a86066649964.jpg",
    "category": "embutidos"
  },
  {
    "id": 60,
    "name": "salchicha Viena",
    "price": 8690,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bb/bf0/1f5/5bbbf01f589bd640398061.jpg",
    "category": "embutidos"
  },
  {
    "id": 61,
    "name": "chorizo (bombon)",
    "price": 8490,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d9/8c3/5bc5d98c3875a300032464.jpg",
    "category": "embutidos"
  },
  {
    "id": 62,
    "name": "chorizo (puro cerdo)",
    "price": 9790,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/131/fe8/5c0131fe89cf8868524406.jpg",
    "category": "embutidos"
  },
  {
    "id": 63,
    "name": "morchilla (bombon)",
    "price": 6800,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5da/6e4/5bc5da6e4742c205668325.jpg",
    "category": "embutidos"
  },
  {
    "id": 64,
    "name": "morcilla (especial)",
    "price": 7590,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/b1d/a8e/5c4b1da8e9e26914886971.png",
    "category": "embutidos"
  },
  {
    "id": 65,
    "name": "mondongo",
    "price": 4200,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c0/e91/60a/5c0e9160a4153929329466.jpg",
    "category": "anchuras"
  },
  {
    "id": 66,
    "name": "mollejas",
    "price": 17900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9a8/099/5c49a8099b5cf838811650.png",
    "category": "anchuras"
  },
  {
    "id": 67,
    "name": "chinchulín",
    "price": 4800,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5c4/9a8/836/5c49a88361f92349097620.png",
    "category": "anchuras"
  },
  {
    "id": 68,
    "name": "centro",
    "price": 5000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d7/9e4/5bc5d79e4554f479997431.jpg",
    "category": "anchuras"
  },
  {
    "id": 69,
    "name": "quijada",
    "price": 1300,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d8/00b/5bc5d800b7a82931895806.jpg",
    "category": "anchuras"
  },
  {
    "id": 70,
    "name": "higado",
    "price": 1400,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d8/42d/5bc5d842dc56d906214527.jpg",
    "category": "anchuras"
  },
  {
    "id": 71,
    "name": "corazon",
    "price": 2400,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d8/714/5bc5d87140c2c737255181.jpg",
    "category": "anchuras"
  },
  {
    "id": 72,
    "name": "lengua",
    "price": 9900,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d8/a1c/5bc5d8a1c49b3255274658.jpg",
    "category": "anchuras"
  },
  {
    "id": 73,
    "name": "tripa gorda",
    "price": 2000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d8/c4a/5bc5d8c4aefbe198579950.jpg",
    "category": "anchuras"
  },
  {
    "id": 74,
    "name": "ruda",
    "price": 2000,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d8/ee1/5bc5d8ee18b9d333439777.jpg",
    "category": "anchuras"
  },
  {
    "id": 75,
    "name": "riñon",
    "price": 4500,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d9/133/5bc5d9133a05a659649002.jpg",
    "category": "anchuras"
  },
  {
    "id": 76,
    "name": "rabo",
    "price": 5200,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d9/32a/5bc5d932a637e184021475.jpg",
    "category": "anchuras"
  },
  {
    "id": 77,
    "name": "sesos",
    "price": 750,
    "image": "https://jscarnicerias.com.ar/storage/app/uploads/public/5bc/5d9/66d/5bc5d966dbc56132800335.jpg",
    "category": "anchuras"
  }
]

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 0.5 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => {
      if (quantity === 0) {
        return prev.filter(item => item.id !== id);
      }
      return prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/1234567890', '_blank');
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleSidebar()}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-6 h-6 text-blue-600" />
            </button>
            <h1 className="hidden md:block text-2xl font-bold text-red-600">Carnicería Lo De Nacho</h1>
          </div>
          <div className="flex-1 justify-center items-center max-w-xl mx-4">
            <div className="relative pr-16 md:pr-0">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCategorySelect={setSelectedCategory}
      />

      {/* Main Content */}
      <div className="mt-16">
        <Routes>
          <Route path="/" element={
            <>
              {!selectedCategory && <Carousel />}
              <main className="flex-1 p-6">
                <div className="max-w-7xl mx-auto">
                  {selectedCategory && (
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Categoría: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                      </h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              </main>
            </>
          } />
          <Route path="/nosotros" element={
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
              <p className="text-lg mb-4">
                Somos una carnicería con más de 30 años de experiencia...
              </p>
            </div>
          } />
          <Route path="/contacto" element={
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-3xl font-bold mb-6">Contacto</h2>
              <p className="text-lg mb-4">
                Encuentranos en...
              </p>
            </div>
          } />
        </Routes>
      </div>

      {/* Fixed WhatsApp Button */}
      <button
        onClick={handleWhatsAppContact}
        className="fixed bottom-6 right-6 z-40 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p>Teléfono: (123) 456-7890</p>
              <p>Email: info@carniceria.com</p>
              <p>Dirección: Calle Principal 123</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horarios</h3>
              <p>Lunes a Viernes: 8:00 - 20:00</p>
              <p>Sábados: 8:00 - 14:00</p>
              <p>Domingos: Cerrado</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">Facebook</a>
                <a href="#" className="hover:text-blue-400">Instagram</a>
                <a href="#" className="hover:text-blue-400">Twitter</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 Carnicería. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;