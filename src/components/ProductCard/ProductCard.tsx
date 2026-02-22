import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star, Zap, Box, Check, TrendingUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useDynamicPrice } from '../../hooks/useDynamicPrice';
import ARPreview from '../Product/ARPreview';
import confetti from 'canvas-confetti';

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    discount?: number;
    isNew?: boolean;
    reviewCount?: number;
    onView?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id, name, price: basePrice, image, category, rating,
    discount, isNew, reviewCount = Math.floor(Math.random() * 200) + 20,
    onView
}) => {
    const [addedToCart, setAddedToCart] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [isAROpen, setIsAROpen] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const { addToCart } = useCart();
    const { updateHistory, addPoints } = useUser();
    const { price, multiplier } = useDynamicPrice(basePrice);

    const discountedPrice = discount ? price * (1 - discount / 100) : price;
    const stars = Math.round(rating);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (addedToCart) return;

        addToCart({ id, name, price: discountedPrice, image, quantity: 1 });
        addPoints(Math.floor(discountedPrice / 10));
        setAddedToCart(true);

        confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.75, x: (e.clientX / window.innerWidth) },
            colors: ['#D4AF37', '#F9E2AF', '#FFFFFF', '#FFF9E6'],
            scalar: 0.8,
        });

        setTimeout(() => setAddedToCart(false), 2500);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInWishlist(!inWishlist);
    };

    const handleCardClick = () => {
        updateHistory(id.toString());
        onView?.(id);
    };

    return (
        <>
            <motion.div
                className="product-card group"
                onClick={handleCardClick}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -6 }}
            >
                {/* Image Container */}
                <div className="product-card-image" style={{ aspectRatio: '4/5', background: 'var(--bg-3)', position: 'relative', overflow: 'hidden' }}>
                    {/* Skeleton Shimmer */}
                    <AnimatePresence>
                        {!isImageLoaded && (
                            <motion.div
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                            >
                                <div className="shimmer" style={{ width: '100%', height: '100%' }} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.img
                        src={image}
                        alt={name}
                        loading="lazy"
                        onLoad={() => setIsImageLoaded(true)}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease',
                            opacity: isImageLoaded ? 1 : 0
                        }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.7 }}
                    />

                    {/* Gradient overlay */}
                    <div className="product-card-overlay" />

                    {/* Top left badges */}
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {isNew && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="product-card-badge badge-new"
                            >
                                NEW
                            </motion.span>
                        )}
                        {discount && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="product-card-badge badge-sale"
                            >
                                -{discount}%
                            </motion.span>
                        )}
                        {multiplier > 1 && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="product-card-badge badge-demand"
                            >
                                <TrendingUp size={9} /> HOT
                            </motion.span>
                        )}
                        {multiplier < 1 && !discount && (
                            <motion.span
                                className="product-card-badge badge-sale"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Zap size={9} /> FLASH
                            </motion.span>
                        )}
                    </div>

                    {/* Right action buttons */}
                    <div className="product-card-actions">
                        <button
                            onClick={handleWishlist}
                            className={`product-card-action-btn ${inWishlist ? 'active' : ''}`}
                            title="Add to Wishlist"
                        >
                            <Heart size={16} fill={inWishlist ? '#000' : 'none'} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsAROpen(true); }}
                            className="product-card-action-btn"
                            title="View in AR"
                        >
                            <Box size={16} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onView?.(id); }}
                            className="product-card-action-btn"
                            title="Quick View"
                        >
                            <Eye size={16} />
                        </button>
                    </div>

                    {/* Bottom CTA */}
                    <div className="product-card-cta">
                        <motion.button
                            onClick={handleAddToCart}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                width: '100%',
                                background: addedToCart
                                    ? 'linear-gradient(135deg, #22C55E, #15803d)'
                                    : 'linear-gradient(135deg, #D4AF37 0%, #F9E2AF 50%, #B8922A 100%)',
                                color: '#000',
                                fontWeight: 700,
                                padding: '0.75rem',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: addedToCart ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontSize: '0.8rem',
                                letterSpacing: '0.05em',
                                fontFamily: 'var(--font-heading)',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {addedToCart ? (
                                    <motion.span
                                        key="added"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <Check size={16} /> Added!
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="add"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <ShoppingCart size={16} /> Add to Cart
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* Card Info */}
                <div className="product-card-info">
                    {/* Category */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--gold-400)',
                        }}>
                            {category}
                        </span>
                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={10}
                                    fill={i < stars ? '#D4AF37' : 'none'}
                                    color={i < stars ? '#D4AF37' : 'var(--text-muted)'}
                                />
                            ))}
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '2px' }}>
                                ({reviewCount})
                            </span>
                        </div>
                    </div>

                    {/* Name */}
                    <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        marginBottom: '0.75rem',
                        lineHeight: 1.3,
                        color: 'var(--text-primary)',
                        transition: 'color 0.2s',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {name}
                    </h3>

                    {/* Price + Colors */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                                    ${discountedPrice.toFixed(2)}
                                </span>
                                {(discount || multiplier !== 1) && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                        ${price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            {discount && (
                                <span style={{ fontSize: '0.65rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                                    Save ${(price - discountedPrice).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Color swatches */}
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {[
                                { bg: '#1A1A1A', border: 'rgba(255,255,255,0.2)' },
                                { bg: '#D4AF37', border: 'rgba(212,175,55,0.4)' },
                                { bg: '#E8E8E8', border: 'rgba(255,255,255,0.3)' },
                                { bg: '#8B5CF6', border: 'rgba(139,92,246,0.4)' },
                            ].map((c, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '12px', height: '12px',
                                        borderRadius: '50%',
                                        background: c.bg,
                                        border: `1.5px solid ${c.border}`,
                                        cursor: 'pointer',
                                        transition: 'transform 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.3)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <ARPreview
                isOpen={isAROpen}
                onClose={() => setIsAROpen(false)}
                productName={name}
            />
        </>
    );
};

export default ProductCard;
