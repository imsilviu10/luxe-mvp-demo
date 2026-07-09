"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AdminStatus = "pending" | "approved" | "rejected" | "payment";
type PaymentStatus = "unpaid" | "processing" | "paid";

type SelectedPackage = {
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

type DraftAd = {
  displayName?: string;
  age?: string | number;
  city?: string;
  phone?: string;
  description?: string;
  selectedPackage?: SelectedPackage;
  photoNames?: string[];
};

type VerificationDraft = {
  documentName?: string;
  selfieName?: string;
  submittedAt?: string;
};

const adminStatusConfig = {
  pending: {
    label: "În moderare",
    title: "Anunțul așteaptă verificarea adminului.",
    description:
      "Datele au fost trimise și urmează să fie verificate. După aprobare, advertiserul poate continua către plată.",
    badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  },
  approved: {
    label: "Aprobat",
    title: "Anunțul este aprobat.",
    description:
      "Anunțul a trecut de moderare. Poți continua către plata pachetului ales.",
    badgeClass: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  },
  payment: {
    label: "Aprobat pentru plată",
    title: "Anunțul este gata pentru plată.",
    description:
      "Adminul a aprobat anunțul pentru plată. După plata demo, profilul devine public.",
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  },
  rejected: {
    label: "Respins",
    title: "Anunțul trebuie revizuit.",
    description:
      "Anunțul nu poate continua în forma curentă. Revizuiește informațiile și retrimite-l.",
    badgeClass: "border-rose-500/20 bg-rose-500/10 text-rose-200",
  },
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

function formatDate(value?: string) {
  if (!value) {
    return "Nu există încă";
  }

  try {
    return new Intl.DateTimeFormat("ro-RO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "Dată indisponibilă";
  }
}

function getPackageTitle(packageData?: SelectedPackage) {
  return (
    packageData?.title ||
    packageData?.name ||
    packageData?.label ||
    "Pachet neselectat"
  );
}

function getPackagePrice(packageData?: SelectedPackage) {
  return packageData?.price ?? packageData?.priceRon ?? packageData?.amount ?? 0;
}

function getPackageDuration(packageData?: SelectedPackage) {
  if (packageData?.duration) {
    return packageData.duration;
  }

  if (packageData?.days) {
    return `${packageData.days} zile`;
  }

  return "Durată demo";
}

export default function AdvertiserAdStatusPage() {
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [verificationDraft, setVerificationDraft] =
    useState<VerificationDraft | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [isPublished, setIsPublished] = useState(false);

  function loadStatusData() {
    const savedDraftAd = readJson<DraftAd>("luxe_draft_ad");
    const savedVerification =
      readJson<VerificationDraft>("luxe_verification_draft");

    const savedAdminStatus =
      (localStorage.getItem("luxe_admin_status") as AdminStatus | null) ||
      "pending";

    const savedPaymentStatus =
      (localStorage.getItem("luxe_payment_status") as PaymentStatus | null) ||
      "unpaid";

    setDraftAd(savedDraftAd);
    setVerificationDraft(savedVerification);

    if (
      savedAdminStatus === "pending" ||
      savedAdminStatus === "approved" ||
      savedAdminStatus === "rejected" ||
      savedAdminStatus === "payment"
    ) {
      setAdminStatus(savedAdminStatus);
    } else {
      setAdminStatus("pending");
    }

    if (
      savedPaymentStatus === "unpaid" ||
      savedPaymentStatus === "processing" ||
      savedPaymentStatus === "paid"
    ) {
      setPaymentStatus(savedPaymentStatus);
    } else {
      setPaymentStatus("unpaid");
    }

    setIsPublished(localStorage.getItem("luxe_ad_published") === "true");
  }

  useEffect(() => {
    loadStatusData();

    function handleFocus() {
      loadStatusData();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const hasDraft = Boolean(draftAd);
  const hasVerification = Boolean(verificationDraft);
  const canPay =
    (adminStatus === "payment" || adminStatus === "approved") &&
    paymentStatus !== "paid";
  const isPaid = paymentStatus === "paid";
  const isPublic = isPublished || isPaid;

  const packageTitle = getPackageTitle(draftAd?.selectedPackage);
  const packagePrice = getPackagePrice(draftAd?.selectedPackage);
  const packageDuration = getPackageDuration(draftAd?.selectedPackage);

  const progress = useMemo(() => {
    let value = 0;

    if (hasDraft) {
      value += 20;
    }

    if (hasVerification) {
      value += 20;
    }

    if (adminStatus === "approved" || adminStatus === "payment") {
      value += 20;
    }

    if (canPay || isPaid) {
      value += 15;
    }

    if (isPaid) {
      value += 15;
    }

    if (isPublic) {
      value += 10;
    }

    return Math.min(value, 100);
  }, [adminStatus, canPay, hasDraft, hasVerification, isPaid, isPublic]);

  const primaryAction = useMemo(() => {
    if (!hasDraft) {
      return {
        href: "/publica-anunt",
        label: "Publică primul anunț",
        description: "Nu există încă un anunț creat.",
      };
    }

    if (!hasVerification) {
      return {
        href: "/verificare-18",
        label: "Continuă verificarea",
        description: "Anunțul are nevoie de verificarea 18+.",
      };
    }

    if (adminStatus === "rejected") {
      return {
        href: "/publica-anunt",
        label: "Revizuiește anunțul",
        description: "Anunțul a fost respins și trebuie modificat.",
      };
    }

    if (canPay) {
      return {
        href: "/plata",
        label: "Continuă la plată",
        description: "Anunțul este aprobat pentru plată.",
      };
    }

    if (isPublic) {
      return {
        href: "/profil/anunt-publicat-demo",
        label: "Vezi profilul public",
        description: "Anunțul este public în demo.",
      };
    }

    return {
      href: "/cont/anunt",
      label: "Actualizează statusul",
      description: "Anunțul așteaptă moderarea adminului.",
    };
  }, [adminStatus, canPay, hasDraft, hasVerification, isPublic]);

  const timeline = [
    {
      title: "Anunț creat",
      description: hasDraft
        ? "Formularul de publicare a fost completat."
        : "Creează primul anunț pentru a porni flow-ul.",
      done: hasDraft,
      href: "/publica-anunt",
    },
    {
      title: "Verificare 18+",
      description: hasVerification
        ? "Verificarea demo a fost trimisă."
        : "Trimite verificarea pentru ca adminul să poată analiza anunțul.",
      done: hasVerification,
      href: "/verificare-18",
    },
    {
      title: "Moderare admin",
      description: adminStatusConfig[adminStatus].description,
      done: adminStatus === "approved" || adminStatus === "payment",
      href: "/admin",
    },
    {
      title: "Plată pachet",
      description: isPaid
        ? "Plata demo este confirmată."
        : canPay
          ? "Plata este disponibilă acum."
          : "Plata se activează după aprobarea adminului.",
      done: isPaid,
      href: "/plata",
    },
    {
      title: "Publicare profil",
      description: isPublic
        ? "Profilul este activ în lista publică."
        : "Profilul devine public după plată.",
      done: isPublic,
      href: "/profiluri",
    },
  ];

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
              Status anunț
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/cont" className="hover:text-white">
              Dashboard
            </Link>

            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/profiluri" className="hover:text-white">
              Profiluri
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
              Monitorizare completă
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Status detaliat pentru anunțul tău.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Urmărește fiecare etapă: formular, verificare 18+, moderare admin,
              plată și publicarea profilului în lista publică.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={primaryAction.href}
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                {primaryAction.label}
              </Link>

              <button
                type="button"
                onClick={loadStatusData}
                className="rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:bg-white/80"
              >
                Actualizează
              </button>

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
                  Progres total
                </p>

                <h2 className="mt-3 text-4xl font-bold">{progress}%</h2>
              </div>

              <div
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${adminStatusConfig[adminStatus].badgeClass}`}
              >
                {adminStatusConfig[adminStatus].label}
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-white/60">
              {primaryAction.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Etape
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Timeline publicare
              </h2>
            </div>

            <div className="space-y-4">
              {timeline.map((item, index) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="grid gap-4 rounded-3xl border border-white/10 bg-black/30 p-5 transition hover:bg-white/[0.05] sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${
                      item.done
                        ? "bg-emerald-500 text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {item.done ? "✓" : index + 1}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>

                    <p className="mt-1 text-sm leading-6 text-white/55">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`rounded-full border px-4 py-2 text-center text-xs font-semibold ${
                      item.done
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                        : "border-white/10 bg-white/[0.04] text-white/50"
                    }`}
                  >
                    {item.done ? "Complet" : "În lucru"}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Detalii anunț
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Informații publicare
              </h2>
            </div>

            {draftAd ? (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Nume profil</p>
                  <p className="mt-2 text-xl font-bold">
                    {draftAd.displayName || "Nume indisponibil"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Oraș</p>
                  <p className="mt-2 text-xl font-bold">
                    {draftAd.city || "Oraș nespecificat"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Vârstă</p>
                  <p className="mt-2 text-xl font-bold">
                    {draftAd.age || "Necompletat"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Telefon</p>
                  <p className="mt-2 text-xl font-bold">
                    {draftAd.phone || "Necompletat"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5 md:col-span-2">
                  <p className="text-sm text-white/45">Descriere</p>
                  <p className="mt-3 leading-8 text-white/65">
                    {draftAd.description ||
                      "Descrierea anunțului nu a fost completată."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
                <h3 className="text-2xl font-bold text-amber-200">
                  Nu există anunț creat.
                </h3>

                <p className="mt-3 max-w-2xl leading-8 text-amber-100/70">
                  Creează primul anunț pentru a porni verificarea, moderarea și
                  plata demo.
                </p>

                <Link
                  href="/publica-anunt"
                  className="mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
                >
                  Publică anunț
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Verificare 18+
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Documente demo
              </h2>
            </div>

            {verificationDraft ? (
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Document</p>
                  <p className="mt-2 break-all font-semibold">
                    {verificationDraft.documentName || "Nespecificat"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Selfie</p>
                  <p className="mt-2 break-all font-semibold">
                    {verificationDraft.selfieName || "Nespecificat"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Trimis la</p>
                  <p className="mt-2 text-sm font-semibold leading-6">
                    {formatDate(verificationDraft.submittedAt)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
                <h3 className="text-2xl font-bold text-sky-200">
                  Verificarea nu a fost trimisă.
                </h3>

                <p className="mt-3 max-w-2xl leading-8 text-sky-100/70">
                  Pentru ca anunțul să poată fi moderat, trimite verificarea
                  demo 18+.
                </p>

                <Link
                  href="/verificare-18"
                  className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/80"
                >
                  Trimite verificarea
                </Link>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Decizie admin
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              {adminStatusConfig[adminStatus].title}
            </h2>

            <div
              className={`mt-5 rounded-3xl border p-5 ${adminStatusConfig[adminStatus].badgeClass}`}
            >
              <p className="text-sm font-semibold">
                {adminStatusConfig[adminStatus].label}
              </p>

              <p className="mt-3 text-sm leading-7 opacity-80">
                {adminStatusConfig[adminStatus].description}
              </p>
            </div>

            <Link
              href="/admin-login-luxe"
              className="mt-5 block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Login admin demo
            </Link>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Pachet și plată
            </p>

            <h2 className="mt-3 text-2xl font-bold text-emerald-100">
              {packageTitle}
            </h2>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Cost</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {packagePrice ? `${packagePrice} RON` : "Neales"}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Durată</p>
                <p className="mt-2 font-semibold text-white">
                  {packageDuration}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Status plată</p>
                <p className="mt-2 font-semibold text-white">
                  {isPaid ? "Plată confirmată" : "Plată neconfirmată"}
                </p>
              </div>
            </div>

            {canPay && (
              <Link
                href="/plata"
                className="mt-5 block rounded-full bg-emerald-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-400"
              >
                Continuă la plată
              </Link>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <h2 className="text-xl font-bold">Acțiuni rapide</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/cont"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Dashboard advertiser
              </Link>

              <Link
                href="/publica-anunt"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Editează / publică anunț
              </Link>

              <Link
                href="/verificare-trimisa"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Pagina verificare
              </Link>

              {isPublic && (
                <Link
                  href="/profil/anunt-publicat-demo"
                  className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Vezi profil public
                </Link>
              )}

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Lista profiluri
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Notă demo
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/75">
              În versiunea demo, statusurile sunt salvate în localStorage.
              Într-o versiune reală, aceste date trebuie mutate într-o bază de
              date securizată.
            </p>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — status anunț advertiser.
      </footer>
    </main>
  );
}