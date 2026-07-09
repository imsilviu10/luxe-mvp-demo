"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { profiles } from "@/lib/profiles";

type DemoAccount = {
  id?: string;
  name?: string;
  email?: string;
  role?: "user" | "advertiser" | "admin";
  roleLabel?: string;
  loggedInAt?: string;
};

type DraftAd = {
  displayName?: string;
  age?: string | number;
  city?: string;
  phone?: string;
  description?: string;
  photoNames?: string[];
};

type DisplayProfile = {
  slug: string;
  name: string;
  age: number;
  city: string;
  status: string;
  phone: string;
  isPremium: boolean;
  description: string;
  details?: string[];
  isPublishedDemo?: boolean;
};

const cityFilters = [
  "Toate",
  "București",
  "Cluj",
  "Brașov",
  "Constanța",
  "Iași",
  "Timișoara",
  "Sibiu",
  "Oradea",
];

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

function createReportHref(profileName: string, profileHref: string) {
  const encodedName = encodeURIComponent(profileName);
  const encodedHref = encodeURIComponent(profileHref);

  return `/raporteaza?profil=${encodedName}&link=${encodedHref}`;
}

function ProfilesPageContent() {
  const searchParams = useSearchParams();

  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [demoRole, setDemoRole] = useState("");

  const selectedCityFromUrl = searchParams.get("oras") || "Toate";
  const [selectedCity, setSelectedCity] = useState(selectedCityFromUrl);

  useEffect(() => {
    setSelectedCity(selectedCityFromUrl);
  }, [selectedCityFromUrl]);

  useEffect(() => {
    function loadLocalData() {
      const savedDraft = readJson<DraftAd>("luxe_draft_ad");
      const savedAccount = readJson<DemoAccount>("luxe_demo_account");
      const savedRole = localStorage.getItem("luxe_demo_role") || "";
      const published = localStorage.getItem("luxe_ad_published") === "true";

      setDraftAd(savedDraft);
      setAccount(savedAccount);
      setDemoRole(savedRole);
      setIsPublished(published);
    }

    loadLocalData();

    function handleFocus() {
      loadLocalData();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const isAdvertiserAccount =
    account?.role === "advertiser" && demoRole === "advertiser";

  const allProfiles = useMemo(() => {
    const normalProfiles = profiles as DisplayProfile[];

    if (!draftAd || !isPublished) {
      return normalProfiles;
    }

    const demoProfile: DisplayProfile = {
      slug: "anunt-publicat-demo",
      name: draftAd.displayName || "Profil publicat",
      age: Number(draftAd.age) || 18,
      city: draftAd.city || "România",
      status: "Activ",
      phone: draftAd.phone || "",
      isPremium: true,
      description:
        draftAd.description ||
        "Profil publicat prin flow-ul demo: anunț, verificare, moderare, plată și publicare.",
      details: [
        "Profil public",
        "Chat disponibil",
        "Verificare demo trimisă",
      ],
      isPublishedDemo: true,
    };

    return [demoProfile, ...normalProfiles];
  }, [draftAd, isPublished]);

  const filteredProfiles = useMemo(() => {
    if (selectedCity === "Toate") {
      return allProfiles;
    }

    return allProfiles.filter((profile) => profile.city === selectedCity);
  }, [allProfiles, selectedCity]);

  function changeCity(city: string) {
    setSelectedCity(city);
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200">
              Profiluri 18+
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/inregistrare" className="hover:text-white">
              Creează cont
            </Link>

            <Link href="/autentificare" className="hover:text-white">
              Login
            </Link>

            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>
          </div>

          <Link
            href="/publica-anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Publică anunț
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              Listă publică premium
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Descoperă profiluri active în România.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Profilurile publice sunt afișate pentru utilizatori adulți. Datele
              comerciale ale advertiserului, pachetul ales, durata și plata nu
              sunt afișate public.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#lista-profiluri"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Vezi profiluri
              </a>

              <Link
                href="/publica-anunt"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Publică anunț
              </Link>

              <Link
                href="/prezentare"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Prezentare MVP
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Rezumat
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {filteredProfiles.length}
            </h2>

            <p className="mt-3 leading-7 text-white/60">
              profiluri afișate pentru filtrul selectat.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Filtru</p>
                <p className="mt-2 font-semibold">{selectedCity}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Chat</p>
                <p className="mt-2 font-semibold">Disponibil</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Raportări</p>
                <p className="mt-2 font-semibold">Active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="lista-profiluri" className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Filtrare
              </p>

              <h2 className="mt-3 text-3xl font-bold">Alege orașul</h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/60">
                Folosește filtrele pentru a vedea profilurile disponibile pe
                oraș. Poți deschide un profil fie din imagine, fie din butonul
                „Vezi profil”.
              </p>
            </div>

            <Link
              href="/raporteaza"
              className="rounded-full border border-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Raportează un profil
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {cityFilters.map((city) => {
              const isSelected = selectedCity === city;

              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => changeCity(city)}
                  className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                    isSelected
                      ? "border-rose-500/40 bg-rose-500 text-white"
                      : "border-white/10 bg-black/30 text-white/65 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {isPublished && draftAd && isAdvertiserAccount && (
          <div className="mb-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-emerald-100">
                  Anunțul tău este public.
                </h2>

                <p className="mt-2 max-w-2xl leading-7 text-emerald-100/70">
                  Ești logat ca advertiser, de aceea vezi marcajul „Al tău” pe
                  propriul anunț. Utilizatorii publici nu văd acest marcaj.
                </p>
              </div>

              <Link
                href="/cont"
                className="rounded-full bg-white px-6 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Dashboard advertiser
              </Link>
            </div>
          </div>
        )}

        {filteredProfiles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProfiles.map((profile) => {
              const profileHref = profile.isPublishedDemo
                ? "/profil/anunt-publicat-demo"
                : `/profil/${profile.slug}`;

              const chatHref = profile.isPublishedDemo
                ? "/chat/anunt-publicat-demo"
                : `/chat/${profile.slug}`;

              const reportHref = createReportHref(profile.name, profileHref);

              const shouldShowOwnerBadge =
                profile.isPublishedDemo && isAdvertiserAccount;

              return (
                <article
                  key={profile.slug}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl transition hover:border-rose-500/30 hover:bg-white/[0.09]"
                >
                  <Link
                    href={profileHref}
                    className="relative flex aspect-[4/5] items-center justify-center border-b border-white/10 bg-black/30 transition hover:bg-black/20"
                    aria-label={`Deschide profilul ${profile.name}`}
                  >
                    <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {profile.status || "Activ"}
                      </span>

                      {profile.isPremium && (
                        <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                          Premium
                        </span>
                      )}

                      {shouldShowOwnerBadge && (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                          Al tău
                        </span>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-500/10 text-4xl transition group-hover:scale-105">
                        ✦
                      </div>

                      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-white/35">
                        Galerie demo
                      </p>

                      <p className="mt-3 text-xs font-semibold text-white/35 transition group-hover:text-white/70">
                        Click pentru profil
                      </p>
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {profile.name}, {profile.age}
                        </h3>

                        <p className="mt-2 text-white/50">{profile.city}</p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold text-white/70">
                        18+
                      </div>
                    </div>

                    <p className="mt-5 min-h-24 text-sm leading-7 text-white/60">
                      {profile.description}
                    </p>

                    {profile.details && profile.details.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {profile.details.slice(0, 3).map((detail) => (
                          <span
                            key={detail}
                            className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white/50"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 grid gap-3">
                      <Link
                        href={profileHref}
                        className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                      >
                        Vezi profil
                      </Link>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Link
                          href={chatHref}
                          className="rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                        >
                          Deschide chat
                        </Link>

                        <Link
                          href={reportHref}
                          className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                        >
                          Raportează
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-amber-200">
              Nu există profiluri pentru filtrul selectat.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-amber-100/70">
              Alege alt oraș sau revino la filtrul „Toate”.
            </p>

            <button
              type="button"
              onClick={() => changeCity("Toate")}
              className="mt-6 rounded-full bg-amber-400 px-8 py-4 font-semibold text-black transition hover:bg-amber-300"
            >
              Arată toate profilurile
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6 shadow-2xl md:p-8">
          <h2 className="text-2xl font-bold text-sky-200">
            Informații afișate public
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-sky-100/75">
            Utilizatorii publici văd doar informațiile de profil necesare:
            nume, vârstă, oraș, descriere, chat, telefon și raportare. Costul
            pachetului, durata, plata și marcajele interne sunt vizibile doar în
            zona advertiserului sau adminului.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — listă profiluri 18+.
      </footer>
    </main>
  );
}

function ProfilesPageFallback() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Se încarcă
          </p>

          <h1 className="mt-4 text-3xl font-bold">Pregătim profilurile...</h1>
        </div>
      </section>
    </main>
  );
}

export default function ProfilesPage() {
  return (
    <Suspense fallback={<ProfilesPageFallback />}>
      <ProfilesPageContent />
    </Suspense>
  );
}