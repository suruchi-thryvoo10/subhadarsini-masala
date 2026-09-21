import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { OrderStatus } from '../../types';
import { getApiUrl } from '../../config/api';

export const AdminOrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(getApiUrl('/api/v1/admin/orders'), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setOrders(data.data);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/v1/admin/orders/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen p-6 md:p-10 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-spice-brown">Order Workflow Management</h1>
        <p className="text-xs text-spice-brown/60">Update order status pipeline (Confirmed → Processing → Packed → Shipped → Delivered).</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-spice-brown/10 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-spice-brown/10 uppercase text-spice-brown tracking-wider">
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-spice-brown/10">
            {orders.map((ord) => (
              <tr key={ord._id}>
                <td className="p-3 font-bold font-mono text-spice-brown">{ord.orderNumber}</td>
                <td className="p-3">{ord.shippingAddress?.name} ({ord.shippingAddress?.city})</td>
                <td className="p-3 font-serif font-bold text-spice-red">₹{ord.pricing?.totalAmount}</td>
                <td className="p-3">
                  <span className="bg-spice-saffron/15 text-spice-saffron font-bold px-2.5 py-1 rounded-full uppercase">
                    {ord.orderStatus}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                    className="bg-spice-cream border border-spice-brown/20 rounded-xl p-1.5 font-bold"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="PACKED">PACKED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
