import Link from "next/link";

const termsSections = [
  {
    title: "Platformă exclusiv 18+",
    text: "Luxe.ro este o platformă destinată exclusiv persoanelor adulte. Utilizatorii trebuie să aibă minimum 18 ani pentru a accesa, crea conturi, publica anunțuri sau interacționa cu profilurile.",
  },
  {
    title: "Conținut permis",
    text: "Sunt permise doar anunțuri și profiluri care respectă legea, regulile platformei și standardele de siguranță. Conținutul ilegal, exploatator, coercitiv sau care implică persoane minore este strict interzis.",
  },
  {
    title: "Verificare și moderare",
    text: "Anunțurile pot necesita verificare 18+ și aprobare manuală înainte de publicare. Adminul poate respinge, bloca sau elimina anunțuri care nu respectă regulile platformei.",
  },
  {
    title: "Plăți",
    text: "Advertiserul este responsabil pentru plata pachetului ales. Adminul nu introduce date de card pentru advertiser. În versiunea finală, plățile trebuie procesate printr-un furnizor autorizat de plăți.",
  },
];

const privacySections = [
  {
    title: "Date de cont și anunț",
    text: "Putem colecta date precum nume afișat, vârstă, oraș, descriere, telefon, pachet ales și informații necesare pentru publicarea anunțului.",
  },
  {
    title: "Date pentru verificare 18+",
    text: "Pentru siguranța platformei, pot fi solicitate documente sau verificări suplimentare. În demo, aceste date sunt salvate doar local în browser și nu sunt trimise către server.",
  },
  {
    title: "Raportări",
    text: "Utilizatorii pot raporta profiluri, conversații sau comportamente suspecte. Raportările pot fi analizate de moderatori pentru siguranța comunității.",
  },
  {
    title: "Date de plată",
    text: "Platforma nu ar trebui să salveze date complete de card. Într-o versiune reală, datele de plată trebuie gestionate de un procesator de plăți securizat.",
  },
];

const userResponsibilities = [
  "Să folosească platforma doar dacă are minimum 18 ani.",
  "Să ofere informații corecte și reale în formulare.",
  "Să nu publice conținut ilegal, fals, abuziv sau înșelător.",
  "Să respecte regulile de siguranță și moderare.",
  "Să raporteze profilurile sau comportamentele suspecte.",
];

const prohibitedContent = [
  "Conținut care implică persoane sub 18 ani.",
  "Exploatare, constrângere, trafic de persoane sau violență.",
  "Fraudă, șantaj, amenințări sau hărțuire.",
  "Date personale publicate fără acord.",
  "Anunțuri false, spam sau tentative de înșelătorie.",
  "Orice activitate care încalcă legea aplicabilă.",
];

export default function TermsPage() {
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

            <Link href="/reguli" className="hover:text-white">
              Reguli
            </Link>

            <Link href="/raporteaza" className="hover:text-white">
              Raportează
            </Link>

            <Link href="/cont" className="hover:text-white">
              Cont demo
            </Link>
          </div>

          <Link
            href="/reguli"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Vezi regulile
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
              Termeni și confidențialitate
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Termeni de utilizare și politică de confidențialitate.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Această pagină explică regulile generale pentru folosirea
              platformei Luxe.ro, datele care pot fi colectate și modul în care
              trebuie tratate siguranța, verificarea 18+, raportările și
              plățile.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/publica-anunt"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Publică anunț
              </Link>

              <Link
                href="/reguli"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Citește regulile
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Termeni
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Termeni de utilizare
            </h2>

            <p className="mt-4 leading-8 text-white/60">
              Prin folosirea platformei, utilizatorul confirmă că a citit și
              acceptă regulile de utilizare. Platforma poate limita accesul,
              poate elimina conținut sau poate bloca profiluri care încalcă
              aceste reguli.
            </p>

            <div className="mt-8 grid gap-4">
              {termsSections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-3xl border border-white/10 bg-black/30 p-5"
                >
                  <h3 className="text-xl font-bold">{section.title}</h3>

                  <p className="mt-3 leading-7 text-white/60">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Confidențialitate
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Date colectate și folosirea lor
            </h2>

            <p className="mt-4 leading-8 text-white/60">
              Datele sunt folosite pentru publicarea anunțurilor, verificarea
              eligibilității 18+, moderare, siguranță, raportări și procesarea
              plăților.
            </p>

            <div className="mt-8 grid gap-4">
              {privacySections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-3xl border border-white/10 bg-black/30 p-5"
                >
                  <h3 className="text-xl font-bold">{section.title}</h3>

                  <p className="mt-3 leading-7 text-white/60">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Responsabilități
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Responsabilitățile utilizatorului
            </h2>

            <div className="mt-8 grid gap-4">
              {userResponsibilities.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-3xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white">
                    ✓
                  </div>

                  <p className="leading-7 text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-300">
              Interzis
            </p>

            <h2 className="mt-3 text-3xl font-bold text-rose-100">
              Conținut și comportamente interzise
            </h2>

            <div className="mt-8 grid gap-4">
              {prohibitedContent.map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-rose-500/20 bg-black/20 p-5"
                >
                  <p className="leading-7 text-rose-100/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-amber-200">
              Notă legală importantă
            </h2>

            <p className="mt-4 leading-8 text-amber-100/70">
              Această pagină este un model demo și nu reprezintă consultanță
              juridică. Înainte de lansarea reală, termenii, politica de
              confidențialitate, fluxul de verificare 18+, sistemul de plăți și
              procedurile de moderare trebuie verificate de un avocat.
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Rezumat
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Pe scurt
            </h2>

            <div className="mt-6 space-y-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Acces</p>
                <p className="mt-2 text-xl font-bold">Doar 18+</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Moderare</p>
                <p className="mt-2 text-xl font-bold">Manuală</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Raportări</p>
                <p className="mt-2 text-xl font-bold">Disponibile</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-white/50">Plăți</p>
                <p className="mt-2 text-xl font-bold">Prin advertiser</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Date în demo
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              În această versiune locală, datele sunt salvate în localStorage.
              Ele nu sunt trimise către o bază de date reală și pot fi șterse
              din pagina de reset demo.
            </p>

            <Link
              href="/reset-demo"
              className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
            >
              Reset demo
            </Link>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Siguranță
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/70">
              Dacă observi profiluri false, comportament abuziv, fraudă sau
              conținut interzis, folosește pagina de raportare.
            </p>

            <Link
              href="/raporteaza"
              className="mt-5 block rounded-full bg-rose-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-rose-400"
            >
              Raportează
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 space-y-3">
              <Link
                href="/reguli"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Reguli platformă
              </Link>

              <Link
                href="/profiluri"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Profiluri
              </Link>

              <Link
                href="/publica-anunt"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Publică anunț
              </Link>

              <Link
                href="/cont"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Cont demo
              </Link>

              <Link
                href="/admin"
                className="block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Admin demo
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