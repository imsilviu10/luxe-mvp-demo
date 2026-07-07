"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function AdminReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);

  function loadReport() {
    const savedReport = localStorage.getItem("luxe_last_report");

    if (!savedReport) {
      setReport(null);
      return;
    }

    try {
      const parsedReport = JSON.parse(savedReport) as ReportData;
      setReport(parsedReport);
    } catch {
      setReport(null);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  function updateReportStatus(newStatus: ReportStatus) {
    if (!report) {
      return;
    }

    const updatedReport: ReportData = {
      ...report,
      status: newStatus,
    };

    localStorage.setItem("luxe_last_report", JSON.stringify(updatedReport));
    setReport(updatedReport);
  }

  function deleteReport() {
    localStorage.removeItem("luxe_last_report");
    setReport(null);
  }

  const statusLabel = !report
    ? "Nicio raportare"
    : report.status === "reviewed"
      ? "Verificată"
      : report.status === "urgent"
        ? "Urgentă"
        : "În așteptare";

  const statusClass = !report
    ? "border-white/10 bg-white/10 text-white/60"
    : report.status === "reviewed"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : report.status === "urgent"
        ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
        : "border-amber-500/20 bg-amber-500/10 text-amber-200";

  const profileHref =
    report?.profileLink && report.profileLink.startsWith("/")
      ? report.profileLink
      : "/profiluri";

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
            <Link href="/admin" className="hover:text-white">
              Admin
            </Link>

            <Link href="/raporteaza" className="hover:text-white">
              Raportează
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>
          </div>

          <button
            type="button"
            onClick={loadReport}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Actualizează
          </button>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="max-w-3xl">
            <div
              className={`mb-5 inline-flex rounded-full border px-4 py-2 text-sm ${statusClass}`}
            >
              Admin raportări • {statusLabel}
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Raportări utilizatori.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Aici adminul vede raportările trimise de utilizatori. Momentan
              afișăm ultima raportare salvată local din pagina de raportare.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/raporteaza"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Trimite raportare demo
              </Link>

              <Link
                href="/admin"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Înapoi la admin
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
                Raportare
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Ultima raportare primită
              </h2>
            </div>

            <div
              className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusClass}`}
            >
              {statusLabel}
            </div>
          </div>

          {report ? (
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Profil raportat</p>
                    <p className="mt-2 text-xl font-bold">
                      {report.profileName}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Motiv</p>
                    <p className="mt-2 text-xl font-bold text-rose-300">
                      {report.reason}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Link profil</p>
                    <p className="mt-2 break-all font-semibold">
                      {report.profileLink || "Nu a fost completat"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/50">Email contact</p>
                    <p className="mt-2 break-all font-semibold">
                      {report.email || "Nu a fost completat"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:col-span-2">
                    <p className="text-sm text-white/50">Trimis la</p>
                    <p className="mt-2 font-semibold">
                      {report.submittedAt
                        ? new Date(report.submittedAt).toLocaleString("ro-RO")
                        : "Dată indisponibilă"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                  Detalii
                </p>

                <p className="mt-4 leading-8 text-white/70">
                  {report.details}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <button
                  type="button"
                  onClick={() => updateReportStatus("reviewed")}
                  className="rounded-full bg-emerald-500 px-5 py-4 font-semibold text-white transition hover:bg-emerald-400"
                >
                  Marchează verificată
                </button>

                <button
                  type="button"
                  onClick={() => updateReportStatus("urgent")}
                  className="rounded-full bg-rose-500 px-5 py-4 font-semibold text-white transition hover:bg-rose-400"
                >
                  Marchează urgentă
                </button>

                <Link
                  href={profileHref}
                  className="rounded-full border border-white/10 px-5 py-4 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Deschide profil
                </Link>

                <button
                  type="button"
                  onClick={deleteReport}
                  className="rounded-full border border-white/10 px-5 py-4 font-semibold text-white transition hover:bg-white/10"
                >
                  Șterge raportarea
                </button>
              </div>

              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
                <h3 className="font-bold text-amber-200">
                  Notă pentru versiunea reală
                </h3>

                <p className="mt-2 text-sm leading-7 text-amber-100/70">
                  În producție, raportările vor fi salvate în baza de date, vor
                  avea istoric, moderator asignat, statusuri clare și acțiuni
                  asupra profilului raportat.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl">
                !
              </div>

              <h3 className="text-2xl font-bold">
                Nu există raportări momentan.
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-white/60">
                Trimite o raportare demo din pagina /raporteaza, apoi revino
                aici și apasă Actualizează.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/raporteaza"
                  className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
                >
                  Trimite raportare
                </Link>

                <Link
                  href="/admin"
                  className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Înapoi la admin
                </Link>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Dashboard raportări
            </p>

            <h2 className="mt-3 text-2xl font-bold">Rezumat</h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Raportări totale demo</p>
                <p className="mt-2 text-3xl font-bold">{report ? 1 : 0}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Status</p>
                <p className="mt-2 text-2xl font-bold">{statusLabel}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Motiv</p>
                <p className="mt-2 text-xl font-bold text-rose-300">
                  {report?.reason || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Situații grave
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/70">
              Dacă raportarea implică minori, exploatare, trafic de persoane,
              amenințări reale sau pericol imediat, formularul demo nu este
              suficient. Într-o platformă reală trebuie să existe proceduri
              clare de escaladare și contactare a autorităților competente.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Navigare admin</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/admin"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Panou admin
              </Link>

              <Link
                href="/raporteaza"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Formular raportare
              </Link>

              <Link
                href="/reguli"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reguli
              </Link>

              <Link
                href="/profiluri"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Profiluri
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">Demo local</h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              Această pagină citește momentan cheia luxe_last_report din
              localStorage. Mai târziu o conectăm la baza de date și la contul
              real de admin.
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