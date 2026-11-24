import React, { useState, useEffect } from 'react';
import { Pill, Search, ShoppingBag, ShieldCheck, CheckCircle, Upload, Plus, Minus, Trash2 } from 'lucide-react';
import { PharmacyProduct, User } from '../types';

interface PharmacyViewProps {
  currentUser: User | null;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({ currentUser }) => {
  const [products, setProducts] = useState<PharmacyProduct[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ product: PharmacyProduct; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [rxFile, setRxFile] = useState<File | null>(null);
  const [address, setAddress] = useState('15 Admiralty Way, Lekki, Lagos');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Over-The-Counter', 'Prescription Medicines', 'Medical Supplies', 'Healthcare Equipment'];

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`/api/pharmacy/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch pharmacy products', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: PharmacyProduct) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { product, qty: 1 }]);
    }
    setCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean) as any);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/pharmacy/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: currentUser?.id || 'u-5',
          patientName: currentUser?.name || 'Patient Blessing',
          items: cart.map(i => ({ productId: i.product.id, name: i.product.name, qty: i.qty, price: i.product.price })),
          total: totalAmount,
          address
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => setOrderSuccess(false), 4000);
    } catch (err) {
      console.error('Checkout failed', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 relative">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row justify-between items-center">
        <div className="space-y-3">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Licensed Online Pharmacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Genuine Medicines & Supplies</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
            Order prescription medicines with verified doctor prescription review, over-the-counter products, and medical equipment delivered to your doorstep.
          </p>
        </div>
        <button 
          onClick={() => setCartOpen(true)}
          className="mt-6 md:mt-0 bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 py-3.5 rounded-2xl shadow-xl flex items-center space-x-2 transition"
        >
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <span>Cart ({cart.reduce((s, i) => s + i.qty, 0)})</span>
        </button>
      </div>

      {orderSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 shadow-md">
          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Pharmacy Order Placed Successfully!</h4>
            <p className="text-xs text-emerald-700">Your order is being reviewed by our licensed pharmacist and prepared for delivery.</p>
          </div>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                category === cat 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search medicines, equipment..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 mt-3">Loading pharmacy catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-lg">No products found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col justify-between">
              <div>
                <div className="relative h-48 overflow-hidden bg-gray-50">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  {prod.rxRequired && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Prescription Required
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded uppercase">
                    {prod.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base">{prod.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{prod.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Price</p>
                  <p className="font-bold text-emerald-700 text-base">₦{prod.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => addToCart(prod)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Drawer / Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-lg text-gray-900">Your Pharmacy Cart</h3>
                </div>
                <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center text-gray-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
                  <p className="text-sm font-semibold">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">{item.product.name}</h4>
                        <p className="text-xs text-emerald-700 font-semibold mt-0.5">₦{item.product.price.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateQty(item.product.id, -1)} className="p-1 bg-white border rounded-md text-gray-600 hover:bg-gray-100"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, 1)} className="p-1 bg-white border rounded-md text-gray-600 hover:bg-gray-100"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 space-y-3 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Delivery Address</label>
                      <input 
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Upload Doctor Prescription (If required)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 font-medium">Click to upload prescription PDF or image</p>
                        <input type="file" className="hidden" onChange={e => setRxFile(e.target.files?.[0] || null)} />
                      </div>
                      {rxFile && <p className="text-[10px] text-emerald-600 font-semibold mt-1">Attached: {rxFile.name}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="flex justify-between items-center font-bold text-gray-900 text-base">
                  <span>Total Amount:</span>
                  <span className="text-emerald-700">₦{totalAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { handleCheckout(); setCartOpen(false); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Checkout & Deliver</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
