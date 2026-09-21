import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { getApiUrl } from '../config/api';

export const OrderTrackPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderTrack = async () => {
      try {
        const res = await fetch(getApiUrl(`/api/v1/orders/track/${orderNumber}`));
        const data = await res.json();
        if (data.success) setOrder(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) fetchOrderTrack();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="h-64 bg-white/60 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-spice-brown mb-3">Order Not Found</h2>
        <p className="text-xs text-spice-brown/70 mb-6">Order #{orderNumber} could not be located in our tracking system.</p>
        <Link to="/products" className="px-6 py-2.5 bg-spice-red text-white font-bold text-xs rounded-full">
          Return to Shop
        </Link>
      </div>
    );
  }

  const timelineSteps = [
    { status: 'PENDING', label: 'Order Initiated' },
    { status: 'CONFIRMED', label: 'Payment Confirmed' },
    { status: 'PROCESSING', label: 'Processing at Spice Mill' },
    { status: 'PACKED', label: 'Packed in Vacuum Sealed Pouch' },
    { status: 'SHIPPED', label: 'Handed to Courier' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { status: 'DELIVERED', label: 'Delivered' }
  ];

  const currentStepIndex = timelineSteps.findIndex((s) => s.status === order.orderStatus);

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-spice-brown/10 shadow-sm space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-spice-brown/10 pb-6 gap-4">
            <div>
              <span className="text-xs font-bold text-spice-saffron uppercase tracking-widest block mb-1">
                Order Tracking Status
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-spice-brown">
                Order #{order.orderNumber}
              </h1>
            </div>
            <div className="bg-spice-beige px-4 py-2 rounded-xl text-right">
              <span className="text-[11px] text-spice-brown/60 block">Current Status</span>
              <span className="font-bold text-xs text-spice-red uppercase tracking-wider">{order.orderStatus}</span>
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="py-4">
            <h3 className="font-serif font-bold text-lg text-spice-brown mb-6">Delivery Progress Timeline</h3>
            <div className="relative pl-6 border-l-2 border-spice-saffron/30 space-y-8">
              {order.trackingHistory?.map((event: any, idx: number) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-spice-red border-2 border-white shadow" />
                  <div className="bg-spice-beige/40 p-4 rounded-xl border border-spice-brown/10">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-spice-brown">{event.status}</span>
                      <span className="text-[11px] text-spice-brown/50">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {event.note && <p className="text-xs text-spice-brown/70 mt-1">{event.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Summary */}
          <div className="border-t border-spice-brown/10 pt-6">
            <h3 className="font-serif font-bold text-lg text-spice-brown mb-4">Items In This Order</h3>
            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs text-spice-brown p-3 bg-spice-cream rounded-xl">
                  <div>
                    <span className="font-bold block">{item.name}</span>
                    <span className="text-spice-saffron">Pack: {item.variantSize} x {item.quantity}</span>
                  </div>
                  <span className="font-bold font-serif">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>
            <div className="text-right mt-4 font-serif font-bold text-lg text-spice-brown">
              Total Paid: <span className="text-spice-red">₹{order.pricing?.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
