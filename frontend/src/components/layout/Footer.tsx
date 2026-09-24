import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Award, Heart, Instagram, Facebook, Globe } from 'lucide-react';
import { CONTACT } from '../../config/contact';
import { useT } from '../../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const t = useT();
  return (
    <footer className="bg-spice-dark text-white pt-16 pb-8 border-t-4 border-spice-turmeric">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center shrink-0">
              <img
                src="/images/brand/logo.webp"
                alt="Subhadarshini Spices & Foods"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-spice-beige/80 leading-relaxed max-w-sm">
              Subhadarshini Spices & Foods brings authentic Indian culinary traditions to your kitchen. Stone-ground, 100% pure, farm-sourced spices processed with uncompromising hygienic quality standards.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-spice-turmeric font-semibold">
                <ShieldCheck className="w-4 h-4" /> Lab Certified Pure
              </div>
              <div className="flex items-center gap-1.5 text-xs text-spice-turmeric font-semibold">
                <Award className="w-4 h-4" /> FSSAI Licensed
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-spice-turmeric text-sm tracking-wider uppercase mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-xs text-spice-beige/80">
              <li><Link to="/products" className="hover:text-spice-turmeric transition-colors">All Products</Link></li>
              <li><Link to="/products?category=blended-spices" className="hover:text-spice-turmeric transition-colors">Blended Masalas</Link></li>
              <li><Link to="/products?category=basic-spices" className="hover:text-spice-turmeric transition-colors">Basic Ground Spices</Link></li>
              <li><Link to="/recipes" className="hover:text-spice-turmeric transition-colors">Recipes & AI Assistant</Link></li>
              <li><Link to="/quality" className="hover:text-spice-turmeric transition-colors">Batch Quality Lookup</Link></li>
            </ul>
          </div>

          {/* Company & Business */}
          <div>
            <h4 className="font-serif font-bold text-spice-turmeric text-sm tracking-wider uppercase mb-4">
              {t('footer.company')}
            </h4>
            <ul className="space-y-2.5 text-xs text-spice-beige/80">
              <li><Link to="/about" className="hover:text-spice-turmeric transition-colors">Our Story & Manufacturing</Link></li>
              <li><Link to="/dealers" className="hover:text-spice-turmeric transition-colors">Dealer Locator</Link></li>
              <li><Link to="/wholesale" className="hover:text-spice-turmeric transition-colors">B2B & Wholesale Enquiries</Link></li>
              <li><Link to="/careers" className="hover:text-spice-turmeric transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-spice-turmeric transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-spice-turmeric text-sm tracking-wider uppercase mb-4">
              {t('footer.contactUs')}
            </h4>
            <ul className="space-y-3 text-xs text-spice-beige/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-spice-turmeric shrink-0 mt-0.5" />
                <span>{CONTACT.addressFull}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-spice-turmeric shrink-0" />
                <a href={CONTACT.phoneHref} className="hover:text-spice-turmeric transition-colors">{CONTACT.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-spice-turmeric shrink-0" />
                <a href={CONTACT.emailHref} className="hover:text-spice-turmeric transition-colors">{CONTACT.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-spice-turmeric shrink-0" />
                <a
                  href={CONTACT.websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-spice-turmeric transition-colors"
                >
                  {CONTACT.website}
                </a>
              </li>
            </ul>

            <h4 className="font-serif font-bold text-spice-turmeric text-sm tracking-wider uppercase mt-8 mb-4">
              {t('footer.followUs')}
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={CONTACT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subhadarshini on Instagram"
                className="w-10 h-10 rounded-full border border-spice-cream/20 flex items-center justify-center text-spice-cream hover:bg-spice-red hover:border-spice-red transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={CONTACT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subhadarshini on Facebook"
                className="w-10 h-10 rounded-full border border-spice-cream/20 flex items-center justify-center text-spice-cream hover:bg-spice-red hover:border-spice-red transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-spice-beige/60 gap-4">
          <p>© 2026 Subhadarshini Spices & Foods Pvt. Ltd. {t('footer.rights')}</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span> <Heart className="w-3.5 h-3.5 text-spice-red fill-spice-red" /> <span>for Authentic Indian Kitchens</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
