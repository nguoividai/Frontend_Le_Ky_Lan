"use client";

import { useState, useEffect, useMemo } from "react";
import { useTokens } from "./use-tokens";

export type WalletToken = {
  symbol: string;
  balance: number;
};

interface WalletData {
  version: number;
  lastUpdated: string;
  tokens: WalletToken[];
}

export const useWallet = () => {
  const [walletTokens, setWalletTokens] = useState<WalletToken[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { tokens } = useTokens();
  const STORAGE_KEY = "crypto-wallet";
  const CURRENT_VERSION = 1;

  // Load wallet from localStorage on initial render
  useEffect(() => {
    const loadWalletFromStorage = () => {
      try {
        const savedWallet = localStorage.getItem(STORAGE_KEY);

        if (savedWallet) {
          const parsedData = JSON.parse(savedWallet) as
            | WalletData
            | WalletToken[];

          // Handle both new format (with version) and old format (array only)
          if (Array.isArray(parsedData)) {
            // Old format migration
            setWalletTokens(parsedData);
            saveWalletToStorage(parsedData); // Save in the new format
          } else {
            // New format
            setWalletTokens(parsedData.tokens);
            setLastUpdated(new Date(parsedData.lastUpdated));
          }
        } else {
          // Initialize with some default tokens if wallet is empty
          const defaultWallet: WalletToken[] = [
            { symbol: "btc", balance: 0.05 },
            { symbol: "eth", balance: 1.5 },
            { symbol: "usdt", balance: 500 },
          ];
          setWalletTokens(defaultWallet);
          saveWalletToStorage(defaultWallet);
        }
      } catch (error) {
        console.error("Failed to parse wallet from localStorage:", error);
        // Initialize with empty wallet on error
        setWalletTokens([]);
      }
    };

    loadWalletFromStorage();
  }, []);

  // Save wallet to localStorage
  const saveWalletToStorage = (tokens: WalletToken[]) => {
    try {
      const now = new Date();
      setLastUpdated(now);

      const walletData: WalletData = {
        version: CURRENT_VERSION,
        lastUpdated: now.toISOString(),
        tokens: tokens,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(walletData));
    } catch (error) {
      console.error("Failed to save wallet to localStorage:", error);
    }
  };

  // Save wallet to localStorage whenever it changes
  useEffect(() => {
    if (walletTokens.length > 0) {
      saveWalletToStorage(walletTokens);
    }
  }, [walletTokens]);

  // Calculate wallet values with current token prices
  const walletWithValues = useMemo(() => {
    return walletTokens
      .map((walletToken) => {
        const token = tokens.find((t) => t.symbol === walletToken.symbol);
        const value = token ? walletToken.balance * token.price : 0;

        return {
          ...walletToken,
          name: token?.name || walletToken.symbol.toUpperCase(),
          price: token?.price || 0,
          value,
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [walletTokens, tokens]);

  // Calculate total portfolio value
  const totalValue = useMemo(() => {
    return walletWithValues.reduce((sum, token) => sum + token.value, 0);
  }, [walletWithValues]);
  // Add or update token in wallet
  const updateTokenBalance = (symbol: string, balance: number) => {
    setWalletTokens((prev) => {
      const existingIndex = prev.findIndex((t) => t.symbol === symbol);

      if (existingIndex >= 0) {
        // Update existing token
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], balance };
        return updated;
      } else {
        // Add new token
        return [...prev, { symbol, balance }];
      }
    });
  };

  // Remove token from wallet
  const removeToken = (symbol: string) => {
    setWalletTokens((prev) => prev.filter((t) => t.symbol !== symbol));
  };

  // Clear entire wallet
  const clearWallet = () => {
    setWalletTokens([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear wallet from localStorage:", error);
    }
  };

  // Export wallet data (for backup)
  const exportWallet = () => {
    try {
      return JSON.stringify(walletTokens, null, 2);
    } catch (error) {
      console.error("Failed to export wallet:", error);
      return "";
    }
  };

  // Import wallet data (from backup)
  const importWallet = (walletData: string): boolean => {
    try {
      const parsedData = JSON.parse(walletData);

      // Validate data structure
      if (
        Array.isArray(parsedData) &&
        parsedData.every(
          (item) =>
            typeof item === "object" &&
            "symbol" in item &&
            "balance" in item &&
            typeof item.symbol === "string" &&
            typeof item.balance === "number"
        )
      ) {
        setWalletTokens(parsedData);
        saveWalletToStorage(parsedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to import wallet:", error);
      return false;
    }
  };

  return {
    wallet: walletWithValues,
    totalValue,
    lastUpdated,
    updateTokenBalance,
    removeToken,
    clearWallet,
    exportWallet,
    importWallet,
  };
};
