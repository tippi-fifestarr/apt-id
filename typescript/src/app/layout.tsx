import type { Metadata } from "next";
import { WalletProvider } from "../components/WalletProvider";
import { SecretButton } from "../components/SecretButton";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Apt ID",
  description: "Your Profile into Aptos Identity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
          {/* The secret button only renders when user has allowlisted ANS name */}
          <SecretButton />
        </WalletProvider>
      </body>
    </html>
  );
}
