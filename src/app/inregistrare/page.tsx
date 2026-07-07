"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AccountRole = "user" | "advertiser";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  ageAccepted?: string;
  termsAccepted?: string;
};

type RegisteredAccount = {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  roleLabel: string;
  createdAt: string;
};

const roles = [
  {
    id: "user",
    title: "Utilizator",
    description: "Vede profiluri, deschide chat și poate raporta profiluri.",
    redirect: "/profiluri",
  },
  {
    id: "advertiser",
    title: "Advertiser",
    description: "Poate publica anunțuri, vede statusul și plătește pachetul.",
    redirect: "/cont",
  },
] as const;

function createDemoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `demo-${Date.now()}`;
}

export default function RegisterPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<AccountRole>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ageAccepted, setAgeAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [createdAccount, setCreatedAccount] =
    useState<RegisteredAccount | null>(null);

  const selectedRoleData = useMemo(() => {
    return roles.find((role) => role.id === selectedRole) || roles[0];
  }, [selectedRole]);

  const roleLabel = useMemo(() => {
    if (selectedRole === "advertiser") {
      return "Advertiser";
    }

    return "Utilizator";
  }, [selectedRole]);

  function updateError(field: keyof FormErrors) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function validateForm() {
    const newErrors: FormErrors = {};

    if (name.trim().length < 2) {
      newErrors.name = "Completează numele.";
    }

    if (!email.includes("@") || email.trim().length < 5) {
      newErrors.email = "Completează un email valid.";
    }

    if (password.length < 6) {
      newErrors.password = "Parola trebuie să aibă minimum 6 caractere.";
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Parolele nu coincid.";
    }

    if (!selectedRole) {
      newErrors.role = "Alege tipul de cont.";
    }

    if (!ageAccepted) {
      newErrors.ageAccepted = "Trebuie să confirmi că ai minimum 18 ani.";
    }

    if (!termsAccepted) {
      newErrors.termsAccepted = "Trebuie să accepți regulile și termenii.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function getSavedAccounts() {
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

  function createAccount() {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const savedAccounts = getSavedAccounts();
    const normalizedEmail = email.trim().toLowerCase();

    const emailAlreadyExists = savedAccounts.some(
      (account) => account.email.toLowerCase() === normalizedEmail
    );

    if (emailAlreadyExists) {
      setErrors({
        email:
          "Există deja un cont demo cu acest email. Poți merge la autentificare.",
      });

      return;
    }

    const newAccount: RegisteredAccount = {
      id: createDemoId(),
      name: name.trim(),
      email: normalizedEmail,
      role: selectedRole,
      roleLabel,
      createdAt: new Date().toISOString(),
    };

    const updatedAccounts = [newAccount, ...savedAccounts];

    localStorage.setItem(
      "luxe_registered_accounts",
      JSON.stringify(updatedAccounts)
    );

    localStorage.setItem(
      "luxe_demo_account",
      JSON.stringify({
        ...newAccount,
        loggedInAt: new Date().toISOString(),
      })
    );

    localStorage.setItem("luxe_demo_role", selectedRole);

    setCreatedAccount(newAccount);
  }

  function continueToAccount() {
    router.push(selectedRoleData.redirect);
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
            <Link href="/autentificare" className="hover:text-white">
              Intră în cont
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
            href="/autentificare"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Ai deja cont?
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Creare cont 18+
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Creează cont pe Luxe.ro.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Alege dacă intri ca utilizator sau advertiser. Adminul nu se poate
              crea public și rămâne separat.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/autentificare"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Am deja cont
              </Link>

              <Link
                href="/termeni"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Citește termenii
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Înregistrare
            </p>

            <h2 className="mt-3 text-3xl font-bold">Date cont</h2>

            <p className="mt-3 leading-7 text-white/60">
              În demo, contul se salvează local în browser. Parola nu este
              trimisă către server.
            </p>
          </div>

          {!createdAccount ? (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Nume
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    updateError("name");
                  }}
                  placeholder="Ex: Andrei Popescu"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                />

                {errors.name && (
                  <p className="mt-2 text-sm text-rose-300">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    updateError("email");
                  }}
                  placeholder="exemplu@email.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                />

                {errors.email && (
                  <p className="mt-2 text-sm text-rose-300">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Parolă
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      updateError("password");
                    }}
                    placeholder="Minimum 6 caractere"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                  />

                  {errors.password && (
                    <p className="mt-2 text-sm text-rose-300">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Confirmă parola
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      updateError("confirmPassword");
                    }}
                    placeholder="Repetă parola"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                  />

                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-rose-300">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-white/80">
                  Tip cont
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.id);
                          updateError("role");
                        }}
                        className={`rounded-3xl border p-5 text-left transition ${
                          isSelected
                            ? "border-rose-500/40 bg-rose-500/10"
                            : "border-white/10 bg-black/30 hover:bg-white/[0.06]"
                        }`}
                      >
                        <p
                          className={`text-lg font-bold ${
                            isSelected ? "text-rose-200" : "text-white"
                          }`}
                        >
                          {role.title}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-white/50">
                          {role.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {errors.role && (
                  <p className="mt-2 text-sm text-rose-300">{errors.role}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/60">
                  <input
                    type="checkbox"
                    checked={ageAccepted}
                    onChange={(event) => {
                      setAgeAccepted(event.target.checked);
                      updateError("ageAccepted");
                    }}
                    className="mt-1 h-4 w-4"
                  />

                  <span>
                    Confirm că am minimum 18 ani și că folosesc platforma pe
                    propria răspundere.
                  </span>
                </label>

                {errors.ageAccepted && (
                  <p className="text-sm text-rose-300">
                    {errors.ageAccepted}
                  </p>
                )}

                <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/60">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => {
                      setTermsAccepted(event.target.checked);
                      updateError("termsAccepted");
                    }}
                    className="mt-1 h-4 w-4"
                  />

                  <span>
                    Accept{" "}
                    <Link
                      href="/reguli"
                      className="font-semibold text-rose-300"
                    >
                      regulile
                    </Link>
                    ,{" "}
                    <Link
                      href="/termeni"
                      className="font-semibold text-rose-300"
                    >
                      termenii și confidențialitatea
                    </Link>{" "}
                    platformei.
                  </span>
                </label>

                {errors.termsAccepted && (
                  <p className="text-sm text-rose-300">
                    {errors.termsAccepted}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={createAccount}
                className="w-full rounded-full bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-400"
              >
                Creează cont
              </button>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
              <h3 className="text-2xl font-bold text-emerald-300">
                Cont creat cu succes.
              </h3>

              <p className="mt-4 leading-8 text-emerald-100/70">
                Contul demo a fost creat și ești autentificat automat.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-5">
                  <p className="text-sm text-emerald-100/50">Nume</p>
                  <p className="mt-2 font-semibold text-white">
                    {createdAccount.name}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-5">
                  <p className="text-sm text-emerald-100/50">Email</p>
                  <p className="mt-2 break-all font-semibold text-white">
                    {createdAccount.email}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-5">
                  <p className="text-sm text-emerald-100/50">Rol</p>
                  <p className="mt-2 font-semibold text-white">
                    {createdAccount.roleLabel}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={continueToAccount}
                  className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
                >
                  Continuă
                </button>

                <Link
                  href="/autentificare"
                  className="rounded-full border border-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Mergi la login
                </Link>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Tipuri de cont
            </p>

            <h2 className="mt-3 text-2xl font-bold">Ce aleg?</h2>

            <div className="mt-6 space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-3xl border border-white/10 bg-black/30 p-5"
                >
                  <p className="font-bold">{role.title}</p>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Adminul nu se creează public
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/70">
              Conturile de admin nu trebuie create de utilizatori. Adminul are
              acces separat printr-o zonă internă.
            </p>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">Demo local</h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              În acest demo, conturile se salvează în localStorage. În versiunea
              reală, conturile vor fi salvate într-o bază de date cu parole
              securizate.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/autentificare"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Intră în cont
              </Link>

              <Link
                href="/termeni"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Termeni
              </Link>

              <Link
                href="/reguli"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reguli
              </Link>

              <Link
                href="/reset-demo"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Reset demo
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