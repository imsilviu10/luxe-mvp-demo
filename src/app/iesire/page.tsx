"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DemoAccount = {
  name?: string;
  email?: string;
  role?: "user" | "advertiser" | "admin";
  roleLabel?: string;
  loggedInAt?: string;
};

export default function LogoutPage() {
  const router = useRouter();

  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const savedAccount = localStorage.getItem("luxe_demo_account");

    if (!savedAccount) {
      setAccount(null);
      return;
    }

    try {
      const parsedAccount = JSON.parse(savedAccount) as DemoAccount;
      setAccount(parsedAccount);
    } catch {
      setAccount(null);
    }
  }, []);

  function logoutDemo() {
    localStorage.removeItem("luxe_demo_account");
    localStorage.removeItem("luxe_demo_role");

    setAccount(null);
    setIsLoggedOut(true);
  }

  function logoutAndGoHome() {
    localStorage.removeItem("luxe_demo_account");
    localStorage.removeItem("luxe_demo_role");

    setAccount(null);
    setIsLoggedOut(true);

    router.push("/");
  }

  function logoutAndGoLogin() {
    localStorage.removeItem("luxe_demo_account");
    localStorage.removeItem("luxe_demo_role");

    setAccount(null);
    setIsLoggedOut(true);

    router.push("/autentificare");
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

        <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl">
            ↪
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Ieșire din cont
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Ieși din contul Luxe.ro.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
            Această pagină șterge doar autentificarea demo din browser. Nu
            șterge anunțul, verificarea, plata, raportările sau preferințele de
            cookies.
          </p>

          {isLoggedOut ? (
            <div className="mt-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
              <h2 className="text-2xl font-bold text-emerald-300">
                Ai ieșit din cont.
              </h2>

              <p className="mt-3 leading-7 text-emerald-100/70">
                Loginul demo a fost șters din localStorage. Poți intra din nou
                ca utilizator, advertiser sau admin din paginile dedicate.
              </p>
            </div>
          ) : account ? (
            <div className="mt-8 rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
              <h2 className="text-2xl font-bold text-sky-200">
                Cont activ detectat.
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-sky-500/20 bg-black/20 p-5">
                  <p className="text-sm text-sky-100/50">Nume</p>
                  <p className="mt-2 font-semibold text-white">
                    {account.name || "Necunoscut"}
                  </p>
                </div>

                <div className="rounded-3xl border border-sky-500/20 bg-black/20 p-5">
                  <p className="text-sm text-sky-100/50">Email</p>
                  <p className="mt-2 break-all font-semibold text-white">
                    {account.email || "Necunoscut"}
                  </p>
                </div>

                <div className="rounded-3xl border border-sky-500/20 bg-black/20 p-5">
                  <p className="text-sm text-sky-100/50">Rol</p>
                  <p className="mt-2 font-semibold text-white">
                    {account.roleLabel || account.role || "Necunoscut"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
              <h2 className="text-2xl font-bold text-amber-200">
                Nu ești autentificat.
              </h2>

              <p className="mt-3 leading-7 text-amber-100/70">
                Nu am găsit un cont demo salvat în browser. Poți merge la
                autentificare pentru a intra într-un cont demo.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={logoutDemo}
              className="rounded-full bg-rose-500 px-8 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Ieși din cont
            </button>

            <button
              type="button"
              onClick={logoutAndGoLogin}
              className="rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:bg-white/80"
            >
              Ieși și mergi la login
            </button>

            <button
              type="button"
              onClick={logoutAndGoHome}
              className="rounded-full border border-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Ieși și mergi acasă
            </button>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/30 p-5 text-left">
            <h3 className="font-bold">Chei șterse la logout:</h3>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
                luxe_demo_account
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
                luxe_demo_role
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-white/50">
            <Link href="/" className="hover:text-white">
              Acasă
            </Link>

            <span>•</span>

            <Link href="/autentificare" className="hover:text-white">
              Login public
            </Link>

            <span>•</span>

            <Link href="/admin-login-luxe" className="hover:text-white">
              Login admin
            </Link>

            <span>•</span>

            <Link href="/cont" className="hover:text-white">
              Cont demo
            </Link>

            <span>•</span>

            <Link href="/reset-demo" className="hover:text-white">
              Reset demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}