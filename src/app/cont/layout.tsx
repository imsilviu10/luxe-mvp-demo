"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

type DemoAccount = {
  name?: string;
  email?: string;
  role?: "user" | "advertiser" | "admin";
  roleLabel?: string;
  loggedInAt?: string;
};

export default function AdvertiserAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [account, setAccount] = useState<DemoAccount | null>(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem("luxe_demo_account");
    const savedRole = localStorage.getItem("luxe_demo_role");

    if (!savedAccount || savedRole !== "advertiser") {
      setHasAccess(false);
      setAccount(null);
      setIsChecking(false);
      return;
    }

    try {
      const parsedAccount = JSON.parse(savedAccount) as DemoAccount;

      if (parsedAccount.role === "advertiser") {
        setAccount(parsedAccount);
        setHasAccess(true);
      } else {
        setAccount(null);
        setHasAccess(false);
      }
    } catch {
      setAccount(null);
      setHasAccess(false);
    }

    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Verificare acces
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Verificăm zona advertiserului...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

          <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 text-3xl">
              🔒
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Acces advertiser
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Zona aceasta este pentru advertiseri.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Pentru a vedea contul advertiserului, statusul anunțului și plata,
              trebuie să intri cu un cont de tip advertiser.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Link
                href="/autentificare"
                className="rounded-full bg-rose-500 px-6 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Intră ca advertiser
              </Link>

              <Link
                href="/inregistrare"
                className="rounded-full bg-white px-6 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Creează cont advertiser
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Vezi profiluri
              </Link>
            </div>

            <div className="mt-8 rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-5 text-left">
              <h2 className="text-xl font-bold text-sky-200">
                Pentru demo rapid
              </h2>

              <p className="mt-3 text-sm leading-7 text-sky-100/70">
                Intră pe pagina de autentificare și folosește butonul demo
                „Intră ca Advertiser”. După login, revino aici și vei avea acces
                la contul advertiserului.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-white/50">
              <Link href="/" className="hover:text-white">
                Acasă
              </Link>

              <span>•</span>

              <Link href="/autentificare" className="hover:text-white">
                Login
              </Link>

              <span>•</span>

              <Link href="/prezentare" className="hover:text-white">
                Prezentare MVP
              </Link>

              <span>•</span>

              <Link href="/admin-login-luxe" className="hover:text-white">
                Admin demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <div className="border-b border-emerald-500/20 bg-emerald-500/10 px-6 py-3 text-center text-sm text-emerald-100/80">
        Cont advertiser activ
        {account?.name ? `: ${account.name}` : ""} — ai acces la zona de
        publicare, status și plată demo.
      </div>

      {children}
    </>
  );
}