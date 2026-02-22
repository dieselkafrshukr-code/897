import React from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, ExternalLink, Clock, CheckCircle, Truck } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface OrdersPageProps {
    onBack: () => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ onBack }) => {
    const { profile } = useUser();

    return (
        <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--bg-1)' }}>
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <button onClick={onBack} className="btn-ghost" style={{ padding: '0.6rem 1rem' }}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900 }}>
                        Order <span className="highlight">History</span>
                    </h1>
                </div>

                {!profile?.orders || profile.orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                        <Package size={64} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>No orders found</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't placed any orders yet.</p>
                        <button onClick={onBack} className="premium-btn">Browse Shop</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {profile.orders.map((order: any, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{
                                    background: 'var(--bg-2)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '20px',
                                    padding: '1.5rem',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID:</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gold-400)' }}>#{order.id || 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            <Clock size={14} />
                                            <span>{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 700 }}>
                                        <CheckCircle size={14} /> Processing
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Items</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {(order.items || []).map((item: any, i: number) => (
                                                <div key={i} style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                                    {item.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Shipping Address</p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{order.address || 'Standard Delivery'}</p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{order.city || 'Egypt'}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Amount</p>
                                        <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gold-400)', fontFamily: 'var(--font-heading)' }}>${(order.total || 0).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                    <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
                                        Track Order <Truck size={14} />
                                    </button>
                                    <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
                                        Details <ExternalLink size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
