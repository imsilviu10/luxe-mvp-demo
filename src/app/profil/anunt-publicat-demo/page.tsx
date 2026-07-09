"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DraftAd = {
  displayName?: string;
  age?: string | number;
  city?: string;
  phone?: string;
  description?: string;
  photoNames?: string[];
};

function readDraftAd() {
  const savedDraft = localStorage.getItem("luxe_draft_ad");

  if (!savedDraft) {
    return null;
  }

  try {
    return JSON.parse(savedDraft) as DraftAd;
  } catch {
    return null;
  }
}

export default function PublishedDemoProfilePage() {
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedDraft = readDraftAd();
    const published = localStorage.getItem("luxe_ad_published") === "true";

    setDraftAd(savedDraft);
    setIsPublished(published);
    setIsLoading(false);
  }, []);

  const displayName = draftAd?.displayName || "Profil Luxe";
  const age = draftAd?.age ? String(draftAd.age) : "";
  const city = draftAd?.city || "România";
  const phone = draftAd?.phone || "";
  const description =
    draftAd?.description ||
    "Profilul public va afișa descrierea completată de advertiser după publicare.";

  const reportHref = useMemo(() => {
    const profileName = encodeURIComponent(displayName);
    const profileLink = encodeURIComponent("/profil/anunt-publicat-demo");

    return `/raporteaza?profil=${profileName}&link=${profileLink}`;
  }, [displayName]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Se încarcă
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Pregătim profilul public...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  if (!draftAd || !isPublished) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-3xl">
              ⚠️
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Profil indisponibil
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Anunțul demo nu este public încă.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Profilul public apare doar după ce advertiserul creează anunțul,
              trimite verificarea, adminul aprobă și plata demo este confirmată.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/publica-anunt"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Publică anunț
              </Link>

              <Link
                href="/cont/anunt"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Status anunț
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              Profil activ
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/chat/anunt-publicat-demo" className="hover:text-white">
              Chat
            </Link>

            <Link href={reportHref} className="hover:text-white">
              Raportează
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>
          </div>

          <Link
            href="/profiluri"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Înapoi la listă
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
              Profil public verificat demo
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              {displayName}
              {age ? `, ${age}` : ""}
            </h1>

            <p className="mt-4 text-xl text-white/60">{city}</p>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              {description}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/chat/anunt-publicat-demo"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Deschide chat
              </Link>

              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
                >
                  Sună acum
                </a>
              ) : (
                <span className="rounded-full bg-white/10 px-8 py-4 text-center font-semibold text-white/50">
                  Telefon indisponibil
                </span>
              )}

              <Link
                href={reportHref}
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Raportează profil
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Status public
            </p>

            <h2 className="mt-3 text-3xl font-bold">Activ pe Luxe.ro</h2>

            <p className="mt-4 leading-7 text-white/60">
              Profilul este vizibil public după finalizarea flow-ului demo:
              creare anunț, verificare 18+, moderare admin și plată demo.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Vârstă</p>
                <p className="mt-2 font-semibold">{age || "18+"}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Oraș</p>
                <p className="mt-2 font-semibold">{city}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Chat</p>
                <p className="mt-2 font-semibold">Disponibil</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Galerie
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Fotografii profil
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/60">
                În demo sunt afișate carduri vizuale. În versiunea reală, aici
                vor apărea imaginile încărcate și aprobate prin moderare.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="flex aspect-[4/5] items-center justify-center rounded-[2rem] border border-white/10 bg-black/30"
                >
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-500/10 text-2xl">
                      ✦
                    </div>

                    <p className="mt-4 text-sm font-semibold text-white/70">
                      Foto demo {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Descriere
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Despre profil
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-white/65">
              {description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-sky-200">
              Recomandări de siguranță
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-sky-500/20 bg-black/20 p-5">
                <h3 className="font-bold text-white">Păstrează conversația</h3>

                <p className="mt-3 text-sm leading-7 text-sky-100/70">
                  Folosește chatul demo al platformei pentru primele mesaje.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-500/20 bg-black/20 p-5">
                <h3 className="font-bold text-white">Raportează probleme</h3>

                <p className="mt-3 text-sm leading-7 text-sky-100/70">
                  Dacă observi conținut suspect, trimite rapid o raportare.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-500/20 bg-black/20 p-5">
                <h3 className="font-bold text-white">Respectă regulile</h3>

                <p className="mt-3 text-sm leading-7 text-sky-100/70">
                  Platforma este destinată exclusiv persoanelor adulte.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Contact
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Contactează profilul
            </h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/chat/anunt-publicat-demo"
                className="rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Deschide chat
              </Link>

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                >
                  {phone}
                </a>
              )}

              <Link
                href={reportHref}
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Raportează profil
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-emerald-200">
              Profil activ
            </h2>

            <p className="mt-3 text-sm leading-7 text-emerald-100/75">
              Acest profil este afișat public doar după aprobarea flow-ului demo.
              Informațiile comerciale ale advertiserului nu sunt afișate
              utilizatorilor publici.
            </p>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Ai observat ceva suspect?
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              Raportează profilul dacă observi informații false, conținut
              interzis sau comportament abuziv.
            </p>

            <Link
              href={reportHref}
              className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
            >
              Trimite raportare
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/profiluri"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Înapoi la profiluri
              </Link>

              <Link
                href="/reguli"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reguli
              </Link>

              <Link
                href="/termeni"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Termeni
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — profil public 18+.
      </footer>
    </main>
  );
}