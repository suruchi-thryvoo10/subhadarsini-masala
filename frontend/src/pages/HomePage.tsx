import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { StatsSection } from '../components/home/StatsSection';
import { LabAuthenticitySection } from '../components/home/LabAuthenticitySection';
import { ProductMarquee } from '../components/home/ProductMarquee';
import { CategoryRail } from '../components/home/CategoryRail';
import { RecipeModal } from '../components/recipe/RecipeModal';
import { Product, Recipe, Category } from '../types';
import { Star, Clock, ChefHat, Quote } from 'lucide-react';
import { fetchApi } from '../config/api';
import { Reveal } from '../components/ui/Reveal';
import { useSeo, organisationSchema, SITE_URL } from '../hooks/useSeo';
import { CONTACT } from '../config/contact';
import { displayProductName } from '../utils/format';
import { handleImageError, productImageUrl } from '../config/images';
import { useT } from '../i18n/LanguageContext';

// Hardcoded fallback heritage recipes with cooked food dish images
const DEFAULT_HERITAGE_RECIPES: Recipe[] = [
  {
    _id: 'rec-1',
    title: 'Traditional Odia Mamsa Kasa',
    slug: 'traditional-odia-mamsa-kasa',
    category: 'Non-Vegetarian',
    prepTimeMinutes: 20,
    cookTimeMinutes: 45,
    difficulty: 'MEDIUM',
    servings: 4,
    image: '/images/recipes/mamsa-kasa.webp',
    description: 'Rich slow-cooked mutton curry with stone-ground spices.',
    ingredients: [
      { name: 'Tender Mutton', quantity: '500g' },
      { name: 'Subhadarshini Mutton & Meat Masala', quantity: '2 tbsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Pure Turmeric Powder', quantity: '1 tbsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Red Chilli Powder', quantity: '1.5 tbsp', isSubhadarshiniProduct: true },
      { name: 'Sliced Onions & Ginger-Garlic Paste', quantity: '2 cups' }
    ],
    instructions: [
      'Marinate mutton with Subhadarshini Turmeric and Red Chilli powder for 30 minutes.',
      'Saute onions in mustard oil until caramelised, add ginger-garlic paste.',
      'Add Subhadarshini Mutton & Meat Masala and slow cook on low heat for 45 minutes.',
      'Garnish with fresh coriander and serve hot with rice or paratha.'
    ],
    heroProduct: {
      _id: 'prod-meat',
      name: 'Subhadarshini Mutton & Meat Masala',
      slug: 'subhadarshini-mutton-meat-masala',
      images: ['/images/products/meat-masala.webp']
    } as any
  },
  {
    _id: 'rec-2',
    title: 'Heritage Odia Dalma',
    slug: 'heritage-odia-dalma',
    category: 'Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    difficulty: 'EASY',
    servings: 4,
    image: '/images/recipes/odia-dalma.webp',
    description: 'Everyday Odia lentil stew cooked with raw banana and Panch Phoran.',
    ingredients: [
      { name: 'Toor Dal (Arhar)', quantity: '1 cup' },
      { name: 'Subhadarshini Panch Phoran', quantity: '1 tsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Pure Turmeric Powder', quantity: '1/2 tsp', isSubhadarshiniProduct: true },
      { name: 'Cubed Raw Vegetables', quantity: '2 cups' },
      { name: 'Ghee & Fresh Ginger', quantity: '1 tbsp' }
    ],
    instructions: [
      'Pressure cook toor dal with turmeric and cubed vegetables.',
      'Crackle Subhadarshini Panch Phoran in hot ghee with dried red chilli.',
      'Pour tempering into cooked dal and simmer for 5 minutes.',
      'Serve steaming hot with boiled rice.'
    ],
    heroProduct: {
      _id: 'prod-panch',
      name: 'Subhadarshini Panch Phoran',
      slug: 'subhadarshini-panch-phoran',
      images: ['/images/products/panch-phoran.webp']
    } as any
  },
  {
    _id: 'rec-3',
    title: 'Machha Besara',
    slug: 'machha-besara-odia-fish-curry',
    category: 'Seafood',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    difficulty: 'MEDIUM',
    servings: 4,
    image: '/images/recipes/machha-besara.webp',
    description: 'Rohu fish simmered in sharp mustard garlic gravy.',
    ingredients: [
      { name: 'Fresh Rohu Fish Steaks', quantity: '600g' },
      { name: 'Subhadarshini Fish Masala', quantity: '2 tbsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Mustard Seeds', quantity: '2 tbsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Pure Turmeric Powder', quantity: '1 tsp', isSubhadarshiniProduct: true },
      { name: 'Garlic & Green Chillies', quantity: '6 cloves' }
    ],
    instructions: [
      'Rub fish with turmeric and salt, shallow fry until golden.',
      'Saute garlic and green chillies in mustard oil.',
      'Add mustard paste and Subhadarshini Fish Masala on low heat.',
      'Simmer fish in gravy for 8 minutes and serve with rice.'
    ],
    heroProduct: {
      _id: 'prod-fish',
      name: 'Subhadarshini Fish Masala',
      slug: 'subhadarshini-fish-curry-masala',
      images: ['/images/products/fish-masala.webp']
    } as any
  },
  {
    _id: 'rec-4',
    title: 'Subhadarshini Special Chicken Curry',
    slug: 'subhadarshini-special-chicken-curry',
    category: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    difficulty: 'EASY',
    servings: 4,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-pzKdY1HWoressqzFGHlu9FgRBKFhsoWkp21nN_PU1g&s=10',
    description: 'Tavern-style chicken curry with roasted spices.',
    ingredients: [
      { name: 'Fresh Chicken', quantity: '750g' },
      { name: 'Subhadarshini Special Chicken Curry Masala', quantity: '2.5 tbsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Pure Turmeric Powder', quantity: '1 tsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Red Chilli Powder', quantity: '1 tsp', isSubhadarshiniProduct: true },
      { name: 'Onion-Tomato Puree', quantity: '2 cups' }
    ],
    instructions: [
      'Coat chicken in Subhadarshini Turmeric and Red Chilli powder.',
      'Saute onions and add Subhadarshini Special Chicken Curry Masala.',
      'Simmer chicken in gravy for 25 minutes until tender.',
      'Serve hot with rotis or steamed rice.'
    ],
    heroProduct: {
      _id: 'prod-chicken',
      name: 'Subhadarshini Special Chicken Curry Masala',
      slug: 'subhadarshini-special-chicken-curry-masala',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-pzKdY1HWoressqzFGHlu9FgRBKFhsoWkp21nN_PU1g&s=10']
    } as any
  },
  {
    _id: 'rec-5',
    title: 'Royal Dum Biryani',
    slug: 'royal-dum-biryani',
    category: 'Royal Special',
    prepTimeMinutes: 25,
    cookTimeMinutes: 40,
    difficulty: 'MEDIUM',
    servings: 6,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcWLQFyIpchYmqH-hhyxqhIcwYbVASOkhcH7x2gFlutQ&s=10',
    description: 'Layered basmati rice dum cooked with biryani masala.',
    ingredients: [
      { name: 'Long Grain Basmati Rice', quantity: '500g' },
      { name: 'Subhadarshini Royal Dum Biryani Masala', quantity: '3 tbsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Coriander Seeds & Tej Patta', quantity: '1 tbsp', isSubhadarshiniProduct: true },
      { name: 'Fried Onions & Mint', quantity: '1 cup' },
      { name: 'Pure Ghee', quantity: '3 tbsp' }
    ],
    instructions: [
      'Parboil basmati rice with whole spices until 70% cooked.',
      'Layer vegetables or chicken with Subhadarshini Dum Biryani Masala.',
      'Seal handi lid with dough and cook on low heat for 25 minutes.',
      'Fluff rice gently and serve with cold cucumber raita.'
    ],
    heroProduct: {
      _id: 'prod-biryani',
      name: 'Subhadarshini Royal Dum Biryani Masala',
      slug: 'subhadarshini-royal-dum-biryani-masala',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcWLQFyIpchYmqH-hhyxqhIcwYbVASOkhcH7x2gFlutQ&s=10']
    } as any
  },
  {
    _id: 'rec-6',
    title: 'Shahi Paneer Butter Masala',
    slug: 'shahi-paneer-butter-masala',
    category: 'Vegetarian',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    difficulty: 'EASY',
    servings: 4,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn9trE4k8QkQ2v8wLGPPSvfja-rJ2V7jW0Jg&s=10',
    description: 'Silky paneer cubes in tomato cashew butter gravy.',
    ingredients: [
      { name: 'Fresh Paneer Cubes', quantity: '300g' },
      { name: 'Subhadarshini Shahi Paneer Masala', quantity: '2 tbsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Kasuri Methi', quantity: '1 tbsp', isSubhadarshiniProduct: true },
      { name: 'Butter & Cream', quantity: '2 tbsp' }
    ],
    instructions: [
      'Melt butter and cook tomato puree with cashew paste.',
      'Stir in Subhadarshini Shahi Paneer Masala and fresh cream.',
      'Add paneer cubes and crushed Subhadarshini Kasuri Methi.',
      'Simmer for 5 minutes and serve with butter naan.'
    ],
    heroProduct: {
      _id: 'prod-paneer',
      name: 'Subhadarshini Shahi Paneer Masala',
      slug: 'subhadarshini-paneer-butter-masala',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn9trE4k8QkQ2v8wLGPPSvfja-rJ2V7jW0Jg&s=10']
    } as any
  }
];

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>(DEFAULT_HERITAGE_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
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
        if (recData.data && recData.data.length >= 3) {
          const combined = [...recData.data];
          DEFAULT_HERITAGE_RECIPES.forEach((defRec) => {
            if (!combined.some((r) => r.slug === defRec.slug)) {
              combined.push(defRec);
            }
          });
          setRecipes(combined.slice(0, 6));
        } else {
          setRecipes(DEFAULT_HERITAGE_RECIPES);
        }
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
      {/* 1. CINEMATIC ANIMATED HERO WITH AMBASSADOR BRANDING */}
      <HeroSection />

      {/* 2. SEPARATE STATISTICS SECTION */}
      <StatsSection />

      {/* 3. FEATURED CATEGORIES */}
      <section className="py-20 bg-spice-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
                {t('home.collections')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown break-words">
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

      {/* 4. FEATURED PRODUCTS BESTSELLERS MARQUEE */}
      <section className="py-20 bg-spice-beige/30 border-y border-spice-brown/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
              {t('home.bestsellers')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown break-words">
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

      {/* 5. LAB AUTHENTICITY SECTION WITH SUBHADARSHINI COMPANY FACILITY IMAGE */}
      <LabAuthenticitySection />

      {/* 6. HERITAGE RECIPES SHOWCASE — CONCISE CARDS WITH COOKED DISH IMAGES */}
      <section className="py-20 bg-spice-cream border-b border-spice-brown/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div className="min-w-0 max-w-full">
              <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
                {t('home.kitchenInspiration')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown break-words">
                Authentic Heritage Recipes
              </h2>
            </div>
            <Link
              to="/recipes"
              className="text-spice-red font-bold text-sm hover:underline flex items-center gap-1 mt-4 sm:mt-0"
            >
              Explore Recipe Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => {
              const mainMasalaText = recipe.heroProduct
                ? displayProductName(recipe.heroProduct.name)
                : recipe.ingredients?.find((i) => i.isSubhadarshiniProduct)?.name || 'Subhadarshini Special Masala';

              const heroMasalaImg = recipe.heroProduct
                ? productImageUrl(recipe.heroProduct)
                : '/images/products/ground-spice-generic.webp';

              return (
                <div
                  key={recipe._id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-3xl overflow-hidden border border-spice-brown/10 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group max-w-sm mx-auto w-full"
                >
                  <div>
                    {/* Cooked Dish Image Header with Attached Small Masala Badge */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-spice-brown">
                      <img
                        src={recipe.image}
                        onError={handleImageError}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-spice-brown uppercase tracking-wider shadow-xs z-10">
                        {recipe.category || 'Recipe'}
                      </span>

                      {/* Attached Small Masala Product Packet Image */}
                      <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md p-1 pr-2.5 rounded-2xl shadow-lg border border-spice-red/25 flex items-center gap-2 group-hover:scale-105 transition-transform z-10">
                        <img
                          src={heroMasalaImg}
                          onError={handleImageError}
                          alt={mainMasalaText}
                          className="w-8 h-8 object-contain bg-spice-cream rounded-xl border border-spice-brown/10 p-0.5 shrink-0"
                        />
                        <div className="min-w-0 max-w-[100px]">
                          <span className="text-[7.5px] font-extrabold uppercase text-spice-red block leading-none tracking-tight">
                            Main Masala
                          </span>
                          <span className="text-[10px] font-bold text-spice-brown truncate block leading-tight font-serif mt-0.5">
                            {mainMasalaText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Small & Clean Card Body */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-spice-brown/70">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-spice-saffron" /> {recipe.cookTimeMinutes} mins
                        </span>
                        <span className="flex items-center gap-1">
                          <ChefHat className="w-3 h-3 text-spice-saffron" /> {recipe.difficulty}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-spice-brown leading-snug group-hover:text-spice-red transition-colors line-clamp-1">
                        {recipe.title}
                      </h3>
                    </div>
                  </div>

                  {/* View Recipe Action */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-2xl bg-spice-cream border border-spice-brown/15 text-spice-brown font-bold text-xs group-hover:bg-spice-red group-hover:text-white group-hover:border-spice-red transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      View Recipe →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recipe Details Modal */}
      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />

      {/* 7. TESTIMONIALS SECTION */}
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
