import React, { useState } from 'react';
import { X, Clock, ChefHat, Sparkles, CheckCircle2, Utensils, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Recipe } from '../../types';
import { displayProductName } from '../../utils/format';
import { productImageUrl, handleImageError } from '../../config/images';
import { Link } from 'react-router-dom';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStepTab, setActiveStepTab] = useState(0);

  if (!recipe) return null;

  const heroMasalaName = recipe.heroProduct
    ? displayProductName(recipe.heroProduct.name)
    : recipe.ingredients?.find((i) => i.isSubhadarshiniProduct)?.name || 'Subhadarshini Special Masala';

  const heroMasalaImage = recipe.heroProduct
    ? productImageUrl(recipe.heroProduct)
    : '/images/products/chicken-masala.webp';

  return (
    <div className="fixed inset-0 z-50 bg-spice-dark/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 max-h-[92vh] overflow-y-auto relative shadow-2xl border border-spice-brown/10 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-spice-cream text-spice-brown hover:bg-spice-red hover:text-white transition-colors flex items-center justify-center z-20 shadow-md"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. RECIPE VIDEO COOKING STUDIO PLAYER */}
        <div className="mb-6 rounded-3xl overflow-hidden bg-spice-dark relative border-2 border-spice-brown/20 shadow-xl group">
          <div className="relative aspect-video bg-spice-brown overflow-hidden flex items-center justify-center">
            
            {/* Cooking Dish Video Canvas / Visual Preview */}
            <img
              src={recipe.image}
              onError={handleImageError}
              alt={`${recipe.title} Video Recipe`}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105 filter brightness-95' : 'scale-100 filter brightness-75'}`}
            />

            {/* Video Gradient Vignette & Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-spice-dark/90 via-spice-dark/30 to-transparent pointer-events-none" />

            {/* Simulated Live Cooking Video Indicator */}
            <div className="absolute top-4 left-4 bg-spice-red/90 text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md backdrop-blur-sm z-10">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Subhadarshini Kitchen Studio Video Guide
            </div>

            {/* Video Play / Pause Center Overlay Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute z-10 w-16 h-16 rounded-full bg-spice-red/90 hover:bg-spice-red text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
              aria-label={isPlaying ? 'Pause Recipe Video' : 'Play Recipe Video'}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>

            {/* Video Player Control Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-spice-dark via-spice-dark/80 to-transparent text-white flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-spice-turmeric">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-spice-turmeric">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-xs font-semibold text-spice-cream">
                  01:45 / 03:30 • {recipe.title} Step-by-Step Cooking
                </span>
              </div>
              <Maximize className="w-4 h-4 hover:text-spice-turmeric cursor-pointer" />
            </div>

          </div>
        </div>

        {/* 2. RECIPE HEADER & MAIN MASALA INGREDIENT IMAGE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6 p-4 rounded-2xl bg-spice-cream border border-spice-brown/10">
          
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-spice-saffron/15 text-spice-saffron text-[10px] font-bold uppercase tracking-wider">
                {recipe.category || 'Traditional Recipe'}
              </span>
              <span className="text-xs text-spice-brown/70 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-spice-saffron" /> {recipe.cookTimeMinutes} mins
              </span>
              <span className="text-xs text-spice-brown/70 flex items-center gap-1 font-semibold">
                <ChefHat className="w-3.5 h-3.5 text-spice-saffron" /> {recipe.difficulty}
              </span>
            </div>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown leading-tight">
              {recipe.title}
            </h2>
            <p className="text-xs text-spice-brown/80 leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* MAIN MASALA INGREDIENT IMAGE & BADGE (AS BEFORE) */}
          <div className="md:col-span-5 bg-white p-3.5 rounded-2xl border-2 border-spice-red/30 shadow-sm flex items-center gap-3">
            <img
              src={heroMasalaImage}
              onError={handleImageError}
              alt={heroMasalaName}
              className="w-16 h-16 object-contain shrink-0 border border-spice-brown/10 rounded-xl p-1 bg-spice-cream"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-spice-red block leading-tight">
                KEY MASALA INGREDIENT
              </span>
              <h4 className="font-serif font-bold text-sm text-spice-brown line-clamp-2">
                {heroMasalaName}
              </h4>
              {recipe.heroProduct && (
                <Link
                  to={`/products/${recipe.heroProduct.slug}`}
                  onClick={onClose}
                  className="text-[10px] font-bold text-spice-red hover:underline block mt-0.5"
                >
                  View Product Pack →
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* 3. INGREDIENTS & STEP-BY-STEP METHOD */}
        <div className="space-y-6 pt-2">
          
          {/* Ingredients List */}
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-spice-brown mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-spice-red inline-block" /> Recipe Ingredients
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {recipe.ingredients?.map((ing, i) => (
                <li
                  key={i}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    ing.isSubhadarshiniProduct
                      ? 'bg-spice-cream border-spice-red/30 text-spice-brown font-bold'
                      : 'bg-surface-50 border-spice-brown/10 text-spice-brown/90'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {ing.isSubhadarshiniProduct && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-spice-red shrink-0" />
                    )}
                    {ing.name}
                  </span>
                  <span className="text-spice-saffron font-bold">{ing.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cooking Instructions */}
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-spice-brown mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-spice-saffron inline-block" /> Step-by-Step Cooking Instructions
            </h3>
            <ol className="space-y-2.5 text-xs text-spice-brown/80">
              {recipe.instructions?.map((step, i) => (
                <li key={i} className="flex gap-3 bg-spice-cream/40 p-3 rounded-xl border border-spice-brown/5">
                  <span className="w-6 h-6 rounded-full bg-spice-saffron text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed text-spice-brown text-xs">{step}</p>
                </li>
              ))}
            </ol>
          </div>

        </div>

      </div>
    </div>
  );
};
