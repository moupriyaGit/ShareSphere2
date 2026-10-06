"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Heart, Lock, Mail, ArrowRight, AlertCircle, Sparkles, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    if (!loginEmail || !loginPass) {
      setErrorMsg("Please fill in email and password");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user);

      // Redirect by role
      if (data.user.role === "donor") {
        router.push("/donor/dashboard");
      } else if (data.user.role === "ngo") {
        router.push("/ngo/dashboard");
      } else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    handleSubmit(undefined, quickEmail, quickPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-600/30">
            <Heart className="w-6 h-6 fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome to ShareSphere
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to manage donations, requirements, or track real impact
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-lg transition text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to ShareSphere"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Tech Mela 1-Click Demo Profiles */}
        <div className="pt-4 border-t border-gray-100 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Demo Profiles (Tech Mela)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("donor@sharesphere.org", "password123")}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-brand-500 bg-gray-50/80 hover:bg-brand-50/50 text-left transition font-medium text-gray-800"
            >
              <div className="font-bold text-brand-700">Donor</div>
              <div className="text-[11px] text-gray-500">Rajesh Sharma</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("hope@ngo.org", "password123")}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-brand-500 bg-gray-50/80 hover:bg-brand-50/50 text-left transition font-medium text-gray-800"
            >
              <div className="font-bold text-purple-700">NGO A</div>
              <div className="text-[11px] text-gray-500">Hope Foundation</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("care@ngo.org", "password123")}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-brand-500 bg-gray-50/80 hover:bg-brand-50/50 text-left transition font-medium text-gray-800"
            >
              <div className="font-bold text-blue-700">NGO B</div>
              <div className="text-[11px] text-gray-500">Care India Relief</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin@sharesphere.org", "password123")}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-brand-500 bg-gray-50/80 hover:bg-brand-50/50 text-left transition font-medium text-gray-800"
            >
              <div className="font-bold text-red-700">Admin</div>
              <div className="text-[11px] text-gray-500">Verification Hub</div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Register as a Donor or NGO
          </Link>
        </div>
      </div>
    </div>
  );
}

