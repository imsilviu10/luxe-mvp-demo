import Link from "next/link";
import { notFound } from "next/navigation";
import { profiles } from "@/lib/profiles";

type ProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return profiles.map((profile) => ({
    slug: profile.slug,
  }));
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;

  const profile = profiles.find((item) => item.slug === slug);

  if (!profile) {
    notFound();
  }

  const reportHref = `/raporteaza?profil=${encodeURIComponent(
    profile.name
  )}&link=${encodeURIComponent(`/profil/${profile.slug}`)}`;

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

            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href="/raporteaza" className="hover:text-white">
              Raportează
            </Link>
          </div>

          <Link
            href="/publica-anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Publică anunț
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Profil verificat 18+
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              {profile.name}
            </h1>

            <p className="mt-4 text-xl text-white/60">
              {profile.age} ani • {profile.city}
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              {profile.description}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/chat/${profile.slug}`}
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Deschide chat
              </Link>

              <a
                href={`tel:${profile.phone}`}
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Sună
              </a>

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
                {profile.isPremium ? "Premium" : "Standard"}
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                {profile.status}
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

            <h2 className="mt-3 text-3xl font-bold">Detalii</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {profile.details.map((detail) => (
                <div
                  key={detail}
                  className="rounded-3xl border border-white/10 bg-black/30 p-5"
                >
                  <p className="font-semibold text-white">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Galerie
            </p>

            <h2 className="mt-3 text-3xl font-bold">Fotografii demo</h2>

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

            <h2 className="mt-3 text-2xl font-bold">{profile.name}</h2>

            <p className="mt-2 text-white/50">
              {profile.age} ani • {profile.city}
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href={`/chat/${profile.slug}`}
                className="block rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Deschide chat
              </Link>

              <a
                href={`tel:${profile.phone}`}
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                {profile.phone}
              </a>

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
              Acest profil este afișat ca demo verificat. În versiunea finală,
              profilurile trebuie validate înainte de publicare.
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
                href="/reguli"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reguli și siguranță
              </Link>

              <Link
                href="/publica-anunt"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Publică anunț
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