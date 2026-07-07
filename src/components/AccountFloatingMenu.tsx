"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type DemoAccount = {
  name?: string;
  email?: string;
  role?: "user" | "advertiser" | "admin";
  roleLabel?: string;
  loggedInAt?: string;
};

export default function AccountFloatingMenu() {
  const pathname = usePathname();

  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function loadAccount() {
    const savedAccount = localStorage.getItem("luxe_demo_account");
    const savedRole = localStorage.getItem("luxe_demo_role");

    if (!savedAccount || !savedRole) {
      setAccount(null);
      return;
    }

    try {
      const parsedAccount = JSON.parse(savedAccount) as DemoAccount;

      if (
        savedRole === "user" ||
        savedRole === "advertiser" ||
        savedRole === "admin"
      ) {
        setAccount({
          ...parsedAccount,
          role: savedRole,
        });

        return;
      }

      setAccount(null);
    } catch {
      setAccount(null);
    }
  }

  useEffect(() => {
    loadAccount();

    function handleFocus() {
      loadAccount();
    }

    function handleStorage() {
      loadAccount();
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    loadAccount();
    setIsOpen(false);
  }, [pathname]);

  function logoutDemo() {
    localStorage.removeItem("luxe_demo_account");
    localStorage.removeItem("luxe_demo_role");

    setAccount(null);
    setIsOpen(false);
  }

  const roleLabel = useMemo(() => {
    if (!account) {
      return "Neautentificat";
    }

    if (account.role === "admin") {
      return "Admin";
    }

    if (account.role === "advertiser") {
      return "Advertiser";
    }

    return "Utilizator";
  }, [account]);

  const displayName = account?.name || roleLabel;

  const accountInitial = useMemo(() => {
    if (!account?.name) {
      return account?.role === "admin"
        ? "A"
        : account?.role === "advertiser"
          ? "P"
          : "U";
    }

    return account.name.slice(0, 1).toUpperCase();
  }, [account]);

  if (!account) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Link
          href="/autentificare"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/90 px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur transition hover:bg-zinc-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
            +
          </span>

          <span>Intră în cont</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-72 rounded-3xl border border-white/10 bg-zinc-950/95 p-4 text-white shadow-2xl backdrop-blur">
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-rose-400">
                Cont demo
              </p>

              <p className="mt-2 truncate text-lg font-bold">{displayName}</p>

              <p className="mt-1 truncate text-sm text-white/50">
                {account.email || "Email indisponibil"}
              </p>

              <div className="mt-3 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                {roleLabel}
              </div>
            </div>

            <div className="space-y-2">
              {account.role === "admin" ? (
                <>
                  <Link
                    href="/admin"
                    className="block rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/80"
                  >
                    Panou admin
                  </Link>

                  <Link
                    href="/admin/raportari"
                    className="block rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Raportări
                  </Link>
                </>
              ) : account.role === "advertiser" ? (
                <>
                  <Link
                    href="/cont"
                    className="block rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/80"
                  >
                    Cont advertiser
                  </Link>

                  <Link
                    href="/cont/anunt"
                    className="block rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Status anunț
                  </Link>

                  <Link
                    href="/publica-anunt"
                    className="block rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Publică anunț
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profiluri"
                    className="block rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/80"
                  >
                    Profiluri
                  </Link>

                  <Link
                    href="/raporteaza"
                    className="block rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Raportează
                  </Link>
                </>
              )}

              <Link
                href="/iesire"
                className="block rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Pagina de ieșire
              </Link>

              <button
                type="button"
                onClick={logoutDemo}
                className="w-full rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
              >
                Ieși rapid
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/90 px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur transition hover:bg-zinc-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
            {accountInitial}
          </span>

          <span className="max-w-32 truncate">{roleLabel}</span>
        </button>
      </div>
    </div>
  );
}