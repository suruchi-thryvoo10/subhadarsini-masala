import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { TrustStrip } from '../components/home/TrustStrip';
import { ManufacturingStoryTimeline } from '../components/home/ManufacturingStoryTimeline';
import { ProductMarquee } from '../components/home/ProductMarquee';
import { CategoryRail } from '../components/home/CategoryRail';
import { Product, Recipe, Category } from '../types';
import { ArrowRight, Star, Clock, ChefHat, ShieldCheck, Quote } from 'lucide-react';
import { fetchApi } from '../config/api';
import { Reveal, StaggerGroup, StaggerItem } from '../components/ui/Reveal';
import { useSeo, organisationSchema, SITE_URL } from '../hooks/useSeo';
import { CONTACT } from '../config/contact';
import { RecipeMotion } from '../components/recipe/RecipeMotion';
import { useT } from '../i18n/LanguageContext';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useT();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData, recData] = await Promise.all([
          fetchApi('/api/v1/products?sort=featured&limit=4'),
          fetchApi('/api/v1/categories'),
          fetchApi('/api/v1/recipes').catch(() => ({ data: [] }))
        ]);

        setFeaturedProducts(prodData.data || []);
        setCategories(catData.data || []);
        setRecipes(recData.data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching homepage data:', err);
        setError(err?.message || 'Unable to load the catalogue right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // The showcase is a three-up grid: render it only when three complete recipes
  // exist, rather than leaving a ragged row or empty cards.
  const featuredRecipes = useMemo(
    () => recipes.filter((r) => r?.title && r?.image && r?.description).slice(0, 3),
    [recipes]
  );
  const showRecipes = featuredRecipes.length === 3;

  useSeo({
    title: 'Subhadarshini Spices — Pure Stone-Ground Masalas from Odisha',
    description:
      'Subhadarshini Spices makes 100% pure, farm-sourced, stone-ground masalas and whole spices in Bhubaneswar, Odisha. Every batch is lab tested and traceable by batch number.',
    path: '/',
    structuredData: [
      organisationSchema(CONTACT as any),
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Subhadarshini Spices',
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  });

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Featured Categories */}
      <section className="py-20 bg-spice-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
                {t('home.collections')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
                {t('home.spiceRange')}
              </h2>
            </div>
            <Link
              to="/products"
              className="text-spice-red font-bold text-sm hover:underline flex items-center gap-1 mt-4 sm:mt-0"
            >
              {t('action.viewAll')} →
            </Link>
          </Reveal>

        </div>

        <CategoryRail categories={categories} loading={loading} />
      </section>

      {/* 4. Featured Products */}
      <section className="py-20 bg-spice-beige/30 border-y border-spice-brown/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
              {t('home.bestsellers')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
              {t('home.handcrafted')}
            </h2>
          </Reveal>

          {loading ? (
            <div className="flex gap-8 overflow-hidden">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-[210px] sm:w-[300px] lg:w-[360px] h-80 shrink-0 bg-white/60 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center bg-white rounded-2xl border border-spice-red/20 p-8">
              <h3 className="font-serif font-bold text-lg text-spice-brown mb-2">
                {t('state.error')}
              </h3>
              <p className="text-xs text-spice-brown/70 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-spice-red text-white font-bold text-xs rounded-full"
              >
                {t('action.retry')}
              </button>
            </div>
          ) : (
            <ProductMarquee products={featuredProducts} />
          )}
        </div>
      </section>

      {/* 5. Production Journey Timeline */}
      <ManufacturingStoryTimeline />

      {/* 6. Batch Quality Traceability CTA Banner */}
      <section className="py-16 bg-spice-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <Reveal from="right" className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-spice-turmeric" /> Digital Batch Traceability
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-cream">
              Verify Your Spice Package Authenticity & Lab Reports
            </h2>
            <p className="text-sm text-spice-cream leading-relaxed">
              Every Subhadarshini product package carries a unique batch number. Check purity scores, active curcumin levels, and lab test certificates in real-time.
            </p>
          </Reveal>
          <Link
            to="/quality"
            className="px-8 py-4 rounded-full bg-spice-cream text-spice-brown font-bold text-sm hover:bg-white transition-all shadow-xl shrink-0"
          >
            Verify Package Batch →
          </Link>
        </div>
      </section>

      {/* 7. Recipe Showcase — hidden unless three complete recipes are available */}
      {showRecipes && (
      <section className="py-20 bg-spice-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
                {t('home.kitchenInspiration')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
                {t('home.recipesCrafted')}
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
            {featuredRecipes.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-2xl overflow-hidden border border-spice-brown/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                <RecipeMotion
                  image={recipe.image}
                  title={recipe.title}
                  steps={recipe.instructions || []}
                  category={recipe.category}
                  videoUrl={recipe.videoUrl}
                  videoThumbnail={recipe.videoThumbnail}
                />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-ink-500 mb-2">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-spice-saffron" /> {recipe.cookTimeMinutes} mins
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <ChefHat className="w-3.5 h-3.5 text-spice-saffron" /> {recipe.difficulty}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-spice-brown mb-2 line-clamp-2">{recipe.title}</h3>
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
      )}

      {/* 8. Testimonials */}
      <section className="py-20 bg-spice-brown text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Quote className="w-10 h-10 text-spice-saffron/40 mx-auto mb-3" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-cream">
              {t('home.lovedBy')}
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
                review: 'We use Subhadarshini turmeric and red chilli in bulk. The consistency in natural colour and curcumin level is top tier.',
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
                <p className="text-sm text-spice-cream italic leading-relaxed">"{test.review}"</p>
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
