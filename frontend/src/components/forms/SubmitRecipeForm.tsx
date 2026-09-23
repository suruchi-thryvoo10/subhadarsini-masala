import React, { useEffect, useRef, useState } from 'react';
import { ChefHat, Send, CheckCircle2, AlertCircle, ImagePlus, X } from 'lucide-react';
import { fetchApi } from '../../config/api';
import { Product } from '../../types';
import { displayProductName } from '../../utils/format';

type Values = {
  name: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  heroProduct: string;
  videoUrl: string;
};

const EMPTY: Values = {
  name: '',
  email: '',
  phone: '',
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  heroProduct: '',
  videoUrl: ''
};

/**
 * Downscale a chosen photo in the browser before it is sent.
 *
 * Keeps submissions small enough to store without a separate media service,
 * and means a 6MB phone photo does not fail the request.
 */
const toResizedDataUrl = (file: File, maxEdge = 1200): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That file does not look like an image'));
      image.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not process that image'));
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

const validate = (v: Values): Partial<Record<keyof Values, string>> => {
  const e: Partial<Record<keyof Values, string>> = {};
  if (v.name.trim().length < 2) e.name = 'Please tell us your name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Enter a valid email address';
  if (v.title.trim().length < 3) e.title = 'Recipe name is required';
  if (v.description.trim().length < 10) e.description = 'A sentence or two about the dish, please';
  if (v.ingredients.trim().length < 5) e.ingredients = 'List at least one ingredient';
  if (v.instructions.trim().length < 10) e.instructions = 'Add the cooking steps';
  if (v.videoUrl.trim() && !/^https?:\/\//i.test(v.videoUrl.trim())) e.videoUrl = 'Enter a full link starting with https://';
  return e;
};

export const SubmitRecipeForm: React.FC = () => {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [image, setImage] = useState<string>('');
  const [imageError, setImageError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchApi('/api/v1/products?limit=48')
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]));
  }, []);

  const set = (key: keyof Values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    try {
      const dataUrl = await toResizedDataUrl(file);
      if (dataUrl.length > 700_000) {
        setImageError('That photo is still too large. Please choose a smaller one.');
        return;
      }
      setImage(dataUrl);
    } catch (err: any) {
      setImageError(err?.message || 'Could not read that image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    setServerError(null);
    try {
      await fetchApi('/api/v1/recipes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, image }),
        timeoutMs: 30000
      });
      setStatus('sent');
      setValues(EMPTY);
      setImage('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: any) {
      setStatus('error');
      setServerError(err?.message || 'We could not send your recipe. Please try again.');
    }
  };

  const field = 'w-full px-4 py-2.5 text-sm rounded-xl bg-spice-cream border focus:outline-none transition-colors';
  const label = 'text-xs font-bold text-spice-brown uppercase tracking-wider block mb-1.5';
  const ok = 'border-spice-brown/15 focus:border-spice-saffron';

  if (status === 'sent') {
    return (
      <div className="bg-white rounded-3xl border border-spice-brown/10 shadow-sm p-10 text-center">
        <CheckCircle2 className="w-14 h-14 text-spice-red mx-auto" />
        <h3 className="font-serif font-bold text-2xl text-spice-brown mt-4">Recipe received</h3>
        <p className="text-sm text-spice-brown/75 mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for cooking with us. Our kitchen team reviews every submission before it is
          published, and we will be in touch.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 px-6 py-2.5 border border-spice-brown/20 text-spice-brown font-bold text-xs rounded-full hover:border-spice-red transition-colors"
        >
          Share another recipe
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-spice-brown/10 shadow-sm p-6 md:p-10">
      <div className="flex items-center gap-3 mb-2">
        <ChefHat className="w-6 h-6 text-spice-red" />
        <h2 className="font-serif font-bold text-2xl text-spice-brown">Share Your Recipe</h2>
      </div>
      <p className="text-sm text-spice-brown/70 mb-8 max-w-2xl leading-relaxed">
        Cooked something you are proud of with a Subhadarshini masala? Send it to us. Every recipe is
        read by our kitchen team before it appears on the site.
      </p>

      {status === 'error' && serverError && (
        <div className="mb-6 p-3 rounded-xl bg-brand-50 border border-brand-200 text-spice-red text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {([
          ['name', 'Your Name *', 'text', 'Your name'],
          ['email', 'Email *', 'email', 'you@example.com'],
          ['phone', 'Phone (optional)', 'tel', '+91 00000 00000'],
          ['title', 'Recipe Name *', 'text', 'e.g. Ama Ghara Dalma']
        ] as const).map(([key, labelText, type, placeholder]) => (
          <div key={key}>
            <label className={label} htmlFor={`recipe-${key}`}>{labelText}</label>
            <input
              id={`recipe-${key}`}
              type={type}
              value={values[key]}
              onChange={set(key)}
              placeholder={placeholder}
              aria-invalid={Boolean(errors[key])}
              className={`${field} ${errors[key] ? 'border-spice-red' : ok}`}
            />
            {errors[key] && <p className="text-[11px] text-spice-red mt-1">{errors[key]}</p>}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className={label} htmlFor="recipe-heroProduct">Subhadarshini Masala Used</label>
          <select
            id="recipe-heroProduct"
            value={values.heroProduct}
            onChange={set('heroProduct')}
            className={`${field} ${ok} cursor-pointer`}
          >
            <option value="">Select a product (optional)</option>
            {products.map((p) => (
              <option key={p._id} value={p.slug}>{displayProductName(p.name)}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="recipe-description">Description / Story *</label>
          <textarea
            id="recipe-description"
            rows={3}
            value={values.description}
            onChange={set('description')}
            placeholder="What is the dish, and what does it mean to you?"
            aria-invalid={Boolean(errors.description)}
            className={`${field} resize-none ${errors.description ? 'border-spice-red' : ok}`}
          />
          {errors.description && <p className="text-[11px] text-spice-red mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className={label} htmlFor="recipe-ingredients">Ingredients *</label>
          <textarea
            id="recipe-ingredients"
            rows={6}
            value={values.ingredients}
            onChange={set('ingredients')}
            placeholder={'One per line, e.g.\n1 cup toor dal\n2 tbsp Subhadarshini Dalma Masala'}
            aria-invalid={Boolean(errors.ingredients)}
            className={`${field} resize-none ${errors.ingredients ? 'border-spice-red' : ok}`}
          />
          {errors.ingredients && <p className="text-[11px] text-spice-red mt-1">{errors.ingredients}</p>}
        </div>

        <div>
          <label className={label} htmlFor="recipe-instructions">Cooking Instructions *</label>
          <textarea
            id="recipe-instructions"
            rows={6}
            value={values.instructions}
            onChange={set('instructions')}
            placeholder={'One step per line'}
            aria-invalid={Boolean(errors.instructions)}
            className={`${field} resize-none ${errors.instructions ? 'border-spice-red' : ok}`}
          />
          {errors.instructions && <p className="text-[11px] text-spice-red mt-1">{errors.instructions}</p>}
        </div>

        <div>
          <label className={label} htmlFor="recipe-image">Photo of the dish</label>
          {image ? (
            <div className="relative rounded-xl overflow-hidden border border-spice-brown/15">
              <img src={image} alt="Your dish" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => { setImage(''); if (fileRef.current) fileRef.current.value = ''; }}
                aria-label="Remove photo"
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-spice-brown hover:text-spice-red"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="recipe-image"
              className={`${field} ${ok} flex items-center gap-2 cursor-pointer text-spice-brown/60`}
            >
              <ImagePlus className="w-4 h-4" /> Choose a photo
            </label>
          )}
          <input
            ref={fileRef}
            id="recipe-image"
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
          {imageError && <p className="text-[11px] text-spice-red mt-1">{imageError}</p>}
        </div>

        <div>
          <label className={label} htmlFor="recipe-videoUrl">Cooking Video Link (optional)</label>
          <input
            id="recipe-videoUrl"
            type="url"
            value={values.videoUrl}
            onChange={set('videoUrl')}
            placeholder="YouTube or Instagram link"
            aria-invalid={Boolean(errors.videoUrl)}
            className={`${field} ${errors.videoUrl ? 'border-spice-red' : ok}`}
          />
          {errors.videoUrl && <p className="text-[11px] text-spice-red mt-1">{errors.videoUrl}</p>}
        </div>

        <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="px-8 py-3.5 rounded-xl bg-spice-brown hover:bg-spice-red disabled:bg-surface-300 disabled:text-ink-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Sending…' : 'Submit Recipe'}
          </button>
          <p className="text-[11px] text-ink-500">
            Submissions are reviewed before publishing. We may contact you about your recipe.
          </p>
        </div>
      </form>
    </div>
  );
};
