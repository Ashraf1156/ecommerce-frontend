import type { FC } from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Catalog } from "./pages/Catalog";
import { Login } from "./pages/admin/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { ResetPassword } from "./pages/admin/ResetPassword";
import { ProductDetails } from "./pages/ProductDetails";
import { Footer } from "./components/Footer";
import api from "./services/api";
import type { StoreSettings } from "./types";

function App() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get<StoreSettings>("/settings");
        setSettings(response.data);
      } catch (err) {
        console.error("Failed to load store settings", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Banner */}
        <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-center">
              <Link
                to="/"
                className="flex items-center gap-3 hover:opacity-90 transition-opacity justify-center w-full"
              >
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Store Logo" className="h-8 w-auto object-contain" />
                ) : (
                  <div className="rounded-xl bg-blue-600 p-2 text-white font-bold text-lg tracking-wider shadow-sm">
                    TD
                  </div>
                )}
                <span className="text-lg font-bold tracking-tight text-gray-900">
                  {settings?.websiteName || "TD E-Commerce Mobile"}
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Dynamic Route Viewport Mapping */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Catalog />} />
          </Routes>
        </div>

        <Footer settings={settings} />
      </div>
    </BrowserRouter>
  );
}

const AppEntry: FC = () => <App />;
export default AppEntry;
