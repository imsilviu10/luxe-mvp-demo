"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type VerificationDraft = {
  documentName?: string;
  selfieName?: string;
  submittedAt?: string;
};

type AdminStatus = "pending" | "approved" | "rejected" | "payment";

export default function VerificationSubmittedPage() {
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [verification, setVerification] = useState<VerificationDraft | null>(
    null
  );
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "paid">("idle");
  const [isPublished, setIsPublished] = useState(false);

  function loadData() {
    const savedAd = localStorage.getItem("luxe_draft_ad");
    const savedVerification = localStorage.getItem("luxe_verification_draft");
    const savedAdminStatus = localStorage.getItem("luxe_admin_status");
    const savedPaymentStatus = localStorage.getItem("luxe_payment_status");
    const savedPublished = localStorage.getItem("luxe_ad_published");

    if (savedAd) {
      setDraftAd(JSON.parse(savedAd));
    } else {
      setDraftAd(null);
    }

    if (savedVerification) {
      setVerification(JSON.parse(savedVerification));
    } else {
      setVerification(null);
    }

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

    if (savedPaymentStatus === "paid") {
      setPaymentStatus("paid");
    } else {
      setPaymentStatus("idle");
    }

    setIsPublished(savedPublished === "true");
  }

  useEffect(() => {
    loadData();
  }, []);

  const hasAd = Boolean(draftAd);
  const hasVerification = Boolean(verification);
  const canPay = adminStatus === "payment" && paymentStatus !== "paid";

  const statusLabel = useMemo(() => {
    if (isPublished) {
      return "Anunț publicat";
    }

    if (paymentStatus === "paid") {
      return "Plată confirmată";
    }

    if (adminStatus === "payment") {
      return "Aprobat pentru plată";
    }

    if (adminStatus === "approved") {
      return "Aprobat de admin";
    }

    if (adminStatus === "rejected") {
      return "Respins";
    }

    if (hasVerification) {
      return "Verificare trimisă";
    }

    if (hasAd) {
      return "Anunț început";
    }

    return "Niciun anunț";
  }, [adminStatus, hasAd, hasVerification, isPublished, paymentStatus]);

  const statusClass = useMemo(() => {
    if (isPublished || paymentStatus === "paid") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    }

    if (adminStatus === "payment" || adminStatus === "approved") {
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    }

    if (adminStatus === "rejected") {
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    }

    return "border-amber-500/20 bg-amber-500/10 text-amber-200";
  }, [adminStatus, isPublished, paymentStatus]);

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

            <Link href="/cont/anunt" className="hover:text-white">
              Cont advertiser
            </Link>

            <Link href="/admin" className="hover:text-white">
              Admin demo
            </Link>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Actualizează
          </button>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-10">
          <div className="max-w-3xl">
            <div
              className={`mb-5 inline-flex rounded-full border px-4 py-2 text-sm ${statusClass}`}
            >
              {statusLabel}
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Verificarea a fost trimisă.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Cererea ta de verificare 18+ și anunțul demo au fost pregătite.
              Următorul pas este moderarea de către admin, apoi plata de către
              advertiser.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/cont/anunt"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Vezi statusul anunțului
              </Link>

              {canPay && (
                <Link
                  href="/plata"
                  className="rounded-full bg-emerald-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-emerald-400"
                >
                  Continuă la plată
                </Link>
              )}

              {isPublished && (
                <Link
                  href="/anunt-publicat"
                  className="rounded-full bg-emerald-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-emerald-400"
                >
                  Vezi anunț publicat
                </Link>
              )}

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Vezi profiluri
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Confirmare
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Cererea ta a fost înregistrată
              </h2>
            </div>

            <div
              className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusClass}`}
            >
              {statusLabel}
            </div>
          </div>

          {hasAd ? (
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
              <div className="relative flex h-80 items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-7xl">
                ✦

                <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-black">
                  {draftAd?.selectedPackage?.name || "Standard"}
                </div>

                <div
                  className={`absolute right-4 top-4 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                    adminStatus === "rejected"
                      ? "bg-rose-500 text-white"
                      : adminStatus === "payment" || isPublished
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 text-black"
                  }`}
                >
                  {statusLabel}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                  {hasVerification
                    ? "Verificare 18+ trimisă"
                    : "Verificare netrimisă"}
                </div>

                <h3 className="text-3xl font-bold">
                  {draftAd?.displayName || "Anunț demo"}
                </h3>

                <p className="mt-2 text-white/50">
                  {draftAd?.age || "--"} ani • {draftAd?.city || "Oraș neales"}
                </p>

                <p className="mt-5 leading-8 text-white/70">
                  {draftAd?.description ||
                    "Descrierea anunțului va apărea aici după completarea formularului."}
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Telefon</p>
                    <p className="mt-2 font-semibold">
                      {draftAd?.phone || "-"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Oraș</p>
                    <p className="mt-2 font-semibold">{draftAd?.city || "-"}</p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Pachet ales</p>
                    <p className="mt-2 font-semibold">
                      {draftAd?.selectedPackage?.name || "-"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Total</p>
                    <p className="mt-2 font-semibold text-rose-300">
                      {draftAd?.selectedPackage?.label || "-"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Document demo</p>
                    <p className="mt-2 font-semibold">
                      {verification?.documentName || "Nu există document"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Selfie demo</p>
                    <p className="mt-2 font-semibold">
                      {verification?.selfieName || "Nu există selfie"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/cont/anunt"
                    className="rounded-full bg-white px-6 py-4 text-center font-semibold text-black transition hover:bg-white/80"
                  >
                    Mergi în contul advertiserului
                  </Link>

                  <Link
                    href="/admin"
                    className="rounded-full border border-white/10 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10"
                  >
                    Deschide admin demo
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-10 text-center">
              <h3 className="text-2xl font-bold">
                Nu există încă un anunț trimis.
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-white/60">
                Creează un anunț, treci prin verificare, apoi revino aici.
              </p>

              <Link
                href="/publica-anunt"
                className="mt-6 inline-flex rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
              >
                Publică anunț
              </Link>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Pașii următori
            </p>

            <h2 className="mt-3 text-2xl font-bold">Flux corect</h2>

            <div className="mt-6 space-y-3">
              <div
                className={`rounded-2xl border p-4 ${
                  hasAd
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : "border-white/10 bg-black/30"
                }`}
              >
                <p
                  className={`font-semibold ${
                    hasAd ? "text-emerald-300" : "text-white"
                  }`}
                >
                  1. Anunț completat
                </p>

                <p className="mt-1 text-sm text-white/50">
                  Formularul a fost salvat ca draft demo.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  hasVerification
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : "border-white/10 bg-black/30"
                }`}
              >
                <p
                  className={`font-semibold ${
                    hasVerification ? "text-emerald-300" : "text-white"
                  }`}
                >
                  2. Verificare 18+
                </p>

                <p className="mt-1 text-sm text-white/50">
                  {hasVerification
                    ? "Verificarea demo a fost trimisă."
                    : "Verificarea nu a fost trimisă încă."}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  adminStatus === "payment" ||
                  adminStatus === "approved" ||
                  isPublished
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : adminStatus === "rejected"
                      ? "border-rose-500/20 bg-rose-500/10"
                      : "border-white/10 bg-black/30"
                }`}
              >
                <p
                  className={`font-semibold ${
                    adminStatus === "rejected"
                      ? "text-rose-300"
                      : adminStatus === "payment" ||
                          adminStatus === "approved" ||
                          isPublished
                        ? "text-emerald-300"
                        : "text-white"
                  }`}
                >
                  3. Moderare admin
                </p>

                <p className="mt-1 text-sm text-white/50">
                  Status actual: {statusLabel}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  paymentStatus === "paid" || isPublished
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : canPay
                      ? "border-sky-500/20 bg-sky-500/10"
                      : "border-white/10 bg-black/30"
                }`}
              >
                <p
                  className={`font-semibold ${
                    paymentStatus === "paid" || isPublished
                      ? "text-emerald-300"
                      : canPay
                        ? "text-sky-300"
                        : "text-white"
                  }`}
                >
                  4. Plată advertiser
                </p>

                <p className="mt-1 text-sm text-white/50">
                  {paymentStatus === "paid"
                    ? "Plata demo a fost confirmată."
                    : canPay
                      ? "Advertiserul poate continua la plată."
                      : "Plata apare după aprobarea adminului."}
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  isPublished
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : "border-white/10 bg-black/30"
                }`}
              >
                <p
                  className={`font-semibold ${
                    isPublished ? "text-emerald-300" : "text-white"
                  }`}
                >
                  5. Publicare
                </p>

                <p className="mt-1 text-sm text-white/50">
                  {isPublished
                    ? "Anunțul este activ în demo."
                    : "Anunțul devine activ după plată."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Plata nu este făcută de admin
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              După ce adminul aprobă anunțul pentru plată, advertiserul merge în
              pagina lui de cont și apasă „Continuă la plată”.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Navigare rapidă</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/cont/anunt"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Cont advertiser
              </Link>

              <Link
                href="/admin"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Admin demo
              </Link>

              <Link
                href="/profiluri"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Profiluri
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