import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, Truck, XCircle, Search, Filter, Mail, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
    const { showToast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showToast('Failed to load orders', 'error');
        }
        setLoading(false);
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            showToast(`Order status updated to ${newStatus}`, 'success');
        } catch (error) {
            showToast('Update failed', 'error');
        }
    };

    const filteredOrders = orders.filter(o =>
        filter === 'all' ? true : o.status === filter
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return { bg: 'rgba(212,175,55,0.1)', color: '#D4AF37', icon: <Clock size={14} /> };
            case 'shipped': return { bg: 'rgba(37,99,235,0.1)', color: '#2563EB', icon: <Truck size={14} /> };
            case 'delivered': return { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', icon: <CheckCircle size={14} /> };
            default: return { bg: 'rgba(255,255,255,0.05)', color: '#999', icon: <XCircle size={14} /> };
        }
    };

    return (
        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold font-heading mb-1">Global <span className="text-[#D4AF37]">Orders</span></h3>
                    <p className="text-xs text-gray-400">Manage customer fulfillment and logistics</p>
                </div>

                <div className="flex glass p-1 rounded-xl border-none ring-1 ring-white/10">
                    {['all', 'pending', 'shipped', 'delivered'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${filter === f ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-500">Syncing with Order Engine...</div>
            ) : filteredOrders.length === 0 ? (
                <div className="py-20 text-center text-gray-500">No orders found matching criteria</div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const style = getStatusStyle(order.status);
                        return (
                            <motion.div
                                layout
                                key={order.id}
                                className="glass p-6 rounded-2xl border-white/5 hover:border-white/10 transition-all"
                            >
                                <div className="flex flex-wrap justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37]">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold">{order.id}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase" style={{ background: style.bg, color: style.color }}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                                                <span className="flex items-center gap-1"><Mail size={12} /> {order.userEmail}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="glass px-4 py-2 rounded-xl border-none ring-1 ring-white/10 text-[10px] font-bold uppercase outline-none focus:ring-[#D4AF37]/50"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total</p>
                                            <p className="text-lg font-bold text-[#D4AF37]">${order.total?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">Shipping Matrix</p>
                                        <div className="flex items-start gap-2 text-xs">
                                            <MapPin size={14} className="text-[#D4AF37] mt-1 shrink-0" />
                                            <div>
                                                <p className="font-bold mb-1">{order.city}</p>
                                                <p className="text-gray-400 capitalize">{order.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">Manifest</p>
                                        <div className="space-y-2">
                                            {order.items?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between text-[10px]">
                                                    <span className="text-gray-400">{item.quantity}x {item.name}</span>
                                                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderManager;
