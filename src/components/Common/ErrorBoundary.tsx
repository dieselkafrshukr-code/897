import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Critical System Failure:", error, errorInfo);
        // Here you would typically send to Sentry/LogRocket
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--bg-1)', color: 'var(--text-primary)', textAlign: 'center', padding: '2rem'
                }}>
                    <div style={{ maxWidth: '500px' }}>
                        <div style={{
                            display: 'inline-flex', padding: '1.5rem', borderRadius: '50%',
                            background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', marginBottom: '2rem'
                        }}>
                            <AlertTriangle size={48} />
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }}>
                            System <span style={{ color: 'var(--accent-rose)' }}>Error</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            We've encountered a fatal exception in the luxury engine. Our engineers have been notified.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem 2rem', background: 'var(--gold-400)', color: '#000',
                                borderRadius: '12px', fontWeight: 700, cursor: 'pointer', border: 'none'
                            }}
                        >
                            <RefreshCcw size={18} /> Re-initialize App
                        </button>
                        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--accent-rose)', textAlign: 'left', overflow: 'auto' }}>
                            <code>{this.state.error?.toString()}</code>
                        </div>
                    </div>
                </div>
            );
        }

        return this.children;
    }
}

export default ErrorBoundary;
