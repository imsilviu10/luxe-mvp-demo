"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("luxe_demo_role");
    const savedAccount = localStorage.getItem("luxe_demo_account");

    if (!savedRole || !savedAccount) {
      setHasAccess(false);
      setIsChecking(false);
      return;
    }

    try {
      const account = JSON.parse(savedAccount);

      if (savedRole === "admin" && account.role === "admin") {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      setHasAccess(false);
      setIsChecking(false);
    } catch {
      setHasAccess(false);
      setIsChecking(false);
    }
  }, []);

  function goToAdminLogin() {
    router.push("/admin-login-luxe");
  }

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-6 text-white">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
          <p className="text-lg font-semibold">Verificăm accesul admin...</p>
        </div>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

          <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/20 text-3xl">
              !
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Acces restricționat
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Adminul nu este disponibil public.
            </h1>

            <p className="mx-auto mt-5 max-w-xl leading-8 text-white/60">
              Pentru a accesa panoul admin, trebuie să intri prin pagina internă
              de login admin. Utilizatorii și advertiserii nu pot intra aici.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToAdminLogin}
                className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
              >
                Login admin
              </button>

              <Link
                href="/autentificare"
                className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Login public
              </Link>

              <Link
                href="/"
                className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Acasă
              </Link>
            </div>

            <div className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-left">
              <h2 className="font-bold text-amber-200">Notă demo</h2>

              <p className="mt-2 text-sm leading-7 text-amber-100/70">
                Această protecție este făcută cu localStorage pentru demo. În
                versiunea reală, accesul admin trebuie verificat pe server, cu
                sesiuni securizate și permisiuni reale.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}