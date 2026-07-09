"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AdminStatus = "pending" | "approved" | "rejected" | "payment";
type PaymentStatus = "unpaid" | "processing" | "paid";

type DemoAccount = {
  id?: string;
  name?: string;
  email?: string;
  role?: "user" | "advertiser" | "admin";
  roleLabel?: string;
};

type DraftAd = {
  displayName?: string;
  age?: string | number;
  city?: string;
  phone?: string;
  description?: string;
  ownerName?: string;
  ownerEmail?: string;
  createdAt?: string;
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
};

type VerificationDraft = {
  documentName?: string;
  selfieName?: string;
  submittedAt?: string;
  ageConfirmed?: boolean;
  dataConfirmed?: boolean;
  rulesAccepted?: boolean;
};

function readJson<T>(key: string): T | null {
  const savedValue = localStorage.getItem(key);

  if (!savedValue) {
    return null;
  }

  try {
    return JSON.parse(savedValue) as T;
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

function formatDate(value?: string) {
  if (!value) {
    return "Nedisponibil";
  }

  try {
    return new Intl.DateTimeFormat("ro-RO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Nedisponibil";
  }
}

function getAdminStatusLabel(status: AdminStatus) {
  if (status === "approved") {
    return "Aprobat";
  }

  if (status === "payment") {
    return "Aprobat pentru plată";
  }

  if (status === "rejected") {
    return "Respins";
  }

  return "În moderare";
}

function getAdminStatusText(status: AdminStatus) {
  if (status === "approved") {
    return "Adminul a aprobat verificarea, dar încă nu a trimis anunțul către plată.";
  }

  if (status === "payment") {
    return "Adminul a aprobat anunțul pentru plată. Advertiserul poate continua către pagina de plată demo.";
  }

  if (status === "rejected") {
    return "Adminul a respins anunțul. Advertiserul trebuie să corecteze datele și să retrimită verificarea.";
  }

  return "Anunțul și verificarea 18+ au fost trimise către moderare. Adminul trebuie să analizeze datele.";
}

export default function VerificationSubmittedPage() {
  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [verificationDraft, setVerificationDraft] =
    useState<VerificationDraft | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAccount = readJson<DemoAccount>("luxe_demo_account");
    const savedDraft = readJson<DraftAd>("luxe_draft_ad");
    const savedVerification = readJson<VerificationDraft>(
      "luxe_verification_draft"
    );

    const savedAdminStatus =
      (localStorage.getItem("luxe_admin_status") as AdminStatus | null) ||
      "pending";

    const savedPaymentStatus =
      (localStorage.getItem("luxe_payment_status") as PaymentStatus | null) ||
      "unpaid";

    const savedPublished = localStorage.getItem("luxe_ad_published") === "true";

    setAccount(savedAccount);
    setDraftAd(savedDraft);
    setVerificationDraft(savedVerification);
    setAdminStatus(savedAdminStatus);
    setPaymentStatus(savedPaymentStatus);
    setIsPublished(savedPublished);
    setIsLoading(false);
  }, []);

  const packageTitle = getPackageTitle(draftAd);
  const packagePrice = getPackagePrice(draftAd);

  const progressScore = useMemo(() => {
    if (isPublished) {
      return 100;
    }

    if (paymentStatus === "paid") {
      return 95;
    }

    if (adminStatus === "payment") {
      return 75;
    }

    if (adminStatus === "approved") {
      return 65;
    }

    if (verificationDraft) {
      return 45;
    }

    if (draftAd) {
      return 25;
    }

    return 0;
  }, [adminStatus, draftAd, isPublished, paymentStatus, verificationDraft]);

  const mainActionHref = useMemo(() => {
    if (isPublished) {
      return "/profil/anunt-publicat-demo";
    }

    if (adminStatus === "payment" && paymentStatus !== "paid") {
      return "/plata";
    }

    if (adminStatus === "rejected") {
      return "/publica-anunt";
    }

    return "/cont/anunt";
  }, [adminStatus, isPublished, paymentStatus]);

  const mainActionLabel = useMemo(() => {
    if (isPublished) {
      return "Vezi profilul public";
    }

    if (adminStatus === "payment" && paymentStatus !== "paid") {
      return "Continuă către plată";
    }

    if (adminStatus === "rejected") {
      return "Corectează anunțul";
    }

    return "Vezi statusul anunțului";
  }, [adminStatus, isPublished, paymentStatus]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Se încarcă
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Pregătim confirmarea verificării...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  if (!draftAd || !verificationDraft) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-3xl">
              ⚠️
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Verificare lipsă
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Nu există o verificare trimisă.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Pentru a ajunge aici, trebuie mai întâi să creezi un anunț și să
              trimiți verificarea 18+ demo.
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
              Verificare trimisă
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/cont" className="hover:text-white">
              Dashboard
            </Link>

            <Link href="/cont/anunt" className="hover:text-white">
              Status anunț
            </Link>

            <Link href="/admin-login-luxe" className="hover:text-white">
              Admin demo
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>
          </div>

          <Link
            href="/cont/anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Vezi status
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
              Anunț trimis către moderare
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Verificarea 18+ a fost trimisă cu succes.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Anunțul este acum în zona de moderare. Adminul verifică datele
              demo, apoi poate aproba, respinge sau trimite anunțul către plata
              pachetului.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={mainActionHref}
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                {mainActionLabel}
              </Link>

              <Link
                href="/admin-login-luxe"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Intră în admin demo
              </Link>

              <Link
                href="/prezentare"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Prezentare MVP
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                  Progres publicare
                </p>

                <h2 className="mt-3 text-4xl font-bold">{progressScore}%</h2>
              </div>

              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">
                {getAdminStatusLabel(adminStatus)}
              </span>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${progressScore}%` }}
              />
            </div>

            <p className="mt-5 leading-7 text-white/60">
              {getAdminStatusText(adminStatus)}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Anunț</p>
                <p className="mt-2 font-semibold">Creat</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">18+</p>
                <p className="mt-2 font-semibold">Trimis</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Plată</p>
                <p className="mt-2 font-semibold">
                  {paymentStatus === "paid" ? "Achitată" : "În așteptare"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Timeline
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Pașii publicării
            </h2>

            <div className="mt-8 space-y-4">
              {[
                {
                  title: "Anunț creat",
                  text: "Advertiserul a completat formularul de publicare.",
                  active: true,
                },
                {
                  title: "Verificare 18+ trimisă",
                  text: "Documentul demo, selfie-ul demo și confirmările au fost salvate local.",
                  active: true,
                },
                {
                  title: "Moderare admin",
                  text: "Adminul analizează anunțul și decide dacă poate continua către plată.",
                  active:
                    adminStatus === "pending" ||
                    adminStatus === "approved" ||
                    adminStatus === "payment" ||
                    adminStatus === "rejected",
                },
                {
                  title: "Aprobare pentru plată",
                  text: "Advertiserul primește acces la pagina de plată doar după decizia adminului.",
                  active: adminStatus === "payment" || paymentStatus === "paid",
                },
                {
                  title: "Profil public",
                  text: "După plata demo, profilul apare în lista publică.",
                  active: isPublished,
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className={`rounded-[1.5rem] border p-5 ${
                    step.active
                      ? "border-emerald-500/20 bg-emerald-500/10"
                      : "border-white/10 bg-black/25"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                        step.active
                          ? "bg-emerald-400 text-black"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-bold">{step.title}</h3>

                      <p className="mt-2 text-sm leading-7 text-white/55">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6 shadow-2xl md:p-8">
            <h2 className="text-2xl font-bold text-sky-200">
              Ce trebuie să facă advertiserul acum?
            </h2>

            <p className="mt-4 leading-8 text-sky-100/75">
              Advertiserul trebuie să urmărească statusul anunțului din cont.
              Dacă adminul aprobă pentru plată, apare butonul de plată. Dacă
              anunțul este respins, advertiserul îl poate corecta și retrimite.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cont/anunt"
                className="rounded-full bg-white px-6 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Status anunț
              </Link>

              <Link
                href="/cont"
                className="rounded-full border border-sky-500/20 px-6 py-3 text-center font-semibold text-sky-100 transition hover:bg-sky-500/10"
              >
                Dashboard advertiser
              </Link>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Anunț trimis
            </p>

            <div className="mt-5 rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                  {packageTitle}
                </span>

                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
                  {getAdminStatusLabel(adminStatus)}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                {draftAd.displayName || "Profil Luxe"}
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
              Verificare primită
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Document demo</p>
                <p className="mt-2 font-semibold text-white">
                  {verificationDraft.documentName || "Selectat"}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Selfie demo</p>
                <p className="mt-2 font-semibold text-white">
                  {verificationDraft.selfieName || "Selectat"}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Trimis la</p>
                <p className="mt-2 font-semibold text-white">
                  {formatDate(verificationDraft.submittedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Pachet advertiser
            </p>

            <h2 className="mt-3 text-2xl font-bold text-amber-100">
              {packageTitle}
            </h2>

            <p className="mt-3 text-sm leading-7 text-amber-100/70">
              Aceste informații sunt pentru zona advertiserului. Utilizatorii
              publici nu văd pachetul, costul sau durata anunțului.
            </p>

            <div className="mt-5 rounded-3xl border border-amber-500/20 bg-black/20 p-4">
              <p className="text-sm text-amber-100/50">Cost demo</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {packagePrice ? `${packagePrice} RON` : "Neales"}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Acces rapid</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/admin-login-luxe"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Admin demo
              </Link>

              <Link
                href="/cont/anunt"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Status anunț
              </Link>

              <Link
                href="/publica-anunt"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Editează / retrimite
              </Link>

              {adminStatus === "payment" && paymentStatus !== "paid" && (
                <Link
                  href="/plata"
                  className="rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Continuă la plată
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Notă demo
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              În această versiune, verificarea este salvată în localStorage.
              Pentru producție, zona trebuie conectată la upload securizat,
              bază de date, audit admin și procesator de plăți.
            </p>

            {account?.email && (
              <p className="mt-4 rounded-2xl border border-rose-500/20 bg-black/20 px-4 py-3 text-sm text-rose-100/70">
                Cont curent: {account.email}
              </p>
            )}
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — verificare 18+ trimisă.
      </footer>
    </main>
  );
}