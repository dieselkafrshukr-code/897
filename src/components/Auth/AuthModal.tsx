import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider, db } from '../../config/firebase';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { X, Mail, Lock, LogIn, UserPlus, Eye, EyeOff, User, Sparkles } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const reset = () => {
        setEmail(''); setPassword(''); setName('');
        setConfirmPassword(''); setError(''); setSuccess('');
        setShowPass(false);
    };

    const switchTab = (t: 'login' | 'register') => {
        setTab(t);
        reset();
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onClose();
        } catch (err: any) {
            setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message);
        }
        setLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: name });
            await setDoc(doc(db, 'users', cred.user.uid), {
                uid: cred.user.uid,
                email,
                displayName: name,
                photoURL: null,
                points: 0,
                level: 'Bronze',
                role: 'Customer',
                referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                wishlist: [],
                history: [],
                preferences: {},
                createdAt: new Date().toISOString(),
            });
            setSuccess('Account created! Welcome aboard 🎉');
            setTimeout(() => { onClose(); }, 1500);
        } catch (err: any) {
            setError(err.code === 'auth/email-already-in-use' ? 'This email is already registered.' : err.message);
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        setError(''); setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(16px)',
                            zIndex: 2000
                        }}
                    />
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 24 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 24 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%', maxWidth: '440px',
                            background: 'var(--bg-2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '28px',
                            padding: '2.5rem',
                            zIndex: 2100,
                            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                            margin: '0 1rem',
                        }}
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: '1.25rem', right: '1.25rem',
                                background: 'var(--bg-3)', border: 'none',
                                borderRadius: '50%', width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-secondary)', cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.transform = 'rotate(0)'; }}
                        >
                            <X size={16} />
                        </button>

                        {/* Logo */}
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '56px', height: '56px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #D4AF37, #B8922A)',
                                margin: '0 auto 1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                            }}>
                                <Sparkles size={26} color="#000" />
                            </div>
                            <h2 style={{
                                fontSize: '1.5rem', fontWeight: 800,
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '-0.02em',
                                color: 'var(--text-primary)',
                            }}>
                                {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                {tab === 'login' ? 'Sign in to continue shopping' : 'Join our luxury community'}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            background: 'var(--bg-3)',
                            borderRadius: '12px',
                            padding: '4px',
                            marginBottom: '1.5rem',
                        }}>
                            {(['login', 'register'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => switchTab(t)}
                                    style={{
                                        flex: 1, padding: '0.6rem',
                                        borderRadius: '9px', border: 'none',
                                        fontWeight: 700, fontSize: '0.825rem',
                                        fontFamily: 'var(--font-heading)',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s',
                                        background: tab === t
                                            ? 'linear-gradient(135deg, #D4AF37, #B8922A)'
                                            : 'transparent',
                                        color: tab === t ? '#000' : 'var(--text-secondary)',
                                        boxShadow: tab === t ? '0 4px 12px rgba(212,175,55,0.25)' : 'none',
                                    }}
                                >
                                    {t === 'login' ? 'Sign In' : 'Sign Up'}
                                </button>
                            ))}
                        </div>

                        {/* Google Button */}
                        <button
                            onClick={handleGoogle}
                            disabled={loading}
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem',
                                background: 'var(--bg-3)',
                                border: '1.5px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontWeight: 600, fontSize: '0.875rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                marginBottom: '1.25rem',
                                opacity: loading ? 0.7 : 1,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                        </div>

                        {/* Form */}
                        <form onSubmit={tab === 'login' ? handleEmailLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {tab === 'register' && (
                                <div className="input-wrapper">
                                    <User size={17} color="var(--text-muted)" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="input-wrapper">
                                <Mail size={17} color="var(--text-muted)" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-wrapper">
                                <Lock size={17} color="var(--text-muted)" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0' }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {tab === 'register' && (
                                <div className="input-wrapper">
                                    <Lock size={17} color="var(--text-muted)" />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            {/* Error / Success */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            color: 'var(--accent-rose)', fontSize: '0.8rem',
                                            padding: '0.6rem 0.875rem',
                                            background: 'rgba(244,63,94,0.1)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(244,63,94,0.2)',
                                        }}
                                    >
                                        {error}
                                    </motion.p>
                                )}
                                {success && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            color: 'var(--accent-green)', fontSize: '0.8rem',
                                            padding: '0.6rem 0.875rem',
                                            background: 'rgba(34,197,94,0.1)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(34,197,94,0.2)',
                                        }}
                                    >
                                        {success}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: '100%',
                                    padding: '0.95rem',
                                    background: 'linear-gradient(135deg, #D4AF37 0%, #F9E2AF 50%, #B8922A 100%)',
                                    color: '#000',
                                    fontWeight: 800,
                                    fontSize: '0.875rem',
                                    letterSpacing: '0.05em',
                                    fontFamily: 'var(--font-heading)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    opacity: loading ? 0.8 : 1,
                                    marginTop: '0.25rem',
                                    boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {loading ? (
                                    <div style={{
                                        width: '18px', height: '18px',
                                        border: '2.5px solid rgba(0,0,0,0.3)',
                                        borderTopColor: '#000',
                                        borderRadius: '50%',
                                        animation: 'spin 0.7s linear infinite',
                                    }} />
                                ) : (
                                    <>
                                        {tab === 'login' ? <LogIn size={17} /> : <UserPlus size={17} />}
                                        {tab === 'login' ? 'Sign In' : 'Create Account'}
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
