"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DraftAd = {
  displayName?: string;
  age?: string;
  city?: string;
  phone?: string;
  description?: string;
  selectedPackage?: {
    name: string;
    duration: string;
    label: string;
  };
  photoNames?: string[];
};

export default function PublishedAdPage() {
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);

  useEffect(() => {
    const savedAd = localStorage.getItem("luxe_draft_ad");

    if (savedAd) {
      setDraftAd(JSON.parse(savedAd));
    }

    localStorage.setItem("luxe_ad_published", "true");
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.25),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(244,63,94,0.18),_transparent_30%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Acasă
            </Link>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/admin" className="hover:text-white">
              Admin
            </Link>
          </div>

          <Link
            href="/profiluri"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Vezi profiluri
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              Anunț publicat
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Anunțul tău este acum activ pe Luxe.ro.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Plata demo a fost confirmată, iar anunțul este marcat ca publicat.
              În versiunea finală, acest pas va activa automat profilul în baza
              de date și îl va afișa în listările publice.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/profiluri"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Vezi profiluri
              </Link>

              <Link
                href="/publica-anunt"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Publică alt anunț
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Profil publicat
          </p>

          <h2 className="mt-3 text-3xl font-bold">Preview anunț activ</h2>

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
            <div className="relative flex h-80 items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-7xl">
              ✦

              <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                Activ
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-rose-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                {draftAd?.selectedPackage?.name || "Standard"}
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                Verificat 18+
              </div>

              <h3 className="text-3xl font-bold">
                {draftAd?.displayName || "Anunț demo"}
              </h3>

              <p className="mt-2 text-white/50">
                {draftAd?.age || "--"} ani • {draftAd?.city || "Oraș neales"}
              </p>

              <p className="mt-5 leading-8 text-white/70">
                {draftAd?.description ||
                  "Descrierea anunțului va apărea aici după completarea formularului."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button className="rounded-full border border-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  Chat
                </button>

                <button className="rounded-full bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/80">
                  Vezi profil
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Status final
            </p>

            <h2 className="mt-3 text-2xl font-bold">Publicare completă</h2>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="font-semibold text-emerald-300">
                  1. Verificare 18+ aprobată
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="font-semibold text-emerald-300">
                  2. Moderare aprobată
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="font-semibold text-emerald-300">
                  3. Plată confirmată
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="font-semibold text-emerald-300">
                  4. Anunț publicat
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Detalii pachet</h2>

            <div className="mt-5 space-y-4 text-sm text-white/60">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Pachet</span>
                <span className="text-white">
                  {draftAd?.selectedPackage?.name || "-"}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Durată</span>
                <span className="text-white">
                  {draftAd?.selectedPackage?.duration || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total plătit</span>
                <span className="font-bold text-rose-300">
                  {draftAd?.selectedPackage?.label || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-200">
              Demo local
            </h2>

            <p className="mt-3 text-sm leading-7 text-amber-100/70">
              În acest moment anunțul este publicat doar ca demo local. Mai
              târziu îl salvăm în baza de date și îl afișăm automat în pagina de
              profiluri.
            </p>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — Platformă 18+ pentru utilizatori adulți.
      </footer>
    </main>
  );
}