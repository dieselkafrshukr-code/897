import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, ChevronRight, Shield, Tag, Check, Lock, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useUser } from '../../context/UserContext';

interface CheckoutPageProps {
    onBack: () => void;
    onSuccess: () => void;
}

const STEPS = ['Shipping', 'Payment', 'Review'];

const EGYPT_GOVERNORATES = [
    'Cairo', 'Giza', 'Alexandria', 'Luxor', 'Aswan',
    'Port Said', 'Suez', 'Ismailia', 'Mansoura', 'Tanta',
    'Zagazig', 'Faiyum', 'Qena', 'Sohag', 'Asyut',
    'Minya', 'Beni Suef', 'Damietta', 'Kafr el-Sheikh',
    'Damanhur', 'Banha', 'Shibin el-Kom', 'Marsa Matruh', 'Arish',
];

const PAYMENT_METHODS = [
    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
    { id: 'vodafone', label: 'Vodafone Cash', icon: '🔴' },
    { id: 'instapay', label: 'InstaPay', icon: '📱' },
];

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onSuccess }) => {
    const { cart, totalPrice, clearCart } = useCart();
    const { showToast } = useToast();
    const { addOrder } = useUser();
    const [step, setStep] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [placing, setPlacing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        phone: '', address: '', city: 'Cairo',
        cardNumber: '', expiry: '', cvv: '', cardName: '',
    });

    const shipping = totalPrice > 100 ? 0 : 15;
    const finalTotal = totalPrice + shipping - discount;

    const applyCoupon = () => {
        const COUPONS: Record<string, number> = { 'YOUSSEF20': 20, 'LUXURY10': 10, 'GOLD15': 15 };
        const pct = COUPONS[coupon.toUpperCase()];
        if (pct) {
            const discAmt = (totalPrice * pct) / 100;
            setDiscount(discAmt);
            setCouponApplied(true);
            showToast(`Coupon applied! Saved $${discAmt.toFixed(2)}`, 'success');
        } else {
            showToast('Invalid coupon code.', 'error');
        }
    };

    const handleInput = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePlaceOrder = async () => {
        setPlacing(true);
        try {
            const orderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            await addOrder({
                id: orderId,
                items: cart,
                total: finalTotal,
                address: formData.address,
                city: formData.city,
                date: new Date().toISOString()
            });

            await new Promise(res => setTimeout(res, 2000));
            showToast('Order placed successfully!', 'success');
            clearCart();
            onSuccess();
        } catch (error) {
            showToast('Failed to place order. Please try again.', 'error');
        } finally {
            setPlacing(false);
        }
    };

    const handleWhatsAppCheckout = async () => {
        const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();

        await addOrder({
            id: orderId,
            items: cart,
            total: finalTotal,
            address: formData.address,
            city: formData.city,
            date: new Date().toISOString(),
            method: 'whatsapp'
        });

        const itemsList = cart.map(item => `- ${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');

        const message = `*NEW ORDER - ${orderId}*\n\n` +
            `*Customer:* ${formData.firstName} ${formData.lastName}\n` +
            `*Phone:* ${formData.phone}\n` +
            `*Address:* ${formData.address}, ${formData.city}\n\n` +
            `*Items:*\n${itemsList}\n\n` +
            `*Subtotal:* $${totalPrice.toFixed(2)}\n` +
            `*Shipping:* ${shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}\n` +
            `*Final Total:* $${finalTotal.toFixed(2)}\n\n` +
            `*Payment Method:* ${PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}\n\n` +
            `Please confirm my order. Thank you!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/201234567890?text=${encodedMessage}`, '_blank');

        showToast('Redirecting to WhatsApp...', 'info');
        clearCart();
        onSuccess();
    };

    const InputField = ({ label, field, type = 'text', placeholder = '' }: any) => (
        <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={formData[field as keyof typeof formData]}
                onChange={e => handleInput(field, e.target.value)}
                className="input-field"
            />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--bg-1)' }}>
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: 'var(--bg-2)', border: '1.5px solid var(--glass-border)',
                            borderRadius: '10px', padding: '0.6rem 1rem',
                            color: 'var(--text-secondary)', cursor: 'pointer',
                            fontWeight: 600, fontSize: '0.825rem', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-400)'; e.currentTarget.style.color = 'var(--gold-400)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Checkout
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Lock size={14} /> Secure Checkout
                    </div>
                </div>

                {/* Steps */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '0' }}>
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: i <= step ? 'pointer' : 'default' }}
                                onClick={() => i < step && setStep(i)}
                            >
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '0.8rem', transition: 'all 0.3s',
                                    background: i < step ? 'var(--accent-green)' : i === step ? 'var(--gold-400)' : 'var(--bg-3)',
                                    color: i <= step ? '#000' : 'var(--text-muted)',
                                    boxShadow: i === step ? '0 4px 16px rgba(212,175,55,0.4)' : 'none',
                                }}>
                                    {i < step ? <Check size={16} /> : i + 1}
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: i === step ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                    {s}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{
                                    flex: 1, height: '2px', margin: '0 0.75rem',
                                    background: i < step ? 'var(--accent-green)' : 'var(--glass-border)',
                                    transition: 'background 0.4s',
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {/* Main Form */}
                    <div style={{ flex: '1 1 400px' }}>
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <motion.div key="shipping"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                >
                                    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                            <Truck size={20} color="var(--gold-400)" />
                                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 800 }}>Shipping Information</h2>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                            <InputField label="First Name" field="firstName" />
                                            <InputField label="Last Name" field="lastName" />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                            <InputField label="Email" field="email" type="email" />
                                            <InputField label="Phone" field="phone" type="tel" placeholder="+20..." />
                                        </div>
                                        <InputField label="Street Address" field="address" />
                                        <div style={{ marginTop: '1rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                                                Governorate
                                            </label>
                                            <select
                                                value={formData.city}
                                                onChange={e => handleInput('city', e.target.value)}
                                                className="input-field"
                                            >
                                                {EGYPT_GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <button onClick={() => setStep(1)} className="premium-btn" style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        Continue to Payment <ChevronRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 1 && (
                                <motion.div key="payment"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                >
                                    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                            <CreditCard size={20} color="var(--gold-400)" />
                                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 800 }}>Payment Method</h2>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            {PAYMENT_METHODS.map(m => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setPaymentMethod(m.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                                        padding: '1rem 1.25rem',
                                                        background: paymentMethod === m.id ? 'rgba(212,175,55,0.08)' : 'var(--bg-3)',
                                                        border: `2px solid ${paymentMethod === m.id ? 'var(--gold-400)' : 'transparent'}`,
                                                        borderRadius: '14px', cursor: 'pointer',
                                                        transition: 'all 0.2s', textAlign: 'left',
                                                    }}
                                                >
                                                    <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{m.label}</span>
                                                    {paymentMethod === m.id && (
                                                        <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Check size={12} color="#000" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <InputField label="Card Number" field="cardNumber" placeholder="1234 5678 9012 3456" />
                                                <InputField label="Name on Card" field="cardName" />
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <InputField label="Expiry Date" field="expiry" placeholder="MM/YY" />
                                                    <InputField label="CVV" field="cvv" placeholder="123" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button onClick={() => setStep(0)} className="btn-ghost" style={{ flex: '0 0 auto' }}>
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                        <button onClick={() => setStep(2)} className="premium-btn" style={{ flex: 1, padding: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                                            Review Order <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="review"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                >
                                    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.75rem' }}>
                                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Review</h2>
                                        {[
                                            { label: 'Ship to', value: `${formData.firstName} ${formData.lastName}, ${formData.city}` },
                                            { label: 'Payment', value: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || '' },
                                        ].map(r => (
                                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{r.label}</span>
                                                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{r.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button onClick={() => setStep(1)} className="btn-ghost" style={{ flex: '0 0 auto' }}>
                                                <ArrowLeft size={16} /> Back
                                            </button>
                                            <motion.button
                                                onClick={handlePlaceOrder}
                                                disabled={placing}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="premium-btn"
                                                style={{ flex: 1, padding: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', opacity: placing ? 0.8 : 1 }}
                                            >
                                                {placing ? (
                                                    <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                                ) : (
                                                    <> <Shield size={18} /> Place Order &bull; ${finalTotal.toFixed(2)}</>
                                                )}
                                            </motion.button>
                                        </div>

                                        <motion.button
                                            onClick={handleWhatsAppCheckout}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                width: '100%', padding: '1rem', borderRadius: '14px',
                                                background: '#25D366', color: '#fff', border: 'none',
                                                fontWeight: 800, display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', gap: '0.5rem', cursor: 'pointer',
                                                fontSize: '0.9rem', boxShadow: '0 8px 24px rgba(37,211,102,0.2)'
                                            }}
                                        >
                                            <MessageCircle size={18} /> Order via WhatsApp
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div style={{ flex: '0 0 340px' }}>
                        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.75rem', position: 'sticky', top: '7rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary ({cart.length} items)</h3>

                            {/* Cart Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-3)', flexShrink: 0 }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '0.8rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>x{item.quantity}</p>
                                        </div>
                                        <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon */}
                            {!couponApplied ? (
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Coupon code..."
                                        value={coupon}
                                        onChange={e => setCoupon(e.target.value)}
                                        style={{
                                            flex: 1, background: 'var(--bg-3)',
                                            border: '1.5px solid var(--glass-border)',
                                            borderRadius: '10px', padding: '0.625rem 0.875rem',
                                            color: 'var(--text-primary)', outline: 'none',
                                            fontSize: '0.8rem',
                                        }}
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        style={{
                                            padding: '0.625rem 0.875rem', borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #D4AF37, #B8922A)',
                                            border: 'none', color: '#000', fontWeight: 700,
                                            cursor: 'pointer', fontSize: '0.8rem',
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                        }}
                                    >
                                        <Tag size={15} /> Apply
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.625rem 0.875rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px' }}>
                                    <Check size={16} color="var(--accent-green)" />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 700 }}>Coupon Applied! Saving ${discount.toFixed(2)}</span>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
                                {[
                                    { label: 'Subtotal', value: `$${totalPrice.toFixed(2)}` },
                                    { label: 'Shipping', value: shipping === 0 ? '🎁 Free' : `$${shipping.toFixed(2)}` },
                                    ...(couponApplied ? [{ label: 'Discount', value: `-$${discount.toFixed(2)}`, color: 'var(--accent-green)' }] : []),
                                ].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{r.label}</span>
                                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: (r as any).color || 'var(--text-primary)' }}>{r.value}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 0', borderTop: '2px solid var(--glass-border)', marginTop: '0.5rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total</span>
                                    <span style={{ fontWeight: 900, fontSize: '1.35rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-400)' }}>${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Security */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                <Shield size={14} /> 256-bit SSL Encrypted &bull; 100% Secure
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default CheckoutPage;
