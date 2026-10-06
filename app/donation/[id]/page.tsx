"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DonationRedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      router.replace(`/track/${params.id}`);
    }
  }, [params.id, router]);

  return (
    <div className="py-24 text-center space-y-2">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-xs text-gray-500">Redirecting to donation tracking console...</p>
    </div>
  );
}

