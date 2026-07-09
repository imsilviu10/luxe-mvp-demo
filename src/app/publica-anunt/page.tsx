"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AccountRole = "user" | "advertiser" | "admin";

type DemoAccount = {
  id?: string;
  name?: string;
  email?: string;
  role?: AccountRole;
  roleLabel?: string;
  loggedInAt?: string;
};

type PackageId = "basic" | "standard" | "premium";

type AdPackage = {
  id: PackageId;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  badge: string;
  features: string[];
  highlighted?: boolean;
};

type FormErrors = {
  displayName?: string;
  age?: string;
  city?: string;
  phone?: string;
  description?: string;
  selectedPackageId?: string;
  acceptedRules?: string;
};

const packages: AdPackage[] = [
  {
    id: "basic",
    title: "Basic",
    subtitle: "Pentru testarea listării",
    price: 49,
    duration: "7 zile",
    badge: "Start",
    features: [
      "Profil public în listă",
      "Pagină profil individuală",
      "Chat demo activ",
      "Verificare 18+ obligatorie",
    ],
  },
  {
    id: "standard",
    title: "Standard",
    subtitle: "Cel mai potrivit pentru demo",
    price: 149,
    duration: "30 zile",
    badge: "Recomandat",
    highlighted: true,
    features: [
      "Profil public 30 zile",
      "Pagină profil individuală",
      "Chat demo activ",
      "Apariție mai bună în listă",
      "Status advertiser complet",
    ],
  },
  {
    id: "premium",
    title: "Premium",
    subtitle: "Pentru prezentare premium",
    price: 299,
    duration: "30 zile",
    badge: "Premium",
    features: [
      "Profil premium evidențiat",
      "Boost vizibilitate demo",
      "Apariție prioritară în listă",
      "Chat demo activ",
      "Status complet advertiser",
    ],
  },
];

const cities = [
  "București",
  "Cluj",
  "Brașov",
  "Constanța",
  "Iași",
  "Timișoara",
  "Sibiu",
  "Oradea",
];

function createDemoAdvertiserAccount() {
  return {
    id: `quick-advertiser-${Date.now()}`,
    name: "Advertiser Demo",
    email: "advertiser.demo@luxe.ro",
    role: "advertiser" as const,
    roleLabel: "Advertiser",
    loggedInAt: new Date().toISOString(),
  };
}

