"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

type ChatProfile = {
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

type ChatMessage = {
  id: number;
  sender: "profile" | "user";
  text: string;
  time: string;
};

export default function ChatPage() {
  const params = useParams();

  const [profile, setProfile] = useState<ChatProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const slug = useMemo(() => {
    const routeSlug = params.slug;

    if (Array.isArray(routeSlug)) {
      return routeSlug[0];
    }

    return routeSlug;
  }, [params.slug]);

  useEffect(() => {
    if (!slug) {
      setProfile(null);
      return;
    }

    if (slug === "anunt-publicat-demo") {
      const savedAd = localStorage.getItem("luxe_draft_ad");
      const savedPublished = localStorage.getItem("luxe_ad_published");

      if (!savedAd || savedPublished !== "true") {
        setProfile(null);
        return;
      }

      try {
        const draftAd: DraftAd = JSON.parse(savedAd);

        const demoProfile: ChatProfile = {
          slug: "anunt-publicat-demo",
          name: draftAd.displayName || "Profil publicat demo",
          age: draftAd.age || "--",
          city: draftAd.city || "Oraș neales",
          phone: draftAd.phone || "",
          status: "Activ",
          isPremium: draftAd.selectedPackage?.name === "Premium",
          description:
            draftAd.description || "Profil publicat prin fluxul demo Luxe.ro.",
          details: [
            "Profil publicat demo",
            "Verificare 18+ trimisă",
            "Aprobat de admin",
            "Plată confirmată",
          ],
          isPublishedDemo: true,
        };

        setProfile(demoProfile);

        setMessages([
          {
            id: 1,
            sender: "profile",
            text: `Bună, sunt ${demoProfile.name}. Acesta este chatul demo pentru profilul publicat.`,
            time: "acum",
          },
          {
            id: 2,
            sender: "profile",
            text: "Mesajele sunt doar locale în browser și dispar la refresh.",
            time: "acum",
          },
        ]);
      } catch {
        setProfile(null);
      }

      return;
    }

    const foundProfile = profiles.find((item) => item.slug === slug);

    if (!foundProfile) {
      setProfile(null);
      return;
    }

    setProfile(foundProfile);

    setMessages([
      {
        id: 1,
        sender: "profile",
        text: `Bună, sunt ${foundProfile.name}. Cu ce te pot ajuta?`,
        time: "acum",
      },
      {
        id: 2,
        sender: "profile",
        text: "Acesta este un chat demo. Mesajele nu sunt salvate pe server.",
        time: "acum",
      },
    ]);
  }, [slug]);

  const profileHref = useMemo(() => {
    if (!profile) {
      return "/profiluri";
    }

    if (profile.isPublishedDemo) {
      return "/profil/anunt-publicat-demo";
    }

    return `/profil/${profile.slug}`;
  }, [profile]);

  const reportHref = useMemo(() => {
    if (!profile) {
      return "/raporteaza";
    }

    return `/raporteaza?profil=${encodeURIComponent(
      profile.name
    )}&link=${encodeURIComponent(profileHref)}`;
  }, [profile, profileHref]);

  function sendMessage() {
    if (newMessage.trim().length < 1) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: newMessage.trim(),
      time: "acum",
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setNewMessage("");

    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: "profile",
        text: "Mulțumesc pentru mesaj. Acesta este un răspuns demo.",
        time: "acum",
      };

      setMessages((currentMessages) => [...currentMessages, replyMessage]);
    }, 500);
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

          <div className="relative z-10 max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl">
              !
            </div>

            <h1 className="text-4xl font-bold">Chat indisponibil.</h1>

            <p className="mt-4 leading-8 text-white/60">
              Nu am găsit profilul pentru acest chat sau profilul demo nu este
              încă publicat.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/profiluri"
                className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
              >
                Înapoi la profiluri
              </Link>

              <Link
                href="/publica-anunt"
                className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Publică anunț
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
            <Link href={profileHref} className="hover:text-white">
              Profil
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href={reportHref} className="hover:text-white">
              Raportează
            </Link>

            <Link href="/cont" className="hover:text-white">
              Cont demo
            </Link>
          </div>

          <Link
            href={reportHref}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Raportează
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Chat demo • {profile.status}
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Chat cu {profile.name}
            </h1>

            <p className="mt-4 text-xl text-white/60">
              {profile.age} ani • {profile.city}
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Acesta este un chat demo local. În versiunea finală, mesajele vor
              fi conectate la conturi reale, reguli de siguranță și moderare.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 md:p-6">
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-2xl">
                ✦
              </div>

              <div>
                <h2 className="text-xl font-bold">{profile.name}</h2>

                <p className="text-sm text-white/50">
                  {profile.city} • {profile.isPremium ? "Premium" : "Standard"}
                </p>
              </div>
            </div>

            <div className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
              Online demo
            </div>
          </div>

          <div className="h-[520px] space-y-4 overflow-y-auto rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
            {messages.map((message) => {
              const isUser = message.sender === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl px-5 py-4 ${
                      isUser
                        ? "bg-rose-500 text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <p className="leading-7">{message.text}</p>

                    <p
                      className={`mt-2 text-xs ${
                        isUser ? "text-white/70" : "text-white/40"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Scrie un mesaj demo..."
              className="min-h-14 flex-1 rounded-full border border-white/10 bg-black/30 px-5 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
            />

            <button
              type="button"
              onClick={sendMessage}
              className="rounded-full bg-rose-500 px-8 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Trimite
            </button>
          </div>

          <div className="mt-5 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
            <h3 className="font-bold text-amber-200">Atenție demo</h3>

            <p className="mt-2 text-sm leading-7 text-amber-100/70">
              Acest chat nu este conectat la server. Mesajele se pierd la
              refresh. Pentru siguranță, utilizatorii pot raporta conversația
              sau profilul direct din această pagină.
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Profil
            </p>

            <h2 className="mt-3 text-2xl font-bold">{profile.name}</h2>

            <p className="mt-2 text-white/50">
              {profile.age} ani • {profile.city}
            </p>

            <p className="mt-5 leading-7 text-white/70">
              {profile.description}
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href={profileHref}
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Vezi profil
              </Link>

              {profile.phone ? (
                <a
                  href={`tel:${profile.phone}`}
                  className="block rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Sună: {profile.phone}
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
                Raportează conversația
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Siguranță în chat
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/70">
              Dacă primești mesaje abuzive, frauduloase, amenințări sau orice
              conținut interzis, poți trimite o raportare către admin.
            </p>

            <Link
              href={reportHref}
              className="mt-5 block rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
            >
              Raportează acum
            </Link>
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
                href="/raporteaza"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Formular raportare
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