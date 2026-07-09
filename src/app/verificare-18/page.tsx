"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DraftAd = {
  displayName?: string;
  age?: string | number;
  city?: string;
  phone?: string;
  description?: string;
  selectedPackage?: {
    id?: string;
    title?: string;
    name?: string;
    label?: string;
    price?: number;
    priceRon?: number;
    amount?: number;
    duration?: string;
    days?: number;
  };
  photoNames?: string[];
  ownerName?: string;
  ownerEmail?: string;
  createdAt?: string;
};

type VerificationErrors = {
  documentName?: string;
  selfieName?: string;
  ageConfirmed?: string;
  dataConfirmed?: string;
  rulesAccepted?: string;
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

function getPackageTitle(draftAd?: DraftAd | null) {
  return (
    draftAd?.selectedPackage?.title ||
    draftAd?.selectedPackage?.name ||
    draftAd?.selectedPackage?.label ||
    "Pachet neselectat"
  );
}

function getPackagePrice(draftAd?: DraftAd | null) {
  return (
    draftAd?.selectedPackage?.price ??
    draftAd?.selectedPackage?.priceRon ??
    draftAd?.selectedPackage?.amount ??
    0
  );
}

export default function AgeVerificationPage() {
  const router = useRouter();

  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [selfieName, setSelfieName] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [errors, setErrors] = useState<VerificationErrors>({});

  useEffect(() => {
    setDraftAd(readDraftAd());
  }, []);

  const packageTitle = getPackageTitle(draftAd);
  const packagePrice = getPackagePrice(draftAd);

  const completionScore = useMemo(() => {
    let score = 0;

    if (documentName) {
      score += 25;
    }

    if (selfieName) {
      score += 25;
    }

    if (ageConfirmed) {
      score += 20;
    }

    if (dataConfirmed) {
      score += 15;
    }

    if (rulesAccepted) {
      score += 15;
    }

    return Math.min(score, 100);
  }, [ageConfirmed, dataConfirmed, documentName, rulesAccepted, selfieName]);

  function clearError(field: keyof VerificationErrors) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function validateForm() {
    const newErrors: VerificationErrors = {};

    if (!documentName) {
      newErrors.documentName = "Selectează un document demo.";
    }

    if (!selfieName) {
      newErrors.selfieName = "Selectează un selfie demo.";
    }

    if (!ageConfirmed) {
      newErrors.ageConfirmed = "Trebuie să confirmi că ai minimum 18 ani.";
    }

    if (!dataConfirmed) {
      newErrors.dataConfirmed =
        "Trebuie să confirmi că datele introduse sunt corecte.";
    }

    if (!rulesAccepted) {
      newErrors.rulesAccepted =
        "Trebuie să accepți regulile înainte de trimitere.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function submitVerification() {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    localStorage.setItem(
      "luxe_verification_draft",
      JSON.stringify({
        documentName,
        selfieName,
        submittedAt: new Date().toISOString(),
        ageConfirmed: true,
        dataConfirmed: true,
        rulesAccepted: true,
      })
    );

    localStorage.setItem("luxe_admin_status", "pending");

    router.push("/verificare-trimisa");
  }

  if (!draftAd) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-3xl">
              ⚠️
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Verificare indisponibilă
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Nu există un anunț pregătit pentru verificare.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Pentru a trimite verificarea 18+, trebuie mai întâi să completezi
              formularul de publicare anunț.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/publica-anunt"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Publică anunț
              </Link>

              <Link
                href="/cont"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Cont advertiser
              </Link>

              <Link
                href="/prezentare"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Prezentare MVP
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
              Verificare 18+
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/publica-anunt" className="hover:text-white">
              Anunț
            </Link>

            <Link href="/cont/anunt" className="hover:text-white">
              Status
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href="/iesire" className="hover:text-white">
              Ieșire
            </Link>
          </div>

          <Link
            href="/cont"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Cont advertiser
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
              Siguranță înainte de publicare
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Trimite verificarea 18+ pentru anunțul tău.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Înainte ca anunțul să ajungă la moderare admin și plată,
              advertiserul trebuie să confirme vârsta și datele profilului.
              În demo salvăm doar numele fișierelor selectate.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#formular-verificare"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Completează verificarea
              </a>

              <Link
                href="/publica-anunt"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Înapoi la anunț
              </Link>

              <Link
                href="/reguli"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Citește regulile
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                  Progres verificare
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  {completionScore}%
                </h2>
              </div>

              <div className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200">
                Verificare demo
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${completionScore}%` }}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Document</p>
                <p className="mt-2 font-semibold">
                  {documentName ? "Selectat" : "Lipsă"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Selfie</p>
                <p className="mt-2 font-semibold">
                  {selfieName ? "Selectat" : "Lipsă"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Confirmări</p>
                <p className="mt-2 font-semibold">
                  {ageConfirmed && dataConfirmed && rulesAccepted
                    ? "Complete"
                    : "În lucru"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="formular-verificare"
        className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr]"
      >
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8 rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Formular verificare
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Fișiere demo și confirmări
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/60">
                Pentru prezentare, fișierele nu se încarcă pe server. Salvăm
                doar numele lor în browser pentru a demonstra flow-ul complet.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Document demo
                  </label>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0];
                      setDocumentName(selectedFile?.name || "");
                      clearError("documentName");
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                  />

                  <p className="mt-3 text-sm leading-7 text-white/45">
                    Exemplu demo: poză document sau PDF. Nu folosi documente
                    reale în demo.
                  </p>

                  {documentName && (
                    <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      Selectat: {documentName}
                    </div>
                  )}

                  {errors.documentName && (
                    <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.documentName}
                    </p>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Selfie demo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0];
                      setSelfieName(selectedFile?.name || "");
                      clearError("selfieName");
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                  />

                  <p className="mt-3 text-sm leading-7 text-white/45">
                    Exemplu demo: selfie de verificare. În producție ar fi
                    upload securizat.
                  </p>

                  {selfieName && (
                    <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      Selectat: {selfieName}
                    </div>
                  )}

                  {errors.selfieName && (
                    <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.selfieName}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
                <h3 className="text-xl font-bold">
                  Confirmări obligatorii
                </h3>

                <div className="mt-5 space-y-4">
                  <label className="flex cursor-pointer gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/65 transition hover:bg-white/[0.07]">
                    <input
                      type="checkbox"
                      checked={ageConfirmed}
                      onChange={(event) => {
                        setAgeConfirmed(event.target.checked);
                        clearError("ageConfirmed");
                      }}
                      className="mt-1 h-4 w-4 shrink-0"
                    />

                    <span>
                      Confirm că persoana din anunț are minimum 18 ani și că
                      platforma este destinată exclusiv adulților.
                    </span>
                  </label>

                  {errors.ageConfirmed && (
                    <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.ageConfirmed}
                    </p>
                  )}

                  <label className="flex cursor-pointer gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/65 transition hover:bg-white/[0.07]">
                    <input
                      type="checkbox"
                      checked={dataConfirmed}
                      onChange={(event) => {
                        setDataConfirmed(event.target.checked);
                        clearError("dataConfirmed");
                      }}
                      className="mt-1 h-4 w-4 shrink-0"
                    />

                    <span>
                      Confirm că datele profilului sunt corecte și că nu folosesc
                      informații false, frauduloase sau aparținând altei persoane.
                    </span>
                  </label>

                  {errors.dataConfirmed && (
                    <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.dataConfirmed}
                    </p>
                  )}

                  <label className="flex cursor-pointer gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/65 transition hover:bg-white/[0.07]">
                    <input
                      type="checkbox"
                      checked={rulesAccepted}
                      onChange={(event) => {
                        setRulesAccepted(event.target.checked);
                        clearError("rulesAccepted");
                      }}
                      className="mt-1 h-4 w-4 shrink-0"
                    />

                    <span>
                      Accept{" "}
                      <Link
                        href="/reguli"
                        className="font-semibold text-rose-300"
                      >
                        regulile
                      </Link>
                      ,{" "}
                      <Link
                        href="/termeni"
                        className="font-semibold text-rose-300"
                      >
                        termenii și confidențialitatea
                      </Link>{" "}
                      platformei.
                    </span>
                  </label>

                  {errors.rulesAccepted && (
                    <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.rulesAccepted}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={submitVerification}
                  className="mt-6 w-full rounded-full bg-rose-500 px-8 py-4 font-semibold text-white transition hover:bg-rose-400"
                >
                  Trimite verificarea către moderare
                </button>

                <p className="mt-4 text-center text-sm leading-7 text-white/45">
                  După trimitere, anunțul ajunge în statusul „În moderare” și
                  poate fi analizat în panoul admin.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Anunț în verificare
            </p>

            <div className="mt-5 rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                  {packageTitle}
                </span>

                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
                  Draft
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                {draftAd.displayName || "Nume profil"}
                {draftAd.age ? `, ${draftAd.age}` : ""}
              </h2>

              <p className="mt-2 text-sm text-white/45">
                {draftAd.city || "Oraș nespecificat"}
              </p>

              <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/60">
                {draftAd.description ||
                  "Descrierea profilului apare aici după completarea anunțului."}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Pachet ales
            </p>

            <h2 className="mt-3 text-2xl font-bold text-emerald-100">
              {packageTitle}
            </h2>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Cost demo</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {packagePrice ? `${packagePrice} RON` : "Neales"}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Plată</p>
                <p className="mt-2 font-semibold text-white">
                  După aprobare admin
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Ce se întâmplă după trimitere?
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-sky-100/75">
              <p>1. Verificarea demo este salvată în browser.</p>
              <p>2. Anunțul apare în panoul admin ca „În moderare”.</p>
              <p>3. Adminul poate aproba, respinge sau aproba pentru plată.</p>
              <p>4. Advertiserul plătește pachetul doar după aprobare.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Notă demo
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              Nu încărca documente reale în demo. Pentru producție, această zonă
              trebuie conectată la upload securizat, storage privat și verificare
              manuală.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/publica-anunt"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Înapoi la anunț
              </Link>

              <Link
                href="/cont/anunt"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Status anunț
              </Link>

              <Link
                href="/admin-login-luxe"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Admin demo
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — verificare 18+ demo.
      </footer>
    </main>
  );
}