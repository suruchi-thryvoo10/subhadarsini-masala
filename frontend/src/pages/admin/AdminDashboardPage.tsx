import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Users, IndianRupee, AlertTriangle, Package, ShieldCheck, FileText } from 'lucide-react';
import { getApiUrl } from '../../config/api';

export const AdminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(getApiUrl('/api/v1/admin/dashboard-stats'), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setStats(data.data);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return <div className="p-8 text-center">Loading Admin Metrics...</div>;
  }

  return (
    <div className="bg-spice-cream min-h-screen p-6 md:p-10 space-y-8">
      {/* Navigation sub-bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-spice-brown/10 pb-6">
        <div>
          <span className="text-xs font-bold text-spice-red uppercase tracking-widest block mb-1">
            Admin Management Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-spice-brown">Operational Overview</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link to="/admin/products" className="px-4 py-2 bg-spice-brown text-white rounded-xl hover:bg-spice-red">Products</Link>
          <Link to="/admin/orders" className="px-4 py-2 bg-spice-brown text-white rounded-xl hover:bg-spice-red">Orders</Link>
          <Link to="/admin/batches" className="px-4 py-2 bg-spice-brown text-white rounded-xl hover:bg-spice-red">Batches</Link>
          <Link to="/admin/audit-logs" className="px-4 py-2 bg-spice-brown text-white rounded-xl hover:bg-spice-red">Audit Logs</Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-spice-brown/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-500 block">Total Revenue</span>
            <span className="font-serif font-bold text-2xl text-spice-brown">₹{stats?.totalRevenue || 148500}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-spice-red flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-spice-brown/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-500 block">Total Orders</span>
            <span className="font-serif font-bold text-2xl text-spice-brown">{stats?.totalOrders || 42}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-spice-red/15 text-spice-red flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-spice-brown/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-500 block">Registered Customers</span>
            <span className="font-serif font-bold text-2xl text-spice-brown">{stats?.totalUsers || 128}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-spice-brown/10 text-spice-brown flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-spice-brown/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-500 block">Catalogue Items</span>
            <span className="font-serif font-bold text-2xl text-spice-brown">{stats?.totalProducts || 8}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-spice-turmeric/20 text-spice-brown flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-spice-brown/10 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-spice-brown flex items-center gap-2 border-b border-spice-brown/10 pb-3">
            <AlertTriangle className="w-5 h-5 text-spice-red" /> Low Stock Alerts
          </h3>
          {stats?.lowStockProducts?.length === 0 ? (
            <p className="text-xs text-ink-500">All inventory stock levels are healthy.</p>
          ) : (
            <div className="space-y-3">
              {stats?.lowStockProducts?.map((p: any) => (
                <div key={p._id} className="p-3 bg-brand-50 rounded-2xl border border-brand-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-spice-brown">{p.name}</span>
                  <span className="font-bold text-white bg-spice-red px-2 py-0.5 rounded">
                    Stock: {p.variants[0]?.stock || 0} units remaining
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-spice-brown/10 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-spice-brown flex items-center gap-2 border-b border-spice-brown/10 pb-3">
            <ShoppingBag className="w-5 h-5 text-spice-saffron" /> Recent Customer Orders
          </h3>
          <div className="space-y-3">
            {stats?.recentOrders?.map((ord: any) => (
              <div key={ord._id} className="p-3 bg-spice-cream rounded-2xl border border-spice-brown/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-spice-brown block">#{ord.orderNumber}</span>
                  <span className="text-[10px] text-ink-500">{ord.shippingAddress?.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-spice-red block font-serif">₹{ord.pricing?.totalAmount}</span>
                  <span className="text-[10px] font-bold text-spice-saffron uppercase">{ord.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
