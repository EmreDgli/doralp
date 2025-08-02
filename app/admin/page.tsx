"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div style={{ maxWidth: 600, margin: "100px auto", padding: 24 }}>
      <h1>Admin Paneli</h1>
      <p>Başarıyla giriş yaptınız!</p>
      <button 
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Çıkış Yap
      </button>
    </div>
  );
}
