import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../ProductCard/ProductCard';

interface WishlistPageProps {
    products: any[];
    onProductSelect: (id: string) => void;
    onBack: () => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ products, onProductSelect, onBack }) => {
    const { profile, toggleWishlist } = useUser();
    const { showToast } = useToast();

    const wishlistItems = products.filter(p => profile?.wishlist.includes(p.id));

    const handleRemove = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await toggleWishlist(id);
        showToast('Removed from wishlist', 'info');
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--bg-1)' }}>
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <button onClick={onBack} className="btn-ghost" style={{ padding: '0.6rem 1rem' }}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900 }}>
                        My <span className="highlight">Wishlist</span>
                    </h1>
                </div>

                {wishlistItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                        <Heart size={64} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Your wishlist is empty</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Save your favorite items here to find them later.</p>
                        <button onClick={onBack} className="premium-btn">Start Shopping</button>
                    </div>
                ) : (
                    <div className="products-grid">
                        <AnimatePresence>
                            {wishlistItems.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{ position: 'relative' }}
                                >
                                    <ProductCard
                                        {...product}
                                        onView={() => onProductSelect(product.id)}
                                    />
                                    <button
                                        onClick={(e) => handleRemove(product.id, e)}
                                        style={{
                                            position: 'absolute', top: '1rem', right: '1rem',
                                            width: '36px', height: '36px', borderRadius: '50%',
                                            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
                                            color: 'var(--accent-rose)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', zIndex: 10, transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-rose)'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
