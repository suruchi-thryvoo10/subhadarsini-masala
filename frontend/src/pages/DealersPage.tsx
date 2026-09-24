import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Search, Navigation } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { BecomeDealerForm } from '../components/forms/BecomeDealerForm';
import { useSeo } from '../hooks/useSeo';

export const DealersPage: React.FC = () => {
  useSeo({
    title: 'Stockists & Become a Dealer',
    description:
      'Find a Subhadarshini stockist near you, or apply to stock our masalas and spices in your shop or territory.',
    path: '/dealers'
  });

  const [dealers, setDealers] = useState<any[]>([]);
  const [stateFilter, setStateFilter] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealers();
  }, [stateFilter]);

  const fetchDealers = async () => {
    try {
      const query = new URLSearchParams({ state: stateFilter, search: searchVal }).toString();
      const res = await fetch(getApiUrl(`/api/v1/dealers?${query}`));
      const data = await res.json();
      if (data.success) setDealers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
            Store & Distributor Network
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-spice-brown">
            Find A Subhadarshini Dealer Near You
          </h1>
          <p className="text-sm text-spice-brown/80 mt-3">
            Locate official retail partners, grocery outlets, and flagship spice marts across Odisha and India.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-spice-brown/10 shadow-sm max-w-2xl mx-auto mb-12 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by city, pincode, or dealer name..."
              className="w-full pl-10 pr-4 py-3 text-xs font-bold rounded-2xl bg-spice-cream border border-spice-brown/15 focus:outline-none focus:border-spice-saffron"
            />
            <Search className="w-4 h-4 text-ink-500 absolute left-3.5 top-3.5" />
          </div>
          <button
            onClick={fetchDealers}
            className="px-6 py-3 bg-spice-red text-white font-bold text-xs uppercase tracking-wider rounded-2xl"
          >
            Search
          </button>
        </div>

        {/* Dealer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealers.map((dealer) => (
            <div key={dealer._id} className="bg-white rounded-3xl p-6 border border-spice-brown/10 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-brand-50 text-spice-red font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                    {dealer.city}, {dealer.state}
                  </span>
                  <span className="text-xs font-mono font-bold text-ink-500">PIN: {dealer.pincode}</span>
                </div>

                <h3 className="font-serif font-bold text-xl text-spice-brown mb-3">{dealer.name}</h3>

                <div className="space-y-2 text-xs text-spice-brown/80 mb-6">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-spice-saffron shrink-0 mt-0.5" />
                    <span>{dealer.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-spice-saffron shrink-0" />
                    <span>{dealer.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-spice-saffron shrink-0" />
                    <span>{dealer.openingHours}</span>
                  </p>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${dealer.name} ${dealer.address}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-spice-beige hover:bg-spice-saffron/20 border border-spice-brown/15 text-spice-brown font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-4 h-4 text-spice-red" /> Get Directions
              </a>
            </div>
          ))}
        </div>

        {/* Become a Dealer */}
        <div className="mt-16">
          <BecomeDealerForm />
        </div>
      </div>
    </div>
  );
};
