import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Cpu, MapPin, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white/20 stroke-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Share<span className="text-brand-400">Sphere</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              "Give what you can. Reach who needs it."
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              A smart donation management and distribution platform connecting donors with NGOs
              based on verifiable real-time requirements.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/80 text-brand-300 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>100% Transparent Algorithmic Logic</span>
            </div>
          </div>

          {/* Core Innovations */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              5 Core Innovations
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Weighted Multi-Criteria Matching (30/25/20/15/10)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Multi-NGO Algorithmic Allocation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Haversine Spatial Proximity Matching</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Cryptographic QR Lifecycle Tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Verifiable Proof of Community Impact</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/explore" className="hover:text-brand-400 transition">
                  Explore NGO Needs
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-brand-400 transition">
                  Create a Donation
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-brand-400 transition">
                  Verified Impact Metrics
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-400 transition">
                  Donor & NGO Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-brand-400 transition">
                  Admin Verification Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Algorithmic Integrity Guarantee */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Integrity Standard
            </h4>
            <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/60 space-y-2 text-xs text-gray-300">
              <div className="flex items-center space-x-2 text-brand-400 font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Zero AI / Zero ML Architecture</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                All match scores, priority rankings, distance calculations, and distribution plans
                are calculated strictly via mathematical formulas and verified MongoDB transactions.
                No black-box models or hallucinated estimates.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} ShareSphere Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built with Next.js, TypeScript & MongoDB for high-impact social welfare.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

