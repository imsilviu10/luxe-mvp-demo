"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AdminStatus = "pending" | "approved" | "rejected" | "payment";
type PaymentStatus = "unpaid" | "processing" | "paid";
type UserRole = "user" | "advertiser" | "admin";

type DemoAccount = {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  roleLabel?: string;
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

type ManagedAccount = RegisteredAccount & {
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "blocked";
  isSeedDemo?: boolean;
  blockedAt?: string;
  blockReason?: string;
};

type BlockedAccount = {
  email: string;
  name?: string;
  role?: UserRole;
  blockedAt: string;
  reason?: string;
};

type DeletedAccount = {
  email: string;
  name?: string;
  role?: UserRole;
  deletedAt: string;
  reason?: string;
};

type DraftAd = {
  displayName?: string;
  age?: string | number;
  city?: string;
  phone?: string;
  description?: string;
  ownerName?: string;
  ownerEmail?: string;
  createdAt?: string;
  selectedPackage?: {
    id?: string;
    title?: string;
    name?: string;
    label?: string;
    price?: number;
    priceRon?: number;
    amount?: number;
    duration?: string;
    days?: number;
  };
};

type VerificationDraft = {
  documentName?: string;
  selfieName?: string;
  submittedAt?: string;
  ageConfirmed?: boolean;
  dataConfirmed?: boolean;
  rulesAccepted?: boolean;
};

type LastReport = {
  profileName?: string;
  profileLink?: string;
  reason?: string;
  details?: string;
  status?: "pending" | "reviewed" | "urgent";
  createdAt?: string;
};

const seedDemoAccounts: ManagedAccount[] = [
  {
    id: "demo-user",
    name: "Utilizator Demo",
    email: "user.demo@luxe.ro",
    role: "user",
    roleLabel: "Utilizator",
    status: "active",
    isSeedDemo: true,
    createdAt: "Demo",
  },
  {
    id: "demo-advertiser",
    name: "Advertiser Demo",
    email: "advertiser.demo@luxe.ro",
    role: "advertiser",
    roleLabel: "Advertiser",
    status: "active",
    isSeedDemo: true,
    createdAt: "Demo",
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
          blockedAt: new Date().toISOString(),
          reason: "Blocare demo",
        };
      }

      const account = item as Partial<BlockedAccount>;

      return {
        email: normalizeEmail(account.email),
        name: account.name,
        role: account.role,
        blockedAt: account.blockedAt || new Date().toISOString(),
        reason: account.reason || "Blocare demo",
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
          deletedAt: new Date().toISOString(),
          reason: "Șters demo",
        };
      }

      const account = item as Partial<DeletedAccount>;

      return {
        email: normalizeEmail(account.email),
        name: account.name,
        role: account.role,
        deletedAt: account.deletedAt || new Date().toISOString(),
        reason: account.reason || "Șters demo",
      };
    })
    .filter((item) => item.email);
}

function writeBlockedAccounts(accounts: BlockedAccount[]) {
  localStorage.setItem("luxe_blocked_accounts", JSON.stringify(accounts));
}

function writeDeletedAccounts(accounts: DeletedAccount[]) {
  localStorage.setItem("luxe_deleted_accounts", JSON.stringify(accounts));
}

function writeRegisteredAccounts(accounts: RegisteredAccount[]) {
  localStorage.setItem("luxe_registered_accounts", JSON.stringify(accounts));
}

