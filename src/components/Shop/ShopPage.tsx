import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, X, Grid3X3, LayoutList, Star, TrendingUp, ArrowUpDown, Package } from 'lucide-react';
import { CatalogService, Product } from '../../services/catalogService';
import ProductCard from '../ProductCard/ProductCard';

interface ShopPageProps {
    onProductSelect: (id: string) => void;
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'popular', label: 'Most Popular' },
];

const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 – $150', min: 50, max: 150 },
    { label: '$150 – $500', min: 150, max: 500 },
    { label: '$500+', min: 500, max: Infinity },
];

const ShopPage: React.FC<ShopPageProps> = ({ onProductSelect }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prods, cats] = await Promise.all([
                CatalogService.getProducts({ status: 'active' }),
                CatalogService.getCategories(),
            ]);
            setProducts(prods);
            const catNames = ['All', ...Array.from(new Set(prods.map(p => p.categoryId).filter(Boolean)))];
            setCategories(catNames);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const filtered = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== 'All') {
            result = result.filter(p => p.categoryId === selectedCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.categoryId?.toLowerCase().includes(q)
            );
        }

        result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'newest': result.sort((a, b) => new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime()); break;
            default: break;
        }

        return result;
    }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

    return (
        <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--bg-1)' }}>
            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, var(--bg-2) 0%, var(--bg-3) 100%)',
                padding: '3rem 0',
                borderBottom: '1px solid var(--glass-border)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-50%', right: '-5%',
                    width: '40%', height: '300%',
                    background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div className="container" style={{ position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="section-label">Our Collection</span>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 900,
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '-0.04em',
                            marginBottom: '0.5rem',
                        }}>
                            Shop <span style={{
                                background: 'linear-gradient(135deg, #D4AF37, #F9E2AF)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>All Products</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            {loading ? 'Loading...' : `${filtered.length} products found`}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Search & Controls */}
                <div style={{
                    display: 'flex', gap: '1rem', marginBottom: '1.5rem',
                    flexWrap: 'wrap', alignItems: 'center',
                }}>
                    {/* Search */}
                    <div style={{
                        flex: '1 1 280px',
                        display: 'flex', alignItems: 'center',
                        gap: '0.75rem',
                        background: 'var(--bg-2)',
                        border: '1.5px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        transition: 'all 0.2s',
                    }}
                        onFocus={() => { }}
                    >
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1, background: 'none', border: 'none',
                                outline: 'none', color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                            }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div style={{ position: 'relative' }}>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            style={{
                                appearance: 'none',
                                background: 'var(--bg-2)',
                                border: '1.5px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '0.75rem 2.5rem 0.75rem 1rem',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                fontWeight: 600, cursor: 'pointer',
                                outline: 'none',
                            }}
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown size={15} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: showFilters ? 'var(--gold-400)' : 'var(--bg-2)',
                            border: '1.5px solid',
                            borderColor: showFilters ? 'var(--gold-400)' : 'var(--glass-border)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            color: showFilters ? '#000' : 'var(--text-primary)',
                            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        <SlidersHorizontal size={17} /> Filters
                    </button>

                    {/* View Mode */}
                    <div style={{
                        display: 'flex',
                        background: 'var(--bg-2)',
                        border: '1.5px solid var(--glass-border)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        padding: '4px', gap: '2px',
                    }}>
                        {(['grid', 'list'] as const).map(v => (
                            <button
                                key={v}
                                onClick={() => setViewMode(v)}
                                style={{
                                    background: viewMode === v ? 'var(--gold-400)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.4rem 0.6rem',
                                    color: viewMode === v ? '#000' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center',
                                }}
                            >
                                {v === 'grid' ? <Grid3X3 size={18} /> : <LayoutList size={18} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
                        >
                            <div style={{
                                background: 'var(--bg-2)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                display: 'flex', flexWrap: 'wrap', gap: '2rem',
                            }}>
                                {/* Category Filter */}
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Category</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Price Range</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {PRICE_RANGES.map(r => (
                                            <button
                                                key={r.label}
                                                onClick={() => setPriceRange(r)}
                                                className={`filter-chip ${priceRange.label === r.label ? 'active' : ''}`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category Chips (always visible) */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '1.25rem',
                    }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <div className="skeleton" style={{ height: '300px', borderRadius: '20px 20px 0 0' }} />
                                <div style={{ padding: '1.25rem', background: 'var(--bg-2)', borderRadius: '0 0 20px 20px', borderTop: 'none' }}>
                                    <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: '4px', marginBottom: '8px' }} />
                                    <div className="skeleton" style={{ height: '18px', width: '75%', borderRadius: '4px', marginBottom: '12px' }} />
                                    <div className="skeleton" style={{ height: '22px', width: '30%', borderRadius: '4px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            textAlign: 'center', padding: '5rem 2rem',
                            background: 'var(--bg-2)', borderRadius: '24px',
                            border: '1px dashed var(--glass-border)',
                        }}
                    >
                        <Package size={64} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            No products found
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try different filters or search terms</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setPriceRange(PRICE_RANGES[0]); }}
                            className="premium-btn"
                            style={{ marginTop: '1.5rem' }}
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: viewMode === 'list'
                            ? '1fr'
                            : 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '1.25rem',
                    }}>
                        <AnimatePresence>
                            {filtered.map((product, idx) => (
                                <ProductCard
                                    key={product.id}
                                    id={parseInt(product.id.slice(0, 8), 16) || idx}
                                    name={product.name}
                                    price={product.price}
                                    image={product.images?.[0] || `https://picsum.photos/seed/${product.id}/400/500`}
                                    category={product.categoryId || 'General'}
                                    rating={4.5 + Math.random() * 0.5}
                                    discount={Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined}
                                    isNew={Math.random() > 0.75}
                                    onView={() => onProductSelect(product.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopPage;
