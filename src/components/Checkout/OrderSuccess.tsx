import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface OrderSuccessProps {
    onGoHome: () => void;
    onGoShop: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onGoHome, onGoShop }) => {
    useEffect(() => {
        confetti({ particleCount: 150, spread: 120, origin: { y: 0.5 }, colors: ['#D4AF37', '#F9E2AF', '#22C55E', '#fff'] });
    }, []);

    const orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return (
        <div style={{
            minHeight: '100vh', paddingTop: '6rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-1)',
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                style={{
                    textAlign: 'center', padding: '3rem 2rem',
                    maxWidth: '480px', width: '100%',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '28px',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                    margin: '0 1rem',
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 12, stiffness: 200 }}
                    style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        background: 'rgba(34,197,94,0.12)',
                        border: '3px solid var(--accent-green)',
                        margin: '0 auto 1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(34,197,94,0.2)',
                    }}
                >
                    <CheckCircle size={44} color="var(--accent-green)" />
                </motion.div>

                <h1 style={{
                    fontFamily: 'var(--font-heading)', fontSize: '2rem',
                    fontWeight: 900, letterSpacing: '-0.03em',
                    marginBottom: '0.5rem',
                }}>
                    Order Placed! 🎉
                </h1>

                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    Thank you for your purchase. Your order has been successfully placed and is being processed.
                </p>

                <div style={{
                    background: 'var(--bg-3)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    marginBottom: '2rem',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Order ID</span>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--gold-400)' }}>{orderId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Estimated Delivery</span>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>3-5 Business Days</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.75rem', background: 'rgba(34,197,94,0.08)', borderRadius: '10px' }}>
                        <Package size={16} color="var(--accent-green)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 700 }}>Preparing your order...</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={onGoHome} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '0.875rem' }}>
                        <Home size={17} /> Home
                    </button>
                    <button onClick={onGoShop} className="premium-btn" style={{ flex: 1, padding: '0.875rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                        Shop More <ArrowRight size={17} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
