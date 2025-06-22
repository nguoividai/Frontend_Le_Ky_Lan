"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Combobox } from "@/components/ui/combobox";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SwapDialogProps {
  showSwapDialog: boolean;
  setShowSwapDialog: (show: boolean) => void;
  swapFromToken: any;
  tokens: any[];
  tokenOptions: { label: string; value: string }[];
  pricesLoading: boolean;
  updateTokenBalance: (symbol: string, balance: number) => void;
  wallet: any[];
  addTransaction: (transaction: any) => void;
}

export function SwapDialog({
  showSwapDialog,
  setShowSwapDialog,
  swapFromToken,
  tokens,
  tokenOptions,
  pricesLoading,
  updateTokenBalance,
  wallet,
  addTransaction,
}: SwapDialogProps) {
  const [swapToToken, setSwapToToken] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapEstimate, setSwapEstimate] = useState("");
  const [swapRate, setSwapRate] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate swap rate and estimate
  const calculateSwap = () => {
    if (!swapFromToken || !swapToToken || !swapAmount) {
      setSwapEstimate("");
      setSwapRate(0);
      return;
    }

    try {
      // Find token prices
      const fromPrice =
        tokens.find((t) => t.symbol === swapFromToken.symbol)?.price || 0;
      const toPrice = tokens.find((t) => t.symbol === swapToToken)?.price || 0;

      if (fromPrice && toPrice) {
        // Calculate rate
        const rate = fromPrice / toPrice;
        setSwapRate(rate);

        // Calculate estimated amount
        const amount = parseFloat(swapAmount.replace(/,/g, ""));
        if (!isNaN(amount)) {
          const estimated = amount * rate;
          setSwapEstimate(estimated.toFixed(6));
        }
      }
    } catch (error) {
      console.error("Swap calculation error:", error);
    }
  };

  // Update calculation when swap inputs change
  useEffect(() => {
    calculateSwap();
  }, [swapFromToken, swapToToken, swapAmount]);

  // Handle executing a swap
  const handleExecuteSwap = async () => {
    if (
      !swapFromToken ||
      !swapToToken ||
      !swapAmount ||
      !swapEstimate ||
      swapRate === 0
    ) {
      return;
    }

    const fromAmount = parseFloat(swapAmount.replace(/,/g, ""));
    const toAmount = parseFloat(swapEstimate);

    // Validate from amount is available
    if (fromAmount > swapFromToken.balance) {
      alert("Insufficient balance for swap");
      return;
    }

    // Validate amount is positive
    if (fromAmount <= 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update tokens in wallet
      updateTokenBalance(
        swapFromToken.symbol,
        swapFromToken.balance - fromAmount
      );

      // Get current balance of target token (if exists)
      const existingToken = wallet.find((t) => t.symbol === swapToToken);
      const currentBalance = existingToken ? existingToken.balance : 0;

      // Add the swapped amount
      updateTokenBalance(swapToToken, currentBalance + toAmount);

      // Add to transaction history
      addTransaction({
        fromToken: swapFromToken.symbol,
        toToken: swapToToken,
        fromAmount: fromAmount.toString(),
        toAmount: toAmount.toString(),
      });

      // Close dialog and reset
      setShowSwapDialog(false);

      // Success message
      alert(
        `Successfully swapped ${fromAmount} ${swapFromToken.symbol.toUpperCase()} for ${toAmount.toFixed(
          6
        )} ${swapToToken.toUpperCase()}`
      );
    } catch (error) {
      console.error("Swap execution error:", error);
      alert("Failed to execute swap. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showSwapDialog} onOpenChange={setShowSwapDialog}>
      <DialogContent className="bg-gray-900 border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Swap Cryptocurrency</DialogTitle>
          <DialogDescription className="text-gray-400">
            Swap your tokens for other cryptocurrencies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* From Token */}
          <div className="space-y-2">
            <Label htmlFor="swap-from" className="text-white">
              From
            </Label>
            <div className="flex items-center gap-3 bg-black/40 p-3 rounded-md border border-white/10">
              <div className="relative">
                {" "}
                <img
                  src={
                    swapFromToken
                      ? `/tokens/${swapFromToken.symbol.toUpperCase()}.svg`
                      : ""
                  }
                  alt={swapFromToken?.symbol}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div
                  className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 w-8 h-8 rounded-full flex items-center justify-center absolute top-0 left-0"
                  style={{ display: "none" }}
                >
                  {swapFromToken?.symbol.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="flex-1">
                <div className="font-medium text-white">
                  {swapFromToken?.symbol.toUpperCase()}
                </div>
                <div className="text-xs text-gray-400">
                  Balance: {swapFromToken?.balance.toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="swap-amount" className="text-gray-400 text-xs">
                  Amount to swap
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 py-0 px-2 text-xs text-blue-400 hover:text-blue-300"
                  onClick={() =>
                    swapFromToken &&
                    setSwapAmount(swapFromToken.balance.toString())
                  }
                >
                  Use maximum
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="swap-amount"
                  placeholder="0.00"
                  value={swapAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    if (
                      value === "." ||
                      (value.match(/\./g) || []).length <= 1
                    ) {
                      setSwapAmount(value);
                    }
                  }}
                  className="font-mono bg-black/20 border-white/10 text-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-6 text-xs text-blue-400 hover:text-blue-300"
                  onClick={() =>
                    swapFromToken &&
                    setSwapAmount(swapFromToken.balance.toString())
                  }
                >
                  Max
                </Button>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-full p-2">
              <ArrowLeftRight className="h-4 w-4 text-blue-400" />
            </div>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label htmlFor="swap-to" className="text-white">
              To
            </Label>
            <Combobox
              options={tokenOptions.filter(
                (option) => option.value !== swapFromToken?.symbol
              )}
              value={swapToToken}
              onValueChange={setSwapToToken}
              placeholder="Select crypto"
              searchPlaceholder="Search cryptocurrencies..."
              disabled={pricesLoading}
              className="bg-black/40 border-white/10 text-white hover:bg-black/50 [&>span]:text-white hover:border-blue-400/50"
            />

            {swapEstimate && (
              <div className="bg-black/40 p-3 rounded-md border border-white/10">
                <div className="text-xs text-gray-400">Estimated amount</div>
                <div className="font-mono text-white text-lg">
                  {parseFloat(swapEstimate).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </div>

                {swapToToken && swapRate > 0 && (
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>1{" "}
                    {swapFromToken?.symbol.toUpperCase()} ={" "}
                    {swapRate.toFixed(6)} {swapToToken.toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator className="bg-white/10" />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-300">
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleExecuteSwap}
              disabled={
                !swapFromToken ||
                !swapToToken ||
                !swapAmount ||
                !swapEstimate ||
                swapRate === 0 ||
                isSubmitting ||
                parseFloat(swapAmount) > swapFromToken?.balance
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Swap
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
