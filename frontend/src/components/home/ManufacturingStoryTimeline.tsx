import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Cog, ShieldCheck, PackageCheck, ArrowRight } from 'lucide-react';

export const ManufacturingStoryTimeline: React.FC = () => {
  const steps = [
    {
      title: 'Whole Spices Sourced',
      desc: '100% farm-sourced single-origin whole spices.',
      icon: Sprout,
      image: '/images/products/coriander-seeds.webp'
    },
    {
      title: 'Granite Stone Milling',
      desc: 'Slow-ground at low temperatures to prevent oil loss.',
      icon: Cog,
      image: '/images/products/turmeric-powder.webp'
    },
    {
      title: 'Touchless Processing',
      desc: 'Automated magnetic cleaning & hygienic sorting.',
      icon: ShieldCheck,
      image: '/images/products/panch-phoran.webp'
    },
    {
      title: 'Finished Subhadarshini Masala',
      desc: 'Aroma-locked multi-layer pouch seal ready for your kitchen.',
      icon: PackageCheck,
      image: '/images/products/chicken-masala.webp'
    }
  ];

  return (
    <section className="py-20 bg-spice-beige/40 border-y border-spice-brown/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Section Header with EXACT REQUIRED HEADING & TEXT */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block">
            Purity & Science In Every Grain
          </span>

          {/* EXACT HEADING */}
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
            Automated Touchless Processing & Stone Grinding
          </h2>

          {/* EXACT BODY COPY */}
          <p className="text-sm sm:text-base text-spice-brown/80 leading-relaxed max-w-2xl mx-auto">
            Our central manufacturing facility in Odisha is equipped with heavy-duty granite stone mills that slow-grind whole spices at low temperatures, ensuring zero volatile oil evaporation.
          </p>
        </div>

        {/* Visual Storytelling Flow: Whole Spices -> Stone Grinding -> Careful Processing -> Finished Subhadarshini Masala */}
        <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-spice-brown/10 shadow-sm">
          <h3 className="font-serif font-bold text-xl text-spice-brown mb-6 text-center">
            From Raw Spice To Authentic Subhadarshini Masala
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-spice-cream rounded-2xl p-5 border border-spice-brown/10 flex flex-col justify-between relative group hover:border-spice-red transition-all"
                >
                  <div>
                    <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center border border-spice-brown/5 shadow-inner">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 w-7 h-7 rounded-full bg-spice-brown text-white font-bold text-xs flex items-center justify-center">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-spice-saffron/10 text-spice-saffron flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-serif font-bold text-base text-spice-brown leading-tight">
                        {step.title}
                      </h4>
                    </div>

                    <p className="text-xs text-spice-brown/70 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-spice-saffron text-white items-center justify-center shadow-md">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
