"use client";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";

export default function HideFooterOnAdmin() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Server-side rendering sırasında hiçbir şey render etme
  if (!mounted) {
    return null;
  }

  // Sadece /admin ve altı sayfalarda footer'ı gösterme
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}