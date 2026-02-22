import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import AIUpsellPredictor from '../AI/AIUpsellPredictor';

interface MiniCartProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout?: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ isOpen, onClose, onCheckout }) => {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 1100,
                        }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                        style={{
                            position: 'fixed', right: 0, top: 0,
                            height: '100%', width: '100%', maxWidth: '420px',
                            background: 'var(--bg-0)',
                            borderLeft: '1px solid var(--glass-border)',
                            zIndex: 1200,
                            display: 'flex', flexDirection: 'column',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1.5rem 1.75rem',
                            borderBottom: '1px solid var(--glass-border)',
                            background: 'var(--bg-1)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShoppingBag size={22} color="var(--gold-400)" />
                                <div>
                                    <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>Your Bag</h2>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'var(--bg-3)', border: 'none',
                                    color: 'var(--text-muted)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.transform = 'rotate(0)'; }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Items */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.length === 0 ? (
                                <div style={{
                                    flex: 1, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    padding: '3rem 1rem', textAlign: 'center',
                                }}>
                                    <Package size={64} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Your bag is empty</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Add items to get started</p>
                                    <button onClick={onClose} className="premium-btn" style={{ padding: '0.75rem 1.5rem' }}>
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={`${item.id}-${item.variant}`}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 60 }}
                                            style={{
                                                display: 'flex', gap: '0.875rem',
                                                background: 'var(--bg-2)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '16px', padding: '0.875rem',
                                            }}
                                        >
                                            <div style={{ width: '76px', height: '76px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                                <p style={{ color: 'var(--gold-400)', fontWeight: 800, fontSize: '0.925rem', marginBottom: '0.5rem' }}>${item.price.toFixed(2)}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center',
                                                        background: 'var(--bg-3)',
                                                        borderRadius: '20px', overflow: 'hidden',
                                                    }}>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            style={{ padding: '0.3rem 0.6rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.15s' }}
                                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-400)'}
                                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                        >
                                                            <Minus size={13} />
                                                        </button>
                                                        <span style={{ padding: '0 0.375rem', fontWeight: 700, fontSize: '0.825rem', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            style={{ padding: '0.3rem 0.6rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.15s' }}
                                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-400)'}
                                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                        >
                                                            <Plus size={13} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        style={{ background: 'none', border: 'none', color: 'rgba(244,63,94,0.5)', cursor: 'pointer', transition: 'color 0.15s', padding: '0.25rem' }}
                                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-rose)'}
                                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,63,94,0.5)'}
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                    <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: '0.875rem' }}>
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* AI Upsell */}
                                    <AIUpsellPredictor />
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                borderTop: '1px solid var(--glass-border)',
                                background: 'var(--bg-1)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Subtotal</span>
                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900 }}>${totalPrice.toFixed(2)}</span>
                                </div>
                                {totalPrice >= 100 && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '0.75rem', textAlign: 'center' }}>
                                        🎁 Free shipping unlocked!
                                    </p>
                                )}
                                <motion.button
                                    onClick={() => { onCheckout?.(); }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="premium-btn"
                                    style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '0.9rem' }}
                                >
                                    Proceed to Checkout <ArrowRight size={18} />
                                </motion.button>
                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                    🔒 Taxes and shipping calculated at checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MiniCart;
