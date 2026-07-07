"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormErrors = {
  email?: string;
  password?: string;
};

const adminEmail = "admin@luxe.ro";
const adminPassword = "LUXE-ADMIN-2026";

export default function AdminHiddenLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginFailed, setLoginFailed] = useState(false);

  function loginAdmin() {
    const newErrors: FormErrors = {};

    if (!email.includes("@")) {
      newErrors.email = "Completează emailul de admin.";
    }

    if (password.trim().length < 3) {
      newErrors.password = "Completează parola de admin.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (email.trim() !== adminEmail || password.trim() !== adminPassword) {
      setLoginFailed(true);
      return;
    }

    const adminAccount = {
      name: "Admin Luxe",
      email: adminEmail,
      role: "admin",
      roleLabel: "Admin",
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem("luxe_demo_account", JSON.stringify(adminAccount));
    localStorage.setItem("luxe_demo_role", "admin");

    setLoginFailed(false);
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

        <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <div className="mb-6">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <div className="mt-6 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Acces intern
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight">
              Login admin.
            </h1>

            <p className="mt-4 leading-7 text-white/60">
              Această pagină nu este afișată în meniul public. În versiunea
              reală, accesul admin trebuie protejat pe server.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Email admin
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({ ...current, email: "" }));
                  setLoginFailed(false);
                }}
                placeholder="admin@luxe.ro"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-rose-300">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Parolă admin
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({ ...current, password: "" }));
                  setLoginFailed(false);
                }}
                placeholder="Parola internă"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.password && (
                <p className="mt-2 text-sm text-rose-300">
                  {errors.password}
                </p>
              )}
            </div>

            {loginFailed && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
                <p className="text-sm font-semibold text-rose-200">
                  Emailul sau parola sunt greșite.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={loginAdmin}
              className="w-full rounded-full bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Intră în admin
            </button>

            <button
              type="button"
              onClick={() => setShowHint((current) => !current)}
              className="w-full rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Arată date demo admin
            </button>

            {showHint && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-sm leading-7 text-amber-100/80">
                  Email demo: <span className="font-bold">{adminEmail}</span>
                  <br />
                  Parolă demo:{" "}
                  <span className="font-bold">{adminPassword}</span>
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 pt-3 text-sm text-white/50">
              <Link href="/" className="hover:text-white">
                Acasă
              </Link>

              <span>•</span>

              <Link href="/autentificare" className="hover:text-white">
                Login public
              </Link>

              <span>•</span>

              <Link href="/termeni" className="hover:text-white">
                Termeni
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}