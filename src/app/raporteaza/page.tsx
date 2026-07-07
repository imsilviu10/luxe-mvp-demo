"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type ReportStatus = "pending" | "reviewed" | "urgent";

type ReportForm = {
  profileName: string;
  profileLink: string;
  reason: string;
  details: string;
  email: string;
};

type ReportErrors = {
  profileName?: string;
  reason?: string;
  details?: string;
  email?: string;
};

type SavedReport = ReportForm & {
  submittedAt: string;
  status: ReportStatus;
};

const reportReasons = [
  "Profil suspect",
  "Conținut interzis",
  "Persoană sub 18 ani",
  "Comportament abuziv",
  "Fotografii false",
  "Fraudă sau înșelătorie",
  "Alt motiv",
];

function ReportPageContent() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState<ReportForm>({
    profileName: "",
    profileLink: "",
    reason: "",
    details: "",
    email: "",
  });

  const [errors, setErrors] = useState<ReportErrors>({});
  const [submittedReport, setSubmittedReport] = useState<SavedReport | null>(
    null
  );

  useEffect(() => {
    const profileFromUrl = searchParams.get("profil") || "";
    const linkFromUrl = searchParams.get("link") || "";

    setForm((currentForm) => ({
      ...currentForm,
      profileName: profileFromUrl || currentForm.profileName,
      profileLink: linkFromUrl || currentForm.profileLink,
    }));
  }, [searchParams]);

  function updateField(field: keyof ReportForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function validateForm() {
    const newErrors: ReportErrors = {};

    if (form.profileName.trim().length < 2) {
      newErrors.profileName = "Completează numele profilului raportat.";
    }

    if (!form.reason) {
      newErrors.reason = "Alege motivul raportării.";
    }

    if (form.details.trim().length < 20) {
      newErrors.details = "Descrierea trebuie să aibă minimum 20 de caractere.";
    }

    if (form.email.trim().length > 0 && !form.email.includes("@")) {
      newErrors.email = "Emailul introdus nu pare valid.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function submitReport() {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const reportToSave: SavedReport = {
      profileName: form.profileName.trim(),
      profileLink: form.profileLink.trim(),
      reason: form.reason,
      details: form.details.trim(),
      email: form.email.trim(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    localStorage.setItem("luxe_last_report", JSON.stringify(reportToSave));

    setSubmittedReport(reportToSave);
  }

  function resetForm() {
    setForm({
      profileName: "",
      profileLink: "",
      reason: "",
      details: "",
      email: "",
    });

    setErrors({});
    setSubmittedReport(null);
  }

  if (submittedReport) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

          <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 text-3xl">
              ✓
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Raportare trimisă
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Mulțumim. Raportarea a fost înregistrată.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-emerald-100/70">
              Raportarea a fost salvată în demo și poate fi văzută în panoul de
              admin la secțiunea raportări.
            </p>

            <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-5">
                <p className="text-sm text-emerald-100/50">Profil raportat</p>
                <p className="mt-2 font-semibold text-white">
                  {submittedReport.profileName}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-5">
                <p className="text-sm text-emerald-100/50">Motiv</p>
                <p className="mt-2 font-semibold text-white">
                  {submittedReport.reason}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full bg-emerald-500 px-8 py-4 font-semibold text-white transition hover:bg-emerald-400"
              >
                Trimite altă raportare
              </button>

              <Link
                href="/admin/raportari"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Vezi în admin
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Înapoi la profiluri
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <Link
              href="/profiluri"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Profiluri
            </Link>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href="/termeni" className="hover:text-white">
              Termeni
            </Link>

            <Link href="/autentificare" className="hover:text-white">
              Intră în cont
            </Link>
          </div>

          <Link
            href="/profiluri"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Înapoi
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Raportare profil
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Raportează un profil sau o conversație.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Folosește formularul pentru a semnala un profil suspect, conținut
              interzis, fraudă sau comportament abuziv.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Formular
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Detalii raportare
            </h2>

            <p className="mt-3 leading-7 text-white/60">
              În demo, raportarea se salvează local în browser și apare în
              panoul admin.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Profil raportat
              </label>

              <input
                type="text"
                value={form.profileName}
                onChange={(event) =>
                  updateField("profileName", event.target.value)
                }
                placeholder="Ex: Nume profil"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.profileName && (
                <p className="mt-2 text-sm text-rose-300">
                  {errors.profileName}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Link profil sau conversație
              </label>

              <input
                type="text"
                value={form.profileLink}
                onChange={(event) =>
                  updateField("profileLink", event.target.value)
                }
                placeholder="/profil/nume-profil"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-white/80">
                Motiv raportare
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                {reportReasons.map((reason) => {
                  const isSelected = form.reason === reason;

                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => updateField("reason", reason)}
                      className={`rounded-3xl border p-4 text-left text-sm font-semibold transition ${
                        isSelected
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                          : "border-white/10 bg-black/30 text-white/70 hover:bg-white/[0.06]"
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>

              {errors.reason && (
                <p className="mt-2 text-sm text-rose-300">{errors.reason}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Detalii
              </label>

              <textarea
                value={form.details}
                onChange={(event) => updateField("details", event.target.value)}
                placeholder="Descrie problema cât mai clar..."
                rows={7}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.details && (
                <p className="mt-2 text-sm text-rose-300">{errors.details}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Email opțional
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="email@exemplu.com"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-rose-300">{errors.email}</p>
              )}
            </div>

            <button
              type="button"
              onClick={submitReport}
              className="w-full rounded-full bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Trimite raportarea
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Siguranță înainte de toate
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/70">
              Dacă există pericol imediat, amenințări reale, exploatare sau
              suspiciuni legate de minori, contactează autoritățile competente.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Ce se întâmplă după raportare?</h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-white/60">
              <p>1. Raportarea este trimisă către moderare.</p>
              <p>2. Adminul poate marca raportarea ca verificată sau urgentă.</p>
              <p>3. Profilul poate fi verificat, ascuns sau blocat.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Demo admin
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              După trimiterea raportării, o poți vedea în panoul admin, în
              pagina de raportări.
            </p>

            <Link
              href="/admin/raportari"
              className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
            >
              Vezi raportări admin
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/profiluri"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Profiluri
              </Link>

              <Link
                href="/reguli"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reguli
              </Link>

              <Link
                href="/termeni"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Termeni
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — raportare și siguranță 18+.
      </footer>
    </main>
  );
}

function ReportPageFallback() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Se încarcă
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            Pregătim formularul de raportare...
          </h1>
        </div>
      </section>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<ReportPageFallback />}>
      <ReportPageContent />
    </Suspense>
  );
}