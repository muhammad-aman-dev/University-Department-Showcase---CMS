"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  fallbackUrl = "/research",
  label = "Go back",
}) {
  const router = useRouter();

  function handleBack() {
    try {
      const referrer = document.referrer;

      if (referrer) {
        try {
          const previousUrl = new URL(referrer);

          if (previousUrl.origin === window.location.origin) {
            router.back();
            return;
          }
        } catch (error) {
          console.error("Failed to parse referrer URL:", error);
        }
      }

      router.push(fallbackUrl);
    } catch (error) {
      console.error("Back navigation failed:", error);
      window.location.href = fallbackUrl;
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-amber-400"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}