import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { fetchApi } from '../config/api';
import { resolveImageUrl, handleImageError } from '../config/images';
import { Reveal, StaggerGroup, StaggerItem } from '../components/ui/Reveal';
import { useSeo, breadcrumbSchema } from '../hooks/useSeo';
import { useCategoryName } from '../i18n/categories';

export const CategoryPage: React.FC = () => {
  const categoryName = useCategoryName();
  const { slug } = useParams<{ slug: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [siblings, setSiblings] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: category ? category.name : 'Category',
    description:
      category?.description ||
      'Explore the Subhadarshini range of pure, stone-ground masalas and whole spices.',
    path: `/category/${slug}`,
    image: category?.image,
    structuredData: category
      ? breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: category.name, path: `/category/${category.slug}` }
        ])
      : undefined
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      window.scrollTo({ top: 0 });
      try {
        const [catData, allCats] = await Promise.all([
          fetchApi(`/api/v1/categories/${slug}`),
          fetchApi('/api/v1/categories').catch(() => ({ data: [] }))
        ]);

        setCategory(catData.data.category);
        setProducts(catData.data.products || []);
        setSiblings(allCats.data || []);
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Unable to load this category.');
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-spice-cream min-h-screen">
        <div className="h-72 bg-spice-brown/10 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 bg-white/60 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="bg-spice-cream min-h-screen py-24 px-4">
        <div className="max-w-lg mx-auto text-center bg-white rounded-2xl border border-spice-brown/10 p-10">
          <h1 className="font-serif text-2xl font-bold text-spice-brown mb-2">Category not available</h1>
          <p className="text-xs text-spice-brown/70 mb-6">{error || 'We could not find this category.'}</p>
          <Link
            to="/products"
            className="px-6 py-2.5 bg-spice-red text-white text-xs font-bold rounded-full inline-block"
          >
            Browse the full catalogue
          </Link>
        </div>
      </div>
    );
  }

  const highlights = category.highlights?.length
    ? category.highlights
    : ['Lab tested every batch', 'No added colour or starch', 'Sealed for freshness'];

  return (
    <div className="bg-spice-cream min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-spice-brown text-white">
        

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <Reveal from="right">
            <nav className="text-[11px] text-spice-beige/70 mb-4 flex items-center gap-2">
              <Link to="/" className="hover:text-spice-turmeric">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-spice-turmeric">Products</Link>
              <span>/</span>
              <span className="text-spice-turmeric font-bold">{categoryName(category.slug, category.name)}</span>
            </nav>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-spice-cream leading-tight">
              {categoryName(category.slug, category.name)}
            </h1>

            {category.tagline && (
              <p className="text-base sm:text-lg text-spice-turmeric/90 font-serif italic mt-3 max-w-xl">
                {category.tagline}
              </p>
            )}

            {category.description && (
              <p className="text-sm text-spice-beige/80 mt-4 leading-relaxed max-w-xl">
                {category.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6">
              {highlights.map((point) => (
                <span key={point} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-spice-cream">
                  <CheckCircle2 className="w-3.5 h-3.5 text-spice-turmeric shrink-0" />
                  {point}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <span className="px-4 py-2 rounded-full bg-spice-saffron/20 text-spice-turmeric text-xs font-bold">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </span>
              <Link
                to="/quality"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-spice-cream text-spice-brown text-xs font-bold hover:bg-white transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Verify a batch
              </Link>
            </div>
          </Reveal>

          <Reveal from="left" delay={0.1} className="hidden lg:block">
            <div className="relative aspect-square max-w-sm ml-auto rounded-3xl bg-spice-cream/10 border border-spice-cream/15 backdrop-blur-sm p-8">
              <img
                src={resolveImageUrl(category.image)}
                onError={handleImageError}
                alt={category.name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sibling category strip */}
      {siblings.length > 1 && (
        <div className="bg-white border-b border-spice-brown/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {siblings.map((sib) => (
              <Link
                key={sib._id}
                to={`/category/${sib.slug}`}
                className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                  sib.slug === category.slug
                    ? 'bg-spice-red text-white shadow-sm'
                    : 'bg-spice-beige text-spice-brown hover:bg-spice-saffron/20'
                }`}
              >
                {sib.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center bg-white rounded-2xl border border-spice-brown/10 p-12">
            <h2 className="font-serif font-bold text-xl text-spice-brown mb-2">Nothing here yet</h2>
            <p className="text-xs text-spice-brown/70">
              Products in this category are on the way. Check back shortly.
            </p>
          </div>
        ) : (
          <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <StaggerItem key={product._id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        <Reveal className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-spice-red font-bold text-sm hover:underline"
          >
            Browse the full catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
};
