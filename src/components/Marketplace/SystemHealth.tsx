import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, AlertTriangle, Globe, Cpu } from 'lucide-react';

const SystemHealth: React.FC = () => {
    const [metrics] = useState({
        apiLatency: '42ms',
        dbLoad: '12%',
        serverUptime: '99.99%',
        activeSessions: '1,402',
        blockedThreats: '24'
    });

    return (
        <div className="py-12">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-3xl font-bold font-heading uppercase tracking-widest">
                        System <span className="text-[#D4AF37]">Health & Security</span>
                    </h2>
                    <p className="text-gray-500 text-sm">Enterprise-grade monitoring and infrastructure</p>
                </div>
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-green-400">CORE SYSTEMS STABLE</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Latency', value: metrics.apiLatency, icon: <Zap size={14} />, color: 'blue' },
                    { label: 'DB Load', value: metrics.dbLoad, icon: <Database size={14} />, color: 'purple' },
                    { label: 'Uptime', value: metrics.serverUptime, icon: <Shield size={14} />, color: 'green' },
                    { label: 'Threats Deflected', value: metrics.blockedThreats, icon: <Lock size={14} />, color: 'red' },
                    { label: 'Geo-Nodes', value: '42', icon: <Globe size={14} />, color: 'amber' },
                    { label: 'AI Compute', value: '88%', icon: <Cpu size={14} />, color: 'cyan' },
                ].map((m, i) => (
                    <div key={i} className="glass p-4 rounded-2xl border-white/5">
                        <div className="text-gray-500 mb-2">{m.icon}</div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">{m.label}</p>
                        <h4 className="text-lg font-bold">{m.value}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Security Logs Snippet */}
                <div className="glass rounded-3xl p-8 border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500" />
                        Active Security Firewall
                    </h3>
                    <div className="space-y-3">
                        {[
                            { event: 'Rate Limit Applied', ip: '192.168.x.x', time: '2m ago' },
                            { event: 'DDoS Mitigation Spike', ip: 'Global CDN', time: '15m ago' },
                            { event: '2FA Verification Success', ip: 'Admin Node', time: '1h ago' },
                        ].map((log, i) => (
                            <div key={i} className="flex justify-between text-[11px] p-2 hover:bg-white/5 rounded-lg border border-white/5">
                                <span className="text-gray-300 font-medium">{log.event}</span>
                                <span className="text-gray-500">{log.ip}</span>
                                <span className="text-[#D4AF37]">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Caching & Performance */}
                <div className="glass rounded-3xl p-8 border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Cpu size={18} className="text-blue-500" />
                        Processing & Cache Optimization
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-[10px] mb-1">
                                <span>REDIS CACHE HIT RATE</span>
                                <span className="text-blue-400">94.2%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[94%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] mb-1">
                                <span>CDN IMAGE OPTIMIZATION</span>
                                <span className="text-purple-400">88.5% SAVINGS</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[88%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mock icons if not imported correctly
const Zap = ({ size }: any) => <Shield size={size} />;
const Database = ({ size }: any) => <Shield size={size} />;

export default SystemHealth;
