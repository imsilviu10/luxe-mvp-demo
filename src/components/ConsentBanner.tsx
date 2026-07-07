"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentPreferences = {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

const consentStorageKey = "luxe_cookie_consent";
const preferencesStorageKey = "luxe_cookie_preferences";

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(consentStorageKey);

    if (!savedConsent) {
      setIsVisible(true);
    }
  }, []);

  function saveConsent(selectedPreferences: ConsentPreferences) {
    const safePreferences: ConsentPreferences = {
      necessary: true,
      preferences: selectedPreferences.preferences,
      analytics: selectedPreferences.analytics,
      marketing: selectedPreferences.marketing,
    };

    localStorage.setItem(consentStorageKey, "accepted");
    localStorage.setItem(
      preferencesStorageKey,
      JSON.stringify(safePreferences)
    );

    setIsVisible(false);
    setShowSettings(false);
  }

  function acceptAll() {
    saveConsent({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    });
  }

  function acceptNecessaryOnly() {
    saveConsent({
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    });
  }

  function selectAll() {
    setPreferences(true);
    setAnalytics(true);
    setMarketing(true);
  }

  function saveSelected() {
    saveConsent({
      necessary: true,
      preferences,
      analytics,
      marketing,
    });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 w-[calc(100%-2rem)] max-w-md rounded-3xl border border-white/10 bg-zinc-950/95 p-4 text-white shadow-2xl backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-sm font-bold">
            18+
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Cookies și setări locale</p>

            <p className="mt-1 text-xs leading-5 text-white/55">
              Folosim cookie-uri necesare pentru funcționare. Poți accepta tot
              sau alege setările.{" "}
              <Link href="/termeni" className="font-semibold text-rose-300">
                Termeni
              </Link>{" "}
              •{" "}
              <Link href="/reguli" className="font-semibold text-rose-300">
                Reguli
              </Link>
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Alege setări
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-400"
              >
                Acceptă tot
              </button>

              <button
                type="button"
                onClick={acceptNecessaryOnly}
                className="col-span-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                Continuă doar cu necesare
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 px-4 pb-4 backdrop-blur sm:items-center sm:pb-0">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-400">
                  Setări
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Preferințe cookies
                </h2>

                <p className="mt-2 text-xs leading-6 text-white/55">
                  Cele necesare sunt obligatorii pentru funcționarea site-ului.
                  Restul pot fi alese de utilizator.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Închide
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-emerald-200">Necesare</p>

                    <p className="mt-1 text-xs leading-5 text-emerald-100/60">
                      Obligatorii pentru navigare, siguranță și funcționarea
                      platformei.
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase text-white">
                    Obligatoriu
                  </span>
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div>
                  <p className="font-semibold">Preferințe</p>

                  <p className="mt-1 text-xs leading-5 text-white/50">
                    Salvează alegeri locale și setări utile pentru experiență.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(event) => setPreferences(event.target.checked)}
                  className="h-5 w-5"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div>
                  <p className="font-semibold">Statistici</p>

                  <p className="mt-1 text-xs leading-5 text-white/50">
                    Ajută la îmbunătățirea site-ului și a fluxurilor demo.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="h-5 w-5"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div>
                  <p className="font-semibold">Marketing</p>

                  <p className="mt-1 text-xs leading-5 text-white/50">
                    Poate fi folosit pentru promovări și recomandări relevante.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                  className="h-5 w-5"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={acceptNecessaryOnly}
                className="rounded-full border border-white/10 px-4 py-3 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Doar necesare
              </button>

              <button
                type="button"
                onClick={selectAll}
                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
              >
                Selectează tot
              </button>

              <button
                type="button"
                onClick={saveSelected}
                className="rounded-full bg-rose-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-rose-400"
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}