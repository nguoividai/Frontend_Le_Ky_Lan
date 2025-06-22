"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

interface Token {
  symbol: string;
  name: string;
  price: number;
  change24h?: number;
}

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://interview.switcheo.com/prices.json"
      );
      const prices: TokenPrice[] = await response.json();

      // Group by currency and get latest price
      const tokenMap = new Map<string, Token>();

      prices.forEach((item) => {
        if (item.price > 0) {
          const existing = tokenMap.get(item.currency);
          if (!existing || new Date(item.date) > new Date(existing.name)) {
            tokenMap.set(item.currency, {
              symbol: item.currency,
              name: item.currency.toUpperCase(),
              price: item.price,
            });
          }
        }
      });

      const tokenList = Array.from(tokenMap.values()).sort((a, b) =>
        a.symbol.localeCompare(b.symbol)
      );
      setTokens(tokenList);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const tokenOptions = useMemo(() => {
    return tokens.map((token) => ({
      value: token.symbol,
      label: token.symbol.toUpperCase(),
      icon: `/tokens/${token.symbol.toUpperCase()}.svg`,
      price: `$${token.price.toFixed(4)}`,
    }));
  }, [tokens]);

  return {
    tokens,
    tokenOptions,
    isLoading,
    lastUpdated,
    refetch: fetchPrices,
  };
}
