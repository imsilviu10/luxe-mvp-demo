import Link from "next/link";

const demoAccess = [
  {
    title: "Utilizator demo",
    description: "Vede profiluri, poate deschide chat demo și poate raporta.",
    href: "/autentificare",
    button: "Login public",
  },
  {
    title: "Advertiser demo",
    description:
      "Poate crea anunț, trimite verificare 18+, vede statusul și plata.",
    href: "/autentificare",
    button: "Login advertiser",
  },
  {
    title: "Admin demo",
    description:
      "Moderează anunțuri, aprobă pentru plată și gestionează raportări.",
    href: "/admin-login-luxe",
    button: "Login admin",
  },
];

const demoFlow = [
  {
    step: "01",
    title: "Creare cont",
    description: "Utilizatorul sau advertiserul își creează cont 18+.",
    href: "/inregistrare",
  },
  {
    step: "02",
    title: "Publicare anunț",
    description: "Advertiserul completează anunțul și alege pachetul.",
    href: "/publica-anunt",
  },
  {
    step: "03",
    title: "Verificare 18+",
    description: "Advertiserul trimite verificarea înainte de publicare.",
    href: "/verificare-18",
  },
  {
    step: "04",
    title: "Moderare admin",
    description: "Adminul verifică anunțul și îl aprobă pentru plată.",
    href: "/admin",
  },
  {
    step: "05",
    title: "Plată demo",
    description: "Advertiserul plătește pachetul aprobat.",
    href: "/plata",
  },
  {
    step: "06",
    title: "Profil public",
    description: "Anunțul apare în lista publică și are pagină proprie.",
    href: "/profiluri",
  },
];

const readyFeatures = [
  "Homepage premium cu confirmare 18+",
  "Listă profiluri cu filtre pe oraș",
  "Pagină profil public",
  "Chat demo pentru profiluri",
  "Creare cont utilizator / advertiser",
  "Login public separat de admin",
  "Logout demo",
  "Publicare anunț advertiser",
  "Verificare 18+ demo",
  "Panou admin pentru moderare",
  "Aprobare pentru plată",
  "Plată demo",
  "Profil public după plată",
  "Raportare profiluri",
  "Panou admin pentru raportări",
  "Pagini reguli, termeni și cookies",
];

const productionNeeds = [
  "Bază de date reală, de exemplu Supabase sau PostgreSQL",
  "Autentificare reală cu sesiuni securizate",
  "Parole criptate pe server",
  "Upload real pentru poze și documente",
  "Procesator de plăți real",
  "Emailuri tranzacționale",
  "Moderare reală cu istoric",
  "Politici legale verificate de avocat",
  "Hosting domeniu + monitorizare",
];

export default function PresentationPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200">
              Prezentare MVP
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/autentificare" className="hover:text-white">
              Login
            </Link>

            <Link href="/admin-login-luxe" className="hover:text-white">
              Admin demo
            </Link>
          </div>

          <Link
            href="/"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Vezi site
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              Demo funcțional pentru prezentare și vânzare
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Luxe.ro — platformă premium 18+ cu user, advertiser și admin.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Acesta este un MVP demonstrabil pentru o platformă 18+ de
              profiluri, anunțuri, verificare, plată demo, moderare admin și
              raportări. Proiectul este pregătit pentru prezentare, nu pentru
              producție finală fără backend și verificare legală.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/profiluri"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Vezi demo public
              </Link>

              <Link
                href="/inregistrare"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Creează cont demo
              </Link>

              <Link
                href="/admin-login-luxe"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Admin demo
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Date demo admin
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Acces complet pentru prezentare
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">URL admin</p>
                <p className="mt-2 break-all font-semibold text-white">
                  /admin-login-luxe
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Email</p>
                <p className="mt-2 font-semibold text-white">
                  admin@luxe.ro
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Parolă</p>
                <p className="mt-2 font-semibold text-white">
                  LUXE-ADMIN-2026
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/50">
              Adminul este păstrat pentru demo și vânzare, dar nu este afișat
              în meniul public principal ca rol normal de utilizator.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Roluri
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Trei roluri pentru demonstrație completă.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {demoAccess.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"
            >
              <h3 className="text-2xl font-bold">{item.title}</h3>

              <p className="mt-3 min-h-20 leading-7 text-white/60">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/80"
              >
                {item.button}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Flow demo
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Pașii recomandați când prezinți proiectul.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {demoFlow.map((item) => (
            <Link
              key={item.step}
              href={item.href}
              className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 transition hover:bg-white/[0.09]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-sm font-bold text-white">
                {item.step}
              </div>

              <h3 className="text-2xl font-bold">{item.title}</h3>

              <p className="mt-3 leading-7 text-white/60">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Gata în demo
          </p>

          <h2 className="mt-3 text-3xl font-bold text-emerald-100">
            Funcționalități existente.
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {readyFeatures.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-emerald-500/20 bg-black/20 px-4 py-3 text-sm text-emerald-50/80"
              >
                ✓ {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Pentru producție
          </p>

          <h2 className="mt-3 text-3xl font-bold text-amber-100">
            Ce se adaugă după vânzare.
          </h2>

          <div className="mt-6 space-y-3">
            {productionNeeds.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-amber-500/20 bg-black/20 px-4 py-3 text-sm text-amber-50/80"
              >
                → {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Poziționare pentru vânzare
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Cum trebuie prezentat proiectul.
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <h3 className="text-xl font-bold">Ce este</h3>

              <p className="mt-3 leading-7 text-white/60">
                MVP demonstrabil cu interfață premium, flow complet și roluri
                separate.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <h3 className="text-xl font-bold">Ce nu este încă</h3>

              <p className="mt-3 leading-7 text-white/60">
                Nu este încă aplicație de producție cu bază de date reală,
                plăți reale și securitate server-side completă.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <h3 className="text-xl font-bold">Valoare orientativă</h3>

              <p className="mt-3 leading-7 text-white/60">
                Ca demo vandabil: aproximativ 1.500 € - 3.000 €. Cu backend,
                plăți și upload real: poate urca spre 4.000 € - 10.000 €+.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/reset-demo"
              className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Reset demo
            </Link>

            <Link
              href="/admin-login-luxe"
              className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
            >
              Intră în admin
            </Link>

            <Link
              href="/profiluri"
              className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
            >
              Vezi site public
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — MVP demo 18+ pentru prezentare.
      </footer>
    </main>
  );
}