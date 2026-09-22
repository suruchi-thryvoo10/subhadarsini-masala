import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { ChefHat, Sparkles, Clock, ShoppingBag, Search, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getApiUrl } from '../config/api';
import { resolveImageUrl, handleImageError } from '../config/images';

export const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [ingredientsInput, setIngredientsInput] = useState('chicken, onion, tomato, garlic');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(getApiUrl('/api/v1/recipes'));
      const data = await res.json();
      if (data.success) setRecipes(data.data);
    } catch (err) {
      console.error(err);
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

        {/* Recipe Grid */}
        <h2 className="font-serif text-2xl font-bold text-spice-brown mb-6">Signature Heritage Recipes</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-white/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-3xl overflow-hidden border border-spice-brown/10 shadow-sm flex flex-col justify-between">
                <div className="relative aspect-video">
                  <img
                    src={resolveImageUrl(recipe.image)}
                    onError={handleImageError}
                    alt={recipe.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-spice-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {recipe.category}
                  </span>
                </div>

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

                    <h3 className="font-serif font-bold text-xl text-spice-brown mb-2">{recipe.title}</h3>
                    <p className="text-xs text-spice-brown/70 leading-relaxed mb-4">{recipe.description}</p>

                    <h4 className="font-serif font-bold text-xs text-spice-red uppercase tracking-wider mb-2">Ingredients</h4>
                    <ul className="text-xs space-y-1 text-spice-brown/80 mb-6">
                      {recipe.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-center justify-between border-b border-spice-brown/5 py-1">
                          <span>{ing.name}</span>
                          <span className="font-bold text-spice-saffron">{ing.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Products Link */}
                  {recipe.requiredProducts && recipe.requiredProducts.length > 0 && (
                    <div className="pt-4 border-t border-spice-brown/10">
                      <span className="text-[11px] font-bold text-ink-500 uppercase block mb-2">Required Spices:</span>
                      <div className="flex items-center gap-2">
                        {recipe.requiredProducts.map((p) => (
                          <button
                            key={p._id}
                            onClick={() => addToCart(p, p.variants[0]?.size || '100g')}
                            className="px-3 py-1.5 bg-spice-cream hover:bg-spice-saffron/20 border border-spice-brown/15 text-spice-brown text-[11px] font-bold rounded-xl flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3 text-spice-red" /> {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Recipe Assistant Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-spice-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setAiModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-ink-500 hover:text-spice-red"
            >
              <X className="w-5 h-5" />
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
                        <button
                          key={sp._id}
                          onClick={() => addToCart(sp, sp.variants?.[0]?.size || '100g')}
                          className="px-3 py-1.5 bg-white border border-spice-brown/20 rounded-xl text-xs font-bold text-spice-brown flex items-center gap-1.5 shadow-sm hover:border-spice-saffron"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-spice-red" /> Shop {sp.name}
                        </button>
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
    </div>
  );
};
