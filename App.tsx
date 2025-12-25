
import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Star, ChevronRight, MessageSquare, Trash2, Plus, Minus } from 'lucide-react';
import { Product, CartItem, Category } from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './constants';
import { getSmartProductRecommendation } from './services/geminiService';

export default function App() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtered products logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsAiLoading(true);
    const result = await getSmartProductRecommendation(searchQuery, products);
    setAiResponse(result || "No suggestions found.");
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div 
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); setSelectedProduct(null); }}
            >
              ShopBase<span className="text-gray-900">BD</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleAiSearch} className="relative w-full group">
              <input
                type="text"
                placeholder="Ask our AI to find anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-12 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <button 
                type="submit"
                className="absolute right-1 top-1 h-8 px-3 bg-orange-500 text-white rounded-full text-xs font-semibold hover:bg-orange-600 transition-colors"
              >
                AI Search
              </button>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium">
              Login
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden lg:block border-t border-gray-50 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category)}
                className={`text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* AI Notification */}
        {aiResponse && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-xl relative animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600 h-fit">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-orange-900 mb-1">AI Shopping Assistant</h3>
                <p className="text-sm text-orange-800 leading-relaxed">{aiResponse}</p>
              </div>
              <button onClick={() => setAiResponse(null)} className="text-orange-400 hover:text-orange-600">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        {activeCategory === 'All' && !searchQuery && !selectedProduct && (
          <div className="relative h-[300px] lg:h-[400px] rounded-3xl overflow-hidden mb-12 bg-gray-900 group">
            <img 
              src="https://picsum.photos/seed/tech/1200/400" 
              alt="Hero"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16 text-white max-w-2xl">
              <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 leading-tight">
                Premium Gadgets <br/><span className="text-orange-500">Curated for You</span>
              </h1>
              <p className="text-lg text-gray-200 mb-8 font-light">
                Discover the latest in tech, fashion and home automation with ShopBase BD's smart collection.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveCategory('Gadgets')}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-full font-bold transition-all transform hover:scale-105"
                >
                  Shop Gadgets
                </button>
                <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full font-bold border border-white/30 transition-all">
                  Flash Sales
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Details View */}
        {selectedProduct ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600"
            >
              <ChevronRight className="rotate-180" size={16} /> Back to Products
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm">
              <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full mb-4">
                  {selectedProduct.category}
                </span>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 mb-6 text-orange-500">
                  <Star fill="currentColor" size={18} />
                  <span className="font-bold text-gray-900">{selectedProduct.rating}</span>
                  <span className="text-gray-400 text-sm">(120 Reviews)</span>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-6">
                  ৳{selectedProduct.price.toLocaleString()}
                </div>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {selectedProduct.description}
                </p>
                <div className="flex gap-4 mb-8">
                  <button 
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                  <button className="px-6 border border-gray-200 hover:bg-gray-50 rounded-xl">
                    ❤️
                  </button>
                </div>
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stock Availability:</span>
                    <span className="font-medium text-green-600">{selectedProduct.stock} units left</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery:</span>
                    <span className="font-medium text-gray-900">2-4 Days (Dhaka)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeCategory === 'All' ? 'Our Collections' : activeCategory}
              </h2>
              <span className="text-sm text-gray-500">{filteredProducts.length} items found</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Search className="mx-auto text-gray-200 mb-4" size={64} />
                <h3 className="text-xl font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                  >
                    <div 
                      className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        ❤️
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">
                        {product.category}
                      </div>
                      <h3 
                        className="font-semibold text-gray-900 mb-1 truncate cursor-pointer hover:text-orange-500"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="text-orange-400 fill-orange-400" size={12} />
                        <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-gray-900">৳{product.price.toLocaleString()}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="p-2 bg-gray-900 text-white rounded-lg hover:bg-orange-500 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">ShopBase BD</h2>
            <p className="text-gray-400 text-sm font-light">
              Premium curated e-commerce platform in Bangladesh. Quality products, smart delivery.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-orange-500">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-500">How to Buy</a></li>
              <li><a href="#" className="hover:text-orange-500">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-orange-500">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">ShopBase</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-orange-500">About Us</a></li>
              <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-500">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-orange-500">Campaigns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Get the latest deals and updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none w-full"
              />
              <button className="bg-orange-500 px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ShopBase BD. Developed with Smart AI Integration.
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={24} /> Your Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingCart size={64} className="text-gray-100 mb-4" />
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-orange-500 font-bold hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">৳{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-orange-500"><Minus size={14} /></button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-orange-500"><Plus size={14} /></button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">৳{cartTotal.toLocaleString()}</span>
                </div>
                <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-transform active:scale-95 shadow-lg shadow-orange-500/20">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-xs bg-white flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="text-xl font-black text-orange-500">ShopBase BD</div>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex-1 py-4">
              <div className="px-6 mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
                <nav className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat as Category); setIsMobileMenuOpen(false); setSelectedProduct(null); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                        activeCategory === cat ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Search - Always Accessible */}
      {!isCartOpen && (
        <button 
          onClick={() => {
            const input = document.querySelector('input');
            input?.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 p-4 bg-gray-900 text-white rounded-full shadow-2xl flex items-center gap-3 group hover:bg-orange-600 transition-all z-40"
        >
          <div className="bg-white/20 p-2 rounded-full">
            <MessageSquare size={20} />
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold pr-2">
            Ask Shopping Assistant
          </span>
        </button>
      )}

      {/* Loading Overlay for AI */}
      {isAiLoading && (
        <div className="fixed inset-0 z-[200] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-20 h-20 mb-4">
             <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-orange-900 font-bold animate-pulse">Consulting the AI Guru...</p>
        </div>
      )}
    </div>
  );
}
