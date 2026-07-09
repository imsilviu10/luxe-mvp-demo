"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type UserRole = "user" | "advertiser" | "admin";

type DemoAccount = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  loggedInAt?: string;
};

type RegisteredAccount = {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  roleLabel?: string;
  passwordDemo?: string;
  createdAt?: string;
  status?: "active" | "blocked" | "deleted";
  blockedAt?: string;
  deletedAt?: string;
};

type BlockedAccount = {
  email: string;
  name?: string;
  role?: UserRole;
  blockedAt?: string;
  reason?: string;
};

type DeletedAccount = {
  email: string;
  name?: string;
  role?: UserRole;
  deletedAt?: string;
  reason?: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
  acceptedRules?: string;
  general?: string;
};

const quickAccounts: DemoAccount[] = [
  {
    id: "demo-user",
    name: "Utilizator Demo",
    email: "user.demo@luxe.ro",
    role: "user",
    roleLabel: "Utilizator",
  },
  {
    id: "demo-advertiser",
    name: "Advertiser Demo",
    email: "advertiser.demo@luxe.ro",
    role: "advertiser",
    roleLabel: "Advertiser",
  },
];

function normalizeEmail(email?: string) {
  return (email || "").trim().toLowerCase();
}

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

function readArray<T>(key: string) {
  const savedValue = readJson<unknown>(key);

  if (!Array.isArray(savedValue)) {
    return [] as T[];
  }

  return savedValue as T[];
}

function readBlockedAccounts() {
  const savedValue = readJson<unknown>("luxe_blocked_accounts");

  if (!Array.isArray(savedValue)) {
    return [] as BlockedAccount[];
  }

  return savedValue
    .map((item) => {
      if (typeof item === "string") {
        return {
          email: normalizeEmail(item),
          reason: "Cont blocat de admin.",
        };
      }

      const blockedAccount = item as Partial<BlockedAccount>;

      return {
        email: normalizeEmail(blockedAccount.email),
        name: blockedAccount.name,
        role: blockedAccount.role,
        blockedAt: blockedAccount.blockedAt,
        reason: blockedAccount.reason || "Cont blocat de admin.",
      };
    })
    .filter((item) => item.email);
}

function readDeletedAccounts() {
  const savedValue = readJson<unknown>("luxe_deleted_accounts");

  if (!Array.isArray(savedValue)) {
    return [] as DeletedAccount[];
  }

  return savedValue
    .map((item) => {
      if (typeof item === "string") {
        return {
          email: normalizeEmail(item),
          reason: "Cont șters de admin.",
        };
      }

      const deletedAccount = item as Partial<DeletedAccount>;

      return {
        email: normalizeEmail(deletedAccount.email),
        name: deletedAccount.name,
        role: deletedAccount.role,
        deletedAt: deletedAccount.deletedAt,
        reason: deletedAccount.reason || "Cont șters de admin.",
      };
    })
    .filter((item) => item.email);
}

function isAccountBlocked(email: string) {
  const cleanEmail = normalizeEmail(email);
  const blockedAccounts = readBlockedAccounts();

  return blockedAccounts.find((account) => {
    return normalizeEmail(account.email) === cleanEmail;
  });
}

function isAccountDeleted(email: string) {
  const cleanEmail = normalizeEmail(email);
  const deletedAccounts = readDeletedAccounts();

  return deletedAccounts.find((account) => {
    return normalizeEmail(account.email) === cleanEmail;
  });
}

function getRegisteredAccount(email: string) {
  const cleanEmail = normalizeEmail(email);
  const registeredAccounts = readArray<RegisteredAccount>(
    "luxe_registered_accounts"
  );

  return registeredAccounts.find((account) => {
    return normalizeEmail(account.email) === cleanEmail;
  });
}