export default function PublishAdPage() {
  const router = useRouter();

  const [isCheckingAccount, setIsCheckingAccount] = useState(true);
  const [account, setAccount] = useState<DemoAccount | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPackageId, setSelectedPackageId] =
    useState<PackageId>("standard");
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const selectedPackage = useMemo(() => {
    return (
      packages.find((adPackage) => adPackage.id === selectedPackageId) ||
      packages[1]
    );
  }, [selectedPackageId]);

  const descriptionLength = description.trim().length;

  const completionScore = useMemo(() => {
    let score = 0;

    if (displayName.trim().length >= 2) {
      score += 15;
    }

    if (Number(age) >= 18) {
      score += 15;
    }

    if (city) {
      score += 15;
    }

    if (phone.trim().length >= 8) {
      score += 15;
    }

    if (description.trim().length >= 20) {
      score += 20;
    }

    if (selectedPackageId) {
      score += 10;
    }

    if (acceptedRules) {
      score += 10;
    }

    return Math.min(score, 100);
  }, [
    acceptedRules,
    age,
    city,
    description,
    displayName,
    phone,
    selectedPackageId,
  ]);

  useEffect(() => {
    const savedAccount = localStorage.getItem("luxe_demo_account");
    const savedRole = localStorage.getItem("luxe_demo_role");

    if (!savedAccount || savedRole !== "advertiser") {
      setAccount(null);
      setIsCheckingAccount(false);
      return;
    }

    try {
      const parsedAccount = JSON.parse(savedAccount) as DemoAccount;

      if (parsedAccount.role === "advertiser") {
        setAccount(parsedAccount);
      } else {
        setAccount(null);
      }
    } catch {
      setAccount(null);
    }

    setIsCheckingAccount(false);
  }, []);

  function clearError(field: keyof FormErrors) {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function loginAsDemoAdvertiser() {
    const demoAccount = createDemoAdvertiserAccount();

    localStorage.setItem("luxe_demo_account", JSON.stringify(demoAccount));
    localStorage.setItem("luxe_demo_role", "advertiser");

    setAccount(demoAccount);
    window.dispatchEvent(new Event("storage"));
  }

  function validateForm() {
    const newErrors: FormErrors = {};
    const numericAge = Number(age);

    if (displayName.trim().length < 2) {
      newErrors.displayName = "Completează numele profilului.";
    }

    if (!age || Number.isNaN(numericAge) || numericAge < 18) {
      newErrors.age = "Vârsta trebuie să fie minimum 18 ani.";
    }

    if (!city) {
      newErrors.city = "Alege orașul.";
    }

    if (phone.trim().length < 8) {
      newErrors.phone = "Completează un număr de telefon valid.";
    }

    if (description.trim().length < 20) {
      newErrors.description =
        "Descrierea trebuie să aibă minimum 20 de caractere.";
    }

    if (!selectedPackageId) {
      newErrors.selectedPackageId = "Alege un pachet.";
    }

    if (!acceptedRules) {
      newErrors.acceptedRules =
        "Trebuie să confirmi regulile și condițiile platformei.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function submitAd() {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const draftAd = {
      displayName: displayName.trim(),
      age: Number(age),
      city,
      phone: phone.trim(),
      description: description.trim(),
      selectedPackage,
      photoNames,
      ownerName: account?.name || "Advertiser Demo",
      ownerEmail: account?.email || "advertiser.demo@luxe.ro",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("luxe_draft_ad", JSON.stringify(draftAd));

    localStorage.removeItem("luxe_verification_draft");
    localStorage.removeItem("luxe_payment_status");
    localStorage.removeItem("luxe_ad_published");

    localStorage.setItem("luxe_admin_status", "pending");

    router.push("/verificare-18");
  }

  if (isCheckingAccount) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Verificare acces
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Pregătim formularul de publicare...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

          <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 text-3xl">
              🔒
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Publicare anunț
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Pentru a publica un anunț trebuie să intri ca advertiser.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/60">
              Zona de publicare este separată de zona utilizatorilor. Un
              advertiser poate crea anunțuri, trimite verificare 18+, urmări
              statusul admin și continua către plată.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <button
                type="button"
                onClick={loginAsDemoAdvertiser}
                className="rounded-full bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-400"
              >
                Intră ca advertiser demo
              </button>

              <Link
                href="/autentificare"
                className="rounded-full bg-white px-6 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Login public
              </Link>

              <Link
                href="/inregistrare"
                className="rounded-full border border-white/10 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Creează cont
              </Link>
            </div>

            <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <h2 className="text-lg font-bold">1. Cont advertiser</h2>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Intră cu un cont advertiser sau folosește demo-ul rapid pentru
                  prezentare.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <h2 className="text-lg font-bold">2. Verificare 18+</h2>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  După publicare, advertiserul trimite verificarea demo înainte
                  de moderare.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <h2 className="text-lg font-bold">3. Admin + plată</h2>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  Adminul aprobă anunțul, iar advertiserul continuă către plata
                  demo.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-white/50">
              <Link href="/" className="hover:text-white">
                Acasă
              </Link>

              <span>•</span>

              <Link href="/profiluri" className="hover:text-white">
                Profiluri
              </Link>

              <span>•</span>

              <Link href="/prezentare" className="hover:text-white">
                Prezentare MVP
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_35%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Luxe
            </Link>

            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              Publicare advertiser
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/cont" className="hover:text-white">
              Dashboard
            </Link>

            <Link href="/cont/anunt" className="hover:text-white">
              Status anunț
            </Link>

            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/iesire" className="hover:text-white">
              Ieșire
            </Link>
          </div>

          <Link
            href="/cont"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Cont advertiser
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
              Creează anunț premium
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Publică un anunț 18+ într-un flow clar și moderat.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Completează datele profilului, alege pachetul și trimite anunțul
              către verificare 18+ și moderare admin. Plata se face doar după
              aprobarea adminului.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#formular-anunt"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Completează formularul
              </a>

              <Link
                href="/reguli"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Citește regulile
              </Link>

              <Link
                href="/prezentare"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Prezentare MVP
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                  Completare formular
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  {completionScore}%
                </h2>
              </div>

              <div className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200">
                {selectedPackage.title}
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${completionScore}%` }}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Pachet</p>
                <p className="mt-2 font-semibold">{selectedPackage.title}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Cost</p>
                <p className="mt-2 font-semibold">
                  {selectedPackage.price} RON
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Durată</p>
                <p className="mt-2 font-semibold">
                  {selectedPackage.duration}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/55">
              Cont activ:{" "}
              <span className="font-semibold text-white">
                {account.name || "Advertiser Demo"}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section
        id="formular-anunt"
        className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr]"
      >
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8 rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Formular
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Datele profilului
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/60">
                Aceste informații vor fi folosite pentru profilul public după
                verificare, aprobare și plată demo.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Nume afișat
                  </label>

                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => {
                      setDisplayName(event.target.value);
                      clearError("displayName");
                    }}
                    placeholder="Ex: Profil Premium"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                  />

                  {errors.displayName && (
                    <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.displayName}
                    </p>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Vârstă
                  </label>

                  <input
                    type="number"
                    min="18"
                    value={age}
                    onChange={(event) => {
                      setAge(event.target.value);
                      clearError("age");
                    }}
                    placeholder="Minimum 18"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                  />

                  {errors.age && (
                    <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Oraș
                  </label>

                  <select
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value);
                      clearError("city");
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition focus:border-rose-500"
                  >
                    <option value="">Alege orașul</option>

                    {cities.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>

                  {errors.city && (
                    <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <label className="mb-2 block text-sm font-semibold text-white/80">
                    Telefon
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      clearError("phone");
                    }}
                    placeholder="+40 700 000 000"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                  />

                  {errors.phone && (
                    <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="block text-sm font-semibold text-white/80">
                    Descriere
                  </label>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      descriptionLength >= 20
                        ? "bg-emerald-500/10 text-emerald-200"
                        : "bg-white/10 text-white/45"
                    }`}
                  >
                    {descriptionLength}/20 caractere
                  </span>
                </div>

                <textarea
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    clearError("description");
                  }}
                  placeholder="Scrie o descriere elegantă și clară pentru profil..."
                  rows={7}
                  className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                />

                {errors.description && (
                  <p className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Fotografii demo
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => {
                    const selectedFiles = Array.from(event.target.files || []);
                    setPhotoNames(selectedFiles.map((file) => file.name));
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                />

                <p className="mt-3 text-sm leading-7 text-white/50">
                  În demo salvăm doar numele fișierelor, nu încărcăm fotografii
                  reale pe server.
                </p>

                {photoNames.length > 0 && (
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    {photoNames.map((photoName) => (
                      <div
                        key={photoName}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65"
                      >
                        {photoName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Pachete
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Alege pachetul anunțului
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {packages.map((adPackage) => {
                const isSelected = selectedPackageId === adPackage.id;

                return (
                  <button
                    key={adPackage.id}
                    type="button"
                    onClick={() => {
                      setSelectedPackageId(adPackage.id);
                      clearError("selectedPackageId");
                    }}
                    className={`relative rounded-[2rem] border p-5 text-left transition ${
                      isSelected
                        ? "border-rose-500/40 bg-rose-500/10"
                        : "border-white/10 bg-black/30 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            adPackage.highlighted
                              ? "bg-rose-500 text-white"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {adPackage.badge}
                        </span>

                        <h3 className="mt-4 text-2xl font-bold">
                          {adPackage.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-white/50">
                          {adPackage.subtitle}
                        </p>
                      </div>

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                          isSelected
                            ? "bg-rose-500 text-white"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {isSelected ? "✓" : "+"}
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-3xl font-bold">
                        {adPackage.price} RON
                      </p>

                      <p className="mt-1 text-sm text-white/45">
                        {adPackage.duration}
                      </p>
                    </div>

                    <div className="mt-5 space-y-2">
                      {adPackage.features.map((feature) => (
                        <p
                          key={feature}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/60"
                        >
                          ✓ {feature}
                        </p>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.selectedPackageId && (
              <p className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errors.selectedPackageId}
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <label className="flex cursor-pointer gap-4 rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white/65 transition hover:bg-white/[0.04]">
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
                Confirm că informațiile sunt corecte, persoana are minimum 18
                ani și accept{" "}
                <Link href="/reguli" className="font-semibold text-rose-300">
                  regulile platformei
                </Link>
                ,{" "}
                <Link href="/termeni" className="font-semibold text-rose-300">
                  termenii și confidențialitatea
                </Link>
                .
              </span>
            </label>

            {errors.acceptedRules && (
              <p className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errors.acceptedRules}
              </p>
            )}

            <button
              type="button"
              onClick={submitAd}
              className="mt-6 w-full rounded-full bg-rose-500 px-8 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Continuă către verificare 18+
            </button>

            <p className="mt-4 text-center text-sm leading-7 text-white/45">
              După acest pas, anunțul intră în flow-ul de verificare 18+ și
              moderare admin.
            </p>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Previzualizare
            </p>

            <div className="mt-5 rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <div className="flex aspect-[4/5] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.04] text-center">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 text-3xl">
                    ✦
                  </div>

                  <p className="mt-4 font-semibold text-white/80">
                    Profil demo
                  </p>

                  <p className="mt-2 text-sm text-white/45">
                    {photoNames.length
                      ? `${photoNames.length} fotografii selectate`
                      : "Galerie demo"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                  {selectedPackage.title}
                </span>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Draft
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                {displayName || "Nume profil"}
                {age ? `, ${age}` : ""}
              </h2>

              <p className="mt-2 text-sm text-white/45">
                {city || "Oraș nespecificat"}
              </p>

              <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/60">
                {description ||
                  "Descrierea profilului va apărea aici în previzualizarea anunțului."}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Pachet selectat
            </p>

            <h2 className="mt-3 text-2xl font-bold text-emerald-100">
              {selectedPackage.title}
            </h2>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Cost demo</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {selectedPackage.price} RON
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Durată</p>
                <p className="mt-2 font-semibold text-white">
                  {selectedPackage.duration}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-black/20 p-4">
                <p className="text-sm text-emerald-100/50">Plată</p>
                <p className="mt-2 font-semibold text-white">
                  După aprobare admin
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Flow corect
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-sky-100/75">
              <p>1. Advertiserul completează anunțul.</p>
              <p>2. Trimite verificarea 18+.</p>
              <p>3. Adminul aprobă sau respinge.</p>
              <p>4. Advertiserul plătește pachetul.</p>
              <p>5. Profilul devine public.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Reguli importante
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              Nu publica informații false, conținut interzis, minori, materiale
              abuzive sau activități ilegale. Platforma este 18+ și moderată.
            </p>

            <Link
              href="/reguli"
              className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
            >
              Citește regulile
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Pagini utile</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/cont"
                className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Dashboard advertiser
              </Link>

              <Link
                href="/cont/anunt"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Status anunț
              </Link>

              <Link
                href="/profiluri"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Profiluri
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — publicare anunț advertiser 18+.
      </footer>
    </main>
  );
}