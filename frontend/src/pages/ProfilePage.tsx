import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { useSeo } from '../hooks/useSeo';

export const ProfilePage: React.FC = () => {
  useSeo({ title: 'My Account', description: 'Your Subhadarshini account.', path: '/profile', noIndex: true });

  const { user, token, logout } = useAuth();
  const { wishlist } = useWishlist();

  

  if (!user) {
    return (
      <div className="bg-spice-cream min-h-screen py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-spice-brown mb-4">Please Log In</h2>
        <Link to="/login" className="px-6 py-2.5 bg-spice-red text-white font-bold text-xs rounded-full">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-spice-cream min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-spice-brown/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-spice-red text-white font-serif text-3xl font-bold flex items-center justify-center">
              {user.name[0]}
            </div>
            <div>
              <span className="bg-brand-50 text-spice-red font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                {user.role}
              </span>
              <h1 className="font-serif font-bold text-2xl text-spice-brown mt-1">{user.name}</h1>
              <p className="text-xs text-ink-500">{user.email} • {user.phone || 'No phone registered'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-spice-beige border border-spice-brown/20 text-spice-brown font-bold text-xs rounded-full hover:bg-spice-red hover:text-white transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Saved Wishlist */}
        <div>
          <h2 className="font-serif font-bold text-xl text-spice-brown flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-spice-red" /> Saved Wishlist ({wishlist.length})
          </h2>
          {wishlist.length === 0 ? (
            <p className="text-xs text-ink-500 bg-white p-8 rounded-3xl text-center border border-spice-brown/10">
              Your wishlist is currently empty. Click the heart icon on any product to save it here.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
