"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type UserRole = "user" | "advertiser" | "admin";

type DemoAccount = {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  roleLabel?: string;
};

type DraftAd = {
  displayName?: string;
  age?: string | number;
  city?: string;
  phone?: string;
  description?: string;
  ownerName?: string;
  ownerEmail?: string;
  createdAt?: string;
  selectedPackage?: {
    id?: string;
    title?: string;
    name?: string;
    label?: string;
    price?: number;
    priceRon?: number;
    amount?: number;
    duration?: string;
    days?: number;
    features?: string[];
  };
};

function readJson<T>(key: string): T | null {
  const savedValue = localStorage.getItem(key);

  if (!savedValue) {
    return null;
  }

  try {
    return JSON.parse(savedValue) as T;
  } catch {
    return null;
  }
}

function getPackageTitle(draftAd?: DraftAd | null) {
  return (
    draftAd?.selectedPackage?.title ||
    draftAd?.selectedPackage?.name ||
    draftAd?.selectedPackage?.label ||
    "Pachet neselectat"
  );
}

function getPackagePrice(draftAd?: DraftAd | null) {
  return (
    draftAd?.selectedPackage?.price ??
    draftAd?.selectedPackage?.priceRon ??
    draftAd?.selectedPackage?.amount ??
    0
  );
}

function getPackageDuration(draftAd?: DraftAd | null) {
  if (draftAd?.selectedPackage?.duration) {
    return draftAd.selectedPackage.duration;
  }

  if (draftAd?.selectedPackage?.days) {
    return `${draftAd.selectedPackage.days} zile`;
  }

  return "Durată neselectată";
}

