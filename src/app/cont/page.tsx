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

export default function AccountPage() {
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [verification, setVerification] = useState<VerificationDraft | null>(
    null
  );
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "paid">("idle");
  const [isPublished, setIsPublished] = useState(false);

  function loadAccountData() {
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
    loadAccountData();
  }, []);

  const hasAd = Boolean(draftAd);
  const hasVerification = Boolean(verification);
  const canPay = adminStatus === "payment" && paymentStatus !== "paid";
  const isRejected = adminStatus === "rejected";

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
      return "În moderare";
    }

    if (hasAd) {
      return "Anunț început";
    }

    return "Fără anunț";
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
              Anunțul meu
            </Link>

            <Link href="/admin" className="hover:text-white">
              Admin demo
            </Link>
          </div>

          <button
            type="button"
            onClick={loadAccountData}
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
              Cont demo • {statusLabel}
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Contul tău Luxe.ro.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Aici advertiserul vede rapid anunțul, verificarea, plata,
              publicarea, profilul public și chatul demo.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {!hasAd && (
                <Link
                  href="/publica-anunt"
                  className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Publică primul anunț
                </Link>
              )}

              {hasAd && !hasVerification && (
                <Link
                  href="/verificare-18"
                  className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Continuă verificarea
                </Link>
              )}

              {canPay && (
                <Link
                  href="/plata"
                  className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Continuă la plată
                </Link>
              )}

              {isPublished && (
                <Link
                  href="/profil/anunt-publicat-demo"
                  className="rounded-full bg-emerald-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-emerald-400"
                >
                  Vezi profil public
                </Link>
              )}

              <Link
                href="/cont/anunt"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Status anunț
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                  Dashboard
                </p>

                <h2 className="mt-3 text-3xl font-bold">Rezumat cont</h2>
              </div>

              <div
                className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusClass}`}
              >
                {statusLabel}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Anunț</p>
                <p className="mt-2 text-2xl font-bold">
                  {hasAd ? "Creat" : "Lipsă"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Verificare 18+</p>
                <p className="mt-2 text-2xl font-bold">
                  {hasVerification ? "Trimisă" : "Netrimisă"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Plată</p>
                <p className="mt-2 text-2xl font-bold">
                  {paymentStatus === "paid" ? "Confirmată" : "În așteptare"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Publicare</p>
                <p className="mt-2 text-2xl font-bold">
                  {isPublished ? "Activ" : "Inactiv"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Anunțul meu
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {draftAd?.displayName || "Nu există anunț încă"}
            </h2>

            {hasAd ? (
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
                <div className="relative flex h-80 items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-7xl">
                  ✦

                  {isPublished && (
                    <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                      Activ
                    </div>
                  )}

                  {canPay && (
                    <div className="absolute left-4 top-4 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                      Plata necesară
                    </div>
                  )}

                  {isRejected && (
                    <div className="absolute left-4 top-4 rounded-full bg-rose-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                      Respins
                    </div>
                  )}

                  <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-black">
                    {draftAd?.selectedPackage?.name || "Standard"}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-white/50">
                    {draftAd?.age || "--"} ani • {draftAd?.city || "Oraș neales"}
                  </p>

                  <p className="mt-5 leading-8 text-white/70">
                    {draftAd?.description ||
                      "Descrierea anunțului va apărea aici."}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/cont/anunt"
                      className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                    >
                      Vezi status complet
                    </Link>

                    {isPublished ? (
                      <Link
                        href="/profil/anunt-publicat-demo"
                        className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                      >
                        Vezi profil public
                      </Link>
                    ) : (
                      <Link
                        href="/publica-anunt"
                        className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                      >
                        Editează demo
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/30 p-10 text-center">
                <h3 className="text-2xl font-bold">
                  Nu ai încă un anunț demo.
                </h3>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-white/60">
                  Creează un anunț, treci prin verificare, apoi adminul îl poate
                  aproba pentru plată.
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
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Acțiuni rapide
            </p>

            <h2 className="mt-3 text-2xl font-bold">Navigare cont</h2>

            <div className="mt-6 space-y-3">
              <Link
                href="/cont/anunt"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Anunțul meu
              </Link>

              <Link
                href="/publica-anunt"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Publică anunț nou
              </Link>

              <Link
                href="/verificare-trimisa"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Status verificare
              </Link>

              {canPay && (
                <Link
                  href="/plata"
                  className="block rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
                >
                  Continuă la plată
                </Link>
              )}

              {isPublished && (
                <>
                  <Link
                    href="/profil/anunt-publicat-demo"
                    className="block rounded-full bg-emerald-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Profil public
                  </Link>

                  <Link
                    href="/chat/anunt-publicat-demo"
                    className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                  >
                    Chat demo
                  </Link>
                </>
              )}

              <Link
                href="/profiluri"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Vezi profiluri
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Timeline
            </p>

            <h2 className="mt-3 text-2xl font-bold">Pașii anunțului</h2>

            <div className="mt-6 space-y-3">
              <div
                className={`rounded-2xl border p-4 ${
                  hasAd
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : "border-white/10 bg-black/30"
                }`}
              >
                <p className={hasAd ? "font-semibold text-emerald-300" : "font-semibold text-white"}>
                  1. Anunț creat
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  hasVerification
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : "border-white/10 bg-black/30"
                }`}
              >
                <p className={hasVerification ? "font-semibold text-emerald-300" : "font-semibold text-white"}>
                  2. Verificare 18+
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  adminStatus === "payment" || adminStatus === "approved"
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
                      : adminStatus === "payment" || adminStatus === "approved"
                        ? "text-emerald-300"
                        : "text-white"
                  }`}
                >
                  3. Moderare admin
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  paymentStatus === "paid"
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : canPay
                      ? "border-sky-500/20 bg-sky-500/10"
                      : "border-white/10 bg-black/30"
                }`}
              >
                <p
                  className={`font-semibold ${
                    paymentStatus === "paid"
                      ? "text-emerald-300"
                      : canPay
                        ? "text-sky-300"
                        : "text-white"
                  }`}
                >
                  4. Plată advertiser
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  isPublished
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : "border-white/10 bg-black/30"
                }`}
              >
                <p className={isPublished ? "font-semibold text-emerald-300" : "font-semibold text-white"}>
                  5. Publicare
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Cont demo local
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              Datele contului sunt citite momentan din localStorage. Mai târziu
              le vom lega de autentificare, bază de date, plăți reale și
              dashboard real pentru advertiser.
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