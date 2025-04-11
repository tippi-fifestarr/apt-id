import type { Metadata } from "next";
import { WalletProvider } from "../components/WalletProvider";
import { SecretButton } from "../components/SecretButton";
import { HowToUseButton } from "../components/HowToUseButton";
import { FeedbackButton } from "../components/FeedbackButton";
import { TurboAptosProvider, TourTooltip, TourHighlight } from "../components/TurboAptos";
import { ClientOnly } from "../components/ClientOnly";
import { allTours } from "../tours";
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
          {/* Wrap TurboAptos and all interactive components in ClientOnly to prevent SSR issues */}
          <ClientOnly>
            <TurboAptosProvider tours={allTours}>
              {/* Tour UI components */}
              <TourTooltip />
              <TourHighlight />
              
              {/* Button stack in bottom right corner */}
              <HowToUseButton />
              <FeedbackButton />
              <SecretButton />
            </TurboAptosProvider>
          </ClientOnly>
          
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
