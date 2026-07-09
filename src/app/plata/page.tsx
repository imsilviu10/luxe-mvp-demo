"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type AdminStatus = "pending" | "approved" | "rejected" | "payment";
type PaymentStatus = "unpaid" | "processing" | "paid";
type UserRole = "user" | "advertiser" | "admin";

type DemoAccount = {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
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
    features?: string[];
  };
};

type PaymentErrors = {
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
  acceptedDemo?: string;
  acceptedTerms?: string;
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

function getPackageDuration(draftAd?: DraftAd | null) {
  if (draftAd?.selectedPackage?.duration) {
    return draftAd.selectedPackage.duration;
  }

  if (draftAd?.selectedPackage?.days) {
    return `${draftAd.selectedPackage.days} zile`;
  }

  return "Durată neselectată";
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 4);

  if (onlyNumbers.length <= 2) {
    return onlyNumbers;
  }

  return `${onlyNumbers.slice(0, 2)}/${onlyNumbers.slice(2)}`;
}

function getStatusLabel(status: AdminStatus) {
  if (status === "payment") {
    return "Aprobat pentru plată";
  }

  if (status === "approved") {
    return "Aprobat";
  }

  if (status === "rejected") {
    return "Respins";
  }

  return "În moderare";
}

export default function PaymentPage() {
  const router = useRouter();

  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [demoRole, setDemoRole] = useState("");
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/29");
  const [cvc, setCvc] = useState("123");
  const [acceptedDemo, setAcceptedDemo] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<PaymentErrors>({});

  useEffect(() => {
    const savedAccount = readJson<DemoAccount>("luxe_demo_account");
    const savedDraft = readJson<DraftAd>("luxe_draft_ad");

    const savedRole = localStorage.getItem("luxe_demo_role") || "";

    const savedAdminStatus =
      (localStorage.getItem("luxe_admin_status") as AdminStatus | null) ||
      "pending";

    const savedPaymentStatus =
      (localStorage.getItem("luxe_payment_status") as PaymentStatus | null) ||
      "unpaid";

    const savedPublished = localStorage.getItem("luxe_ad_published") === "true";

    setAccount(savedAccount);
    setDemoRole(savedRole);
    setDraftAd(savedDraft);
    setAdminStatus(savedAdminStatus);
    setPaymentStatus(savedPaymentStatus);
    setIsPublished(savedPublished);
    setCardName(savedAccount?.name || "");
    setIsLoading(false);
  }, []);

  const isAdvertiser =
    account?.role === "advertiser" && demoRole === "advertiser";

  const isAdmin = account?.role === "admin" || demoRole === "admin";
  const isUser = account?.role === "user" || demoRole === "user";

  const packageTitle = getPackageTitle(draftAd);
  const packagePrice = getPackagePrice(draftAd);
  const packageDuration = getPackageDuration(draftAd);

  const paymentAllowed =
    isAdvertiser &&
    draftAd &&
    adminStatus === "payment" &&
    paymentStatus !== "paid" &&
    !isPublished;

  const progressScore = useMemo(() => {
    if (isPublished || paymentStatus === "paid") {
      return 100;
    }

    if (adminStatus === "payment") {
      return 80;
    }

    if (adminStatus === "approved") {
      return 65;
    }

    if (adminStatus === "pending") {
      return 45;
    }

    return 25;
  }, [adminStatus, isPublished, paymentStatus]);

  function clearError(field: keyof PaymentErrors) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function validatePaymentForm() {
    const newErrors: PaymentErrors = {};

    if (!cardName.trim()) {
      newErrors.cardName = "Introdu numele de pe card.";
    }

    if (cardNumber.replace(/\D/g, "").length < 16) {
      newErrors.cardNumber = "Numărul cardului demo trebuie să aibă 16 cifre.";
    }

    if (expiry.replace(/\D/g, "").length < 4) {
      newErrors.expiry = "Introdu data expirării în format MM/YY.";
    }

    if (cvc.replace(/\D/g, "").length < 3) {
      newErrors.cvc = "CVC-ul demo trebuie să aibă minimum 3 cifre.";
    }

    if (!acceptedDemo) {
      newErrors.acceptedDemo =
        "Trebuie să confirmi că aceasta este o plată demo.";
    }

    if (!acceptedTerms) {
      newErrors.acceptedTerms =
        "Trebuie să accepți termenii înainte de confirmare.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!paymentAllowed || isProcessing) {
      return;
    }

    const isValid = validatePaymentForm();

    if (!isValid) {
      return;
    }

    setIsProcessing(true);
    localStorage.setItem("luxe_payment_status", "processing");

    window.setTimeout(() => {
      localStorage.setItem("luxe_payment_status", "paid");
      localStorage.setItem("luxe_ad_published", "true");
      localStorage.setItem("luxe_admin_status", "payment");

      router.push("/anunt-publicat");
    }, 900);
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Se încarcă
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Pregătim pagina de plată...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  if (!isAdvertiser) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-3xl">
              🔒
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Acces restricționat
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Plata este disponibilă doar pentru advertiser.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Utilizatorii publici nu văd și nu accesează plata anunțurilor.
              Adminul aprobă anunțul, dar nu plătește niciodată. Plata aparține
              exclusiv advertiserului.
            </p>

            {isAdmin && (
              <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5 text-sm leading-7 text-sky-100/75">
                Ești logat ca admin. Pentru demo, aprobă anunțul din panoul
                admin, apoi intră ca advertiser pentru plată.
              </div>
            )}

            {isUser && (
              <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm leading-7 text-rose-100/75">
                Ești logat ca utilizator. Poți vedea profiluri, chat și
                raportări, dar nu poți plăti anunțuri.
              </div>
            )}

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/autentificare"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Intră ca advertiser
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Vezi profiluri
              </Link>

              <Link
                href="/admin-login-luxe"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Admin demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
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
              Anunț lipsă
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Nu există un anunț pregătit pentru plată.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Pentru a plăti un pachet, trebuie mai întâi să creezi anunțul și
              să trimiți verificarea 18+.
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
                Dashboard advertiser
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (paymentStatus === "paid" || isPublished) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-5xl rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400 text-3xl text-black">
              ✓
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
              Plata este confirmată
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Anunțul este deja public.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-emerald-100/75">
              Pachetul demo a fost achitat, iar profilul este vizibil în lista
              publică.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/profil/anunt-publicat-demo"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Vezi profilul public
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Vezi lista profiluri
              </Link>

              <Link
                href="/cont"
                className="rounded-full border border-emerald-500/20 px-8 py-4 text-center font-semibold text-white transition hover:bg-emerald-500/10"
              >
                Dashboard advertiser
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (adminStatus !== "payment") {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-3xl">
              ⏳
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Plata nu este disponibilă încă
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Anunțul trebuie aprobat pentru plată de admin.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Status curent:{" "}
              <span className="font-semibold text-amber-200">
                {getStatusLabel(adminStatus)}
              </span>
              . Advertiserul poate plăti doar după ce adminul apasă „Aprobă
              pentru plată”.
            </p>

            <div className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-white/10 bg-black/30 p-5 text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-400">
                Anunț
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {draftAd.displayName || "Profil Luxe"}
                {draftAd.age ? `, ${draftAd.age}` : ""}
              </h2>

              <p className="mt-2 text-white/45">
                {draftAd.city || "Oraș nespecificat"}
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/cont/anunt"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Vezi statusul anunțului
              </Link>

              <Link
                href="/admin-login-luxe"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Intră în admin demo
              </Link>

              <Link
                href="/verificare-trimisa"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Confirmare verificare
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
              Plată advertiser
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/cont" className="hover:text-white">
              Dashboard
            </Link>

            <Link href="/cont/anunt" className="hover:text-white">
              Status anunț
            </Link>

            <Link href="/verificare-trimisa" className="hover:text-white">
              Verificare
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>
          </div>

          <Link
            href="/cont/anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Status anunț
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
              Ultimul pas înainte de publicare
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Confirmă plata demo pentru publicarea anunțului.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Adminul a aprobat anunțul pentru plată. În demo, plata este
              simulată local. În versiunea reală, cardul ar fi procesat securizat
              de un procesator de plăți, nu de platformă.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#formular-plata"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Plătește demo
              </a>

              <Link
                href="/cont/anunt"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Vezi status
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

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                Aprobat pentru plată
              </span>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${progressScore}%` }}
              />
            </div>

            <p className="mt-5 leading-7 text-white/60">
              După confirmarea plății demo, anunțul devine public și apare în
              lista de profiluri.
            </p>
          </div>
        </div>
      </section>

      <section
        id="formular-plata"
        className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr]"
      >
        <div className="space-y-8">
          <form
            onSubmit={submitPayment}
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8"
          >
            <div className="mb-8 rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Card demo
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Detalii plată
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/60">
                Datele de mai jos sunt doar pentru prezentare. Nu introduce date
                reale de card în demo.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Nume pe card
                </label>

                <input
                  type="text"
                  value={cardName}
                  onChange={(event) => {
                    setCardName(event.target.value);
                    clearError("cardName");
                  }}
                  placeholder="Ex: Advertiser Demo"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
                />

                {errors.cardName && (
                  <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {errors.cardName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Număr card demo
                </label>

                <input
                  type="text"
                  value={cardNumber}
                  onChange={(event) => {
                    setCardNumber(formatCardNumber(event.target.value));
                    clearError("cardNumber");
                  }}
                  placeholder="4242 4242 4242 4242"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
                />

                {errors.cardNumber && (
                  <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Expirare
                  </label>

                  <input
                    type="text"
                    value={expiry}
                    onChange={(event) => {
                      setExpiry(formatExpiry(event.target.value));
                      clearError("expiry");
                    }}
                    placeholder="12/29"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
                  />

                  {errors.expiry && (
                    <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.expiry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    CVC
                  </label>

                  <input
                    type="text"
                    value={cvc}
                    onChange={(event) => {
                      setCvc(event.target.value.replace(/\D/g, "").slice(0, 4));
                      clearError("cvc");
                    }}
                    placeholder="123"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
                  />

                  {errors.cvc && (
                    <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.cvc}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
                <h3 className="text-xl font-bold">
                  Confirmări plată
                </h3>

                <div className="mt-5 space-y-4">
                  <label className="flex cursor-pointer gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/65 transition hover:bg-white/[0.07]">
                    <input
                      type="checkbox"
                      checked={acceptedDemo}
                      onChange={(event) => {
                        setAcceptedDemo(event.target.checked);
                        clearError("acceptedDemo");
                      }}
                      className="mt-1 h-4 w-4 shrink-0"
                    />

                    <span>
                      Confirm că aceasta este o plată demo și că nu folosesc
                      date reale de card.
                    </span>
                  </label>

                  {errors.acceptedDemo && (
                    <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.acceptedDemo}
                    </p>
                  )}

                  <label className="flex cursor-pointer gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/65 transition hover:bg-white/[0.07]">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(event) => {
                        setAcceptedTerms(event.target.checked);
                        clearError("acceptedTerms");
                      }}
                      className="mt-1 h-4 w-4 shrink-0"
                    />

                    <span>
                      Accept{" "}
                      <Link href="/termeni" className="font-semibold text-rose-300">
                        termenii platformei
                      </Link>{" "}
                      și înțeleg că în producție plata ar fi procesată printr-un
                      provider autorizat.
                    </span>
                  </label>

                  {errors.acceptedTerms && (
                    <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.acceptedTerms}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-full bg-rose-500 px-8 py-4 font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
              >
                {isProcessing
                  ? "Se procesează plata demo..."
                  : `Confirmă plata demo${
                      packagePrice ? ` — ${packagePrice} RON` : ""
                    }`}
              </button>

              <p className="text-center text-sm leading-7 text-white/45">
                După confirmare, sistemul setează plata ca achitată și publică
                profilul demo.
              </p>
            </div>
          </form>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Rezumat comandă
            </p>

            <div className="mt-5 rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                  {packageTitle}
                </span>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Aprobat pentru plată
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
              Pachet ales
            </p>

            <h2 className="mt-3 text-2xl font-bold text-emerald-100">
              {packageTitle}
            </h2>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Cost demo</p>
                <p className="mt-2 text-3xl font-bold text-white">
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
                <p className="text-sm text-emerald-100/50">După plată</p>
                <p className="mt-2 font-semibold text-white">
                  Profil public automat
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Cine vede această pagină?
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-sky-100/75">
              <p>1. Utilizatorii publici nu au acces la plată.</p>
              <p>2. Adminul aprobă, dar nu introduce card și nu plătește.</p>
              <p>3. Advertiserul plătește doar după aprobare admin.</p>
              <p>4. În producție, plata ar fi externă și securizată.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Important demo
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              Nu introdu date reale de card. Această pagină simulează plata
              doar pentru prezentarea MVP.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/cont/anunt"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Status anunț
              </Link>

              <Link
                href="/verificare-trimisa"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Verificare trimisă
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
        Luxe.ro © 2026 — plată demo advertiser.
      </footer>
    </main>
  );
}