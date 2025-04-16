import type { Metadata } from "next";
import { WalletProvider } from "../components/WalletProvider";
import { ButtonStack } from "../components/ButtonStack";
import { CodeCornerFlip } from "../components/CodeCornerFlip";
import { TurboAptosProvider, TourTooltip, TourHighlight } from "../components/TurboAptos";
import { InspectorProvider } from "../components/Inspector";
import { ClientOnly } from "../components/ClientOnly";
import { allTours } from "../tours";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "My Hackathon Project",
  description: "Your Gateway to Building on Aptos",
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
            <InspectorProvider>
              <TurboAptosProvider tours={allTours}>
                {/* Tour UI components */}
                <TourTooltip />
                <TourHighlight />
                
                {/* Button stack in bottom right corner */}
                <ButtonStack />
                
                {/* Code corner flip in bottom left */}
                <CodeCornerFlip />
              </TurboAptosProvider>
            </InspectorProvider>
          </ClientOnly>
          
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
