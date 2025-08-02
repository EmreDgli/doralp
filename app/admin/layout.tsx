"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { User } from "@supabase/supabase-js";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Login sayfası için authentication kontrolü yapma
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    // Mevcut oturumu kontrol et
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Kullanıcı giriş yapmamış - login sayfasına yönlendir
        router.push("/admin/login");
        return;
      }
      
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/admin/login");
        } else if (session?.user) {
          setUser(session.user);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  // Login sayfası için sadece children'ı render et
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router zaten login'e yönlendirecek
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: 240, minWidth: 200 }}>
        <AdminSidebar />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