function formatDate(value?: string) {
  if (!value) {
    return "Nedisponibil";
  }

  try {
    return new Intl.DateTimeFormat("ro-RO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Nedisponibil";
  }
}

export default function PublishedAdPage() {
  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [publishedAt, setPublishedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAccount = readJson<DemoAccount>("luxe_demo_account");
    const savedDraft = readJson<DraftAd>("luxe_draft_ad");

    if (savedDraft) {
      localStorage.setItem("luxe_payment_status", "paid");
      localStorage.setItem("luxe_ad_published", "true");
      localStorage.setItem("luxe_admin_status", "payment");

      const existingPublishedAt =
        localStorage.getItem("luxe_ad_published_at") || new Date().toISOString();

      localStorage.setItem("luxe_ad_published_at", existingPublishedAt);
      setPublishedAt(existingPublishedAt);
    }

    setAccount(savedAccount);
    setDraftAd(savedDraft);
    setIsLoading(false);
  }, []);

  const packageTitle = getPackageTitle(draftAd);
  const packagePrice = getPackagePrice(draftAd);
  const packageDuration = getPackageDuration(draftAd);

  const profileTitle = useMemo(() => {
    if (!draftAd) {
      return "Profil Luxe";
    }

    return `${draftAd.displayName || "Profil Luxe"}${
      draftAd.age ? `, ${draftAd.age}` : ""
    }`;
  }, [draftAd]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Se încarcă
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Pregătim confirmarea publicării...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  if (!draftAd) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-3xl">
              ⚠️
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Anunț indisponibil
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Nu există un anunț pentru publicare.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Pentru a ajunge aici, advertiserul trebuie să creeze un anunț, să
              trimită verificarea 18+, să primească aprobarea adminului și să
              confirme plata demo.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/publica-anunt"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Publică anunț
              </Link>

              <Link
                href="/cont"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Dashboard advertiser
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Profiluri
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(244,63,94,0.24),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              Anunț publicat
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/profil/anunt-publicat-demo" className="hover:text-white">
              Profil public
            </Link>

            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/cont" className="hover:text-white">
              Dashboard
            </Link>

            <Link href="/cont/anunt" className="hover:text-white">
              Status anunț
            </Link>
          </div>

          <Link
            href="/profil/anunt-publicat-demo"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Vezi profilul
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              Plata demo confirmată
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Anunțul tău este public pe Luxe.ro.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Flow-ul demo este complet: anunț creat, verificare 18+ trimisă,
              moderare admin, plată confirmată și profil publicat în lista de
              profiluri.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/profil/anunt-publicat-demo"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Vezi profilul public
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Vezi în lista profiluri
              </Link>

              <Link
                href="/cont"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Dashboard advertiser
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                  Progres publicare
                </p>

                <h2 className="mt-3 text-4xl font-bold">100%</h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-400 text-2xl font-bold text-black">
                ✓
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full rounded-full bg-emerald-400" />
            </div>

            <p className="mt-5 leading-7 text-emerald-100/75">
              Profilul este activ public și poate fi accesat din lista de
              profiluri, din dashboard și din linkul direct.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-xs text-emerald-100/50">Status</p>
                <p className="mt-2 font-semibold text-white">Public</p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-xs text-emerald-100/50">Plată</p>
                <p className="mt-2 font-semibold text-white">Achitată</p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-xs text-emerald-100/50">Chat</p>
                <p className="mt-2 font-semibold text-white">Activ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Profil publicat
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Link
                href="/profil/anunt-publicat-demo"
                className="flex aspect-[4/5] items-center justify-center rounded-[2rem] border border-white/10 bg-black/30 transition hover:bg-black/20"
              >
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-500/10 text-4xl">
                    ✦
                  </div>

                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-white/35">
                    Galerie demo
                  </p>

                  <p className="mt-3 text-xs font-semibold text-white/35">
                    Click pentru profil
                  </p>
                </div>
              </Link>

              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Activ
                  </span>

                  <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                    Premium
                  </span>

                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
                    Chat disponibil
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-bold">{profileTitle}</h2>

                <p className="mt-2 text-white/50">
                  {draftAd.city || "Oraș nespecificat"}
                </p>

                <p className="mt-5 leading-8 text-white/65">
                  {draftAd.description ||
                    "Descrierea profilului apare aici după completarea anunțului."}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/profil/anunt-publicat-demo"
                    className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                  >
                    Deschide profil
                  </Link>

                  <Link
                    href="/chat/anunt-publicat-demo"
                    className="rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                  >
                    Deschide chat
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Timeline complet
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Flow MVP finalizat
            </h2>

            <div className="mt-8 space-y-4">
              {[
                "Anunț creat de advertiser",
                "Verificare 18+ trimisă",
                "Admin a aprobat pentru plată",
                "Plată demo confirmată",
                "Profil publicat în listă",
              ].map((step, index) => (
                <div
                  key={step}
                  className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 p-5"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-bold text-black">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-bold">{step}</h3>

                      <p className="mt-2 text-sm leading-7 text-white/55">
                        Pas complet în demo și pregătit pentru prezentare.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6 shadow-2xl md:p-8">
            <h2 className="text-2xl font-bold text-sky-200">
              Următorul nivel: site real, nu doar demo
            </h2>

            <p className="mt-4 leading-8 text-sky-100/75">
              În prezent, flow-ul este un MVP demo salvat local în browser.
              Pentru rulare reală cu utilizatori reali, următorii pași importanți
              sunt backend, bază de date, autentificare reală, upload securizat,
              plăți reale și moderare completă.
            </p>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Rezumat advertiser
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-white/45">Cont</p>
                <p className="mt-2 font-semibold">
                  {account?.email || draftAd.ownerEmail || "Advertiser demo"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-white/45">Publicat la</p>
                <p className="mt-2 font-semibold">
                  {formatDate(publishedAt)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-white/45">Telefon profil</p>
                <p className="mt-2 font-semibold">
                  {draftAd.phone || "Nedisponibil"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Pachet activ
            </p>

            <h2 className="mt-3 text-2xl font-bold text-emerald-100">
              {packageTitle}
            </h2>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Cost demo</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {packagePrice ? `${packagePrice} RON` : "Neales"}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Durată</p>
                <p className="mt-2 font-semibold text-white">
                  {packageDuration}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Status</p>
                <p className="mt-2 font-semibold text-white">
                  Activ și public
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Important
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              Această pagină este pentru advertiser. Utilizatorii publici nu văd
              pachetul, costul sau durata. Ei văd doar profilul public, chatul și
              opțiunea de raportare.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Acces rapid</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/profil/anunt-publicat-demo"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Profil public
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Lista profiluri
              </Link>

              <Link
                href="/cont"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Dashboard advertiser
              </Link>

              <Link
                href="/cont/anunt"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Status anunț
              </Link>

              <Link
                href="/prezentare"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Prezentare MVP
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — anunț publicat demo.
      </footer>
    </main>
  );
}