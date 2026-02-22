import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProductCard from './components/ProductCard/ProductCard';
import PersonalizationEngine from './components/AI/PersonalizationEngine';
import GamificationHub from './components/Gamification/GamificationHub';
import SupportSystem from './components/Support/SupportSystem';
import { CatalogService, Product } from './services/catalogService';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { Truck, ShieldCheck, Star, Headphones } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';

// Lazy Loaded Components
const ShopPage = lazy(() => import('./components/Shop/ShopPage'));
const ProductDetail = lazy(() => import('./components/Product/ProductDetail'));
const CheckoutPage = lazy(() => import('./components/Checkout/CheckoutPage'));
const OrderSuccess = lazy(() => import('./components/Checkout/OrderSuccess'));
const WishlistPage = lazy(() => import('./components/Wishlist/WishlistPage'));
const OrdersHistory = lazy(() => import('./components/Orders/OrdersHistory'));
const MarketplaceDashboard = lazy(() => import('./components/Marketplace/MarketplaceDashboard'));
const AIChatbot = lazy(() => import('./components/AI/AIChatbot'));
const ExitIntentPopup = lazy(() => import('./components/Marketing/ExitIntentPopup'));

const PageLoader = () => (
  <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-1)' }}>
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--gold-400)', borderTopColor: 'transparent' }}
    />
  </div>
);

