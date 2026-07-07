"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const cities = [
  "București",
  "Cluj",
  "Brașov",
  "Constanța",
  "Iași",
  "Timișoara",
];

const featuredProfiles = [
  {
    name: "Luxe Profile",
    city: "București",
    age: "24",
    tag: "Verificat 18+",
  },
  {
    name: "Premium Listing",
    city: "Cluj",
    age: "27",
    tag: "Anunț activ",
  },
  {
    name: "Elegant Companion",
    city: "Brașov",
    age: "25",
    tag: "Profil nou",
  },
];

export default function Home() {
  const [isAdultConfirmed, setIsAdultConfirmed] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const confirmed = localStorage.getItem("luxe_adult_confirmed");
    setIsAdultConfirmed(confirmed === "true");
  }, []);

  function confirmAdultAge() {
    localStorage.setItem("luxe_adult_confirmed", "true");
    setIsAdultConfirmed(true);
  }

  if (isAdultConfirmed === null) {
    return <main className="min-h-screen bg-black" />;
  }

  if (!isAdultConfirmed) {
    return (
      <main className="min-h-screen bg-black text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-3xl font-bold">
              18+
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight">Luxe</h1>

            <p className="mb-6 text-sm leading-6 text-white/70">
              Această platformă este destinată exclusiv persoanelor adulte.
              Pentru a continua, confirmă că ai cel puțin 18 ani.
            </p>

            <button
              onClick={confirmAdultAge}
              className="w-full rounded-full bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Am peste 18 ani
            </button>

            <button
              onClick={() => {
                window.location.href = "https://www.google.com";
              }}
              className="mt-3 w-full rounded-full border border-white/10 px-6 py-4 font-semibold text-white/70 transition hover:bg-white/10"
            >
              Ieșire
            </button>

            <p className="mt-6 text-xs leading-5 text-white/40">
              Confirmarea se salvează în browser, deci nu va mai apărea la
              revenirea pe pagina principală.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.35),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.25),_transparent_30%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Luxe
          </Link>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <a href="#pricing" className="hover:text-white">
              Prețuri
            </a>

            <a href="#safety" className="hover:text-white">
              Siguranță
            </a>
          </div>

          <Link
            href="/publica-anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Publică anunț
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 md:grid-cols-2 md:items-center md:pt-20">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              Luxe.ro — platformă premium 18+ pentru România
            </div>

            <h1 className="max-w-2xl text-5xl font-bold tracking-tight md:text-7xl">
              Conexiuni discrete, moderne și verificate.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Luxe.ro este o platformă adultă pentru profiluri verificate,
              conversații private și anunțuri premium active pe perioade
              determinate.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/profiluri"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Explorează profiluri
              </Link>

              <Link
                href="/publica-anunt"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Publică anunț
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">18+</div>
                <div className="text-xs text-white/50">verificare vârstă</div>
              </div>

              <div>
                <div className="text-2xl font-bold">Chat</div>
                <div className="text-xs text-white/50">mesaje private</div>
              </div>

              <div>
                <div className="text-2xl font-bold">RO/EN</div>
                <div className="text-xs text-white/50">pentru turiști</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-black/40 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">Caută în</p>
                  <h2 className="text-2xl font-bold">România</h2>
                </div>

                <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
                  Online
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/profiluri?oras=${encodeURIComponent(city)}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
                  >
                    <span className="block font-semibold">{city}</span>
                    <span className="text-sm text-white/40">
                      Vezi profiluri
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="profiles" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Profiluri
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Anunțuri recomandate
            </h2>
          </div>

          <Link
            href="/profiluri"
            className="hidden rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white md:inline-flex"
          >
            Vezi toate
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredProfiles.map((profile) => (
            <article
              key={profile.name}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06]"
            >
              <div className="flex h-72 items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-6xl">
                ✦
              </div>

              <div className="p-5">
                <div className="mb-3 inline-flex rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-300">
                  {profile.tag}
                </div>

                <h3 className="text-xl font-bold">{profile.name}</h3>

                <p className="mt-2 text-sm text-white/50">
                  {profile.age} ani • {profile.city}
                </p>

                <Link
                  href="/profiluri"
                  className="mt-5 block w-full rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                >
                  Vezi profil
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Monetizare
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Pachete pentru publicare anunț
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["Basic", "7 zile", "49 RON"],
              ["Standard", "30 zile", "149 RON"],
              ["Premium", "30 zile + boost", "299 RON"],
            ].map(([name, duration, price]) => (
              <div
                key={name}
                className="rounded-3xl border border-white/10 bg-black/30 p-6"
              >
                <h3 className="text-xl font-bold">{name}</h3>

                <p className="mt-2 text-white/50">{duration}</p>

                <div className="mt-6 text-3xl font-bold">{price}</div>

                <Link
                  href="/publica-anunt"
                  className="mt-6 block w-full rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Alege pachetul
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="safety" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [
              "Verificare 18+",
              "Advertiserii trebuie să confirme vârsta înainte de publicare.",
            ],
            [
              "Moderare",
              "Anunțurile sunt verificate înainte să apară public.",
            ],
            [
              "Chat privat",
              "Conversații directe între utilizatori, cu opțiuni de raportare.",
            ],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6"
            >
              <h3 className="text-xl font-bold">{title}</h3>

              <p className="mt-3 leading-7 text-white/60">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — Platformă 18+ pentru utilizatori adulți.
      </footer>
    </main>
  );
}