"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import {
  Heart,
  Layers,
  Search,
  PlusCircle,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSeedMsg("Demo Data Initialized!");
        setTimeout(() => setSeedMsg(""), 3000);
        window.location.reload();
      }
    } catch {
      setSeedMsg("Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "donor") return "/donor/dashboard";
    if (user.role === "ngo") return "/ngo/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-brand-700 transition-colors">
                  Share<span className="text-brand-600">Sphere</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200">
                  Algorithmic
                </span>
              </div>
              <p className="text-[11px] text-gray-500 -mt-1 hidden sm:block">
                Give what you can. Reach who needs it.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/explore"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/explore"
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <Search className="w-4 h-4" />
                <span>Explore Needs</span>
              </span>
            </Link>

            <Link
              href="/donate"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/donate"
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <PlusCircle className="w-4 h-4" />
                <span>Donate Items</span>
              </span>
            </Link>

            <Link
              href="/impact"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/impact"
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4" />
                <span>Verified Impact</span>
              </span>
            </Link>

            {/* Quick Demo Scenario Seeder Button */}
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              title="Preload Tech Mela test scenario (3 NGOs, 3 tiered blanket requirements)"
              className="text-xs px-2.5 py-1.5 rounded-lg font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center space-x-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{seeding ? "Seeding..." : seedMsg || "Seed Demo Data"}</span>
            </button>
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-500 bg-white hover:bg-brand-50/50 text-sm font-medium text-gray-800 transition"
                >
                  <User className="w-4 h-4 text-brand-600" />
                  <span>{user.name.split(" ")[0]}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      user.role === "ngo"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : "bg-brand-100 text-brand-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm hover:shadow transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Explore Needs
          </Link>
          <Link
            href="/donate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Donate Items
          </Link>
          <Link
            href="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Verified Impact
          </Link>
          <button
            onClick={handleSeedDemo}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200"
          >
            {seeding ? "Seeding..." : seedMsg || "Seed Tech Mela Demo Data"}
          </button>

          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-brand-700 bg-brand-50 rounded-lg"
                >
                  Dashboard ({user.name} - {user.role.toUpperCase()})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-center text-sm font-medium text-gray-700 bg-gray-50 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-center text-sm font-medium text-white bg-brand-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

