"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { profiles } from "@/lib/profiles";

type DraftAd = {
  displayName?: string;
  age?: string | number;
  city?: string;
  phone?: string;
  description?: string;
  photoNames?: string[];
};

type ChatProfile = {
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

type ChatMessage = {
  id: number;
  author: "system" | "profile" | "user";
  text: string;
  time: string;
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

function getParamSlug(slugParam: string | string[] | undefined) {
  if (Array.isArray(slugParam)) {
    return slugParam[0] || "";
  }

  return slugParam || "";
}

function createReportHref(profileName: string, profileHref: string) {
  const encodedName = encodeURIComponent(profileName);
  const encodedHref = encodeURIComponent(profileHref);

  return `/raporteaza?profil=${encodedName}&link=${encodedHref}`;
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatPage() {
  const params = useParams();
  const slug = getParamSlug(params.slug);

  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [isPublishedDemo, setIsPublishedDemo] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const savedDraft = readDraftAd();
    const published = localStorage.getItem("luxe_ad_published") === "true";

    setDraftAd(savedDraft);
    setIsPublishedDemo(published);
  }, []);

  const currentProfile = useMemo(() => {
    if (slug === "anunt-publicat-demo" && draftAd && isPublishedDemo) {
      const demoProfile: ChatProfile = {
        slug: "anunt-publicat-demo",
        name: draftAd.displayName || "Profil publicat",
        age: Number(draftAd.age) || 18,
        city: draftAd.city || "România",
        status: "Activ",
        phone: draftAd.phone || "",
        isPremium: true,
        description:
          draftAd.description ||
          "Profil publicat prin flow-ul demo al platformei Luxe.",
        details: ["Profil public", "Chat disponibil", "Verificare demo"],
        isPublishedDemo: true,
      };

      return demoProfile;
    }

    const foundProfile = (profiles as ChatProfile[]).find(
      (profile) => profile.slug === slug
    );

    return foundProfile || null;
  }, [draftAd, isPublishedDemo, slug]);

  const profileHref = currentProfile?.isPublishedDemo
    ? "/profil/anunt-publicat-demo"
    : `/profil/${currentProfile?.slug || ""}`;

  const reportHref = currentProfile
    ? createReportHref(currentProfile.name, profileHref)
    : "/raporteaza";

  useEffect(() => {
    if (!currentProfile) {
      return;
    }

    setMessages([
      {
        id: 1,
        author: "system",
        text: "Conversație demo. Nu trimite date personale sensibile, documente sau informații bancare.",
        time: getCurrentTime(),
      },
      {
        id: 2,
        author: "profile",
        text: `Bună, sunt ${currentProfile.name}. Îmi poți scrie aici pentru detalii.`,
        time: getCurrentTime(),
      },
      {
        id: 3,
        author: "system",
        text: "Pentru siguranță, folosește raportarea dacă observi comportament suspect sau conținut interzis.",
        time: getCurrentTime(),
      },
    ]);
  }, [currentProfile]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanMessage = messageText.trim();

    if (!cleanMessage) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      author: "user",
      text: cleanMessage,
      time: getCurrentTime(),
    };

    const autoReply: ChatMessage = {
      id: Date.now() + 1,
      author: "profile",
      text: "Mulțumesc pentru mesaj. Acesta este un răspuns demo pentru prezentarea MVP.",
      time: getCurrentTime(),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      autoReply,
    ]);

    setMessageText("");
  }

  if (!currentProfile) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-3xl">
              ⚠️
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Chat indisponibil
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Profilul nu a fost găsit.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Este posibil ca profilul să nu fie public sau să fi fost accesat
              un link greșit.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/profiluri"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Înapoi la profiluri
              </Link>

              <Link
                href="/"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Acasă
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
              Chat demo
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href={profileHref} className="hover:text-white">
              Profil
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

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-8">
          <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
            Conversație privată demo
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Chat cu {currentProfile.name}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
            Pagina de chat este o simulare pentru MVP. Utilizatorii pot trimite
            mesaje demo, pot reveni la profil și pot raporta rapid dacă observă
            ceva suspect.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl">
          <div className="border-b border-white/10 bg-black/30 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href={profileHref}
                  className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-500/10 text-2xl transition hover:bg-rose-500/20"
                  aria-label={`Deschide profilul ${currentProfile.name}`}
                >
                  ✦
                </Link>

                <div>
                  <h2 className="text-xl font-bold">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>

                  <p className="text-sm text-white/45">
                    {currentProfile.city} · {currentProfile.status}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Activ
                </span>

                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
                  Chat disponibil
                </span>
              </div>
            </div>
          </div>

          <div className="min-h-[520px] space-y-4 bg-black/20 p-5 md:p-8">
            {messages.map((message) => {
              const isUser = message.author === "user";
              const isSystem = message.author === "system";

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.5rem] border px-5 py-4 shadow-xl md:max-w-[70%] ${
                      isUser
                        ? "border-rose-500/20 bg-rose-500 text-white"
                        : isSystem
                          ? "border-sky-500/20 bg-sky-500/10 text-sky-100"
                          : "border-white/10 bg-white/[0.08] text-white"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                        {isUser
                          ? "Tu"
                          : isSystem
                            ? "Luxe safety"
                            : currentProfile.name}
                      </p>

                      <p className="text-xs opacity-50">{message.time}</p>
                    </div>

                    <p className="text-sm leading-7">{message.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-white/10 bg-black/30 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Scrie un mesaj demo..."
                className="min-h-14 flex-1 rounded-full border border-white/10 bg-black/40 px-5 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
              />

              <button
                type="submit"
                className="rounded-full bg-rose-500 px-8 py-4 font-semibold text-white transition hover:bg-rose-400"
              >
                Trimite
              </button>
            </div>

            <p className="mt-4 text-center text-sm leading-7 text-white/40">
              Demo chat: mesajele sunt afișate local în browser și nu sunt
              trimise către un server.
            </p>
          </form>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Profil
            </p>

            <Link
              href={profileHref}
              className="mt-5 flex aspect-[4/5] items-center justify-center rounded-[2rem] border border-white/10 bg-black/30 transition hover:bg-black/20"
              aria-label={`Deschide profilul ${currentProfile.name}`}
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

            <h2 className="mt-5 text-2xl font-bold">
              {currentProfile.name}, {currentProfile.age}
            </h2>

            <p className="mt-2 text-white/50">{currentProfile.city}</p>

            <p className="mt-5 line-clamp-5 text-sm leading-7 text-white/60">
              {currentProfile.description}
            </p>

            {currentProfile.details && currentProfile.details.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {currentProfile.details.slice(0, 3).map((detail) => (
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

              {currentProfile.phone ? (
                <a
                  href={`tel:${currentProfile.phone}`}
                  className="rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Sună acum
                </a>
              ) : (
                <span className="rounded-full bg-white/10 px-5 py-3 text-center font-semibold text-white/45">
                  Telefon indisponibil
                </span>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Siguranță în conversație
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-sky-100/75">
              <p>1. Nu trimite documente personale în chat.</p>
              <p>2. Nu trimite date bancare sau parole.</p>
              <p>3. Raportează comportamentul suspect.</p>
              <p>4. Respectă regulile platformei 18+.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Raportează conversația
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              Dacă observi conținut interzis, mesaje abuzive sau informații
              false, trimite o raportare către admin.
            </p>

            <Link
              href={reportHref}
              className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
            >
              Raportează
            </Link>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h2 className="text-xl font-bold text-emerald-200">
              Informații publice
            </h2>

            <p className="mt-3 text-sm leading-7 text-emerald-100/75">
              Chatul afișează doar informații publice ale profilului. Costul,
              durata, plata și datele comerciale ale advertiserului nu sunt
              vizibile utilizatorilor.
            </p>
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
        Luxe.ro © 2026 — chat demo 18+.
      </footer>
    </main>
  );
}