function mergeManagedAccounts(
  registeredAccounts: RegisteredAccount[],
  blockedAccounts: BlockedAccount[],
  deletedAccounts: DeletedAccount[]
) {
  const accountMap = new Map<string, ManagedAccount>();
  const blockedMap = new Map(
    blockedAccounts.map((account) => [normalizeEmail(account.email), account])
  );
  const deletedEmails = new Set(
    deletedAccounts.map((account) => normalizeEmail(account.email))
  );

  seedDemoAccounts.forEach((account) => {
    const email = normalizeEmail(account.email);

    if (!deletedEmails.has(email)) {
      accountMap.set(email, {
        ...account,
        email,
        status: blockedMap.has(email) ? "blocked" : "active",
        blockedAt: blockedMap.get(email)?.blockedAt,
        blockReason: blockedMap.get(email)?.reason,
      });
    }
  });

  registeredAccounts.forEach((account) => {
    const email = normalizeEmail(account.email);

    if (!email || deletedEmails.has(email)) {
      return;
    }

    const blockedAccount = blockedMap.get(email);

    accountMap.set(email, {
      ...account,
      email,
      name: account.name || "Cont demo",
      role: account.role || "user",
      roleLabel: account.roleLabel,
      status: blockedAccount ? "blocked" : "active",
      blockedAt: blockedAccount?.blockedAt,
      blockReason: blockedAccount?.reason,
      isSeedDemo: false,
    });
  });

  return Array.from(accountMap.values()).sort((firstAccount, secondAccount) => {
    if (firstAccount.role === secondAccount.role) {
      return firstAccount.email.localeCompare(secondAccount.email);
    }

    return firstAccount.role.localeCompare(secondAccount.role);
  });
}

