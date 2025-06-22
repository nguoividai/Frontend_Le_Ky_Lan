"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import {
  ArrowUpDown,
  Loader2,
  RefreshCw,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TechBackground from "@/components/tech-background";
import { Combobox } from "@/components/ui/combobox";
import { useTokens } from "@/hooks/use-tokens";
import { useSwap } from "@/hooks/use-swap";
import { useTransactions } from "@/hooks/use-transactions";
import TransactionHistory from "@/components/transaction-history";
import { format } from "date-fns";

export default function CurrencySwapForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formattedDate, setFormattedDate] = useState("N/A");
  const {
    tokens,
    tokenOptions,
    isLoading: pricesLoading,
    lastUpdated,
    refetch,
  } = useTokens();

  // Format the date on client side only, using useEffect to prevent hydration mismatch
  useEffect(() => {
    if (lastUpdated) {
      setFormattedDate(format(new Date(lastUpdated), "dd/MM/yyyy HH:mm"));
    }
  }, [lastUpdated]);

  const {
    fromToken,
    setFromToken,
    toToken,
    setToToken,
    fromAmount,
    setFromAmount,
    toAmount,
    exchangeRate,
    isSwapping,
    isFormValid,
    handleSwapTokens,
  } = useSwap({ tokens });

  const { transactions, addTransaction, clearTransactions } = useTransactions();

  // Helper function to get appropriate error message
  const getErrorMessage = () => {
    if (!fromToken || !toToken) return "Please select both cryptocurrencies";
    if (!fromAmount) return "Please enter an amount";
    if (Number.parseFloat(fromAmount) <= 0)
      return "Amount must be greater than 0";
    return "";
  };

  const handleSubmitSwap = async () => {
    if (!isFormValid) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add transaction to history
    addTransaction({
      fromToken,
      toToken,
      fromAmount,
      toAmount,
    });

    setIsLoading(false);

    alert(
      `Successfully swapped ${fromAmount} ${fromToken.toUpperCase()} for ${toAmount} ${toToken.toUpperCase()}!`
    );

    setFromAmount("");
    setToToken("");
    setFromToken("");
    setToToken("");
  };

  return (
    <>
      <TechBackground />
      <div className="min-h-screen p-4 flex items-center justify-center relative z-10">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/80 hover:text-orange-400 hover:bg-orange-500/10"
          >
            <Link href="/wallet">
              <Wallet className="h-5 w-5 mr-1" />
              Wallet
            </Link>
          </Button>
          <TransactionHistory
            transactions={transactions}
            onClearTransactions={clearTransactions}
          />
        </div>

        <Card className="w-full max-w-md shadow-2xl backdrop-blur-xl bg-white/5 border border-white/10 relative overflow-hidden">
          {/* Enhanced Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-blue-500/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/5 to-transparent pointer-events-none" />

          <CardHeader className="text-center relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-orange-400" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent">
                Crypto Swap
              </CardTitle>
            </div>
            <CardDescription className="text-gray-300">
              Trade your favorite cryptocurrencies
            </CardDescription>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>{formattedDate}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={refetch}
                disabled={pricesLoading}
                className="h-6 w-6 p-0 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10"
              >
                <RefreshCw
                  className={cn("h-3 w-3", pricesLoading && "animate-spin")}
                />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 relative">
            {/* From Token Section */}
            <div className="space-y-2">
              <Label
                htmlFor="from-token"
                className="text-gray-300 font-medium flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-orange-400 rounded-full" /> From
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Combobox
                  options={tokenOptions}
                  value={fromToken}
                  onValueChange={setFromToken}
                  placeholder="Select crypto"
                  searchPlaceholder="Search cryptocurrencies..."
                  disabled={pricesLoading}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 [&>span]:text-white backdrop-blur-sm hover:border-orange-400/50"
                />

                <Input
                  id="from-amount"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="text-right font-mono bg-white/5 border-white/20 text-white placeholder:text-white-100 backdrop-blur-sm focus:bg-white/10 focus:border-orange-400/50"
                />
              </div>
              {fromToken && tokens.find((t) => t.symbol === fromToken) && (
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>1{" "}
                  {fromToken.toUpperCase()} = $
                  {tokens.find((t) => t.symbol === fromToken)?.price.toFixed(4)}
                </div>
              )}
            </div>

            {/* Enhanced Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwapTokens}
                disabled={isSwapping || pricesLoading}
                className="rounded-full h-12 w-12 p-0 border-2 border-orange-500/50 hover:border-orange-400 transition-all duration-300 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 text-orange-400 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-yellow-500/20 backdrop-blur-sm shadow-lg shadow-orange-500/20"
              >
                <ArrowUpDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    isSwapping && "rotate-180"
                  )}
                />
              </Button>
            </div>

            {/* To Token Section */}
            <div className="space-y-2">
              <Label
                htmlFor="to-token"
                className="text-gray-300 font-medium flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full" /> To
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Combobox
                  options={tokenOptions}
                  value={toToken}
                  onValueChange={setToToken}
                  placeholder="Select crypto"
                  searchPlaceholder="Search cryptocurrencies..."
                  disabled={pricesLoading}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 [&>span]:text-white backdrop-blur-sm hover:border-blue-400/50"
                />

                <Input
                  id="to-amount"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="text-right font-mono bg-white/5 border-white/20 text-white placeholder:text-white-100 backdrop-blur-sm focus:bg-white/10 focus:border-orange-400/50"
                />
              </div>
              {toToken && tokens.find((t) => t.symbol === toToken) && (
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>1{" "}
                  {toToken.toUpperCase()} = $
                  {tokens.find((t) => t.symbol === toToken)?.price.toFixed(4)}
                </div>
              )}
            </div>

            {/* Enhanced Exchange Rate Display */}
            {exchangeRate > 0 && fromToken && toToken && (
              <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-blue-500/5" />
                <div className="flex justify-between items-center text-sm relative">
                  <span className="text-gray-300 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    Exchange Rate
                  </span>
                  <span className="font-mono text-white">
                    1 {fromToken.toUpperCase()} = {exchangeRate.toFixed(6)}{" "}
                    {toToken.toUpperCase()}
                  </span>
                </div>
                {fromAmount && toAmount && (
                  <div className="flex justify-between items-center text-sm relative">
                    <span className="text-gray-300">You'll receive</span>
                    <span className="font-semibold text-green-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                      {toAmount} {toToken.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Enhanced Submit Button */}
            <Button
              onClick={handleSubmitSwap}
              disabled={!isFormValid || isLoading || pricesLoading}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 hover:from-orange-700 hover:via-yellow-700 hover:to-orange-700 transition-all duration-300 border-0 shadow-lg shadow-orange-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Swap...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Swap Cryptocurrencies
                </>
              )}
            </Button>

            {/* Form Validation Messages */}
            {!isFormValid && fromAmount && (
              <div className="text-sm text-red-400 text-center flex items-center justify-center gap-2">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                {getErrorMessage()}
              </div>
            )}

            {pricesLoading && (
              <div className="text-sm text-gray-300 text-center flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading cryptocurrency prices...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
