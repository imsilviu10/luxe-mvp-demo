"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function AgeVerificationPage() {
  const router = useRouter();

  const [documentName, setDocumentName] = useState("");
  const [selfieName, setSelfieName] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedAge, setAcceptedAge] = useState(false);

  const canSubmit =
    documentName.length > 0 &&
    selfieName.length > 0 &&
    acceptedPrivacy &&
    acceptedAge;

  function handleDocumentChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setDocumentName(file?.name ?? "");
  }

  function handleSelfieChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelfieName(file?.name ?? "");
  }

  function submitVerification() {
    if (!canSubmit) {
      return;
    }

    const verificationDraft = {
      documentName,
      selfieName,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "luxe_verification_draft",
      JSON.stringify(verificationDraft)
    );

    router.push("/verificare-trimisa");
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
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/#safety" className="hover:text-white">
              Siguranță
            </Link>
          </div>

          <Link
            href="/publica-anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Înapoi la formular
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              Luxe.ro — verificare obligatorie 18+
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Verificare vârstă pentru publicarea anunțului.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Pentru siguranța platformei, advertiserii trebuie să confirme că
              au minimum 18 ani înainte ca anunțul să poată fi trimis spre
              moderare și publicare.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Documente
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Încarcă documentele pentru verificare
          </h2>

          <p className="mt-3 leading-7 text-white/60">
            Aceasta este momentan doar interfața. Pentru testare locală, poți
            selecta fișiere demo. În versiunea finală vom folosi verificare
            securizată.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-3 block text-sm font-semibold text-white/80">
                Act de identitate
              </label>

              <div className="rounded-3xl border border-dashed border-white/15 bg-black/30 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
                  ID
                </div>

                <p className="font-semibold">
                  Selectează o poză cu documentul
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  În versiunea finală vom verifica doar vârsta și vom evita
                  păstrarea inutilă a documentului.
                </p>

                <label className="mt-5 inline-flex cursor-pointer rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                  Alege document
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleDocumentChange}
                    className="hidden"
                  />
                </label>

                {documentName && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
                    Document selectat:{" "}
                    <span className="text-white">{documentName}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-white/80">
                Selfie de confirmare
              </label>

              <div className="rounded-3xl border border-dashed border-white/15 bg-black/30 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
                  ✦
                </div>

                <p className="font-semibold">Selectează o poză selfie</p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Selfie-ul ajută la confirmarea că persoana care publică
                  anunțul este aceeași cu persoana verificată.
                </p>

                <label className="mt-5 inline-flex cursor-pointer rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                  Alege selfie
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieChange}
                    className="hidden"
                  />
                </label>

                {selfieName && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
                    Selfie selectat:{" "}
                    <span className="text-white">{selfieName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/60">
                <input
                  type="checkbox"
                  checked={acceptedAge}
                  onChange={(event) => setAcceptedAge(event.target.checked)}
                  className="mt-1 h-4 w-4"
                />

                <span>
                  Confirm că am minimum 18 ani și că datele oferite pentru
                  verificare sunt reale.
                </span>
              </label>

              <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/60">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(event) =>
                    setAcceptedPrivacy(event.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  Înțeleg că datele de verificare trebuie tratate confidențial
                  și folosite doar pentru confirmarea eligibilității 18+.
                </span>
              </label>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Status
            </p>

            <h2 className="mt-3 text-2xl font-bold">Rezumat verificare</h2>

            <div className="mt-6 space-y-4 text-sm text-white/60">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Document ID</span>
                <span
                  className={documentName ? "text-emerald-300" : "text-white/40"}
                >
                  {documentName ? "Selectat" : "Lipsește"}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Selfie</span>
                <span
                  className={selfieName ? "text-emerald-300" : "text-white/40"}
                >
                  {selfieName ? "Selectat" : "Lipsește"}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Confirmare 18+</span>
                <span
                  className={acceptedAge ? "text-emerald-300" : "text-white/40"}
                >
                  {acceptedAge ? "Acceptată" : "Necesară"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Confidențialitate</span>
                <span
                  className={
                    acceptedPrivacy ? "text-emerald-300" : "text-white/40"
                  }
                >
                  {acceptedPrivacy ? "Acceptată" : "Necesară"}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={submitVerification}
              className={`mt-6 w-full rounded-full px-6 py-4 font-semibold transition ${
                canSubmit
                  ? "bg-rose-500 text-white hover:bg-rose-400"
                  : "cursor-not-allowed bg-white/10 text-white/30"
              }`}
            >
              Trimite către verificare
            </button>

            {!canSubmit && (
              <p className="mt-4 text-center text-xs leading-5 text-white/40">
                Adaugă documentul, selfie-ul și acceptă confirmările pentru a
                continua.
              </p>
            )}

            {canSubmit && (
              <p className="mt-4 text-center text-xs leading-5 text-emerald-300/80">
                Verificarea este pregătită pentru trimitere.
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-200">
              Important pentru siguranță
            </h2>

            <p className="mt-3 text-sm leading-7 text-amber-100/70">
              Nu încărca documente reale în etapa demo. În versiunea finală vom
              folosi reguli clare de confidențialitate, acces limitat și,
              ideal, un provider specializat de verificare vârstă/KYC.
            </p>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — Platformă 18+ pentru utilizatori adulți.
      </footer>
    </main>
  );
}