function formatDate(value?: string) {
  if (!value || value === "Demo") {
    return value || "Nedisponibil";
  }

  try {
    return new Intl.DateTimeFormat("ro-RO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "Nedisponibil";
  }
}

function getRoleLabel(role?: UserRole) {
  if (role === "admin") {
    return "Admin";
  }

  if (role === "advertiser") {
    return "Advertiser";
  }

  return "Utilizator";
}

function getAdminStatusLabel(status: AdminStatus) {
  if (status === "approved") {
    return "Aprobat";
  }

  if (status === "payment") {
    return "Aprobat pentru plată";
  }

  if (status === "rejected") {
    return "Respins";
  }

  return "În moderare";
}

function getPaymentStatusLabel(status: PaymentStatus) {
  if (status === "paid") {
    return "Achitată";
  }

  if (status === "processing") {
    return "În procesare";
  }

  return "Neachitată";
}

function getPackageTitle(draftAd?: DraftAd | null) {
  return (
    draftAd?.selectedPackage?.title ||
    draftAd?.selectedPackage?.name ||
    draftAd?.selectedPackage?.label ||
    "Pachet neselectat"
  );
}

function getPackagePrice(draftAd?: DraftAd | null) {
  return (
    draftAd?.selectedPackage?.price ??
    draftAd?.selectedPackage?.priceRon ??
    draftAd?.selectedPackage?.amount ??
    0
  );
}

export default function AdminPage() {
  const [account, setAccount] = useState<DemoAccount | null>(null);
  const [draftAd, setDraftAd] = useState<DraftAd | null>(null);
  const [verificationDraft, setVerificationDraft] =
    useState<VerificationDraft | null>(null);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [isPublished, setIsPublished] = useState(false);
  const [lastReport, setLastReport] = useState<LastReport | null>(null);

  const [registeredAccounts, setRegisteredAccounts] = useState<
    RegisteredAccount[]
  >([]);
  const [blockedAccounts, setBlockedAccounts] = useState<BlockedAccount[]>([]);
  const [deletedAccounts, setDeletedAccounts] = useState<DeletedAccount[]>([]);
  const [managedAccounts, setManagedAccounts] = useState<ManagedAccount[]>([]);
  const [accountSearch, setAccountSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [blockReason, setBlockReason] = useState("Încălcare reguli demo");

  function loadAdminData() {
    const savedAccount = readJson<DemoAccount>("luxe_demo_account");
    const savedDraft = readJson<DraftAd>("luxe_draft_ad");
    const savedVerification = readJson<VerificationDraft>(
      "luxe_verification_draft"
    );
    const savedReport = readJson<LastReport>("luxe_last_report");
    const savedRegisteredAccounts =
      readArray<RegisteredAccount>("luxe_registered_accounts");
    const savedBlockedAccounts = readBlockedAccounts();
    const savedDeletedAccounts = readDeletedAccounts();

    const savedAdminStatus =
      (localStorage.getItem("luxe_admin_status") as AdminStatus | null) ||
      "pending";

    const savedPaymentStatus =
      (localStorage.getItem("luxe_payment_status") as PaymentStatus | null) ||
      "unpaid";

    const savedPublished = localStorage.getItem("luxe_ad_published") === "true";

    setAccount(savedAccount);
    setDraftAd(savedDraft);
    setVerificationDraft(savedVerification);
    setAdminStatus(savedAdminStatus);
    setPaymentStatus(savedPaymentStatus);
    setIsPublished(savedPublished);
    setLastReport(savedReport);
    setRegisteredAccounts(savedRegisteredAccounts);
    setBlockedAccounts(savedBlockedAccounts);
    setDeletedAccounts(savedDeletedAccounts);
    setManagedAccounts(
      mergeManagedAccounts(
        savedRegisteredAccounts,
        savedBlockedAccounts,
        savedDeletedAccounts
      )
    );
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  const packageTitle = getPackageTitle(draftAd);
  const packagePrice = getPackagePrice(draftAd);

  const filteredAccounts = useMemo(() => {
    const cleanSearch = accountSearch.trim().toLowerCase();

    return managedAccounts.filter((managedAccount) => {
      const matchesRole =
        roleFilter === "all" || managedAccount.role === roleFilter;

      const matchesSearch =
        !cleanSearch ||
        managedAccount.name.toLowerCase().includes(cleanSearch) ||
        managedAccount.email.toLowerCase().includes(cleanSearch);

      return matchesRole && matchesSearch;
    });
  }, [accountSearch, managedAccounts, roleFilter]);

  const accountStats = useMemo(() => {
    return {
      total: managedAccounts.length,
      users: managedAccounts.filter((managedAccount) => {
        return managedAccount.role === "user";
      }).length,
      advertisers: managedAccounts.filter((managedAccount) => {
        return managedAccount.role === "advertiser";
      }).length,
      blocked: managedAccounts.filter((managedAccount) => {
        return managedAccount.status === "blocked";
      }).length,
      deleted: deletedAccounts.length,
    };
  }, [deletedAccounts.length, managedAccounts]);

  function approveAd() {
    localStorage.setItem("luxe_admin_status", "approved");
    setAdminStatus("approved");
  }

  function approveForPayment() {
    localStorage.setItem("luxe_admin_status", "payment");

    if (localStorage.getItem("luxe_payment_status") !== "paid") {
      localStorage.setItem("luxe_payment_status", "unpaid");
      setPaymentStatus("unpaid");
    }

    setAdminStatus("payment");
  }

  function rejectAd() {
    localStorage.setItem("luxe_admin_status", "rejected");
    localStorage.removeItem("luxe_ad_published");
    setAdminStatus("rejected");
    setIsPublished(false);
  }

  function resetAdFlow() {
    const confirmed = window.confirm(
      "Sigur vrei să resetezi flow-ul de anunț? Conturile demo rămân salvate."
    );

    if (!confirmed) {
      return;
    }

    [
      "luxe_draft_ad",
      "luxe_verification_draft",
      "luxe_admin_status",
      "luxe_payment_status",
      "luxe_ad_published",
      "luxe_ad_published_at",
    ].forEach((key) => localStorage.removeItem(key));

    setDraftAd(null);
    setVerificationDraft(null);
    setAdminStatus("pending");
    setPaymentStatus("unpaid");
    setIsPublished(false);
  }

  function blockAccount(managedAccount: ManagedAccount) {
    if (managedAccount.role === "admin") {
      return;
    }

    const email = normalizeEmail(managedAccount.email);
    const reason = blockReason.trim() || "Blocare demo";

    const nextBlockedAccounts = [
      ...blockedAccounts.filter((blockedAccount) => {
        return normalizeEmail(blockedAccount.email) !== email;
      }),
      {
        email,
        name: managedAccount.name,
        role: managedAccount.role,
        blockedAt: new Date().toISOString(),
        reason,
      },
    ];

    const nextRegisteredAccounts = registeredAccounts.map((registeredAccount) => {
      if (normalizeEmail(registeredAccount.email) !== email) {
        return registeredAccount;
      }

      return {
        ...registeredAccount,
        status: "blocked" as const,
        blockedAt: new Date().toISOString(),
      };
    });

    writeBlockedAccounts(nextBlockedAccounts);
    writeRegisteredAccounts(nextRegisteredAccounts);

    loadAdminData();
  }

  function unblockAccount(managedAccount: ManagedAccount) {
    const email = normalizeEmail(managedAccount.email);

    const nextBlockedAccounts = blockedAccounts.filter((blockedAccount) => {
      return normalizeEmail(blockedAccount.email) !== email;
    });

    const nextRegisteredAccounts = registeredAccounts.map((registeredAccount) => {
      if (normalizeEmail(registeredAccount.email) !== email) {
        return registeredAccount;
      }

      return {
        ...registeredAccount,
        status: "active" as const,
        blockedAt: "",
      };
    });

    writeBlockedAccounts(nextBlockedAccounts);
    writeRegisteredAccounts(nextRegisteredAccounts);

    loadAdminData();
  }

  function deleteAccount(managedAccount: ManagedAccount) {
    if (managedAccount.role === "admin") {
      return;
    }

    const confirmed = window.confirm(
      `Sigur vrei să ștergi contul ${managedAccount.email}? În demo, contul va fi scos din lista de conturi și nu va mai putea fi folosit după ce actualizăm login-ul.`
    );

    if (!confirmed) {
      return;
    }

    const email = normalizeEmail(managedAccount.email);

    const nextRegisteredAccounts = registeredAccounts.filter(
      (registeredAccount) => normalizeEmail(registeredAccount.email) !== email
    );

    const nextBlockedAccounts = blockedAccounts.filter(
      (blockedAccount) => normalizeEmail(blockedAccount.email) !== email
    );

    const nextDeletedAccounts = [
      ...deletedAccounts.filter(
        (deletedAccount) => normalizeEmail(deletedAccount.email) !== email
      ),
      {
        email,
        name: managedAccount.name,
        role: managedAccount.role,
        deletedAt: new Date().toISOString(),
        reason: "Șters de admin demo",
      },
    ];

    const currentDraft = readJson<DraftAd>("luxe_draft_ad");
    const draftOwnerEmail = normalizeEmail(currentDraft?.ownerEmail);

    if (
      managedAccount.role === "advertiser" &&
      currentDraft &&
      (draftOwnerEmail === email || email === "advertiser.demo@luxe.ro")
    ) {
      [
        "luxe_draft_ad",
        "luxe_verification_draft",
        "luxe_admin_status",
        "luxe_payment_status",
        "luxe_ad_published",
        "luxe_ad_published_at",
      ].forEach((key) => localStorage.removeItem(key));
    }

    writeRegisteredAccounts(nextRegisteredAccounts);
    writeBlockedAccounts(nextBlockedAccounts);
    writeDeletedAccounts(nextDeletedAccounts);

    loadAdminData();
  }

  function clearDeletedHistory() {
    const confirmed = window.confirm(
      "Sigur vrei să golești istoricul conturilor șterse demo?"
    );

    if (!confirmed) {
      return;
    }

    writeDeletedAccounts([]);
    loadAdminData();
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

            <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200">
              Admin demo
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/admin/raportari" className="hover:text-white">
              Raportări
            </Link>

            <Link href="/profiluri" className="hover:text-white">
              Profiluri
            </Link>

            <Link href="/prezentare" className="hover:text-white">
              Prezentare
            </Link>

            <Link href="/iesire" className="hover:text-white">
              Ieșire
            </Link>
          </div>

          <Link
            href="/admin/raportari"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
          >
            Vezi raportări
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              Panou administrare
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Moderare, conturi și publicare anunțuri.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              Adminul poate analiza anunțuri, verifica documente demo, aproba
              pentru plată, gestiona raportări și bloca sau șterge conturi de
              utilizator / advertiser.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#anunturi"
                className="rounded-full bg-rose-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-rose-400"
              >
                Moderare anunț
              </a>

              <a
                href="#conturi"
                className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black transition hover:bg-white/80"
              >
                Management conturi
              </a>

              <Link
                href="/admin/raportari"
                className="rounded-full border border-white/10 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Raportări
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Rezumat admin
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Anunț</p>
                <p className="mt-2 font-semibold">
                  {draftAd ? getAdminStatusLabel(adminStatus) : "Lipsă"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Plată</p>
                <p className="mt-2 font-semibold">
                  {getPaymentStatusLabel(paymentStatus)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Conturi active</p>
                <p className="mt-2 font-semibold">{accountStats.total}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs text-white/45">Blocate</p>
                <p className="mt-2 font-semibold">{accountStats.blocked}</p>
              </div>
            </div>

            <p className="mt-5 rounded-3xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm leading-7 text-sky-100/75">
              Cont admin curent:{" "}
              <span className="font-semibold">
                {account?.email || "admin demo"}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section
        id="anunturi"
        className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr]"
      >
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Moderare anunț
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Anunț trimis de advertiser
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-white/60">
                Adminul verifică anunțul și verificarea 18+. Adminul nu
                plătește niciodată. Advertiserul plătește doar după aprobare.
              </p>
            </div>

            {draftAd ? (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                      {packageTitle}
                    </span>

                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
                      {getAdminStatusLabel(adminStatus)}
                    </span>

                    {isPublished && (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        Public
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-3xl font-bold">
                    {draftAd.displayName || "Profil Luxe"}
                    {draftAd.age ? `, ${draftAd.age}` : ""}
                  </h3>

                  <p className="mt-2 text-white/50">
                    {draftAd.city || "Oraș nespecificat"}
                  </p>

                  <p className="mt-5 max-w-3xl leading-8 text-white/65">
                    {draftAd.description ||
                      "Descrierea profilului apare aici după completarea anunțului."}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs text-white/45">Telefon</p>
                      <p className="mt-2 font-semibold">
                        {draftAd.phone || "Lipsă"}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs text-white/45">Advertiser</p>
                      <p className="mt-2 truncate font-semibold">
                        {draftAd.ownerEmail || "Demo"}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs text-white/45">Cost demo</p>
                      <p className="mt-2 font-semibold">
                        {packagePrice ? `${packagePrice} RON` : "Neales"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <button
                    type="button"
                    onClick={approveAd}
                    className="rounded-full bg-white px-5 py-4 font-semibold text-black transition hover:bg-white/80"
                  >
                    Aprobă
                  </button>

                  <button
                    type="button"
                    onClick={approveForPayment}
                    className="rounded-full bg-emerald-500 px-5 py-4 font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Aprobă pentru plată
                  </button>

                  <button
                    type="button"
                    onClick={rejectAd}
                    className="rounded-full bg-rose-500 px-5 py-4 font-semibold text-white transition hover:bg-rose-400"
                  >
                    Respinge
                  </button>

                  <button
                    type="button"
                    onClick={resetAdFlow}
                    className="rounded-full border border-white/10 px-5 py-4 font-semibold text-white transition hover:bg-white/10"
                  >
                    Resetează flow
                  </button>
                </div>

                <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
                  <h3 className="text-xl font-bold text-sky-200">
                    Decizie curentă
                  </h3>

                  <p className="mt-3 leading-7 text-sky-100/75">
                    Status:{" "}
                    <span className="font-semibold">
                      {getAdminStatusLabel(adminStatus)}
                    </span>
                    . Plată:{" "}
                    <span className="font-semibold">
                      {getPaymentStatusLabel(paymentStatus)}
                    </span>
                    . Profil public:{" "}
                    <span className="font-semibold">
                      {isPublished ? "Da" : "Nu"}
                    </span>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-8 text-center">
                <h3 className="text-3xl font-bold text-amber-200">
                  Nu există anunț trimis.
                </h3>

                <p className="mx-auto mt-4 max-w-2xl leading-8 text-amber-100/70">
                  Creează un anunț ca advertiser, trimite verificarea 18+, apoi
                  revino în admin pentru moderare.
                </p>

                <Link
                  href="/publica-anunt"
                  className="mt-6 inline-flex rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:bg-white/80"
                >
                  Publică anunț demo
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Verificare 18+
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Documente demo trimise
            </h2>

            {verificationDraft ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Document demo</p>
                  <p className="mt-2 font-semibold">
                    {verificationDraft.documentName || "Selectat"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Selfie demo</p>
                  <p className="mt-2 font-semibold">
                    {verificationDraft.selfieName || "Selectat"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <p className="text-sm text-white/45">Trimis la</p>
                  <p className="mt-2 font-semibold">
                    {formatDate(verificationDraft.submittedAt)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-5 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 leading-7 text-amber-100/70">
                Nu există încă verificare 18+ trimisă.
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
              Raportări
            </p>

            {lastReport ? (
              <div className="mt-5 rounded-[2rem] border border-white/10 bg-black/30 p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    {lastReport.status || "pending"}
                  </span>

                  <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                    Raportare demo
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold">
                  {lastReport.profileName || "Profil raportat"}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  {lastReport.reason || "Motiv nespecificat"}
                </p>

                <Link
                  href="/admin/raportari"
                  className="mt-5 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/80"
                >
                  Gestionează raportarea
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-[2rem] border border-white/10 bg-black/30 p-5">
                <p className="leading-7 text-white/60">
                  Nu există raportări noi în demo.
                </p>

                <Link
                  href="/admin/raportari"
                  className="mt-5 block rounded-full border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Vezi pagina raportări
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-sky-500/20 bg-sky-500/10 p-6">
            <h2 className="text-xl font-bold text-sky-200">
              Reguli admin
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-7 text-sky-100/75">
              <p>1. Adminul aprobă sau respinge anunțuri.</p>
              <p>2. Adminul poate bloca utilizatori și advertiseri.</p>
              <p>3. Adminul nu introduce date de card.</p>
              <p>4. Advertiserul plătește doar după aprobare.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
            <h2 className="text-xl font-bold text-rose-200">
              Notă demo
            </h2>

            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              Blocarea și ștergerea sunt salvate local în browser. Imediat după
              acest pas modificăm login-ul ca aceste conturi să nu mai poată
              intra.
            </p>
          </div>
        </aside>
      </section>

      <section id="conturi" className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                Management conturi demo
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Blochează sau șterge utilizatori și advertiseri
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-white/60">
                Adminul poate bloca temporar un cont, îl poate debloca sau îl
                poate șterge din demo. Conturile admin nu pot fi șterse sau
                blocate din această listă.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAdminData}
              className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/80"
            >
              Reîncarcă date
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs text-white/45">Total</p>
              <p className="mt-2 text-2xl font-bold">{accountStats.total}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs text-white/45">Utilizatori</p>
              <p className="mt-2 text-2xl font-bold">{accountStats.users}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs text-white/45">Advertiseri</p>
              <p className="mt-2 text-2xl font-bold">
                {accountStats.advertisers}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs text-white/45">Blocate</p>
              <p className="mt-2 text-2xl font-bold">{accountStats.blocked}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs text-white/45">Șterse</p>
              <p className="mt-2 text-2xl font-bold">{accountStats.deleted}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.7fr_0.7fr]">
            <input
              type="text"
              value={accountSearch}
              onChange={(event) => setAccountSearch(event.target.value)}
              placeholder="Caută după nume sau email..."
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
            />

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as "all" | UserRole)
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition focus:border-rose-500/50"
            >
              <option value="all">Toate rolurile</option>
              <option value="user">Utilizatori</option>
              <option value="advertiser">Advertiseri</option>
              <option value="admin">Admin</option>
            </select>

            <input
              type="text"
              value={blockReason}
              onChange={(event) => setBlockReason(event.target.value)}
              placeholder="Motiv blocare"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-rose-500/50"
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10">
            <div className="grid grid-cols-12 gap-4 border-b border-white/10 bg-black/40 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              <div className="col-span-12 md:col-span-4">Cont</div>
              <div className="col-span-6 md:col-span-2">Rol</div>
              <div className="col-span-6 md:col-span-2">Status</div>
              <div className="col-span-12 md:col-span-4">Acțiuni</div>
            </div>

            {filteredAccounts.length > 0 ? (
              <div className="divide-y divide-white/10">
                {filteredAccounts.map((managedAccount) => {
                  const isBlocked = managedAccount.status === "blocked";

                  return (
                    <div
                      key={managedAccount.email}
                      className="grid grid-cols-12 gap-4 bg-black/20 px-5 py-5"
                    >
                      <div className="col-span-12 md:col-span-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                              managedAccount.role === "advertiser"
                                ? "bg-rose-500/10 text-rose-200"
                                : "bg-sky-500/10 text-sky-200"
                            }`}
                          >
                            {managedAccount.role === "advertiser" ? "A" : "U"}
                          </div>

                          <div>
                            <h3 className="font-bold">
                              {managedAccount.name}
                            </h3>

                            <p className="mt-1 break-all text-sm text-white/45">
                              {managedAccount.email}
                            </p>

                            <p className="mt-2 text-xs text-white/35">
                              Creat: {formatDate(managedAccount.createdAt)}
                              {managedAccount.isSeedDemo
                                ? " · cont demo rapid"
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-6 flex items-start md:col-span-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/70">
                          {getRoleLabel(managedAccount.role)}
                        </span>
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        {isBlocked ? (
                          <div>
                            <span className="rounded-full bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200">
                              Blocat
                            </span>

                            <p className="mt-3 text-xs leading-6 text-white/40">
                              {managedAccount.blockReason || "Blocare demo"}
                            </p>
                          </div>
                        ) : (
                          <span className="rounded-full bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200">
                            Activ
                          </span>
                        )}
                      </div>

                      <div className="col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-4">
                        {isBlocked ? (
                          <button
                            type="button"
                            onClick={() => unblockAccount(managedAccount)}
                            className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                          >
                            Deblochează
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => blockAccount(managedAccount)}
                            className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                          >
                            Blochează
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteAccount(managedAccount)}
                          className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                        >
                          Șterge
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-black/20 p-8 text-center">
                <h3 className="text-2xl font-bold">
                  Nu există conturi pentru filtrul selectat.
                </h3>

                <p className="mt-3 text-white/50">
                  Schimbă filtrul sau creează un cont nou din pagina de
                  înregistrare.
                </p>
              </div>
            )}
          </div>

          {deletedAccounts.length > 0 && (
            <div className="mt-8 rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-rose-100">
                    Istoric conturi șterse demo
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-rose-100/70">
                    Aceste conturi sunt ascunse din demo. După ce modificăm
                    login-ul, ele nu vor mai putea intra.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearDeletedHistory}
                  className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/80"
                >
                  Golește istoricul
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {deletedAccounts.map((deletedAccount) => (
                  <div
                    key={`${deletedAccount.email}-${deletedAccount.deletedAt}`}
                    className="rounded-3xl border border-rose-500/20 bg-black/20 p-4"
                  >
                    <p className="font-semibold">{deletedAccount.email}</p>

                    <p className="mt-2 text-sm text-rose-100/60">
                      {getRoleLabel(deletedAccount.role)} · șters la{" "}
                      {formatDate(deletedAccount.deletedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-2xl md:p-8">
          <h2 className="text-2xl font-bold text-emerald-200">
            Următorul pas obligatoriu
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-emerald-100/75">
            Acum adminul poate marca un cont ca blocat sau șters. Următorul
            fișier pe care îl modificăm este pagina de autentificare, ca aceste
            conturi să fie refuzate la login.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        Luxe.ro © 2026 — panou admin demo.
      </footer>
    </main>
  );
}