function getRoleLabel(role?: UserRole) {
  if (role === "advertiser") {
    return "Advertiser";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "Utilizator";
}

function getRedirectPath(role: UserRole) {
  if (role === "advertiser") {
    return "/cont";
  }

  if (role === "admin") {
    return "/admin";
  }

  return "/profiluri";
}

function saveLoggedAccount(account: DemoAccount) {
  localStorage.setItem(
    "luxe_demo_account",
    JSON.stringify({
      ...account,
      loggedInAt: new Date().toISOString(),
    })
  );

  localStorage.setItem("luxe_demo_role", account.role);
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const registeredAccountsCount = useMemo(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    return readArray<RegisteredAccount>("luxe_registered_accounts").length;
  }, []);

  function clearError(field: keyof LoginErrors) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
      general: field === "general" ? "" : currentErrors.general,
    }));
  }

  function validateBaseForm() {
    const newErrors: LoginErrors = {};

    if (!email.trim()) {
      newErrors.email = "Introdu adresa de email.";
    }

    if (!password.trim()) {
      newErrors.password = "Introdu parola.";
    }

    if (!acceptedRules) {
      newErrors.acceptedRules =
        "Trebuie să confirmi că ai peste 18 ani și accepți regulile.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function checkAccountAccess(accountEmail: string) {
    const deletedAccount = isAccountDeleted(accountEmail);

    if (deletedAccount) {
      return {
        allowed: false,
        message:
          "Acest cont a fost șters de admin și nu mai poate fi folosit în demo.",
      };
    }

    const blockedAccount = isAccountBlocked(accountEmail);

    if (blockedAccount) {
      return {
        allowed: false,
        message: `Acest cont este blocat de admin.${
          blockedAccount.reason ? ` Motiv: ${blockedAccount.reason}` : ""
        }`,
      };
    }

    const registeredAccount = getRegisteredAccount(accountEmail);

    if (registeredAccount?.status === "deleted") {
      return {
        allowed: false,
        message:
          "Acest cont a fost șters de admin și nu mai poate fi folosit în demo.",
      };
    }

    if (registeredAccount?.status === "blocked") {
      return {
        allowed: false,
        message:
          "Acest cont este blocat de admin și nu poate intra în platformă.",
      };
    }

    return {
      allowed: true,
      message: "",
    };
  }

  function loginQuickAccount(account: DemoAccount) {
    if (!acceptedRules) {
      setErrors({
        acceptedRules:
          "Bifează confirmarea 18+ înainte de autentificarea rapidă.",
      });

      return;
    }

    const access = checkAccountAccess(account.email);

    if (!access.allowed) {
      setErrors({
        general: access.message,
      });

      return;
    }

    saveLoggedAccount(account);
    router.push(getRedirectPath(account.role));
  }

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = validateBaseForm();

    if (!isValid) {
      return;
    }

    const cleanEmail = normalizeEmail(email);
    const registeredAccount = getRegisteredAccount(cleanEmail);
    const quickAccount = quickAccounts.find((account) => {
      return normalizeEmail(account.email) === cleanEmail;
    });

    const access = checkAccountAccess(cleanEmail);

    if (!access.allowed) {
      setErrors({
        general: access.message,
      });

      return;
    }

    if (registeredAccount) {
      if (registeredAccount.passwordDemo !== password) {
        setErrors({
          password: "Parola introdusă nu este corectă.",
        });

        return;
      }

      const role = registeredAccount.role || "user";

      if (role === "admin") {
        setErrors({
          general:
            "Adminul nu se autentifică din pagina publică. Folosește pagina ascunsă de admin.",
        });

        return;
      }

      const accountToSave: DemoAccount = {
        id: registeredAccount.id || cleanEmail,
        name: registeredAccount.name || "Cont demo",
        email: cleanEmail,
        role,
        roleLabel: registeredAccount.roleLabel || getRoleLabel(role),
      };

      saveLoggedAccount(accountToSave);
      router.push(getRedirectPath(role));
      return;
    }

    if (quickAccount) {
      if (password !== "demo123" && password !== "123456") {
        setErrors({
          password:
            "Pentru conturile demo rapide folosește parola demo123 sau 123456.",
        });

        return;
      }

      saveLoggedAccount(quickAccount);
      router.push(getRedirectPath(quickAccount.role));
      return;
    }

    setErrors({
      general:
        "Nu am găsit acest cont. Creează un cont nou sau folosește autentificarea rapidă demo.",
    });
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200">
              Autentificare 18+
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/inregistrare" className="hover:text-white">
              Creează cont
            </Link>

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href="/admin-login-luxe" className="hover:text-white">
              Admin demo
            </Link>
          </div>

          <Link
            href="/inregistrare"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Creează cont
          </Link>
        </nav>

        <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="pt-6 lg:pt-16">
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              Acces controlat demo
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Intră în contul tău Luxe.ro.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Autentificarea diferențiază utilizatorii publici de advertiseri.
              Conturile blocate sau șterse de admin nu mai pot intra în
              platformă.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
                <p className="text-sm text-white/45">Roluri</p>
                <p className="mt-2 text-2xl font-bold">User / Advertiser</p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
                <p className="text-sm text-white/45">Conturi create</p>
                <p className="mt-2 text-2xl font-bold">
                  {registeredAccountsCount}
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
                <p className="text-sm text-white/45">Admin</p>
                <p className="mt-2 text-2xl font-bold">Separat</p>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
              <h2 className="text-xl font-bold text-sky-200">
                Regulă importantă
              </h2>

              <p className="mt-3 text-sm leading-7 text-sky-100/75">
                Dacă adminul blochează un utilizator sau advertiser, login-ul
                este refuzat. Dacă adminul șterge contul, acesta dispare din
                demo și nu mai poate fi folosit.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8 rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Login
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Autentificare cont demo
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/60">
                Poți intra cu un cont creat în demo sau cu autentificarea rapidă
                de mai jos.
              </p>
            </div>

            {errors.general && (
              <div className="mb-6 rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-5 text-sm leading-7 text-rose-100">
                {errors.general}
              </div>
            )}

            <form onSubmit={submitLogin} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearError("email");
                    clearError("general");
                  }}
                  placeholder="ex: test@test.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
                />

                {errors.email && (
                  <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Parolă
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearError("password");
                    clearError("general");
                  }}
                  placeholder="Parola contului demo"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
                />

                {errors.password && (
                  <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {errors.password}
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer gap-4 rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white/65 transition hover:bg-white/[0.06]">
                <input
                  type="checkbox"
                  checked={acceptedRules}
                  onChange={(event) => {
                    setAcceptedRules(event.target.checked);
                    clearError("acceptedRules");
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

              {errors.acceptedRules && (
                <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {errors.acceptedRules}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-rose-500 px-8 py-4 font-semibold text-white transition hover:bg-rose-400"
              >
                Intră în cont
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35">
                sau rapid demo
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {quickAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => loginQuickAccount(account)}
                  className="rounded-[2rem] border border-white/10 bg-black/30 p-5 text-left transition hover:border-rose-500/30 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                        account.role === "advertiser"
                          ? "bg-rose-500/10 text-rose-200"
                          : "bg-sky-500/10 text-sky-200"
                      }`}
                    >
                      {account.role === "advertiser" ? "A" : "U"}
                    </div>

                    <div>
                      <h3 className="font-bold">{account.name}</h3>

                      <p className="mt-1 text-sm text-white/45">
                        {account.email}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-white/70">
                        Intră ca {account.roleLabel}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/inregistrare"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Creează cont nou
              </Link>

              <Link
                href="/admin-login-luxe"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Login admin demo
              </Link>
            </div>

            <div className="mt-8 rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-5">
              <h3 className="font-bold text-amber-200">
                Date rapide demo
              </h3>

              <div className="mt-4 space-y-2 text-sm leading-7 text-amber-100/75">
                <p>User rapid: user.demo@luxe.ro</p>
                <p>Advertiser rapid: advertiser.demo@luxe.ro</p>
                <p>Parolă pentru conturile rapide: demo123 sau 123456</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}