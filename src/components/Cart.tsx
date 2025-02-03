import { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { CartItem, CustomerInfo } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    location: '',
    paymentMethod: 'cash'
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Función para formatear precios con separadores de miles
  const formatPrice = (price: number): string => {
    return price.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleWhatsAppOrder = () => {
    const message = `*Nuevo Pedido*\n\n` +
      `*Cliente:* ${customerInfo.name}\n` +
      `*Ubicación:* ${customerInfo.location}\n` +
      `*Método de Pago:* ${customerInfo.paymentMethod}\n\n` +
      `*Productos:*\n${items.map(item => 
        `- ${item.name}: ${item.quantity}kg x $${formatPrice(item.price)} = $${formatPrice(item.price * item.quantity)}`
      ).join('\n')}\n\n` +
      `*Total:* $${formatPrice(total)}`;

    window.open(`https://wa.me/91173680952?text=${encodeURIComponent(message)}`);
    setIsOpen(false);
    setShowCustomerForm(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4 z-40 bg-red-600 p-2 rounded-full"
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Carrito</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {!showCustomerForm ? (
              <div className="p-4">
                {items.length === 0 ? (
                  <p className="text-center text-gray-500">El carrito está vacío</p>
                ) : (
                  <>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">${formatPrice(item.price)}/kg</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 0.5))}
                              className="px-2 py-1 bg-gray-100 rounded"
                            >
                              -
                            </button>
                            <span className='w-10 text-center'>{item.quantity}kg</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 0.5)}
                              className="px-2 py-1 bg-gray-100 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Total:</span>
                        <span className="text-xl font-bold">${formatPrice(total)}</span>
                      </div>
                      <button
                        onClick={() => setShowCustomerForm(true)}
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Contactar por WhatsApp
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleWhatsAppOrder();
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={customerInfo.location}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={customerInfo.paymentMethod}
                        onChange={(e) => setCustomerInfo({
                          ...customerInfo,
                          paymentMethod: e.target.value as 'cash' | 'card' | 'transfer'
                        })}
                      >
                        <option value="cash">Efectivo</option>
                        <option value="card">Tarjeta</option>
                        <option value="transfer">Transferencia</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Enviar Pedido
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}