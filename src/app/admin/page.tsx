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

type ReportStatus = "pending" | "reviewed" | "urgent";

type ReportData = {
  profileName: string;
  profileLink: string;
  reason: string;
  details: string;
  email: string;
  submittedAt: string;
  status: ReportStatus;
};

export default function AdminPage() {
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [verification, setVerification] = useState<VerificationDraft | null>(
    null
  );
  const [lastReport, setLastReport] = useState<ReportData | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "paid">("idle");
  const [isPublished, setIsPublished] = useState(false);

  function loadDemoData() {
    const savedAd = localStorage.getItem("luxe_draft_ad");
    const savedVerification = localStorage.getItem("luxe_verification_draft");
    const savedAdminStatus = localStorage.getItem("luxe_admin_status");
    const savedPaymentStatus = localStorage.getItem("luxe_payment_status");
    const savedPublished = localStorage.getItem("luxe_ad_published");
    const savedReport = localStorage.getItem("luxe_last_report");

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

    if (savedReport) {
      try {
        setLastReport(JSON.parse(savedReport));
      } catch {
        setLastReport(null);
      }
    } else {
      setLastReport(null);
    }
  }

  useEffect(() => {
    loadDemoData();
  }, []);

  function approveAd() {
    localStorage.setItem("luxe_admin_status", "approved");
    setAdminStatus("approved");
  }

  function approveForPayment() {
    localStorage.setItem("luxe_admin_status", "payment");
    setAdminStatus("payment");
  }

  function rejectAd() {
    localStorage.setItem("luxe_admin_status", "rejected");
    setAdminStatus("rejected");
  }

  function resetModeration() {
    localStorage.setItem("luxe_admin_status", "pending");
    setAdminStatus("pending");
  }

  const hasAd = Boolean(draftAd);
  const hasVerification = Boolean(verification);
  const hasReport = Boolean(lastReport);

  const statusLabel = useMemo(() => {
    if (isPublished) {
      return "Publicat";
    }

    if (paymentStatus === "paid") {
      return "Plată confirmată";
    }

    if (adminStatus === "payment") {
      return "Aprobat pentru plată";
    }

    if (adminStatus === "approved") {
      return "Aprobat";
    }

    if (adminStatus === "rejected") {
      return "Respins";
    }

    if (hasVerification) {
      return "În verificare";
    }

    if (hasAd) {
      return "Draft primit";
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

  const reportStatusLabel = useMemo(() => {
    if (!lastReport) {
      return "Nicio raportare";
    }

    if (lastReport.status === "reviewed") {
      return "Verificată";
    }

    if (lastReport.status === "urgent") {
      return "Urgentă";
    }

    return "În așteptare";
  }, [lastReport]);

  const reportStatusClass = useMemo(() => {
    if (!lastReport) {
      return "border-white/10 bg-black/30 text-white/50";
    }

    if (lastReport.status === "urgent") {
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    }

    if (lastReport.status === "reviewed") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    }

    return "border-amber-500/20 bg-amber-500/10 text-amber-200";
  }, [lastReport]);

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

            <Link href="/admin/raportari" className="hover:text-white">
              Raportări
            </Link>
          </div>

          <button
            type="button"
            onClick={loadDemoData}
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
              Admin demo • {statusLabel}
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Panou de moderare Luxe.ro.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Adminul verifică anunțurile, aprobă pentru plată și poate vedea
              raportările trimise de utilizatori.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/admin/raportari"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Vezi raportări
              </Link>

              <Link
                href="/cont/anunt"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Vezi pagina advertiserului
              </Link>

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
                Cerere advertiser
              </p>

              <h2 className="mt-3 text-3xl font-bold">Anunț în moderare</h2>
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
                    <p className="text-sm text-white/50">Telefon advertiser</p>
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
                    <p className="text-sm text-white/50">Valoare pachet</p>
                    <p className="mt-2 font-semibold text-rose-300">
                      {draftAd?.selectedPackage?.label || "-"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Fotografii demo</p>
                    <p className="mt-2 font-semibold">
                      {draftAd?.photoNames?.length || 0} selectate
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Verificare 18+</p>
                    <p className="mt-2 font-semibold">
                      {hasVerification ? "Trimisă" : "Netimisă"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <h4 className="text-lg font-bold">Documente demo</h4>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-white/50">Document</p>
                      <p className="mt-2 font-semibold">
                        {verification?.documentName || "Nu există document"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-white/50">Selfie</p>
                      <p className="mt-2 font-semibold">
                        {verification?.selfieName || "Nu există selfie"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 md:grid-cols-4">
                  <button
                    type="button"
                    onClick={approveAd}
                    disabled={!hasVerification || isPublished}
                    className={`rounded-full px-5 py-4 font-semibold transition ${
                      hasVerification && !isPublished
                        ? "bg-sky-500 text-white hover:bg-sky-400"
                        : "cursor-not-allowed bg-white/10 text-white/30"
                    }`}
                  >
                    Aprobă
                  </button>

                  <button
                    type="button"
                    onClick={approveForPayment}
                    disabled={!hasVerification || isPublished}
                    className={`rounded-full px-5 py-4 font-semibold transition ${
                      hasVerification && !isPublished
                        ? "bg-emerald-500 text-white hover:bg-emerald-400"
                        : "cursor-not-allowed bg-white/10 text-white/30"
                    }`}
                  >
                    Aprobă pentru plată
                  </button>

                  <button
                    type="button"
                    onClick={rejectAd}
                    disabled={!hasVerification || isPublished}
                    className={`rounded-full px-5 py-4 font-semibold transition ${
                      hasVerification && !isPublished
                        ? "bg-rose-500 text-white hover:bg-rose-400"
                        : "cursor-not-allowed bg-white/10 text-white/30"
                    }`}
                  >
                    Respinge
                  </button>

                  <button
                    type="button"
                    onClick={resetModeration}
                    disabled={isPublished}
                    className={`rounded-full px-5 py-4 font-semibold transition ${
                      !isPublished
                        ? "border border-white/10 text-white hover:bg-white/10"
                        : "cursor-not-allowed bg-white/10 text-white/30"
                    }`}
                  >
                    Resetează
                  </button>
                </div>

                <div className="mt-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
                  <h4 className="font-bold text-amber-200">
                    Important pentru fluxul corect
                  </h4>

                  <p className="mt-2 text-sm leading-7 text-amber-100/70">
                    Butonul „Aprobă pentru plată” nu deschide pagina de card.
                    El doar schimbă statusul anunțului. Advertiserul vede
                    butonul „Continuă la plată” în pagina lui de cont.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-10 text-center">
              <h3 className="text-2xl font-bold">
                Nu există încă un anunț trimis.
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-white/60">
                Creează un anunț din pagina de publicare, treci prin verificare,
                apoi revino aici.
              </p>

              <Link
                href="/publica-anunt"
                className="mt-6 inline-flex rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
              >
                Publică anunț demo
              </Link>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Statistici demo
            </p>

            <h2 className="mt-3 text-2xl font-bold">Dashboard</h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Anunțuri trimise</p>
                <p className="mt-2 text-3xl font-bold">{hasAd ? 1 : 0}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Verificări 18+</p>
                <p className="mt-2 text-3xl font-bold">
                  {hasVerification ? 1 : 0}
                </p>
              </div>

              <div className={`rounded-3xl border p-5 ${reportStatusClass}`}>
                <p className="text-sm opacity-70">Raportări</p>
                <p className="mt-2 text-3xl font-bold">{hasReport ? 1 : 0}</p>
                <p className="mt-2 text-sm opacity-80">{reportStatusLabel}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Încasare demo</p>
                <p className="mt-2 text-3xl font-bold text-rose-300">
                  {paymentStatus === "paid"
                    ? draftAd?.selectedPackage?.label || "0 RON"
                    : "0 RON"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Publicate</p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">
                  {isPublished ? 1 : 0}
                </p>
              </div>
            </div>
          </div>

          {hasReport && (
            <div className={`rounded-[2rem] border p-6 ${reportStatusClass}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-80">
                Ultima raportare
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {lastReport?.profileName}
              </h2>

              <p className="mt-2 text-sm opacity-80">
                Motiv: {lastReport?.reason}
              </p>

              <Link
                href="/admin/raportari"
                className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Deschide raportarea
              </Link>
            </div>
          )}

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Navigare demo</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/admin/raportari"
                className="block rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Raportări utilizatori
              </Link>

              <Link
                href="/cont/anunt"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Vezi pagina advertiserului
              </Link>

              <Link
                href="/verificare-trimisa"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Vezi confirmarea verificării
              </Link>

              <Link
                href="/profiluri"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Vezi profiluri
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Adminul nu introduce cardul
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              Adminul doar aprobă, respinge și verifică raportări. După aprobare
              pentru plată, advertiserul intră în contul lui și plătește
              pachetul ales.
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