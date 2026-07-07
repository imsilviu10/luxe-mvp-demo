"use client";

import Link from "next/link";
import { useState } from "react";

const demoKeys = [
  "luxe_adult_confirmed",
  "luxe_draft_ad",
  "luxe_verification_draft",
  "luxe_admin_status",
  "luxe_payment_status",
  "luxe_ad_published",
  "luxe_last_report",
  "luxe_cookie_consent",
  "luxe_cookie_preferences",
  "luxe_demo_account",
  "luxe_demo_role",
];

export default function ResetDemoPage() {
  const [resetDone, setResetDone] = useState(false);

  function resetDemo() {
    demoKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    setResetDone(true);
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

        <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl">
            ↺
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Reset demo
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Resetează demo-ul Luxe.ro.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
            Acest buton șterge datele salvate local în browser: confirmarea
            18+, anunțul demo, verificarea, statusul admin, plata, profilul
            publicat, raportările, preferințele de cookies și loginul demo.
          </p>

          {resetDone ? (
            <div className="mt-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
              <h2 className="text-2xl font-bold text-emerald-300">
                Demo resetat cu succes.
              </h2>

              <p className="mt-3 leading-7 text-emerald-100/70">
                Toate datele demo au fost șterse din localStorage. Acum dacă
                intri pe /admin fără login admin, trebuie să apară acces
                restricționat.
              </p>
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
              <h2 className="text-2xl font-bold text-amber-200">Atenție</h2>

              <p className="mt-3 leading-7 text-amber-100/70">
                Resetarea afectează doar datele din browserul tău. Într-o
                versiune reală, aceste date vor fi salvate în baza de date și
                administrate separat.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={resetDemo}
              className="rounded-full bg-rose-500 px-8 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Resetează demo-ul
            </button>

            <Link
              href="/admin"
              className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
            >
              Testează /admin
            </Link>

            <Link
              href="/admin-login-luxe"
              className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Login admin
            </Link>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/30 p-5 text-left">
            <h3 className="font-bold">Chei șterse:</h3>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {demoKeys.map((key) => (
                <div
                  key={key}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60"
                >
                  {key}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-white/50">
            <Link href="/" className="hover:text-white">
              Acasă
            </Link>

            <span>•</span>

            <Link href="/autentificare" className="hover:text-white">
              Login public
            </Link>

            <span>•</span>

            <Link href="/admin-login-luxe" className="hover:text-white">
              Login admin
            </Link>

            <span>•</span>

            <Link href="/termeni" className="hover:text-white">
              Termeni
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}