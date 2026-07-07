"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DraftAd = {
  displayName?: string;
  age?: string;
  city?: string;
  phone?: string;
  description?: string;
  selectedPackage?: {
    name: string;
    duration: string;
    label: string;
  };
  photoNames?: string[];
};

export default function PaymentPage() {
  const router = useRouter();

  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "paid"
  >("idle");

  useEffect(() => {
    const savedAd = localStorage.getItem("luxe_draft_ad");
    const savedPayment = localStorage.getItem("luxe_payment_status");

    if (savedAd) {
      setDraftAd(JSON.parse(savedAd));
    }

    if (savedPayment === "paid") {
      setPaymentStatus("paid");
    }
  }, []);

  const canPay =
    cardName.trim().length >= 3 &&
    cardNumber.replaceAll(" ", "").length >= 12 &&
    acceptedTerms &&
    paymentStatus !== "processing";

  function confirmDemoPayment() {
    if (!canPay) {
      return;
    }

    setPaymentStatus("processing");

    setTimeout(() => {
      localStorage.setItem("luxe_payment_status", "paid");
      localStorage.setItem("luxe_ad_published", "true");
      localStorage.setItem("luxe_admin_status", "payment");

      setPaymentStatus("paid");

      router.push("/anunt-publicat");
    }, 900);
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
            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/publica-anunt" className="hover:text-white">
              Publică anunț
            </Link>

            <Link href="/verificare-trimisa" className="hover:text-white">
              Status anunț
            </Link>

            <Link href="/admin" className="hover:text-white">
              Admin demo
            </Link>
          </div>

          <Link
            href="/verificare-trimisa"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Înapoi la status
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              Luxe.ro — plată demo advertiser
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Plată pentru publicarea anunțului.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Aceasta este o interfață demo. În varianta finală, advertiserul
              va fi trimis către un procesator de plăți securizat, iar site-ul
              va primi doar confirmarea plății.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Detalii plată
          </p>

          <h2 className="mt-3 text-3xl font-bold">Card demo</h2>

          <p className="mt-3 leading-7 text-white/60">
            Completează câmpurile cu date fictive pentru a simula plata. Nu
            introduce date reale de card în această etapă.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Nume pe card
              </label>

              <input
                type="text"
                value={cardName}
                onChange={(event) => setCardName(event.target.value)}
                placeholder="Ex: Maria Test"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Număr card demo
              </label>

              <input
                type="text"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              <p className="mt-2 text-sm text-white/40">
                Poți scrie orice număr demo cu minimum 12 cifre.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Expirare
                </label>

                <input
                  type="text"
                  placeholder="12/30"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  CVC
                </label>

                <input
                  type="text"
                  placeholder="123"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                />
              </div>
            </div>

            <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/60">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-4 w-4"
              />

              <span>
                Confirm că înțeleg că aceasta este o plată demo și că plata
                reală va fi conectată ulterior printr-un procesator compatibil.
              </span>
            </label>

            <button
              type="button"
              disabled={!canPay || paymentStatus === "paid"}
              onClick={confirmDemoPayment}
              className={`w-full rounded-full px-6 py-4 font-semibold transition ${
                paymentStatus === "paid"
                  ? "bg-emerald-500 text-white"
                  : canPay
                    ? "bg-rose-500 text-white hover:bg-rose-400"
                    : "cursor-not-allowed bg-white/10 text-white/30"
              }`}
            >
              {paymentStatus === "idle" && "Confirmă plata demo"}
              {paymentStatus === "processing" && "Se procesează..."}
              {paymentStatus === "paid" && "Plată confirmată"}
            </button>

            {paymentStatus === "paid" && (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <h3 className="font-bold text-emerald-300">
                  Plata demo a fost confirmată.
                </h3>

                <p className="mt-2 text-sm leading-7 text-emerald-100/70">
                  Vei fi redirecționat către pagina unde anunțul apare ca
                  publicat.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Rezumat
            </p>

            <h2 className="mt-3 text-2xl font-bold">Anunț și pachet</h2>

            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-6xl">
                ✦
              </div>

              <div className="p-5">
                <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                  În așteptare plată
                </div>

                <h3 className="text-xl font-bold">
                  {draftAd?.displayName || "Anunț demo"}
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  {draftAd?.age || "--"} ani • {draftAd?.city || "Oraș neales"}
                </p>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/60">
                  {draftAd?.description ||
                    "Descrierea anunțului va apărea aici după completarea formularului."}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-white/60">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Pachet</span>
                <span className="text-white">
                  {draftAd?.selectedPackage?.name || "Standard"}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Durată</span>
                <span className="text-white">
                  {draftAd?.selectedPackage?.duration || "30 zile"}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Status verificare</span>
                <span className="text-emerald-300">Trimisă</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span>Moderare</span>
                <span className="text-sky-300">Aprobat pentru plată</span>
              </div>

              <div className="flex justify-between text-lg">
                <span>Total</span>
                <span className="font-bold text-rose-300">
                  {draftAd?.selectedPackage?.label || "149 RON"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-200">Etapă demo</h2>

            <p className="mt-3 text-sm leading-7 text-amber-100/70">
              Această pagină nu colectează și nu procesează bani. Este doar
              interfața vizuală și logica demo locală.
            </p>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — Platformă 18+ pentru utilizatori adulți.
      </footer>
    </main>
  );
}