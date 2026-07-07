import Link from "next/link";

const mainRules = [
  {
    title: "Doar persoane peste 18 ani",
    text: "Luxe.ro este o platformă destinată exclusiv adulților. Persoanele sub 18 ani nu au voie să folosească platforma.",
  },
  {
    title: "Fără minori",
    text: "Este strict interzis orice conținut, profil, mesaj sau fotografie care implică persoane minore.",
  },
  {
    title: "Fără conținut ilegal",
    text: "Nu permitem activități ilegale, exploatare, constrângere, trafic de persoane, fraudă sau comportament abuziv.",
  },
  {
    title: "Verificare obligatorie",
    text: "Advertiserii trebuie să treacă prin verificarea 18+ înainte ca anunțul să fie publicat.",
  },
  {
    title: "Moderare admin",
    text: "Adminul verifică anunțurile înainte de publicare și poate aproba, respinge sau bloca un profil.",
  },
  {
    title: "Advertiserul plătește anunțul",
    text: "Adminul nu introduce date de card. Plata pentru pachet este făcută de persoana care publică anunțul.",
  },
];

const advertiserRules = [
  "Completează doar informații reale și actuale.",
  "Nu folosi fotografii care nu îți aparțin.",
  "Nu publica date personale ale altor persoane.",
  "Nu publica anunțuri care promovează activități ilegale.",
  "Nu folosi limbaj agresiv, înșelător sau abuziv.",
  "Acceptă că anunțul poate fi respins dacă încalcă regulile.",
];

const userRules = [
  "Folosește platforma doar dacă ai peste 18 ani.",
  "Respectă persoanele cu care interacționezi.",
  "Nu trimite mesaje abuzive, amenințătoare sau hărțuitoare.",
  "Nu cere activități ilegale sau conținut interzis.",
  "Nu încerca să ocolești verificările platformei.",
  "Raportează profilurile suspecte sau comportamentul abuziv.",
];

export default function RulesPage() {
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

            <Link href="/cont" className="hover:text-white">
              Cont demo
            </Link>

            <Link href="/admin" className="hover:text-white">
              Admin demo
            </Link>
          </div>

          <Link
            href="/publica-anunt"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Publică anunț
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Reguli și siguranță
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Reguli clare pentru o platformă 18+ sigură.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Luxe.ro este construit ca o platformă adultă, moderată și
              responsabilă. Regulile de mai jos protejează utilizatorii,
              advertiserii și siguranța platformei.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/publica-anunt"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Publică anunț
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

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Reguli principale
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Ce este permis și ce nu
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mainRules.map((rule) => (
            <div
              key={rule.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-2xl text-rose-300">
                ✓
              </div>

              <h3 className="text-xl font-bold">{rule.title}</h3>

              <p className="mt-3 leading-7 text-white/60">{rule.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-12 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Pentru advertiseri
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Reguli pentru publicarea anunțurilor
          </h2>

          <div className="mt-8 space-y-3">
            {advertiserRules.map((rule) => (
              <div
                key={rule}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="leading-7 text-white/70">• {rule}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Pentru utilizatori
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Reguli de comportament
          </h2>

          <div className="mt-8 space-y-3">
            {userRules.map((rule) => (
              <div
                key={rule}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="leading-7 text-white/70">• {rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-300">
            Conținut interzis
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Nu permitem activități ilegale sau abuzive.
          </h2>

          <p className="mt-5 leading-8 text-rose-100/75">
            Platforma nu trebuie folosită pentru exploatare, constrângere,
            trafic de persoane, conținut cu minori, fraudă, amenințări,
            șantaj, promovarea activităților ilegale sau orice comportament
            care pune în pericol siguranța unei persoane.
          </p>

          <p className="mt-5 leading-8 text-rose-100/75">
            Orice profil suspect poate fi respins, blocat sau raportat către
            autoritățile competente, dacă situația o cere.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/publica-anunt"
              className="rounded-full bg-white px-6 py-3 text-center font-semibold text-black transition hover:bg-white/80"
            >
              Publică responsabil
            </Link>

            <Link
              href="/profiluri"
              className="rounded-full border border-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Înapoi la profiluri
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Siguranță
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Cum protejăm platforma
            </h2>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">
                  Verificare înainte de publicare
                </p>

                <p className="mt-1 text-sm leading-6 text-white/50">
                  Anunțurile trebuie să treacă prin verificare 18+.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">Moderare manuală</p>

                <p className="mt-1 text-sm leading-6 text-white/50">
                  Adminul poate aproba sau respinge anunțurile.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">Raportare profiluri</p>

                <p className="mt-1 text-sm leading-6 text-white/50">
                  Vom adăuga sistem de raportare pentru utilizatori.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">
                  Plăți făcute de advertiser
                </p>

                <p className="mt-1 text-sm leading-6 text-white/50">
                  Adminul nu introduce date de card și nu plătește anunțurile.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Notă importantă
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              Această pagină este o bază pentru regulile platformei. Înainte de
              lansarea reală, termenii, politica de confidențialitate și
              regulile trebuie verificate cu un avocat.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/publica-anunt"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Publică anunț
              </Link>

              <Link
                href="/verificare-18"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Verificare 18+
              </Link>

              <Link
                href="/cont"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Cont demo
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