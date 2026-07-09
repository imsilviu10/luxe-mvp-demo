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
  loggedInAt?: string;
};

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

const statusStyles = {
  pending: {
    label: "În moderare",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    description: "Anunțul așteaptă verificarea și decizia adminului.",
  },
  approved: {
    label: "Aprobat",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-200",
    description: "Anunțul este aprobat. Poți continua către plată.",
  },
  payment: {
    label: "Aprobat pentru plată",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
    description: "Adminul a aprobat anunțul pentru plată.",
  },
  rejected: {
    label: "Respins",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-200",
    description: "Anunțul trebuie revizuit înainte de publicare.",
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
  const price =
    packageData?.price ?? packageData?.priceRon ?? packageData?.amount ?? 0;

  return price;
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

export default function AdvertiserDashboardPage() {
  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [verificationDraft, setVerificationDraft] =
    useState<VerificationDraft | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [isPublished, setIsPublished] = useState(false);

  function loadDashboardData() {
    const savedAccount = readJson<DemoAccount>("luxe_demo_account");
    const savedDraftAd = readJson<DraftAd>("luxe_draft_ad");
    const savedVerification =
      readJson<VerificationDraft>("luxe_verification_draft");

    const savedAdminStatus =
      (localStorage.getItem("luxe_admin_status") as AdminStatus | null) ||
      "pending";

    const savedPaymentStatus =
      (localStorage.getItem("luxe_payment_status") as PaymentStatus | null) ||
      "unpaid";

    const savedPublished = localStorage.getItem("luxe_ad_published") === "true";

    setAccount(savedAccount);
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

    setIsPublished(savedPublished);
  }

  useEffect(() => {
    loadDashboardData();

    function handleFocus() {
      loadDashboardData();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const packageTitle = getPackageTitle(draftAd?.selectedPackage);
  const packagePrice = getPackagePrice(draftAd?.selectedPackage);
  const packageDuration = getPackageDuration(draftAd?.selectedPackage);

  const hasDraft = Boolean(draftAd);
  const hasVerification = Boolean(verificationDraft);
  const isPaymentReady =
    adminStatus === "payment" || adminStatus === "approved";
  const isPaid = paymentStatus === "paid";
  const publishedReady = isPublished || isPaid;

  const completionPercentage = useMemo(() => {
    let score = 0;

    if (hasDraft) {
      score += 20;
    }

    if (hasVerification) {
      score += 20;
    }

    if (adminStatus === "approved" || adminStatus === "payment") {
      score += 20;
    }

    if (isPaymentReady) {
      score += 15;
    }

    if (isPaid) {
      score += 15;
    }

    if (publishedReady) {
      score += 10;
    }

    return Math.min(score, 100);
  }, [
    adminStatus,
    hasDraft,
    hasVerification,
    isPaid,
    isPaymentReady,
    publishedReady,
  ]);

  const mainAction = useMemo(() => {
    if (!hasDraft) {
      return {
        title: "Publică primul anunț",
        description:
          "Completează formularul de publicare și alege pachetul potrivit.",
        href: "/publica-anunt",
        button: "Publică anunț",
      };
    }

    if (!hasVerification) {
      return {
        title: "Continuă verificarea 18+",
        description:
          "Trimite verificarea demo pentru ca anunțul să poată intra în moderare.",
        href: "/verificare-18",
        button: "Continuă verificarea",
      };
    }

    if (adminStatus === "rejected") {
      return {
        title: "Anunțul trebuie revizuit",
        description:
          "Revizuiește informațiile și retrimite anunțul pentru moderare.",
        href: "/publica-anunt",
        button: "Revizuiește anunțul",
      };
    }

    if (isPaymentReady && !isPaid) {
      return {
        title: "Continuă către plată",
        description:
          "Adminul a aprobat anunțul. Următorul pas este plata pachetului ales.",
        href: "/plata",
        button: "Continuă la plată",
      };
    }

    if (publishedReady) {
      return {
        title: "Anunțul este public",
        description:
          "Profilul demo este activ și poate fi văzut în lista publică.",
        href: "/profil/anunt-publicat-demo",
        button: "Vezi profilul public",
      };
    }

    return {
      title: "Așteaptă moderarea",
      description:
        "Anunțul este trimis către admin. Poți verifica statusul complet în pagina anunțului.",
      href: "/cont/anunt",
      button: "Vezi status anunț",
    };
  }, [adminStatus, hasDraft, hasVerification, isPaid, isPaymentReady, publishedReady]);

  const timeline = [
    {
      title: "Formular anunț",
      description: hasDraft
        ? "Anunțul a fost completat."
        : "Completează primul anunț.",
      done: hasDraft,
      href: "/publica-anunt",
    },
    {
      title: "Verificare 18+",
      description: hasVerification
        ? "Verificarea demo a fost trimisă."
        : "Trimite verificarea înainte de publicare.",
      done: hasVerification,
      href: "/verificare-18",
    },
    {
      title: "Moderare admin",
      description: statusStyles[adminStatus].description,
      done: adminStatus === "approved" || adminStatus === "payment",
      href: "/cont/anunt",
    },
    {
      title: "Plată",
      description: isPaid
        ? "Plata demo este confirmată."
        : isPaymentReady
          ? "Plata este disponibilă."
          : "Plata se activează după aprobare.",
      done: isPaid,
      href: "/plata",
    },
    {
      title: "Publicare",
      description: publishedReady
        ? "Profilul este public."
        : "Profilul apare public după plată.",
      done: publishedReady,
      href: "/profiluri",
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              Cont advertiser
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/cont/anunt" className="hover:text-white">
              Status anunț
            </Link>

            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/iesire" className="hover:text-white">
              Ieșire
            </Link>
          </div>

          <Link
            href="/publica-anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Publică anunț
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
              Dashboard premium advertiser
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Gestionează anunțul, verificarea și plata.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Aici vezi statusul complet al contului de advertiser, pachetul
              ales, verificarea 18+, moderarea admin și publicarea profilului.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={mainAction.href}
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                {mainAction.button}
              </Link>

              <Link
                href="/cont/anunt"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Vezi status complet
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
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                  Progres publicare
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {completionPercentage}%
                </h2>
              </div>

              <div
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${statusStyles[adminStatus].className}`}
              >
                {statusStyles[adminStatus].label}
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Anunț</p>
                <p className="mt-2 font-semibold">
                  {hasDraft ? "Creat" : "Lipsă"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Plată</p>
                <p className="mt-2 font-semibold">
                  {isPaid ? "Achitată" : "Neachitată"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Publicare</p>
                <p className="mt-2 font-semibold">
                  {publishedReady ? "Activă" : "În lucru"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                  Următorul pas
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {mainAction.title}
                </h2>

                <p className="mt-4 max-w-2xl leading-8 text-white/60">
                  {mainAction.description}
                </p>
              </div>

              <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-5">
                <p className="text-sm font-semibold text-rose-200">
                  Recomandare
                </p>

                <p className="mt-3 text-sm leading-7 text-rose-100/75">
                  Pentru prezentare, parcurge flow-ul complet: creare anunț,
                  verificare, aprobare admin, plată demo și profil public.
                </p>

                <Link
                  href={mainAction.href}
                  className="mt-5 inline-flex rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  {mainAction.button}
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Timeline
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Statusul publicării
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
                    {item.done ? "Complet" : "În așteptare"}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Anunț curent
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Previzualizare advertiser
              </h2>
            </div>

            {draftAd ? (
              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
                  <div className="flex aspect-[4/5] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.04] text-center">
                    <div>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 text-3xl">
                        ✦
                      </div>

                      <p className="mt-4 font-semibold text-white/80">
                        Galerie demo
                      </p>

                      <p className="mt-2 text-sm text-white/45">
                        {draftAd.photoNames?.length
                          ? `${draftAd.photoNames.length} fișiere selectate`
                          : "Fără fotografii demo"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                      {publishedReady ? "Activ" : "Draft"}
                    </span>

                    <span className="rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200">
                      {packageTitle}
                    </span>
                  </div>

                  <h3 className="mt-5 text-3xl font-bold">
                    {draftAd.displayName || "Nume profil"}
                    {draftAd.age ? `, ${draftAd.age}` : ""}
                  </h3>

                  <p className="mt-2 text-white/50">
                    {draftAd.city || "Oraș nespecificat"}
                  </p>

                  <p className="mt-5 max-w-2xl leading-8 text-white/65">
                    {draftAd.description ||
                      "Descrierea anunțului va apărea aici după completarea formularului."}
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm text-white/45">Telefon</p>
                      <p className="mt-2 font-semibold">
                        {draftAd.phone || "Necompletat"}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm text-white/45">Pachet</p>
                      <p className="mt-2 font-semibold">{packageTitle}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {publishedReady && (
                      <Link
                        href="/profil/anunt-publicat-demo"
                        className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                      >
                        Vezi profil public
                      </Link>
                    )}

                    <Link
                      href="/cont/anunt"
                      className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                    >
                      Status detaliat
                    </Link>

                    <Link
                      href="/publica-anunt"
                      className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                    >
                      Editează demo
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
                <h3 className="text-2xl font-bold text-amber-200">
                  Nu există anunț creat încă.
                </h3>

                <p className="mt-3 max-w-2xl leading-8 text-amber-100/70">
                  Creează primul anunț pentru a vedea aici previzualizarea,
                  pachetul ales și statusul de publicare.
                </p>

                <Link
                  href="/publica-anunt"
                  className="mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
                >
                  Publică primul anunț
                </Link>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Cont
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              {account?.name || "Advertiser Demo"}
            </h2>

            <p className="mt-2 break-all text-sm text-white/50">
              {account?.email || "advertiser.demo@luxe.ro"}
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-white/45">Rol</p>
                <p className="mt-2 font-semibold">Advertiser</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-white/45">Ultimul login</p>
                <p className="mt-2 text-sm font-semibold leading-6">
                  {formatDate(account?.loggedInAt)}
                </p>
              </div>
            </div>

            <Link
              href="/iesire"
              className="mt-5 block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Ieșire din cont
            </Link>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Pachet
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
                <p className="text-sm text-emerald-100/50">Durată</p>
                <p className="mt-2 font-semibold text-white">
                  {packageDuration}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Status plată</p>
                <p className="mt-2 font-semibold text-white">
                  {isPaid ? "Plătit" : "Neplătit"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <h2 className="text-xl font-bold">Acțiuni rapide</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/publica-anunt"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Publică / editează anunț
              </Link>

              <Link
                href="/verificare-trimisa"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Verificare trimisă
              </Link>

              {isPaymentReady && !isPaid && (
                <Link
                  href="/plata"
                  className="rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Continuă la plată
                </Link>
              )}

              {publishedReady && (
                <Link
                  href="/chat/anunt-publicat-demo"
                  className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Deschide chat demo
                </Link>
              )}

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Vezi lista profiluri
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Notă pentru prezentare
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/75">
              Această zonă arată clientului că advertiserul are un dashboard
              separat, cu status clar, progres de publicare, plată și acces la
              profilul public.
            </p>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — Dashboard advertiser 18+.
      </footer>
    </main>
  );
}