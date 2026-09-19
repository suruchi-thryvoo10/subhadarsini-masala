import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { Product, Category } from '../types';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentPage = Number(searchParams.get('page') || '1');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        category: currentCategory,
        search: currentSearch,
        sort: currentSort,
        page: String(currentPage),
        limit: '24'
      }).toString();

      const res = await fetch(`/api/v1/products?${query}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotal(data.meta?.total || data.data.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug) {
      newParams.set('category', categorySlug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sortValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortValue);
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchVal = formData.get('searchVal')?.toString() || '';
    const newParams = new URLSearchParams(searchParams);
    if (searchVal) newParams.set('search', searchVal);
    else newParams.delete('search');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-spice-brown">
            Product Catalogue
          </h1>
          <p className="text-sm text-spice-brown/70 mt-1">
            Browse our range of pure stone-ground spices, traditional blends, and specialty foods.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-spice-brown/10 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                !currentCategory
                  ? 'bg-spice-red text-white shadow-sm'
                  : 'bg-spice-beige text-spice-brown hover:bg-spice-saffron/20'
              }`}
            >
              All Spices
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                  currentCategory === cat.slug
                    ? 'bg-spice-red text-white shadow-sm'
                    : 'bg-spice-beige text-spice-brown hover:bg-spice-saffron/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearchChange} className="relative flex-1 md:w-64">
              <input
                type="text"
                name="searchVal"
                defaultValue={currentSearch}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-spice-beige border border-spice-brown/15 focus:outline-none focus:border-spice-saffron"
              />
              <Search className="w-3.5 h-3.5 text-spice-brown/50 absolute left-3 top-2.5" />
            </form>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-spice-beige border border-spice-brown/15 text-spice-brown text-xs font-bold py-2 pl-3 pr-8 rounded-full focus:outline-none focus:border-spice-saffron cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-spice-brown/60 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-80 bg-white/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-spice-brown/10 p-8">
            <h3 className="font-serif font-bold text-xl text-spice-brown mb-2">No products found</h3>
            <p className="text-xs text-spice-brown/70 mb-4">Try clearing search keywords or selecting a different category.</p>
            <button
              onClick={() => handleCategorySelect('')}
              className="px-6 py-2.5 bg-spice-red text-white font-bold text-xs rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
