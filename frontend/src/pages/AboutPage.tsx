import React from 'react';
import { handleImageError } from '../config/images';
import { Award, ShieldCheck, Heart, Users, Sprout, Cog, Factory } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';

export const AboutPage: React.FC = () => {
  useSeo({
    title: 'Our Story',
    description:
      'Subhadarshini Spices was founded in 2024 under Subhadarshini Agro Pvt Ltd in Odisha, to offer pure, premium spices in a market where adulteration is common. Meet the founders and see how we process every batch.',
    path: '/about'
  });

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

      {/* Leadership — facts taken from subhadarshini.com/about.php.
          mt-20 matches the space-y-20 rhythm of the blocks above, so the cream
          band between the two white panels reads as a section break. */}
      <section className="bg-white border-t border-spice-brown/10 mt-20 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-spice-red font-bold text-xs uppercase tracking-widest block mb-2">
              The People Behind The Brand
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
              Founder &amp; Co-Founder
            </h2>
            <p className="text-sm text-spice-brown/75 mt-3 leading-relaxed">
              Subhadarshini Spices was founded in 2024 under Subhadarshini Agro Pvt Ltd, born from a
              simple intent: to offer pure, premium spices in a market where adulteration is common.
            </p>
          </div>

          {/* Stacked rather than side by side: one person per row keeps the
              portraits, headings and body text on a single baseline grid. */}
          <div className="space-y-14 lg:space-y-20">
            {[
              {
                label: 'Founder',
                name: 'Saini Subhadarshini',
                role: 'Founder & Managing Director',
                qualification: 'B.Tech & M.Tech, Computer Science',
                photo: '/images/team/saini-subhadarshini.webp',
                bio: 'A technology professional turned entrepreneur, driven by a vision to deliver authentic Indian flavours through pure, hygienically processed, farm-sourced spices. She has built a state-of-the-art, fully automatic spice processing unit designed to hold quality at scale. Her vision extends beyond the business — to empower farmers and to uplift sub-urban Odia women within the supply chain.'
              },
              {
                label: 'Co-Founder',
                name: 'Amit Kumar Swain',
                role: 'Director',
                qualification: 'B.Tech, Electrical Engineering',
                photo: '/images/team/amit-kumar-swain.webp',
                bio: 'An electrical engineer by qualification, Amit spent the past decade building a career in the construction industry, managing projects and leading teams. That engineering discipline now underpins a modern, fully automated spice manufacturing unit — a move from designing buildings to crafting spice blends, built on the same commitment to quality and authenticity.'
              }
            ].map((person) => (
              <article key={person.name}>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-spice-brown pb-4 mb-8 border-b border-spice-brown/10">
                  {person.label}
                </h3>

                {/* On a phone the portrait and the name sit on one row so the
                    photo cannot push the text off the first screen; from sm up
                    it becomes the wider portrait-beside-copy layout. */}
                <div className="sm:flex sm:gap-10">
                  <div className="flex items-center gap-4 sm:block sm:gap-0">
                    <img
                      src={person.photo}
                      onError={handleImageError}
                      alt={person.name}
                      loading="lazy"
                      width={700}
                      height={700}
                      className="w-24 h-24 sm:w-48 sm:h-48 rounded-2xl object-cover object-top shrink-0 border border-spice-brown/10"
                    />
                    <div className="min-w-0 sm:hidden">
                      <h4 className="font-serif font-bold text-lg text-spice-brown leading-tight">
                        {person.name}
                      </h4>
                      <p className="text-[11px] font-bold text-spice-red uppercase tracking-wider mt-1">
                        {person.role}
                      </p>
                      <p className="text-[11px] text-ink-500 mt-0.5">{person.qualification}</p>
                    </div>
                  </div>

                  <div className="min-w-0 max-w-2xl">
                    <h4 className="hidden sm:block font-serif font-bold text-2xl text-spice-brown">
                      {person.name}
                    </h4>
                    <p className="hidden sm:block text-xs font-bold text-spice-red uppercase tracking-wider mt-1.5">
                      {person.role}
                    </p>
                    <p className="hidden sm:block text-[11px] text-ink-500 mt-1">{person.qualification}</p>
                    <p className="text-sm text-spice-brown/80 mt-4 leading-relaxed">{person.bio}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