type Page = 'home' | 'shop' | 'product' | 'checkout' | 'order-success' | 'wishlist' | 'orders' | 'admin';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await CatalogService.getProducts({ status: 'active' });
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
    setLoading(false);
  };

  const navigateTo = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleProductSelect = useCallback(async (id: string) => {
    const found = products.find(p => p.id === id);
    if (found) {
      setSelectedProduct(found);
      navigateTo('product');
    }
  }, [products, navigateTo]);

  const features = [
    { icon: <Truck size={22} />, title: 'Free Shipping', desc: 'On all orders over $100' },
    { icon: <ShieldCheck size={22} />, title: 'Secure Payment', desc: '100% encrypted & safe' },
    { icon: <Star size={22} />, title: 'Premium Quality', desc: 'Handcrafted excellence' },
    { icon: <Headphones size={22} />, title: '24/7 Support', desc: 'Always here for you' },
  ];

  return (
    <UserProvider>
      <AnalyticsProvider>
        <CartProvider>
          <ToastProvider>
            <div style={{ minHeight: '100vh', background: 'var(--bg-1)' }}>
              <Header
                currentPage={page}
                onNavigate={navigateTo}
              />

              <AnimatePresence mode="wait">
                {page === 'home' && (
                  <motion.main
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Hero onShopNow={() => navigateTo('shop')} />

                    {/* Gamification + AI */}
                    <section className="container mx-auto px-6 mt-12" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                      <GamificationHub />
                      <PersonalizationEngine />
                    </section>

                    {/* Latest Arrivals */}
                    <section style={{ padding: '5rem 0' }}>
                      <div className="container">
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1rem' }}>
                          <div>
                            <span className="section-label">Fresh Drops</span>
                            <motion.h2
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              className="section-title"
                            >
                              Latest <span className="highlight">Arrivals</span>
                            </motion.h2>
                          </div>
                          <button
                            onClick={() => navigateTo('shop')}
                            className="btn-outline-gold"
                          >
                            View All Products →
                          </button>
                        </div>

                        <div className="products-grid">
                          {loading ? (
                            [...Array(4)].map((_, i) => (
                              <div key={i} style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <div className="skeleton" style={{ aspectRatio: '4/5', borderRadius: '20px 20px 0 0' }} />
                                <div style={{ padding: '1.25rem', background: 'var(--bg-2)', borderRadius: '0 0 20px 20px' }}>
                                  <div className="skeleton" style={{ height: '10px', width: '40%', borderRadius: '4px', marginBottom: '8px' }} />
                                  <div className="skeleton" style={{ height: '16px', width: '75%', borderRadius: '4px', marginBottom: '10px' }} />
                                  <div className="skeleton" style={{ height: '20px', width: '35%', borderRadius: '4px' }} />
                                </div>
                              </div>
                            ))
                          ) : products.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-2)', borderRadius: '24px', border: '1px dashed var(--glass-border)' }}>
                              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No products yet. Add some from the Admin panel.</p>
                            </div>
                          ) : (
                            products.slice(0, 8).map((product, idx) => (
                              <ProductCard
                                key={product.id}
                                id={parseInt(product.id.slice(0, 8), 16) || idx}
                                name={product.name}
                                price={product.price}
                                image={product.images?.[0] || `https://picsum.photos/seed/${product.id}/400/500`}
                                category={product.categoryId || 'General'}
                                rating={4.5 + Math.random() * 0.5}
                                discount={Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 10 : undefined}
                                isNew={idx < 3}
                                onView={() => handleProductSelect(product.id)}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    </section>

                    {/* Features Strip */}
                    <section style={{
                      background: 'var(--bg-2)',
                      borderTop: '1px solid var(--glass-border)',
                      borderBottom: '1px solid var(--glass-border)',
                      padding: '3rem 0',
                    }}>
                      <div className="container">
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '2rem',
                        }}>
                          {features.map((f, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                              style={{ textAlign: 'center' }}
                            >
                              <div style={{
                                width: '52px', height: '52px',
                                borderRadius: '16px',
                                background: 'rgba(212,175,55,0.1)',
                                border: '1px solid rgba(212,175,55,0.2)',
                                margin: '0 auto 1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--gold-400)',
                                transition: 'all 0.3s',
                              }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = 'var(--gold-400)';
                                  e.currentTarget.style.color = '#000';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = 'rgba(212,175,55,0.1)';
                                  e.currentTarget.style.color = 'var(--gold-400)';
                                }}
                              >
                                {f.icon}
                              </div>
                              <h3 style={{ fontWeight: 800, marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>{f.title}</h3>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{f.desc}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Enterprise Dashboard */}
                    <MarketplaceDashboard />

                    {/* Footer */}
                    <footer style={{
                      padding: '3rem 0',
                      borderTop: '1px solid var(--glass-border)',
                      background: 'var(--bg-0)',
                    }}>
                      <div className="container" style={{ textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                          marginBottom: '1.5rem',
                        }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, #D4AF37, #B8922A)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Star size={16} fill="#000" color="#000" />
                          </div>
                          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', background: 'linear-gradient(135deg, #D4AF37, #F9E2AF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            YOUSSEF LUXURY
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          © 2026 Youssef Luxury Store. All rights reserved. Crafted with excellence.
                        </p>
                      </div>
                    </footer>
                  </motion.main>
                )}

                <Suspense fallback={<PageLoader />}>
                  {page === 'shop' && (
                    <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <ShopPage onProductSelect={handleProductSelect} />
                    </motion.div>
                  )}

                  {page === 'product' && (
                    <motion.div key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <ProductDetail
                        product={selectedProduct}
                        allProducts={products}
                        onProductSelect={handleProductSelect}
                        onBack={() => navigateTo('shop')}
                      />
                    </motion.div>
                  )}

                  {page === 'checkout' && (
                    <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <CheckoutPage
                        onBack={() => navigateTo('shop')}
                        onSuccess={() => navigateTo('order-success')}
                      />
                    </motion.div>
                  )}

                  {page === 'order-success' && (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <OrderSuccess
                        onGoHome={() => navigateTo('home')}
                        onGoShop={() => navigateTo('shop')}
                      />
                    </motion.div>
                  )}

                  {page === 'wishlist' && (
                    <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <WishlistPage
                        products={products}
                        onProductSelect={handleProductSelect}
                        onBack={() => navigateTo('shop')}
                      />
                    </motion.div>
                  )}

                  {page === 'orders' && (
                    <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <OrdersHistory
                        onBack={() => navigateTo('home')}
                      />
                    </motion.div>
                  )}

                  {page === 'admin' && (
                    <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <MarketplaceDashboard />
                    </motion.div>
                  )}
                </Suspense>
              </AnimatePresence>

              <AIChatbot />
              <SupportSystem />
              <Suspense fallback={null}>
                <ExitIntentPopup onClose={() => { }} />
              </Suspense>
            </div>
          </ToastProvider>
        </CartProvider>
      </AnalyticsProvider>
    </UserProvider>
  );
}

export default App;
