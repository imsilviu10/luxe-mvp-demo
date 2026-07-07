"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { profiles } from "@/lib/profiles";

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

type DisplayProfile = {
  slug: string;
  name: string;
  age: string | number;
  city: string;
  status: string;
  phone: string;
  isPremium: boolean;
  description: string;
  details?: string[];
  isPublishedDemo?: boolean;
};

const cities = [
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

function ProfilesContent() {
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get("oras") || "Toate";

  const [publishedProfile, setPublishedProfile] =
    useState<DisplayProfile | null>(null);

  useEffect(() => {
    const savedAd = localStorage.getItem("luxe_draft_ad");
    const savedPublished = localStorage.getItem("luxe_ad_published");

    if (!savedAd || savedPublished !== "true") {
      setPublishedProfile(null);
      return;
    }

    try {
      const draftAd: DraftAd = JSON.parse(savedAd);

      setPublishedProfile({
        slug: "anunt-publicat-demo",
        name: draftAd.displayName || "Profil publicat demo",
        age: draftAd.age || "--",
        city: draftAd.city || "Oraș neales",
        phone: draftAd.phone || "",
        status: "Activ",
        isPremium: draftAd.selectedPackage?.name === "Premium",
        description:
          draftAd.description ||
          "Profil publicat prin fluxul demo Luxe.ro.",
        details: [
          "Profil publicat demo",
          "Verificare 18+ trimisă",
          "Aprobat de admin",
          "Plată confirmată",
        ],
        isPublishedDemo: true,
      });
    } catch {
      setPublishedProfile(null);
    }
  }, []);

  const allProfiles: DisplayProfile[] = useMemo(() => {
    if (publishedProfile) {
      return [publishedProfile, ...profiles];
    }

    return profiles;
  }, [publishedProfile]);

  const filteredProfiles = useMemo(() => {
    if (selectedCity === "Toate") {
      return allProfiles;
    }

    return allProfiles.filter((profile) => profile.city === selectedCity);
  }, [allProfiles, selectedCity]);

  function getProfileHref(profile: DisplayProfile) {
    if (profile.isPublishedDemo) {
      return "/profil/anunt-publicat-demo";
    }

    return `/profil/${profile.slug}`;
  }

  function getChatHref(profile: DisplayProfile) {
    if (profile.isPublishedDemo) {
      return "/chat/anunt-publicat-demo";
    }

    return `/chat/${profile.slug}`;
  }

  function getReportHref(profile: DisplayProfile) {
    return `/raporteaza?profil=${encodeURIComponent(
      profile.name
    )}&link=${encodeURIComponent(getProfileHref(profile))}`;
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

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
            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href="/raporteaza" className="hover:text-white">
              Raportează
            </Link>

            <Link href="/cont" className="hover:text-white">
              Cont demo
            </Link>
          </div>

          <Link
            href="/publica-anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Publică anunț
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Profiluri verificate 18+
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Descoperă profiluri premium în România.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Alege orașul, vezi profilurile active, deschide chatul sau
              raportează rapid un profil suspect.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {cities.map((city) => {
              const href =
                city === "Toate"
                  ? "/profiluri"
                  : `/profiluri?oras=${encodeURIComponent(city)}`;

              const isActive = selectedCity === city;

              return (
                <Link
                  key={city}
                  href={href}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-rose-500 text-white"
                      : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {city}
                </Link>
              );
            })}
          </div>

          {publishedProfile && (
            <div className="mt-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-5">
              <h2 className="text-xl font-bold text-emerald-300">
                Anunțul tău demo este publicat.
              </h2>

              <p className="mt-2 text-sm leading-7 text-emerald-100/70">
                Profilul publicat apare primul în listă și poate fi deschis,
                contactat prin chat sau raportat ca orice alt profil.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Rezultate
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {filteredProfiles.length} profiluri afișate
            </h2>
          </div>

          <p className="text-sm text-white/50">
            Filtru activ:{" "}
            <span className="font-semibold text-white">{selectedCity}</span>
          </p>
        </div>

        {filteredProfiles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProfiles.map((profile) => {
              const profileHref = getProfileHref(profile);
              const chatHref = getChatHref(profile);
              const reportHref = getReportHref(profile);

              return (
                <article
                  key={profile.slug}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] transition hover:-translate-y-1 hover:bg-white/[0.09]"
                >
                  <div className="relative flex h-72 items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-7xl">
                    ✦

                    <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-black">
                      {profile.isPremium ? "Premium" : "Standard"}
                    </div>

                    <div
                      className={`absolute right-4 top-4 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                        profile.isPublishedDemo
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {profile.status}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">{profile.name}</h3>

                        <p className="mt-2 text-white/50">
                          {profile.age} ani • {profile.city}
                        </p>
                      </div>

                      {profile.isPublishedDemo && (
                        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                          Al tău
                        </div>
                      )}
                    </div>

                    <p className="mt-5 line-clamp-3 leading-7 text-white/70">
                      {profile.description}
                    </p>

                    <div className="mt-6 grid gap-3">
                      <Link
                        href={profileHref}
                        className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                      >
                        Vezi profil
                      </Link>

                      <Link
                        href={chatHref}
                        className="rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                      >
                        Deschide chat
                      </Link>

                      <Link
                        href={reportHref}
                        className="rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-center font-semibold text-rose-200 transition hover:bg-rose-500/20"
                      >
                        Raportează profil
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-10 text-center">
            <h3 className="text-2xl font-bold">
              Nu există profiluri pentru acest oraș.
            </h3>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-white/60">
              Alege alt oraș sau revino la lista completă.
            </p>

            <Link
              href="/profiluri"
              className="mt-6 inline-flex rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
            >
              Vezi toate profilurile
            </Link>
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — Platformă 18+ pentru utilizatori adulți.
      </footer>
    </main>
  );
}

export default function ProfilesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <p className="text-lg font-semibold">Se încarcă profilurile...</p>
          </div>
        </main>
      }
    >
      <ProfilesContent />
    </Suspense>
  );
}