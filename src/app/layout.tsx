import type { Metadata } from "next";
import type { ReactNode } from "react";
import AccountFloatingMenu from "@/components/AccountFloatingMenu";
import ConsentBanner from "@/components/ConsentBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxe.ro — Platformă premium 18+ în România",
  description:
    "Luxe.ro este o platformă 18+ modernă pentru profiluri verificate, conversații private și anunțuri premium în România.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        {children}
        <AccountFloatingMenu />
        <ConsentBanner />
      </body>
    </html>
  );
}