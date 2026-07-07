"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

export default function PublishedDemoProfilePage() {
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const savedAd = localStorage.getItem("luxe_draft_ad");
    const savedPublished = localStorage.getItem("luxe_ad_published");

    if (savedAd) {
      setDraftAd(JSON.parse(savedAd));
    } else {
      setDraftAd(null);
    }

    setIsPublished(savedPublished === "true");
  }, []);

  const profileName = draftAd?.displayName || "Profil publicat demo";
  const profileAge = draftAd?.age || "--";
  const profileCity = draftAd?.city || "Oraș neales";
  const profilePhone = draftAd?.phone || "";
  const profileDescription =
    draftAd?.description ||
    "Descrierea profilului va apărea aici după publicarea anunțului.";

  const reportHref = useMemo(() => {
    return `/raporteaza?profil=${encodeURIComponent(
      profileName
    )}&link=${encodeURIComponent("/profil/anunt-publicat-demo")}`;
  }, [profileName]);

  if (!draftAd || !isPublished) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

          <div className="relative z-10 max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl">
              !
            </div>

            <h1 className="text-4xl font-bold">Profil indisponibil.</h1>

            <p className="mt-4 leading-8 text-white/60">
              Profilul demo apare aici doar după ce anunțul este aprobat,
              plătit și publicat.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/publica-anunt"
                className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
              >
                Publică anunț
              </Link>

              <Link
                href="/cont/anunt"
                className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Vezi status anunț
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Înapoi la profiluri
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <Link
              href="/profiluri"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Înapoi la profiluri
            </Link>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/chat/anunt-publicat-demo" className="hover:text-white">
              Chat
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href={reportHref} className="hover:text-white">
              Raportează
            </Link>
          </div>

          <Link
            href="/cont/anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Cont anunț
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              Profil publicat • Activ
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              {profileName}
            </h1>

            <p className="mt-4 text-xl text-white/60">
              {profileAge} ani • {profileCity}
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              {profileDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/chat/anunt-publicat-demo"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Deschide chat demo
              </Link>

              {profilePhone ? (
                <a
                  href={`tel:${profilePhone}`}
                  className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Sună
                </a>
              ) : (
                <span className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white/40">
                  Telefon indisponibil
                </span>
              )}

              <Link
                href={reportHref}
                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-8 py-4 text-center font-semibold text-rose-200 transition hover:bg-rose-500/20"
              >
                Raportează profil
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
            <div className="relative flex h-[520px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-8xl">
              ✦

              <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-black">
                {draftAd.selectedPackage?.name || "Standard"}
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                Activ
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Despre profil
            </p>

            <h2 className="mt-3 text-3xl font-bold">Detalii publice</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Nume afișat</p>
                <p className="mt-2 font-semibold">{profileName}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Oraș</p>
                <p className="mt-2 font-semibold">{profileCity}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Vârstă</p>
                <p className="mt-2 font-semibold">{profileAge} ani</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Status</p>
                <p className="mt-2 font-semibold text-emerald-300">Activ</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Pachet</p>
                <p className="mt-2 font-semibold">
                  {draftAd.selectedPackage?.name || "Standard"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Durată</p>
                <p className="mt-2 font-semibold">
                  {draftAd.selectedPackage?.duration || "30 zile"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Galerie
            </p>

            <h2 className="mt-3 text-3xl font-bold">Fotografii demo</h2>

            {draftAd.photoNames && draftAd.photoNames.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {draftAd.photoNames.map((photoName, index) => (
                  <div
                    key={`${photoName}-${index}`}
                    className="flex h-56 flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/30 p-4 text-center"
                  >
                    <div className="text-5xl">✦</div>
                    <p className="mt-4 break-all text-sm text-white/50">
                      {photoName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((photo) => (
                  <div
                    key={photo}
                    className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-black/30 text-5xl"
                  >
                    ✦
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-rose-200">
              Siguranță și raportare
            </h2>

            <p className="mt-3 leading-8 text-rose-100/70">
              Dacă observi informații false, comportament abuziv, conținut
              interzis sau orice situație suspectă, poți trimite o raportare
              către admin.
            </p>

            <Link
              href={reportHref}
              className="mt-6 inline-flex rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
            >
              Raportează acest profil
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Contact
            </p>

            <h2 className="mt-3 text-2xl font-bold">{profileName}</h2>

            <p className="mt-2 text-white/50">
              {profileAge} ani • {profileCity}
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href="/chat/anunt-publicat-demo"
                className="block rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Deschide chat demo
              </Link>

              {profilePhone ? (
                <a
                  href={`tel:${profilePhone}`}
                  className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                >
                  {profilePhone}
                </a>
              ) : (
                <div className="block rounded-full bg-white/10 px-5 py-3 text-center font-semibold text-white/40">
                  Telefon indisponibil
                </div>
              )}

              <Link
                href={reportHref}
                className="block rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-center font-semibold text-rose-200 transition hover:bg-rose-500/20"
              >
                Raportează profil
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h2 className="text-xl font-bold text-emerald-200">
              Verificare 18+
            </h2>

            <p className="mt-3 text-sm leading-7 text-emerald-100/70">
              Acest profil demo a trecut prin fluxul local de verificare,
              moderare, plată și publicare.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Navigare</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/profiluri"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Înapoi la profiluri
              </Link>

              <Link
                href="/cont/anunt"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Vezi status anunț
              </Link>

              <Link
                href="/reguli"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reguli și siguranță
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — Platformă 18+ pentru utilizatori adulți.
      </footer>
    </main>
  );
}