"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CookiePreferences = {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

const consentStorageKey = "luxe_cookie_consent";
const preferencesStorageKey = "luxe_cookie_preferences";

const defaultPreferences: CookiePreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export default function CookiesPage() {
  const [hasConsent, setHasConsent] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);
  const [savedMessage, setSavedMessage] = useState("");

  function loadPreferences() {
    const savedConsent = localStorage.getItem(consentStorageKey);
    const savedPreferences = localStorage.getItem(preferencesStorageKey);

    setHasConsent(savedConsent === "accepted");

    if (!savedPreferences) {
      setPreferences(defaultPreferences);
      return;
    }

    try {
      const parsedPreferences = JSON.parse(
        savedPreferences
      ) as CookiePreferences;

      setPreferences({
        necessary: true,
        preferences: Boolean(parsedPreferences.preferences),
        analytics: Boolean(parsedPreferences.analytics),
        marketing: Boolean(parsedPreferences.marketing),
      });
    } catch {
      setPreferences(defaultPreferences);
    }
  }

  useEffect(() => {
    loadPreferences();
  }, []);

  function savePreferences(newPreferences: CookiePreferences) {
    const safePreferences: CookiePreferences = {
      necessary: true,
      preferences: newPreferences.preferences,
      analytics: newPreferences.analytics,
      marketing: newPreferences.marketing,
    };

    localStorage.setItem(consentStorageKey, "accepted");
    localStorage.setItem(
      preferencesStorageKey,
      JSON.stringify(safePreferences)
    );

    setPreferences(safePreferences);
    setHasConsent(true);
    setSavedMessage("Preferințele au fost salvate.");
  }

  function acceptAll() {
    savePreferences({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    });
  }

  function acceptNecessaryOnly() {
    savePreferences({
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    });
  }

  function selectAll() {
    setPreferences({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    });

    setSavedMessage("");
  }

  function updatePreference(
    key: "preferences" | "analytics" | "marketing",
    value: boolean
  ) {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: value,
    }));

    setSavedMessage("");
  }

  function saveSelectedPreferences() {
    savePreferences(preferences);
  }

  function resetCookieChoice() {
    localStorage.removeItem(consentStorageKey);
    localStorage.removeItem(preferencesStorageKey);

    setHasConsent(false);
    setPreferences(defaultPreferences);
    setSavedMessage(
      "Alegerea a fost ștearsă. Bannerul va apărea din nou pe site."
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
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Acasă
            </Link>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/termeni" className="hover:text-white">
              Termeni
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/reset-demo" className="hover:text-white">
              Reset demo
            </Link>
          </div>

          <Link
            href="/termeni"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Termeni
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Setări cookies
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Alege preferințele pentru cookies.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Poți schimba oricând alegerea făcută în bannerul de jos al
              site-ului. Cookie-urile necesare rămân active pentru funcționarea
              platformei.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Acceptă tot
              </button>

              <button
                type="button"
                onClick={acceptNecessaryOnly}
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Doar necesare
              </button>

              <button
                type="button"
                onClick={selectAll}
                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-8 py-4 text-center font-semibold text-rose-200 transition hover:bg-rose-500/20"
              >
                Selectează tot
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Preferințe
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Categorii cookies
              </h2>
            </div>

            <div
              className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${
                hasConsent
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-200"
              }`}
            >
              {hasConsent ? "Alegere salvată" : "Alegere nesalvată"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-emerald-200">
                    Necesare
                  </h3>

                  <p className="mt-2 leading-7 text-emerald-100/70">
                    Acestea sunt necesare pentru funcționarea site-ului,
                    siguranță, navigare și salvarea alegerilor de bază.
                  </p>
                </div>

                <div className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold uppercase text-white">
                  Activ
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-3xl border border-white/10 bg-black/30 p-5">
              <div>
                <h3 className="text-xl font-bold">Preferințe</h3>

                <p className="mt-2 leading-7 text-white/60">
                  Salvează setări locale precum confirmarea 18+, preferințe de
                  interfață și alegeri utile pentru experiența pe site.
                </p>
              </div>

              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={(event) =>
                  updatePreference("preferences", event.target.checked)
                }
                className="mt-2 h-5 w-5"
              />
            </label>

            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-3xl border border-white/10 bg-black/30 p-5">
              <div>
                <h3 className="text-xl font-bold">Statistici</h3>

                <p className="mt-2 leading-7 text-white/60">
                  Ajută la înțelegerea modului în care este folosit site-ul,
                  ce pagini sunt utile și unde trebuie îmbunătățit fluxul.
                </p>
              </div>

              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(event) =>
                  updatePreference("analytics", event.target.checked)
                }
                className="mt-2 h-5 w-5"
              />
            </label>

            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-3xl border border-white/10 bg-black/30 p-5">
              <div>
                <h3 className="text-xl font-bold">Marketing</h3>

                <p className="mt-2 leading-7 text-white/60">
                  Poate fi folosit pentru promovări, campanii, recomandări și
                  anunțuri relevante.
                </p>
              </div>

              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(event) =>
                  updatePreference("marketing", event.target.checked)
                }
                className="mt-2 h-5 w-5"
              />
            </label>
          </div>

          {savedMessage && (
            <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="font-semibold text-emerald-300">{savedMessage}</p>
            </div>
          )}

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={saveSelectedPreferences}
              className="rounded-full bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Salvează preferințele
            </button>

            <button
              type="button"
              onClick={acceptAll}
              className="rounded-full bg-white px-6 py-4 font-semibold text-black transition hover:bg-white/80"
            >
              Acceptă tot
            </button>

            <button
              type="button"
              onClick={resetCookieChoice}
              className="rounded-full border border-white/10 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Șterge alegerea
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Status curent
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Preferințe salvate
            </h2>

            <div className="mt-6 space-y-3">
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="text-sm text-emerald-100/60">Necesare</p>
                <p className="mt-2 text-xl font-bold text-emerald-300">
                  Activ
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Preferințe</p>
                <p className="mt-2 text-xl font-bold">
                  {preferences.preferences ? "Acceptat" : "Neacceptat"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Statistici</p>
                <p className="mt-2 text-xl font-bold">
                  {preferences.analytics ? "Acceptat" : "Neacceptat"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Marketing</p>
                <p className="mt-2 text-xl font-bold">
                  {preferences.marketing ? "Acceptat" : "Neacceptat"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Unde se salvează?
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              În acest demo, alegerea se salvează în localStorage folosind
              cheile luxe_cookie_consent și luxe_cookie_preferences.
            </p>
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-200">
              Notă legală
            </h2>

            <p className="mt-3 text-sm leading-7 text-amber-100/70">
              Pentru lansarea reală, textul despre cookies și consimțământul
              trebuie verificat juridic și adaptat la serviciile reale folosite
              pe platformă.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/termeni"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Termeni și confidențialitate
              </Link>

              <Link
                href="/reguli"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reguli
              </Link>

              <Link
                href="/reset-demo"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reset demo
              </Link>

              <Link
                href="/"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Acasă
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