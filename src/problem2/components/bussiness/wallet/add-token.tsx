"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Combobox } from "@/components/ui/combobox";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

interface Token {
  name: string;
  symbol: string;
  price: number;
}

interface AddTokenProps {
  tokenOptions: { label: string; value: string }[];
  tokens: Token[];
  pricesLoading: boolean;
  updateTokenBalance: (symbol: string, balance: number) => void;
  addTransaction: (transaction: {
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
  }) => void;
  wallet: any[];
}

export function AddToken({
  tokenOptions,
  tokens,
  pricesLoading,
  updateTokenBalance,
  addTransaction,
  wallet,
}: AddTokenProps) {
  const [selectedToken, setSelectedToken] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle adding/updating token in wallet
  const handleAddToken = async () => {
    const selectedTokenData = tokens.find((t) => t.symbol === selectedToken);

    if (
      !selectedToken ||
      !tokenAmount ||
      Number(tokenAmount.replace(/,/g, "")) < 0 ||
      !selectedTokenData
    ) {
      return;
    }

    const convertedAmount = +(tokenAmount || 0) / selectedTokenData.price;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if the token already exists in wallet
    const existingToken = wallet.find((t) => t.symbol === selectedToken);
    if (existingToken) {
      // If token exists, add to existing balance
      updateTokenBalance(
        selectedToken,
        existingToken.balance + convertedAmount
      );
    } else {
      // If token doesn't exist, set new balance
      updateTokenBalance(selectedToken, convertedAmount);
    }

    addTransaction({
      fromToken: "add",
      toToken: selectedToken,
      fromAmount: "0",
      toAmount: convertedAmount.toString(),
    });

    setSelectedToken("");
    setTokenAmount("");
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full shadow-2xl backdrop-blur-xl bg-white/5 border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-blue-500/10 pointer-events-none" />

      <CardHeader className="relative">
        <CardTitle className="text-xl font-bold text-white">
          Add Token
        </CardTitle>
        <CardDescription className="text-gray-300">
          Add or update tokens in your wallet
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6">
        <div>
          <Label htmlFor="token" className="text-gray-300 mb-2 block">
            Select Token
          </Label>
          <Combobox
            options={tokenOptions}
            value={selectedToken}
            onValueChange={setSelectedToken}
            placeholder="Select crypto"
            searchPlaceholder="Search cryptocurrencies..."
            disabled={pricesLoading}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 [&>span]:text-white backdrop-blur-sm hover:border-orange-400/50"
          />
        </div>

        <div>
          <Label htmlFor="amount" className="text-gray-300 mb-2 block">
            Amount
          </Label>
          <Input
            id="amount"
            placeholder="$ 0.00"
            value={
              tokenAmount
                ? `$ ${tokenAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                : ""
            }
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              if (value === "." || (value.match(/\./g) || []).length <= 1) {
                setTokenAmount(value);
              }
            }}
            onBlur={(e) => {
              const value = e.target.value.replace(/[$,\s]/g, "");
              if (value && !isNaN(+value)) {
                const numValue = parseFloat(value);
                const formatted = numValue.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                });
                setTokenAmount(formatted);
              }
            }}
            className="font-mono bg-white/5 border-white/20 text-white placeholder:text-white-100 backdrop-blur-sm focus:bg-white/10 focus:border-orange-400/50"
          />
        </div>

        {/* Conversion Display */}
        {selectedToken && tokenAmount && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="text-xs text-gray-400">Conversion Rate</div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-white">
                {`$${tokenAmount.replace(/,/g, "")} USD = `}
              </div>
              <div className="font-medium text-orange-400">
                {(() => {
                  const amount = parseFloat(tokenAmount.replace(/,/g, ""));
                  const selectedTokenData = tokens.find(
                    (t) => t.symbol === selectedToken
                  );
                  if (selectedTokenData?.price && !isNaN(amount)) {
                    const convertedAmount = amount / selectedTokenData.price;
                    return `${convertedAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })} ${selectedToken.toUpperCase()}`;
                  }
                  return "Loading...";
                })()}
              </div>
            </div>
            {(() => {
              const selectedTokenData = tokens.find(
                (t) => t.symbol === selectedToken
              );
              if (selectedTokenData?.price) {
                return (
                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>1{" "}
                    {selectedToken.toUpperCase()} = $
                    {selectedTokenData.price.toFixed(4)} USD
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}

        <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <Button
          onClick={handleAddToken}
          disabled={
            !selectedToken || !tokenAmount || isSubmitting || pricesLoading
          }
          className="w-full h-12 font-semibold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 hover:from-orange-700 hover:via-yellow-700 hover:to-orange-700 transition-all duration-300 border-0 shadow-lg shadow-orange-500/25 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" />
              Add to Wallet
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
