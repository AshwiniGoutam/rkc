'use client'
import { useState, useEffect, ReactNode, Key } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './page.css';
import { useRouter } from 'next/navigation';
import React from 'react';

interface OrderStats {
    totalOrders: number
    change: number
    activeOrders: number
    pendingOrders: number
    onDelivery: number
    delivered: number
}

interface RevenueStats {
    totalRevenue: number
    change: number
    onlineRevenue: number
    cashRevenue: number
}

interface Order {
    phone: ReactNode;
    createdAt: string | number | Date;
    streetAddress: ReactNode;
    name: ReactNode;
    _id: Key;
    products: any;
    id: string
    category: string
    merchant: {
        name: string
        color: string
    }
    customer: {
        name: string
        avatar: string
    }
    arrivalTime: string
    fee: number
    assignTo: {
        name: string
        avatar: string
    }
    route: string
    status: 'pending' | 'shipping' | 'delivered' | 'returned' | 'canceled'
}

const revenueData = [
    { name: 'Online', value: 74, color: '#8b5cf6' },
    { name: 'Cash', value: 42, color: '#f97316' },
]

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
        }
    }, []);
    const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
    const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [activeTab, setActiveTab] = useState('On Delivery')
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/checkout", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Failed to fetch orders");
                } else {
                    setOrders(data.orders || []);
                }
            } catch (err) {
                console.error(err);
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        // Simulate API calls
        fetchOrderStats()
        fetchRevenueStats()
    }, [])

    const fetchOrderStats = async () => {
        // Simulate API call
        const stats = {
            totalOrders: 2520,
            change: 10.5,
            activeOrders: 123,
            pendingOrders: 157,
            onDelivery: 530,
            delivered: 1710,
        }
        setOrderStats(stats)
    }

    const fetchRevenueStats = async () => {
        // Simulate API call
        const stats = {
            totalRevenue: 116000,
            change: -7.2,
            onlineRevenue: 74000,
            cashRevenue: 42000,
        }
        setRevenueStats(stats)
    }

    const getProgressWidth = (value: number, total: number) => {
        return (value / total) * 100
    }

    const formatCurrency = (amount: number) => {
        if (amount >= 1000) {
            return `₹ ${(amount / 1000).toFixed(0)}K`
        }
        return `₹${amount}`
    }

    const statusTabs = ['On Delivery', 'Pending', 'Shipping', 'Delivered', 'Canceled', 'Returned']

    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className='bg-[#f3f4f62e]'>
            <div className="py-10 max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                <div className="dashboard-grid mt-40">
                    {/* Order Overview */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Order Overview</h2>
                            <div className="dropdown">
                                Week ↓
                            </div>
                        </div>

                        {orderStats && (
                            <>
                                <div className="stat-number">
                                    {orderStats.totalOrders.toLocaleString()}
                                </div>
                                <div className="stat-change positive">
                                    ↑ +{orderStats.change}% <span style={{ color: '#64748b' }}>Compared to last week</span>
                                </div>

                                <div className="order-stats">
                                    <div className="stat-item">
                                        <div className="stat-dot active"></div>
                                        <span>Active Order</span>
                                        <strong>{orderStats.activeOrders}</strong>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-dot pending"></div>
                                        <span>Pending Order</span>
                                        <strong>{orderStats.pendingOrders}</strong>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-dot delivery"></div>
                                        <span>On Delivery</span>
                                        <strong>{orderStats.onDelivery}</strong>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-dot delivered"></div>
                                        <span>Delivered</span>
                                        <strong>{orderStats.delivered}</strong>
                                    </div>
                                </div>

                                <div className="progress-bar">
                                    <div
                                        className="progress-segment active"
                                        style={{ width: `${getProgressWidth(orderStats.activeOrders, orderStats.totalOrders)}%` }}
                                    ></div>
                                    <div
                                        className="progress-segment pending"
                                        style={{ width: `${getProgressWidth(orderStats.pendingOrders, orderStats.totalOrders)}%` }}
                                    ></div>
                                    <div
                                        className="progress-segment delivery"
                                        style={{ width: `${getProgressWidth(orderStats.onDelivery, orderStats.totalOrders)}%` }}
                                    ></div>
                                    <div
                                        className="progress-segment delivered"
                                        style={{ width: `${getProgressWidth(orderStats.delivered, orderStats.totalOrders)}%` }}
                                    ></div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Revenue */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Revenue</h2>
                            <div className="dropdown">
                                Last Month ↓
                            </div>
                        </div>

                        {revenueStats && (
                            <div className="revenue-content">
                                <div className="revenue-stats">
                                    <div className="stat-number">
                                        {formatCurrency(revenueStats.totalRevenue)}
                                    </div>
                                    <div className="stat-change negative">
                                        ↓ {revenueStats.change}% <span style={{ color: '#64748b' }}>Compared to last week</span>
                                    </div>

                                    <div className="revenue-breakdown">
                                        <div className="breakdown-item">
                                            <div className="breakdown-dot online"></div>
                                            <span>Online</span>
                                            <strong>{formatCurrency(revenueStats.onlineRevenue)}</strong>
                                        </div>
                                        <div className="breakdown-item">
                                            <div className="breakdown-dot cash"></div>
                                            <span>Cash</span>
                                            <strong>{formatCurrency(revenueStats.cashRevenue)}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ width: 120, height: 120 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={revenueData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={30}
                                                outerRadius={50}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {revenueData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders Table */}
                <div className="orders-section">
                    <div className="orders-header">
                        <h2 className="orders-title">Orders</h2>
                        {/* <div className="orders-controls">
                            <button className="btn">⚙ Filters</button>
                            <button className="btn">📊 Manage</button>
                            <button className="btn">📤 Export</button>
                            <button className="btn">☰</button>
                            <button className="btn">⋮</button>
                        </div> */}
                    </div>

                    {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                        <div className="status-tabs">
                            {statusTabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`status-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="search-bar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div> */}

                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Phone no.</th>
                                <th>Address</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const total = order.products.reduce(
                                    (sum, p) => sum + p.price * p.quantity,
                                    0
                                );

                                return (
                                    <React.Fragment key={order._id}>
                                        {/* Main Row */}
                                        <tr
                                            onClick={() => toggleRow(order._id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>{order._id}</td>
                                            <td>{order.name}</td>
                                            <td>{order.phone}</td>
                                            <td>{order.streetAddress}</td>
                                            <td>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>₹{total}</td>
                                            <td>
                                                <span className="status-badge pending">Pending</span>
                                            </td>
                                        </tr>

                                        {/* Expanded Row */}
                                        {expandedRow === order._id && (
                                            <tr className="expanded-row">
                                                <td colSpan={7}>
                                                    <div className="expanded-content">
                                                        <h4><b>Products</b></h4>
                                                        <ul>
                                                            {order.products.map((p, i) => (
                                                                <li key={i}>
                                                                    {p.name} ({p.quantity} × ₹{p.price}) = ₹
                                                                    {p.price * p.quantity}
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        <h4 className='mt-5'><b>Shipping Details</b></h4>
                                                        <p>
                                                            <b>Name:</b> {order.name}
                                                        </p>
                                                        <p>
                                                            <b>Phone:</b> {order.phone}
                                                        </p>
                                                        <p>
                                                            <b>Address:</b> {order.streetAddress}
                                                        </p>

                                                        <button
                                                            type="submit"
                                                            className="w-auto flex justify-center font-medium text-white bg-dark py-2 px-3 text-sm rounded-lg ease-out duration-200 hover:bg-blue mt-5">
                                                            Mark as Complete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* <div className="pagination">
                        <div className="pagination-info">
                            Showing 1 of 5
                        </div>
                        <div className="pagination-controls">
                            <button className="page-btn">‹</button>
                            <button className="page-btn active">1</button>
                            <button className="page-btn">2</button>
                            <button className="page-btn">3</button>
                            <button className="page-btn">4</button>
                            <button className="page-btn">5</button>
                            <button className="page-btn">›</button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}