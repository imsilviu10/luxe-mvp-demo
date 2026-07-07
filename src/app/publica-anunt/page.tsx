"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type FormErrors = {
  displayName?: string;
  age?: string;
  city?: string;
  phone?: string;
  description?: string;
  acceptedRules?: string;
};

type PackageOption = {
  id: string;
  name: string;
  price: string;
  duration: string;
  label: string;
  features: string[];
};

const packages: PackageOption[] = [
  {
    id: "basic",
    name: "Basic",
    price: "49 RON",
    duration: "7 zile",
    label: "49 RON",
    features: [
      "Anunț activ 7 zile",
      "Afișare în lista de profiluri",
      "Verificare 18+ obligatorie",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "149 RON",
    duration: "30 zile",
    label: "149 RON",
    features: [
      "Anunț activ 30 zile",
      "Poziționare mai bună în listă",
      "Chat privat demo",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "299 RON",
    duration: "30 zile",
    label: "299 RON",
    features: [
      "Anunț activ 30 zile",
      "Badge Premium",
      "Boost în orașul selectat",
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

export default function PublishAdPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("standard");
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const selectedPackage = useMemo(() => {
    return packages.find((item) => item.id === selectedPackageId) || packages[1];
  }, [selectedPackageId]);

  function validateForm() {
    const newErrors: FormErrors = {};

    if (displayName.trim().length < 2) {
      newErrors.displayName = "Completează un nume de afișare.";
    }

    if (!age || Number(age) < 18) {
      newErrors.age = "Trebuie să ai minimum 18 ani.";
    }

    if (!city) {
      newErrors.city = "Alege orașul.";
    }

    if (phone.trim().length < 8) {
      newErrors.phone = "Completează un număr de telefon valid.";
    }

    if (description.trim().length < 20) {
      newErrors.description = "Descrierea trebuie să aibă minimum 20 caractere.";
    }

    if (!acceptedRules) {
      newErrors.acceptedRules = "Trebuie să accepți regulile platformei.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) {
      setPhotoNames([]);
      return;
    }

    const names = Array.from(files).map((file) => file.name);
    setPhotoNames(names);
  }

  function continueToVerification() {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const draftAd = {
      displayName: displayName.trim(),
      age,
      city,
      phone: phone.trim(),
      description: description.trim(),
      selectedPackage,
      photoNames,
    };

    localStorage.setItem("luxe_draft_ad", JSON.stringify(draftAd));

    localStorage.removeItem("luxe_verification_draft");
    localStorage.removeItem("luxe_payment_status");
    localStorage.removeItem("luxe_ad_published");

    localStorage.setItem("luxe_admin_status", "pending");

    router.push("/verificare-18");
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

            <Link href="/cont/anunt" className="hover:text-white">
              Cont advertiser
            </Link>

            <Link href="/admin" className="hover:text-white">
              Admin demo
            </Link>
          </div>

          <Link
            href="/profiluri"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Vezi profiluri
          </Link>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              Luxe.ro — publicare anunț 18+
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Publică un anunț premium.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Completează datele anunțului, alege pachetul dorit, apoi mergi la
              verificarea 18+. După aprobare, advertiserul va putea plăti
              pachetul ales.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Formular anunț
          </p>

          <h2 className="mt-3 text-3xl font-bold">Detalii profil</h2>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Nume de afișare
              </label>

              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Ex: Maria"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.displayName && (
                <p className="mt-2 text-sm text-rose-300">
                  {errors.displayName}
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Vârstă
                </label>

                <input
                  type="number"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="Ex: 25"
                  min="18"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
                />

                {errors.age && (
                  <p className="mt-2 text-sm text-rose-300">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Oraș
                </label>

                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition focus:border-rose-500"
                >
                  <option value="">Alege orașul</option>

                  {cities.map((item) => (
                    <option key={item} value={item} className="bg-zinc-950">
                      {item}
                    </option>
                  ))}
                </select>

                {errors.city && (
                  <p className="mt-2 text-sm text-rose-300">{errors.city}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Telefon
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Ex: +40 700 000 000"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              {errors.phone && (
                <p className="mt-2 text-sm text-rose-300">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Descriere
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Scrie o descriere elegantă pentru profilul tău..."
                rows={6}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                {errors.description ? (
                  <p className="text-sm text-rose-300">
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-sm text-white/40">
                    Minimum 20 caractere.
                  </p>
                )}

                <p className="text-sm text-white/40">
                  {description.length} caractere
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">
                Fotografii demo
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
              />

              <p className="mt-2 text-sm text-white/40">
                În această etapă salvăm doar numele fișierelor, nu încărcăm
                imaginile real.
              </p>

              {photoNames.length > 0 && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm font-semibold text-white/70">
                    Fotografii selectate:
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {photoNames.map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/60">
              <input
                type="checkbox"
                checked={acceptedRules}
                onChange={(event) => setAcceptedRules(event.target.checked)}
                className="mt-1 h-4 w-4"
              />

              <span>
                Confirm că am peste 18 ani, că informațiile sunt corecte și că
                accept regulile platformei Luxe.ro.
              </span>
            </label>

            {errors.acceptedRules && (
              <p className="text-sm text-rose-300">{errors.acceptedRules}</p>
            )}

            <button
              type="button"
              onClick={continueToVerification}
              className="w-full rounded-full bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-400"
            >
              Continuă către verificare
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Pachet ales
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              {selectedPackage.name}
            </h2>

            <p className="mt-2 text-white/50">
              {selectedPackage.duration} • {selectedPackage.price}
            </p>

            <div className="mt-6 space-y-3">
              {packages.map((item) => {
                const isActive = selectedPackageId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPackageId(item.id)}
                    className={`w-full rounded-3xl border p-5 text-left transition ${
                      isActive
                        ? "border-rose-500 bg-rose-500/10"
                        : "border-white/10 bg-black/30 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="mt-1 text-sm text-white/50">
                          {item.duration}
                        </p>
                      </div>

                      <p className="font-bold text-rose-300">{item.price}</p>
                    </div>

                    <ul className="mt-4 space-y-2 text-sm text-white/60">
                      {item.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-xl font-bold">Preview rapid</h2>

            <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-6xl">
                ✦
              </div>

              <div className="p-5">
                <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                  Draft
                </div>

                <h3 className="text-xl font-bold">
                  {displayName || "Nume profil"}
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  {age || "--"} ani • {city || "Oraș"}
                </p>

                <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/60">
                  {description ||
                    "Descrierea anunțului va apărea aici înainte de verificare."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Reset automat pentru anunț nou
            </h2>

            <p className="mt-3 text-sm leading-7 text-sky-100/70">
              Când apeși „Continuă către verificare”, statusurile vechi de
              plată, publicare și verificare sunt resetate automat pentru noul
              anunț.
            </p>
          </div>

          <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
            <h2 className="text-xl font-bold text-amber-200">
              Demo local
            </h2>

            <p className="mt-3 text-sm leading-7 text-amber-100/70">
              Momentan folosim localStorage pentru test. Mai târziu vom salva
              anunțurile, verificările și plățile într-o bază de date reală.
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