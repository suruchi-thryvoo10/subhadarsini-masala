import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';
import { ChefHat, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { handleImageError, productImageUrl } from '../config/images';
import { displayProductName } from '../utils/format';
import { SubmitRecipeForm } from '../components/forms/SubmitRecipeForm';
import { RecipeModal } from '../components/recipe/RecipeModal';
import { RecipeMotion } from '../components/recipe/RecipeMotion';
import { useSeo, SITE_URL } from '../hooks/useSeo';

// Hardcoded default heritage recipes with cooked food dish images
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
    video: '/video/mutton.mp4',
    description: 'Rich slow-cooked mutton curry in caramelised onion and stone-ground spices.',
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
    video: '/video/daal.mp4',
    description: 'The everyday Odia one-pot of toor dal simmered with raw banana, pumpkin and Panch Phoran.',
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
    video: '/video/fish.mp4',
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
    video: '/video/chicken.mp4',
    description: 'Authentic tavern-style chicken curry cooked with slow-roasted spices.',
    ingredients: [
      { name: 'Fresh Chicken', quantity: '750g' },
      { name: 'Subhadarshini Special Chicken Curry Masala', quantity: '2.5 tbsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Pure Turmeric Powder', quantity: '1 tsp', isSubhadarshiniProduct: true },
      { name: 'Subhadarshini Red Chilli Powder', quantity: '1 tsp', isSubhadarshiniProduct: true },
      { name: 'Onion-Tomato Puree', quantity: '2 cups' }
    ],
    instructions: [
      'Coat chicken in Subhadarshini Turmeric and Red Chilli powder for 15 mins.',
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
    video: '/video/biryani.mp4',
    description: 'Aromatic layered rice dish cooked under sealed dum with biryani masala.',
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
    video: '/video/paneer.mp4',
    description: 'Velvety smooth cottage cheese curry in tomato cashew butter gravy.',
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

export const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(DEFAULT_HERITAGE_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // AI Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [ingredientsInput, setIngredientsInput] = useState('chicken, onion, tomato, garlic');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  useSeo({
    title: 'Odia Recipes with Subhadarshini Masalas',
    description:
      'Traditional Odia recipes — Mamsa Kasa, Dalma and Machha Besara — cooked with Subhadarshini masalas, with ingredients and step-by-step method.',
    path: '/recipes',
    structuredData: recipes.slice(0, 6).map((r) => ({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: r.title,
      description: r.description,
      image: r.image ? `${SITE_URL}${r.image}` : undefined,
      recipeCategory: r.category,
      totalTime: `PT${(r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0)}M`,
      recipeYield: r.servings ? `${r.servings} servings` : undefined,
      recipeIngredient: r.ingredients?.map((i) => [i.quantity, i.name].filter(Boolean).join(' ')),
      recipeInstructions: r.instructions?.map((step) => ({ '@type': 'HowToStep', text: step })),
      author: { '@type': 'Organization', name: 'Subhadarshini Spices' }
    }))
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(getApiUrl('/api/v1/recipes'));
      const data = await res.json();
      if (data.success && data.data?.length >= 3) {
        const combined = data.data.map((apiRec: Recipe) => {
          const match = DEFAULT_HERITAGE_RECIPES.find((d) => d.slug === apiRec.slug);
          return {
            ...apiRec,
            image: apiRec.image || match?.image,
            videoUrl: apiRec.videoUrl || apiRec.video || match?.videoUrl || match?.video,
            videoThumbnail: apiRec.videoThumbnail || match?.videoThumbnail
          };
        });
        DEFAULT_HERITAGE_RECIPES.forEach((defRec) => {
          if (!combined.some((r: Recipe) => r.slug === defRec.slug)) {
            combined.push(defRec);
          }
        });
        setRecipes(combined);
      } else {
        setRecipes(DEFAULT_HERITAGE_RECIPES);
      }
    } catch (err) {
      console.error(err);
      setRecipes(DEFAULT_HERITAGE_RECIPES);
    } finally {
      setLoading(false);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientsInput.trim()) return;

    setAiLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/recipes/ai-assistant'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientsInput })
      });
      const data = await res.json();
      if (data.success) {
        setAiSuggestions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with AI Assistant CTA */}
        <div className="bg-spice-brown text-white rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-2 bg-spice-saffron/20 text-spice-turmeric text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-pulse" /> AI Recipe Assistant
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-spice-cream leading-tight">
              What's In Your Kitchen Today?
            </h1>
            <p className="text-xs text-spice-beige/80 leading-relaxed">
              Enter your available ingredients and let our AI Culinary Engine suggest authentic Indian recipes matched with pure Subhadarshini spice blends.
            </p>
          </div>
          <button
            onClick={() => setAiModalOpen(true)}
            className="px-8 py-4 rounded-full bg-spice-saffron hover:bg-spice-red text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <ChefHat className="w-5 h-5" /> Launch AI Assistant
          </button>
        </div>

        {/* Recipe Grid Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-spice-brown">
              Signature Heritage Recipes
            </h2>
            <p className="text-xs text-spice-brown/70 mt-1">
              Click any recipe card below to watch the video recipe & view complete step-by-step cooking instructions.
            </p>
          </div>
        </div>

        {/* SMALLER, CONCISE RECIPE CARDS WITH COOKED FOOD DISH IMAGES */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-white/60 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
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
                      <RecipeMotion
                        image={recipe.image || ''}
                        title={recipe.title}
                        steps={recipe.instructions || []}
                        category={recipe.category}
                        videoUrl={recipe.videoUrl || recipe.video}
                        videoThumbnail={recipe.videoThumbnail}
                        className="h-full"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-spice-brown uppercase tracking-wider shadow-xs z-10">
                        {recipe.category || 'Traditional Recipe'}
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
        )}
      </div>

      {/* Recipe Modal Details */}
      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />

      {/* AI Recipe Assistant Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-spice-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl border border-spice-brown/10">
            <button
              onClick={() => setAiModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-ink-500 hover:text-spice-red"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-spice-saffron text-xs font-bold uppercase mb-1">
              <Sparkles className="w-4 h-4" /> Smart Spice Recommendation
            </div>
            <h2 className="font-serif font-bold text-2xl text-spice-brown mb-4">
              AI Recipe Generator
            </h2>

            <form onSubmit={handleAiSubmit} className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-spice-brown uppercase block mb-1">
                  Enter Your Available Ingredients:
                </label>
                <input
                  type="text"
                  value={ingredientsInput}
                  onChange={(e) => setIngredientsInput(e.target.value)}
                  placeholder="e.g. chicken, onion, tomato, garlic, ghee"
                  className="w-full px-4 py-3 rounded-xl bg-spice-cream border border-spice-brown/20 text-xs font-bold text-spice-brown focus:outline-none focus:border-spice-saffron"
                />
              </div>
              <button
                type="submit"
                disabled={aiLoading}
                className="w-full py-3 bg-spice-red hover:bg-spice-red-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                {aiLoading ? 'Generating Chef Recipe...' : 'Generate Recipe & Match Spices'}
              </button>
            </form>

            {/* AI Results */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-spice-brown/10">
                {aiSuggestions.map((sug, idx) => (
                  <div key={idx} className="bg-spice-cream p-5 rounded-2xl border border-spice-brown/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-lg text-spice-brown">{sug.title}</h3>
                      <span className="text-xs font-bold text-spice-saffron">{sug.cookingTime}</span>
                    </div>
                    <p className="text-xs text-spice-brown/80">{sug.description}</p>

                    <h4 className="font-serif font-bold text-xs text-spice-red uppercase">Recommended Spices:</h4>
                    <div className="flex flex-wrap gap-2">
                      {sug.suggestedProducts?.map((sp: any) => (
                        <Link
                          key={sp._id}
                          to={`/products/${sp.slug}`}
                          className="px-3 py-1.5 bg-white border border-spice-brown/20 rounded-xl text-xs font-bold text-spice-brown flex items-center gap-1.5 shadow-sm hover:border-spice-saffron"
                        >
                          {displayProductName(sp.name)}
                        </Link>
                      ))}
                    </div>

                    <h4 className="font-serif font-bold text-xs text-spice-brown uppercase pt-2">Step-by-step Method:</h4>
                    <ol className="list-decimal pl-4 text-xs space-y-1 text-spice-brown/80">
                      {sug.instructions?.map((inst: string, i: number) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Recipe Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 pb-20">
        <SubmitRecipeForm />
      </div>
    </div>
  );
};
