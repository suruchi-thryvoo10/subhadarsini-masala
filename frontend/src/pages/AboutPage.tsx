import React from 'react';
import { Award, ShieldCheck, Heart, Users, Sprout, Cog, Factory } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-spice-cream min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Brand Story Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block">
            Our Heritage & Purity Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-spice-brown">
            Preserving The Authentic Essence Of Indian Spices
          </h1>
          <p className="text-spice-brown/80 text-sm sm:text-base leading-relaxed">
            Founded with a vision to revive unadulterated, stone-ground traditional Indian culinary flavours, Subhadarshini Spices has grown into one of eastern India’s most trusted FMCG food brands.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-spice-brown/10 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-spice-red/10 text-spice-red flex items-center justify-center font-bold mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-spice-brown mb-2">Our Mission</h3>
            <p className="text-xs text-spice-brown/70 leading-relaxed">
              To deliver 100% pure, unadulterated, farm-sourced spices to every Indian kitchen, preserving health, authentic aroma, and traditional culinary heritage.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-spice-brown/10 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-spice-saffron/10 text-spice-saffron flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-spice-brown mb-2">Our Vision</h3>
            <p className="text-xs text-spice-brown/70 leading-relaxed">
              To establish Subhadarshini as the benchmark for transparency, batch lab traceability, and quality excellence in the national food & spice industry.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-spice-brown/10 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-spice-brown/10 text-spice-brown flex items-center justify-center font-bold mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-spice-brown mb-2">Farmer Relationships</h3>
            <p className="text-xs text-spice-brown/70 leading-relaxed">
              We partner directly with certified spice farming cooperatives in Odisha, Andhra Pradesh, and Kerala, supporting fair trade prices and sustainable organic cultivation.
            </p>
          </div>
        </div>

        {/* Manufacturing Facility */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-spice-brown/10 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block">
              State-Of-The-Art Processing Plant
            </span>
            <h2 className="font-serif text-3xl font-bold text-spice-brown">
              Automated Touchless Processing & Stone Grinding
            </h2>
            <p className="text-xs text-spice-brown/80 leading-relaxed">
              Our central manufacturing facility in Odisha is equipped with heavy-duty granite stone mills that slow-grind whole spices at low temperatures, ensuring zero volatile oil evaporation.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-spice-cream rounded-2xl border border-spice-brown/10">
                <span className="font-serif font-bold text-2xl text-spice-red block">10,000+ Sq.Ft</span>
                <span className="text-xs text-spice-brown/70">Cleanroom Processing Facility</span>
              </div>
              <div className="p-4 bg-spice-cream rounded-2xl border border-spice-brown/10">
                <span className="font-serif font-bold text-2xl text-spice-saffron block">42-Point</span>
                <span className="text-xs text-spice-brown/70">Lab Quality Control Checks</span>
              </div>
            </div>
          </div>
          <div className="aspect-video rounded-3xl overflow-hidden border border-spice-brown/10">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80"
              alt="Manufacturing Facility"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
