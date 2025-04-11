"use client";

import { useEffect, useState, ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
}

/**
 * Component wrapper that only renders its children on the client-side
 * Prevents hydration mismatches for components that use browser APIs
 */
export function ClientOnly({ children }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient ? <>{children}</> : null;
}