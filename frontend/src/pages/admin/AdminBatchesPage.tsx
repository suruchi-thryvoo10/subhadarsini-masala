import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Plus } from 'lucide-react';
import { getApiUrl } from '../../config/api';

export const AdminBatchesPage: React.FC = () => {
  const { token } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetch(getApiUrl('/api/v1/admin/batches'), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setBatches(data.data);
        });
    }
  }, [token]);

  return (
    <div className="bg-spice-cream min-h-screen p-6 md:p-10 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-spice-brown">Batch Quality Certificate Management</h1>
        <p className="text-xs text-ink-500">Issue and manage public batch traceability certificates.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-spice-brown/10 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-spice-brown/10 uppercase text-spice-brown tracking-wider">
              <th className="p-3">Batch Number</th>
              <th className="p-3">Product</th>
              <th className="p-3">Mfg Date</th>
              <th className="p-3">Lab Certificate</th>
              <th className="p-3">Purity Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-spice-brown/10">
            {batches.map((b) => (
              <tr key={b._id}>
                <td className="p-3 font-mono font-bold text-spice-red">{b.batchNumber}</td>
                <td className="p-3 font-bold">{b.productName}</td>
                <td className="p-3">{new Date(b.mfgDate).toLocaleDateString()}</td>
                <td className="p-3 font-mono">{b.qualityReport?.certificateNumber}</td>
                <td className="p-3 font-bold text-spice-red">{b.qualityReport?.purityScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
