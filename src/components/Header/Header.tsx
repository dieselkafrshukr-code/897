import React, { useState, useEffect } from 'react';
import { User, Search, Menu, X, Moon, Sun, Heart, Sparkles, LogOut, Store, Home, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import MiniCart from '../Cart/MiniCart';
import AuthModal from '../Auth/AuthModal';

type Page = 'home' | 'shop' | 'product' | 'checkout' | 'order-success' | 'wishlist' | 'orders';

interface HeaderProps {
    currentPage?: Page;
    onNavigate?: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'home', onNavigate }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const { totalItems } = useCart();
    const { user, profile } = useUser();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    };

    const navigate = (page: Page) => {
        onNavigate?.(page);
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', page: 'home' as Page, icon: <Home size={16} /> },
        { name: 'Shop', page: 'shop' as Page, icon: <Store size={16} /> },
        { name: 'New Arrivals', page: 'shop' as Page, icon: <Sparkles size={16} /> },
    ];

    const isActive = (p: Page) => currentPage === p;

    return (
        <>
            <nav
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                    background: isScrolled ? 'rgba(6, 6, 8, 0.92)' : 'rgba(6, 6, 8, 0.7)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderBottom: `1px solid ${isScrolled ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
                    transition: 'all 0.4s ease',
                    padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
                }}
            >
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    {/* Logo */}
                    <motion.button
                        onClick={() => navigate('home')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            background: 'none', border: 'none', cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        <motion.div
                            initial={{ rotate: -15, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            style={{
                                width: '36px', height: '36px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F9E2AF 50%, #B8922A 100%)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 16px rgba(212,175,55,0.4)',
                            }}
                        >
                            <Sparkles size={18} color="#000" />
                        </motion.div>
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(135deg, #D4AF37, #F9E2AF)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textTransform: 'uppercase',
                        }}>
                            Youssef
                        </span>
                    </motion.button>

                    {/* Desktop NavLinks */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden lg:flex">
                        {navLinks.map(link => (
                            <button
                                key={link.name}
                                onClick={() => navigate(link.page)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.5rem 1rem',
                                    background: isActive(link.page) && link.page === currentPage
                                        ? 'rgba(212,175,55,0.1)'
                                        : 'none',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: isActive(link.page) ? 'var(--gold-400)' : 'var(--text-secondary)',
                                    fontWeight: 600, fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive(link.page)) {
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive(link.page)) {
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.background = 'none';
                                    }
                                }}
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Search (desktop) */}
                        <div
                            className="hidden md:flex"
                            style={{
                                alignItems: 'center', gap: '0.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: `1.5px solid ${searchFocused ? 'var(--gold-400)' : 'var(--glass-border)'}`,
                                borderRadius: '10px',
                                padding: '0.5rem 0.875rem',
                                transition: 'all 0.2s',
                            }}
                        >
                            <Search size={16} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search..."
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                style={{
                                    background: 'none', border: 'none', outline: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.85rem', width: searchFocused ? '140px' : '80px',
                                    transition: 'width 0.3s',
                                }}
                            />
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: '38px', height: '38px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1.5px solid var(--glass-border)',
                                color: 'var(--text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold-400)'; e.currentTarget.style.borderColor = 'var(--glass-border-gold)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                        >
                            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        {/* Wishlist */}
                        <button
                            onClick={() => onNavigate?.('wishlist')}
                            style={{
                                width: '38px', height: '38px', borderRadius: '10px',
                                background: profile?.wishlist.length ? 'rgba(244,63,94,0.12)' : 'rgba(255,255,255,0.05)',
                                border: `1.5px solid ${profile?.wishlist.length ? 'rgba(244,63,94,0.35)' : 'var(--glass-border)'}`,
                                color: profile?.wishlist.length ? 'var(--accent-rose)' : 'var(--text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            className="hidden md:flex"
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-rose)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)'; }}
                            onMouseLeave={e => { if (!profile?.wishlist.length) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; } }}
                        >
                            <Heart size={17} fill={profile?.wishlist.length ? 'currentColor' : 'none'} />
                        </button>

                        {/* Cart */}
                        <motion.button
                            onClick={() => setIsCartOpen(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                position: 'relative',
                                width: '38px', height: '38px',
                                borderRadius: '10px',
                                background: totalItems > 0
                                    ? 'rgba(212,175,55,0.12)'
                                    : 'rgba(255,255,255,0.05)',
                                border: `1.5px solid ${totalItems > 0 ? 'rgba(212,175,55,0.35)' : 'var(--glass-border)'}`,
                                color: totalItems > 0 ? 'var(--gold-400)' : 'var(--text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            <ShoppingBag size={17} />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        style={{
                                            position: 'absolute', top: '-6px', right: '-6px',
                                            width: '18px', height: '18px',
                                            background: 'linear-gradient(135deg, #D4AF37, #B8922A)',
                                            color: '#000', fontSize: '0.65rem', fontWeight: 900,
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(212,175,55,0.4)',
                                        }}
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* User */}
                        {user ? (
                            <div style={{ position: 'relative' }} className="hidden md:flex" id="user-menu-wrapper">
                                <button
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                                        background: 'rgba(212,175,55,0.08)',
                                        border: '1.5px solid rgba(212,175,55,0.2)',
                                        borderRadius: '10px',
                                        padding: '0.4rem 0.875rem 0.4rem 0.5rem',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                    onClick={e => {
                                        const menu = (e.currentTarget.nextSibling as HTMLElement);
                                        if (menu) menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                                    }}
                                >
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #D4AF37, #B8922A)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#000', fontWeight: 900, fontSize: '0.75rem',
                                    }}>
                                        {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--gold-400)', fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <Sparkles size={8} /> {profile?.level}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)' }}>
                                            {profile?.displayName || user.email?.split('@')[0]}
                                        </p>
                                    </div>
                                </button>
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                    width: '180px',
                                    background: 'var(--bg-2)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '14px',
                                    overflow: 'hidden',
                                    display: 'none',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    zIndex: 100,
                                }}>
                                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <User size={15} /> My Profile
                                    </button>
                                    <button
                                        onClick={() => { onNavigate?.('orders'); (document.getElementById('user-menu-wrapper')?.querySelector('div:last-child') as HTMLElement).style.display = 'none'; }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <ShoppingBag size={15} /> My Orders
                                    </button>
                                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }} />
                                    <button
                                        onClick={() => signOut(auth)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <LogOut size={15} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="hidden md:flex"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(212,175,55,0.1)',
                                    border: '1.5px solid rgba(212,175,55,0.25)',
                                    borderRadius: '10px',
                                    color: 'var(--gold-400)',
                                    fontWeight: 700, fontSize: '0.825rem',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.18)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; }}
                            >
                                <User size={16} /> Sign In
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                width: '38px', height: '38px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1.5px solid var(--glass-border)',
                                color: 'var(--text-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                overflow: 'hidden',
                                borderTop: '1px solid var(--glass-border)',
                                background: 'rgba(6,6,8,0.95)',
                            }}
                        >
                            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {/* Mobile Search */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'var(--bg-3)', border: '1.5px solid var(--glass-border)',
                                    borderRadius: '10px', padding: '0.6rem 0.875rem', marginBottom: '0.5rem',
                                }}>
                                    <Search size={16} color="var(--text-muted)" />
                                    <input
                                        type="text" placeholder="Search..."
                                        style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', flex: 1 }}
                                    />
                                </div>

                                {navLinks.map(link => (
                                    <button
                                        key={link.name}
                                        onClick={() => navigate(link.page)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.875rem 1rem',
                                            background: isActive(link.page) ? 'rgba(212,175,55,0.08)' : 'none',
                                            border: 'none', borderRadius: '10px',
                                            color: isActive(link.page) ? 'var(--gold-400)' : 'var(--text-primary)',
                                            fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                                            textAlign: 'left', width: '100%',
                                        }}
                                    >
                                        {link.icon} {link.name}
                                    </button>
                                ))}

                                {/* Mobile Auth */}
                                {!user && (
                                    <button
                                        onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                                        className="premium-btn"
                                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.875rem' }}
                                    >
                                        <User size={17} /> Sign In / Sign Up
                                    </button>
                                )}
                                {user && (
                                    <button
                                        onClick={() => signOut(auth)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.75rem 1rem', marginTop: '0.25rem',
                                            background: 'rgba(244,63,94,0.08)',
                                            border: '1px solid rgba(244,63,94,0.2)',
                                            borderRadius: '10px', color: 'var(--accent-rose)',
                                            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                                        }}
                                    >
                                        <LogOut size={15} /> Sign Out
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav >

            <MiniCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => { setIsCartOpen(false); onNavigate?.('checkout'); }}
            />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default Header;
