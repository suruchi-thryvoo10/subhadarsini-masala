import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { TrustStrip } from '../components/home/TrustStrip';
import { ManufacturingStoryTimeline } from '../components/home/ManufacturingStoryTimeline';
import { ProductCard } from '../components/product/ProductCard';
import { Product, Recipe } from '../types';
import { ArrowRight, Star, Clock, ChefHat, ShieldCheck, Quote } from 'lucide-react';
import { getApiUrl } from '../config/api';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, recRes] = await Promise.all([
          fetch(getApiUrl('/api/v1/products?sort=featured&limit=4')),
          fetch(getApiUrl('/api/v1/recipes'))
        ]);
        const prodData = await prodRes.json();
        const recData = await recRes.json();

        if (prodData.success) setFeaturedProducts(prodData.data);
        if (recData.success) setRecipes(recData.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Featured Categories */}
      <section className="py-20 bg-spice-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
                Curated Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
                Explore Our Spice Range
              </h2>
            </div>
            <Link
              to="/products"
              className="text-spice-red font-bold text-sm hover:underline flex items-center gap-1 mt-4 sm:mt-0"
            >
              View All Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Blended Ground Spices',
                desc: 'Special chicken, garams & curry masalas.',
                slug: 'blended-spices',
                img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
              },
              {
                title: 'Basic Ground Spices',
                slug: 'basic-spices',
                desc: 'Pure high-curcumin turmeric & red chilli.',
                img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
              },
              {
                title: 'Whole Spices',
                slug: 'whole-spices',
                desc: 'Farm fresh unground whole cardamoms & cloves.',
                img: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80'
              },
              {
                title: 'Premium Food Items',
                slug: 'premium-food',
                desc: 'Traditional papads, pickles & specialty foods.',
                img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'
              }
            ].map((cat, idx) => (
              <Link
                key={idx}
                to={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-md aspect-[4/5] flex flex-col justify-end p-6 border border-spice-brown/10 hover:shadow-xl transition-all"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spice-dark/90 via-spice-dark/40 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="font-serif font-bold text-xl text-spice-cream group-hover:text-spice-turmeric transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-spice-beige/80 mt-1 line-clamp-1">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-spice-saffron mt-3">
                    Explore Category <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="py-20 bg-spice-beige/30 border-y border-spice-brown/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
              Bestsellers & Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
              Handcrafted Spice Selection
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-white/60 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Production Journey Timeline */}
      <ManufacturingStoryTimeline />

      {/* 6. Batch Quality Traceability CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-spice-red via-spice-saffron to-spice-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-spice-turmeric" /> Digital Batch Traceability
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-cream">
              Verify Your Spice Package Authenticity & Lab Reports
            </h2>
            <p className="text-sm text-spice-beige/90 leading-relaxed">
              Every Subhadarshini product package carries a unique batch number. Check purity scores, active curcumin levels, and lab test certificates in real-time.
            </p>
          </div>
          <Link
            to="/quality"
            className="px-8 py-4 rounded-full bg-spice-cream text-spice-brown font-bold text-sm hover:bg-white transition-all shadow-xl shrink-0"
          >
            Verify Package Batch →
          </Link>
        </div>
      </section>

      {/* 7. Recipe Showcase */}
      <section className="py-20 bg-spice-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
                Kitchen Inspiration
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
                Recipes Crafted With Subhadarshini
              </h2>
            </div>
            <Link
              to="/recipes"
              className="text-spice-red font-bold text-sm hover:underline flex items-center gap-1 mt-4 sm:mt-0"
            >
              Open AI Recipe Assistant →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-2xl overflow-hidden border border-spice-brown/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                <div className="relative aspect-video">
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-spice-brown text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {recipe.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-spice-brown/60 mb-2">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-spice-saffron" /> {recipe.cookTimeMinutes} mins
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <ChefHat className="w-3.5 h-3.5 text-spice-saffron" /> {recipe.difficulty}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-spice-brown mb-2">{recipe.title}</h3>
                    <p className="text-xs text-spice-brown/70 line-clamp-2">{recipe.description}</p>
                  </div>
                  <Link
                    to="/recipes"
                    className="mt-6 pt-4 border-t border-spice-brown/10 text-spice-red font-bold text-xs flex items-center justify-between hover:text-spice-red-dark"
                  >
                    View Ingredients & Step-by-Step →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-20 bg-spice-brown text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Quote className="w-10 h-10 text-spice-saffron/40 mx-auto mb-3" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-cream">
              Loved By Home Cooks & Chefs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sunita Dash',
                role: 'Home Chef, Cuttack',
                review: 'Subhadarshini Special Chicken Masala has an aroma that takes me right back to my grandmother’s kitchen handi. Unmatched purity!',
                rating: 5
              },
              {
                name: 'Rajesh Mohanty',
                role: 'Restaurant Owner, Bhubaneswar',
                review: 'We use Subhadarshini turmeric and red chilli in bulk. The consistency in natural color and curcumin level is top tier.',
                rating: 5
              },
              {
                name: 'Priyanka Patnaik',
                role: 'Food Blogger, Puri',
                review: 'Knowing I can trace the batch certificate directly on their website gives complete peace of mind about zero adulteration.',
                rating: 5
              }
            ].map((test, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                <p className="text-sm text-spice-beige/90 italic leading-relaxed">"{test.review}"</p>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-spice-cream">{test.name}</h4>
                    <span className="text-[11px] text-spice-beige/60">{test.role}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-spice-turmeric">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-spice-turmeric" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
