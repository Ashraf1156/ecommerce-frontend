import type { FC } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, MessageSquare, Shield, Clock } from "lucide-react";
import type { StoreSettings } from "../types";

interface FooterProps {
  settings?: StoreSettings | null;
}

export const Footer: FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 !text-slate-300 pt-16 pb-8 mt-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold !text-white tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {settings?.websiteName || "TD E-Commerce"}
            </h3>
            <p className="text-xs sm:text-sm !text-slate-300 leading-relaxed whitespace-pre-wrap">
              {settings?.footerDescription || "Your premium destination for hand-tested, verified new and pre-owned smartphones and premium accessories."}
            </p>
            <div className="flex items-center gap-2 text-xs !text-slate-300">
              <Clock size={14} className="text-indigo-400" />
              <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold !text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById("catalog-grid");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }
                  }}
                  className="!text-slate-300 hover:!text-white transition-colors cursor-pointer"
                >
                  Explore Catalog
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings?.whatsappNumber || "918074029899"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!text-slate-300 hover:!text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageSquare size={14} className="text-green-500" />
                  <span>WhatsApp Shop</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold !text-white uppercase tracking-wider mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${settings?.contactPhone || "+918074029899"}`} className="!text-slate-300 hover:!text-white transition-colors">
                    {settings?.contactPhone || "+91 80740 29899"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="!text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {settings?.contactAddress || "TD E-Commerce Store,\nMain Road Market,\nHyderabad, Telangana, India"}
                </span>
              </li>
            </ul>
          </div>

          {/* Administration Access */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold !text-white uppercase tracking-wider mb-4">
              Management Portal
            </h4>
            <p className="text-xs !text-slate-300 leading-relaxed">
              Authorized admin access to manage store inventory, categories, and homepage slides.
            </p>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 !text-slate-300 hover:!text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
            >
              <Shield size={14} className="text-blue-500" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs !text-slate-400">
          <p className="!text-slate-400">© {new Date().getFullYear()} {settings?.websiteName || "TD E-Commerce"}. All rights reserved.</p>
          <div className="flex gap-6 !text-slate-400">
            <span className="hover:!text-white transition-colors select-none cursor-default">Handcrafted Quality</span>
            <span className="text-slate-800">|</span>
            <span className="hover:!text-white transition-colors select-none cursor-default">Secure R2 Cloud Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
