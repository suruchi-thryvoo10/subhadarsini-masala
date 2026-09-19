import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/v1/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setProducts(data.data);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div className="bg-spice-cream min-h-screen p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-spice-brown">Product Management</h1>
          <p className="text-xs text-spice-brown/60">Create, edit, and update spice variants and stock levels.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-spice-brown/10 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-spice-brown/10 text-spice-brown uppercase tracking-wider">
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Variants</th>
              <th className="p-3">Price Range</th>
              <th className="p-3">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-spice-brown/10">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="p-3 font-bold text-spice-brown flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <span>{p.name}</span>
                </td>
                <td className="p-3">{p.category?.name || 'Spice Blend'}</td>
                <td className="p-3">{p.variants?.map((v: any) => v.size).join(', ')}</td>
                <td className="p-3 font-serif font-bold">₹{p.variants[0]?.price} - ₹{p.variants[p.variants.length - 1]?.price}</td>
                <td className="p-3 font-bold text-spice-saffron">★ {p.ratingAvg} ({p.ratingCount})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
