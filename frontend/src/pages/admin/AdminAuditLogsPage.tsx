import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import { getApiUrl } from '../../config/api';

export const AdminAuditLogsPage: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetch(getApiUrl('/api/v1/admin/audit-logs'), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setLogs(data.data);
        });
    }
  }, [token]);

  return (
    <div className="bg-spice-cream min-h-screen p-6 md:p-10 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-spice-brown">Administrative Audit Trail</h1>
        <p className="text-xs text-spice-brown/60">Immutable record of sensitive administrative actions and data modifications.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-spice-brown/10 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-spice-brown/10 uppercase text-spice-brown tracking-wider">
              <th className="p-3">Timestamp</th>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Entity</th>
              <th className="p-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-spice-brown/10">
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="p-3 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-3 font-bold">{log.userEmail} ({log.userRole})</td>
                <td className="p-3"><span className="bg-spice-red/10 text-spice-red font-bold px-2 py-0.5 rounded">{log.action}</span></td>
                <td className="p-3 font-semibold">{log.entity}</td>
                <td className="p-3 font-mono text-spice-brown/60">{log.ipAddress || '127.0.0.1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
