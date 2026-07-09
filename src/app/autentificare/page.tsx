"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type AccountRole = "user" | "advertiser";

type RegisteredAccount = {
  id?: string;
  name: string;
  email: string;
  role: AccountRole;
  roleLabel?: string;
  createdAt?: string;
  loggedInAt?: string;
  passwordDemo?: string;
  password?: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const publicRoles = [
  {
    id: "user",
    title: "Utilizator",
    description:
      "Intră pentru a vedea profiluri, a deschide chat demo și a trimite raportări.",
  },
  {
    id: "advertiser",
    title: "Advertiser",
    description:
      "Intră pentru a publica anunțuri, a vedea statusul verificării și a continua către plată.",
  },
] as const;

function getRoleLabel(role: AccountRole) {
  if (role === "advertiser") {
    return "Advertiser";
  }

  return "Utilizator";
}

function getRoleRedirect(role: AccountRole) {
  if (role === "advertiser") {
    return "/cont";
  }

  return "/profiluri";
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [generalError, setGeneralError] = useState("");

  function clearError(field: keyof LoginErrors) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));

    setGeneralError("");
  }

  function getRegisteredAccounts() {
    const savedAccounts = localStorage.getItem("luxe_registered_accounts");

    if (!savedAccounts) {
      return [];
    }

    try {
      return JSON.parse(savedAccounts) as RegisteredAccount[];
    } catch {
      return [];
    }
  }

  function saveLoggedAccount(account: RegisteredAccount) {
    const safeRole: AccountRole =
      account.role === "advertiser" ? "advertiser" : "user";

    localStorage.setItem(
      "luxe_demo_account",
      JSON.stringify({
        ...account,
        role: safeRole,
        roleLabel: account.roleLabel || getRoleLabel(safeRole),
        loggedInAt: new Date().toISOString(),
      })
    );

    localStorage.setItem("luxe_demo_role", safeRole);

    router.push(getRoleRedirect(safeRole));
  }

  function quickLogin(role: AccountRole) {
    const roleLabel = getRoleLabel(role);

    localStorage.setItem(
      "luxe_demo_account",
      JSON.stringify({
        id: `quick-${role}-${Date.now()}`,
        name: role === "advertiser" ? "Advertiser Demo" : "Utilizator Demo",
        email:
          role === "advertiser"
            ? "advertiser.demo@luxe.ro"
            : "utilizator.demo@luxe.ro",
        role,
        roleLabel,
        loggedInAt: new Date().toISOString(),
      })
    );

    localStorage.setItem("luxe_demo_role", role);

    router.push(getRoleRedirect(role));
  }

  function loginWithRegisteredAccount() {
    const newErrors: LoginErrors = {};
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@") || normalizedEmail.length < 5) {
      newErrors.email = "Completează un email valid.";
    }

    if (password.length < 6) {
      newErrors.password = "Parola trebuie să aibă minimum 6 caractere.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!acceptedRules) {
      setGeneralError(
        "Trebuie să confirmi că ai minimum 18 ani și accepți regulile platformei."
      );
      return;
    }

    const registeredAccounts = getRegisteredAccounts();

    const foundAccount = registeredAccounts.find(
      (account) => account.email.toLowerCase() === normalizedEmail
    );

    if (!foundAccount) {
      setErrors({
        email: "Nu există cont demo cu acest email. Creează cont mai întâi.",
      });
      return;
    }

    const savedPassword = foundAccount.passwordDemo || foundAccount.password;

    if (savedPassword && savedPassword !== password) {
      setErrors({
        password: "Parola introdusă nu este corectă pentru acest cont demo.",
      });
      return;
    }

    saveLoggedAccount(foundAccount);
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
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Acasă
            </Link>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/inregistrare" className="hover:text-white">
              Creează cont
            </Link>

            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/termeni" className="hover:text-white">
              Termeni
            </Link>
          </div>

          <Link
            href="/inregistrare"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Creează cont
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Autentificare publică 18+
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Intră în contul Luxe.ro.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Zona publică este pentru utilizatori și advertiseri. Adminul are
              acces separat pentru moderare și prezentare demo.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/inregistrare"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Nu ai cont? Creează cont
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

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
          <div className="mb-8 rounded-3xl border border-white/10 bg-black/25 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Login
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Intră cu un cont creat.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-white/60">
              Folosește emailul și parola contului creat în pagina de
              înregistrare. În demo, conturile sunt salvate local în browser.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearError("email");
                }}
                placeholder="exemplu@email.com"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.email && (
                <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Parolă
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearError("password");
                }}
                placeholder="Parola contului"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.password && (
                <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {errors.password}
                </p>
              )}
            </div>

            <label className="flex cursor-pointer gap-4 rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white/65 transition hover:bg-white/[0.04]">
              <input
                type="checkbox"
                checked={acceptedRules}
                onChange={(event) => {
                  setAcceptedRules(event.target.checked);
                  setGeneralError("");
                }}
                className="mt-1 h-4 w-4 shrink-0"
              />

              <span>
                Confirm că am minimum 18 ani și accept{" "}
                <Link href="/reguli" className="font-semibold text-rose-300">
                  regulile
                </Link>{" "}
                și{" "}
                <Link href="/termeni" className="font-semibold text-rose-300">
                  termenii platformei
                </Link>
                .
              </span>
            </label>

            {generalError && (
              <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm leading-7 text-rose-100">
                {generalError}
              </div>
            )}

            <button
              type="button"
              onClick={loginWithRegisteredAccount}
              className="w-full rounded-full bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Intră în cont
            </button>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
              <h3 className="text-xl font-bold">Nu ai cont?</h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
                Creează un cont nou ca utilizator sau advertiser. Conturile de
                admin nu se creează public.
              </p>

              <Link
                href="/inregistrare"
                className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Creează cont nou
              </Link>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-6 rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Login rapid demo
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Testează fără cont creat.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/60">
                Pentru prezentare rapidă, poți intra direct ca utilizator sau
                advertiser demo.
              </p>
            </div>

            <div className="space-y-4">
              {publicRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => quickLogin(role.id)}
                  className="group flex w-full flex-col rounded-3xl border border-white/10 bg-black/30 p-5 text-left transition hover:border-rose-500/30 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-white">
                        {role.title}
                      </p>

                      <p className="mt-2 max-w-md text-sm leading-7 text-white/55">
                        {role.description}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold text-white transition group-hover:bg-rose-500">
                      {role.id === "advertiser" ? "A" : "U"}
                    </div>
                  </div>

                  <div className="mt-5 w-full rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-black transition group-hover:bg-rose-500 group-hover:text-white">
                    Intră ca {role.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Adminul este separat
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              Pagina publică de autentificare nu afișează rolul de admin.
              Conturile admin sunt interne și nu pot fi create de utilizatori.
            </p>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Cum testezi corect
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-7 text-sky-100/75">
              <p>1. Creezi cont nou în pagina de înregistrare.</p>
              <p>2. Apeși ieșire din cont.</p>
              <p>3. Revii aici și intri cu emailul contului creat.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/inregistrare"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Creează cont
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Profiluri
              </Link>

              <Link
                href="/publica-anunt"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Publică anunț
              </Link>

              <Link
                href="/iesire"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Ieșire
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