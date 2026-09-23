import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { fetchApi } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl, handleImageError } from '../../config/images';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';

/**
 * Review queue for customer-submitted recipes.
 *
 * Nothing submitted through "Share Your Recipe" is visible on the public site
 * until it is approved here — the public recipe endpoints filter on APPROVED.
 */
export const AdminRecipeSubmissionsPage: React.FC = () => {
  const { token } = useAuth();
  const [filter, setFilter] = useState<Status>('PENDING');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/api/v1/admin/recipe-submissions?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data || []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Could not load submissions.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filter, token]);

  useEffect(() => {
    load();
  }, [load]);

  const review = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setBusyId(id);
    try {
      await fetchApi(`/api/v1/admin/recipe-submissions/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      await load();
    } catch (err: any) {
      setError(err?.message || 'Could not update that submission.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-spice-brown">Recipe Submissions</h1>
            <p className="text-sm text-spice-brown/70 mt-1">
              Customer recipes stay hidden from the site until you approve them.
            </p>
          </div>
          <button
            onClick={load}
            className="self-start px-4 py-2 rounded-full border border-spice-brown/20 text-spice-brown text-xs font-bold flex items-center gap-2 hover:border-spice-red transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-colors ${
                filter === s ? 'bg-spice-red text-white' : 'bg-spice-beige text-spice-brown hover:bg-spice-saffron/20'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-brand-50 border border-brand-200 text-spice-red text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-white/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-spice-brown/10 p-12 text-center">
            <Clock className="w-10 h-10 text-ink-400 mx-auto mb-3" />
            <p className="text-sm text-spice-brown/70">Nothing in this queue right now.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((r) => (
              <article key={r._id} className="bg-white rounded-2xl border border-spice-brown/10 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-0">
                  <div className="bg-spice-cream flex items-center justify-center p-3">
                    {r.image ? (
                      <img
                        src={resolveImageUrl(r.image)}
                        onError={handleImageError}
                        alt=""
                        className="w-full h-40 sm:h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-[11px] text-ink-500 py-10">No photo</span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          r.status === 'APPROVED'
                            ? 'bg-spice-brown text-white'
                            : r.status === 'REJECTED'
                            ? 'bg-surface-300 text-ink-600'
                            : 'bg-brand-50 text-spice-red'
                        }`}
                      >
                        {r.status}
                      </span>
                      <span className="text-[11px] text-ink-500">
                        {r.submittedBy?.name} · {r.submittedBy?.email}
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-xl text-spice-brown">{r.title}</h2>
                    <p className="text-xs text-spice-brown/75 mt-1.5 leading-relaxed">{r.description}</p>

                    {r.heroProduct && (
                      <p className="text-[11px] text-spice-red font-bold mt-2">
                        Masala: {r.heroProduct.name}
                      </p>
                    )}
                    {r.videoUrl && (
                      <a
                        href={r.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-spice-red font-bold underline mt-1 inline-block"
                      >
                        View submitted video
                      </a>
                    )}

                    <details className="mt-3">
                      <summary className="text-[11px] font-bold text-spice-brown cursor-pointer">
                        Ingredients &amp; method
                      </summary>
                      <ul className="text-[11px] text-spice-brown/80 mt-2 list-disc pl-4 space-y-0.5">
                        {r.ingredients?.map((i: any, idx: number) => <li key={idx}>{i.name}</li>)}
                      </ul>
                      <ol className="text-[11px] text-spice-brown/80 mt-2 list-decimal pl-4 space-y-0.5">
                        {r.instructions?.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
                      </ol>
                    </details>

                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => review(r._id, 'APPROVED')}
                        disabled={busyId === r._id || r.status === 'APPROVED'}
                        className="px-4 py-2 rounded-xl bg-spice-brown hover:bg-spice-red disabled:bg-surface-300 disabled:text-ink-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => review(r._id, 'REJECTED')}
                        disabled={busyId === r._id || r.status === 'REJECTED'}
                        className="px-4 py-2 rounded-xl border border-spice-brown/20 text-spice-brown text-xs font-bold flex items-center gap-1.5 hover:border-spice-red disabled:opacity-40 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
