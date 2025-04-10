"use client";

import { useAptosName } from "./useAptosName";
import { ALLOWLISTED_NAMES } from "@/constants";
import { useEffect, useState } from "react";

/**
 * Custom hook to check if the connected wallet's ANS name is on the allowlist
 * for accessing secret features
 */
export function useAllowlistedName() {
  const { ansName, loading } = useAptosName();
  const [isAllowlisted, setIsAllowlisted] = useState<boolean>(false);

  useEffect(() => {
    if (!ansName || loading) {
      setIsAllowlisted(false);
      return;
    }

    // Check if user's ANS name is in the allowlist
    setIsAllowlisted(ALLOWLISTED_NAMES.includes(ansName));
  }, [ansName, loading]);

  return { isAllowlisted, loading };
}