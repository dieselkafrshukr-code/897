import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight } from 'lucide-react';

interface ExitIntentPopupProps {
    onClose: () => void;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenShown, setHasBeenShown] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasBeenShown) {
                setIsVisible(true);
                setHasBeenShown(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasBeenShown]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{
                        width: '90%', maxWidth: '500px', background: 'var(--bg-2)', borderRadius: '32px',
                        padding: '3rem', position: 'relative', border: '1px solid var(--glass-border)',
                        textAlign: 'center', overflow: 'hidden'
                    }}
                >
                    {/* Decorative Background */}
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />

                    <button
                        onClick={() => { setIsVisible(false); onClose(); }}
                        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ marginBottom: '2rem', display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-400)' }}>
                        <Gift size={48} />
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>
                        Wait! Don't <span className="highlight">Leave</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                        Get <strong style={{ color: 'var(--gold-400)' }}>15% OFF</strong> on your first order.
                        Subscribe to our premium collection now.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="email"
                            placeholder="Enter your VIP email"
                            style={{
                                width: '100%', padding: '1.25rem 2rem', borderRadius: '16px',
                                background: 'var(--bg-3)', border: '1px solid var(--glass-border)',
                                color: 'var(--text-primary)', outline: 'none', textAlign: 'center'
                            }}
                        />
                        <button style={{
                            width: '100%', padding: '1.25rem 2rem', borderRadius: '16px',
                            background: 'linear-gradient(135deg, #D4AF37, #B8922A)',
                            color: '#000', fontWeight: 800, textTransform: 'uppercase',
                            letterSpacing: '0.1em', cursor: 'pointer', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}>
                            Unlock My Discount <ArrowRight size={18} />
                        </button>
                    </div>

                    <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        * Valid for next 24 hours only. Luxury takes time, but this offer doesn't.
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ExitIntentPopup;
