import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RefreshCw, ArrowLeft, Plus, Minus, ZoomIn, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import confetti from 'canvas-confetti';

interface ProductDetailProps {
    product: any | null;
    allProducts: any[];
    onProductSelect: (id: string) => void;
    onBack: () => void;
}

const FEATURES = [
    { icon: <Truck size={18} />, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: <Shield size={18} />, title: '2 Year Warranty', desc: 'Full product coverage' },
    { icon: <RefreshCw size={18} />, title: '30-Day Returns', desc: 'No questions asked' },
];

const ProductDetail: React.FC<ProductDetailProps> = ({ product, allProducts, onProductSelect, onBack }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
    const { addToCart } = useCart();
    const { addPoints, profile, toggleWishlist, updateHistory } = useUser();

    const inWishlist = product ? profile?.wishlist.includes(product.id) : false;

    React.useEffect(() => {
        if (product) {
            updateHistory(product.id);
        }
    }, [product?.id]);

    if (!product) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <p style={{ color: 'var(--text-muted)' }}>Product not found.</p>
        </div>
    );

    const images = product.images?.length
        ? product.images
        : [`https://picsum.photos/seed/${product.id}/800/1000`];

    const sizes = product.attributes?.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = product.attributes?.colors || [
        { name: 'Obsidian', hex: '#1A1A1A' },
        { name: 'Gold', hex: '#D4AF37' },
        { name: 'Pearl', hex: '#E8E8E8' },
        { name: 'Sapphire', hex: '#4F8EF7' },
        { name: 'Amethyst', hex: '#8B5CF6' },
    ];

    const handleAddToCart = () => {
        if (addedToCart) return;
        addToCart({ id: parseInt(product.id.slice(0, 8), 16), name: product.name, price: product.price, image: images[0], quantity });
        addPoints(Math.floor(product.price / 10));
        setAddedToCart(true);
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 }, colors: ['#D4AF37', '#F9E2AF', '#fff'] });
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const rating = 4.8;
    const reviewCount = 127;

    return (
        <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--bg-1)' }}>
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
                {/* Back Button */}
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        fontSize: '0.875rem', fontWeight: 600,
                        marginBottom: '2rem', padding: '0',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-400)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <ArrowLeft size={18} /> Back to Shop
                </button>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '3rem',
                }}>
                    {/* Image Gallery */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {/* Thumbs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {images.slice(0, 5).map((img: string, i: number) => (
                                <motion.button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        width: '72px', height: '72px',
                                        borderRadius: '12px', overflow: 'hidden',
                                        border: `2px solid ${selectedImage === i ? 'var(--gold-400)' : 'var(--glass-border)'}`,
                                        background: 'none', cursor: 'pointer',
                                        padding: 0, flexShrink: 0,
                                        transition: 'border-color 0.2s',
                                    }}
                                >
                                    <img src={img} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </motion.button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div style={{ flex: 1, position: 'relative' }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        background: 'var(--bg-2)',
                                        aspectRatio: '4/5',
                                        position: 'relative',
                                    }}
                                >
                                    <img
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <button style={{
                                        position: 'absolute', bottom: '1rem', right: '1rem',
                                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '10px', padding: '0.5rem',
                                        color: '#fff', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        fontSize: '0.75rem',
                                    }}>
                                        <ZoomIn size={16} /> Zoom
                                    </button>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Category + Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 800,
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                color: 'var(--gold-400)',
                            }}>
                                {product.categoryId || 'Premium Collection'}
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => product && toggleWishlist(product.id)}
                                    style={{
                                        width: '38px', height: '38px', borderRadius: '50%',
                                        border: '1.5px solid var(--glass-border)',
                                        background: inWishlist ? 'rgba(244,63,94,0.1)' : 'var(--bg-2)',
                                        color: inWishlist ? 'var(--accent-rose)' : 'var(--text-muted)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                >
                                    <Heart size={17} fill={inWishlist ? 'currentColor' : 'none'} />
                                </button>
                                <button style={{
                                    width: '38px', height: '38px', borderRadius: '50%',
                                    border: '1.5px solid var(--glass-border)',
                                    background: 'var(--bg-2)', color: 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}>
                                    <Share2 size={17} />
                                </button>
                            </div>
                        </div>

                        {/* Name */}
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                            fontWeight: 800, fontFamily: 'var(--font-heading)',
                            letterSpacing: '-0.03em', lineHeight: 1.2,
                            marginBottom: '1rem',
                        }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.round(rating) ? '#D4AF37' : 'none'} color={i < Math.round(rating) ? '#D4AF37' : 'var(--text-muted)'} />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{rating}</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>({reviewCount} reviews)</span>
                            <span style={{
                                padding: '0.2rem 0.6rem', borderRadius: '20px',
                                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
                                color: 'var(--accent-green)', fontSize: '0.7rem', fontWeight: 700,
                            }}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Price */}
                        <div style={{
                            display: 'flex', alignItems: 'baseline', gap: '0.75rem',
                            marginBottom: '1.75rem',
                            padding: '1.25rem',
                            background: 'var(--bg-2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                        }}>
                            <span style={{ fontSize: '2.25rem', fontWeight: 900, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
                                ${product.price.toFixed(2)}
                            </span>
                            <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.1rem' }}>
                                ${(product.price * 1.2).toFixed(2)}
                            </span>
                            <span style={{
                                padding: '0.2rem 0.6rem', borderRadius: '8px',
                                background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)',
                                color: 'var(--gold-400)', fontSize: '0.75rem', fontWeight: 800,
                            }}>
                                SAVE 17%
                            </span>
                        </div>

                        {/* Colors */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                                Color: <span style={{ color: 'var(--text-primary)' }}>{colors[selectedColor]?.name}</span>
                            </p>
                            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                {colors.map((c: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedColor(i)}
                                        title={c.name}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: c.hex, border: 'none',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            outline: selectedColor === i
                                                ? `3px solid ${c.hex}`
                                                : '3px solid transparent',
                                            outlineOffset: '2px',
                                            boxShadow: selectedColor === i ? `0 0 0 1px var(--bg-1), 0 0 12px ${c.hex}60` : 'none',
                                            transform: selectedColor === i ? 'scale(1.15)' : 'scale(1)',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                    Size: <span style={{ color: 'var(--text-primary)' }}>{selectedSize || 'Select'}</span>
                                </p>
                                <button style={{ fontSize: '0.75rem', color: 'var(--gold-400)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                    Size Guide
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {sizes.map((s: string) => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '10px',
                                            border: `1.5px solid ${selectedSize === s ? 'var(--gold-400)' : 'var(--glass-border)'}`,
                                            background: selectedSize === s ? 'rgba(212,175,55,0.12)' : 'var(--bg-2)',
                                            color: selectedSize === s ? 'var(--gold-400)' : 'var(--text-secondary)',
                                            fontWeight: 700, fontSize: '0.8rem',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity + Add to Cart */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0',
                                background: 'var(--bg-2)', border: '1.5px solid var(--glass-border)',
                                borderRadius: '12px', overflow: 'hidden',
                            }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{
                                        padding: '0.875rem 1rem', background: 'none', border: 'none',
                                        color: 'var(--text-muted)', cursor: 'pointer',
                                        transition: 'all 0.15s', fontSize: '1rem',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-400)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{ padding: '0 1.25rem', fontWeight: 700, fontSize: '1rem', minWidth: '50px', textAlign: 'center' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                    style={{
                                        padding: '0.875rem 1rem', background: 'none', border: 'none',
                                        color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-400)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <motion.button
                                onClick={handleAddToCart}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1, minWidth: '180px',
                                    padding: '0.875rem 1.5rem',
                                    background: addedToCart
                                        ? 'linear-gradient(135deg, #22C55E, #15803d)'
                                        : 'linear-gradient(135deg, #D4AF37 0%, #F9E2AF 50%, #B8922A 100%)',
                                    color: '#000',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    fontFamily: 'var(--font-heading)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    transition: 'all 0.3s',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {addedToCart ? (
                                        <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Check size={18} /> Added to Cart!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <ShoppingCart size={18} /> Add to Cart
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>

                        {/* Features */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '0.75rem', marginBottom: '1.5rem',
                        }}>
                            {FEATURES.map((f, i) => (
                                <div key={i} style={{
                                    padding: '1rem 0.75rem',
                                    background: 'var(--bg-2)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '14px', textAlign: 'center',
                                }}>
                                    <div style={{ color: 'var(--gold-400)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{f.title}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div>
                            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', marginBottom: '1.25rem' }}>
                                {(['description', 'specs', 'reviews'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveTab(t)}
                                        style={{
                                            padding: '0.75rem 1.25rem',
                                            background: 'none', border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: 700, fontSize: '0.825rem',
                                            textTransform: 'capitalize',
                                            color: activeTab === t ? 'var(--gold-400)' : 'var(--text-muted)',
                                            borderBottom: `2px solid ${activeTab === t ? 'var(--gold-400)' : 'transparent'}`,
                                            marginBottom: '-1px',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {activeTab === 'description' && (
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>
                                            {product.description || 'A premium quality product crafted with the finest materials. Designed for those who appreciate excellence and sophistication in every detail. Each piece is carefully inspected to ensure the highest standards of quality.'}
                                        </p>
                                    )}
                                    {activeTab === 'specs' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {[
                                                { k: 'SKU', v: `SKU-${product.id?.slice(0, 6).toUpperCase()}` },
                                                { k: 'Category', v: product.categoryId || 'General' },
                                                { k: 'Stock', v: `${product.stock} units` },
                                                { k: 'Material', v: 'Premium Grade A' },
                                                { k: 'Origin', v: 'Handcrafted' },
                                            ].map(s => (
                                                <div key={s.k} style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    padding: '0.625rem 0',
                                                    borderBottom: '1px solid var(--glass-border)',
                                                }}>
                                                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.k}</span>
                                                    <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>{s.v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === 'reviews' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {[
                                                { name: 'Ahmed M.', rating: 5, comment: 'Absolutely stunning quality! Worth every penny.', date: '2 days ago' },
                                                { name: 'Sara K.', rating: 5, comment: 'Fast delivery, perfect packaging, love the product!', date: '1 week ago' },
                                                { name: 'Omar F.', rating: 4, comment: 'Great quality, slightly bigger than expected but still love it.', date: '2 weeks ago' },
                                            ].map((r, i) => (
                                                <div key={i} style={{
                                                    padding: '1rem',
                                                    background: 'var(--bg-2)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '14px',
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #B8922A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.875rem', fontWeight: 700 }}>
                                                                {r.name[0]}
                                                            </div>
                                                            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{r.name}</span>
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.date}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                                                        {[...Array(5)].map((_, si) => (
                                                            <Star key={si} size={12} fill={si < r.rating ? '#D4AF37' : 'none'} color={si < r.rating ? '#D4AF37' : 'var(--text-muted)'} />
                                                        ))}
                                                    </div>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <div style={{ marginTop: '5rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                        Related <span className="highlight">Products</span>
                    </h2>
                    <div className="products-grid">
                        {allProducts
                            .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
                            .slice(0, 4)
                            .map(p => (
                                <div key={p.id} style={{ opacity: 0.9, transform: 'scale(0.95)' }}>
                                    <h3 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.name}</h3>
                                    <div
                                        onClick={() => onProductSelect(p.id)}
                                        style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-2)' }}
                                    >
                                        <img src={p.images?.[0] || `https://picsum.photos/seed/${p.id}/400/400`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <p style={{ marginTop: '0.5rem', fontWeight: 800, color: 'var(--gold-400)' }}>${p.price}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Recently Viewed Section */}
                {profile?.history && profile.history.length > 1 && (
                    <div style={{ marginTop: '5rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                            Recently <span className="highlight">Viewed</span>
                        </h2>
                        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                            {profile.history
                                .filter(id => id !== product.id)
                                .map(hid => {
                                    const hp = allProducts.find(p => p.id === hid);
                                    if (!hp) return null;
                                    return (
                                        <div key={hid} style={{ flex: '0 0 160px' }}>
                                            <div
                                                onClick={() => onProductSelect(hp.id)}
                                                style={{ width: '160px', height: '200px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-2)', marginBottom: '0.75rem' }}
                                            >
                                                <img src={hp.images?.[0] || `https://picsum.photos/seed/${hid}/400/400`} alt={hp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hp.name}</p>
                                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-400)' }}>${hp.price}</p>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
