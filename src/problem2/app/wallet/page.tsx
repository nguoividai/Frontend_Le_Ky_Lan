"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useTokens } from "@/hooks/use-tokens";
import { useTransactions } from "@/hooks/use-transactions";
import TechBackground from "@/components/tech-background";
import { Button } from "@/components/ui/button";
import TransactionHistory from "@/components/transaction-history";
import { Wallet, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

// Import the new components
import {
  PortfolioSummary,
  AssetList,
  AddToken,
  SwapDialog,
} from "@/components/bussiness/wallet";

export default function WalletPage() {
  const {
    wallet,
    totalValue,
    updateTokenBalance,
    removeToken,
    clearWallet,
    exportWallet,
    importWallet,
    lastUpdated: walletLastUpdated,
  } = useWallet();

  const {
    tokenOptions,
    tokens,
    refetch,
    isLoading: pricesLoading,
    lastUpdated,
  } = useTokens();

  const { transactions, addTransaction } = useTransactions();
  const isMobile = useIsMobile();

  // Swap state
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [swapFromToken, setSwapFromToken] = useState<any>(null);

  const formattedDate = lastUpdated
    ? format(new Date(lastUpdated), "dd/MM/yyyy HH:mm")
    : "N/A";

  const walletDate = walletLastUpdated
    ? format(walletLastUpdated, "dd/MM/yyyy HH:mm")
    : "N/A";

  // Handle wallet clear with confirmation
  const handleClearWallet = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your wallet? This cannot be undone."
      )
    ) {
      clearWallet();
    }
  };

  // Handle burning token with confirmation
  const handleBurnToken = (token: any) => {
    const tokenSymbol = token.symbol.toUpperCase();
    const tokenBalance = token.balance;
    const tokenValue = token.value;
    if (
      window.confirm(
        `Are you sure you want to burn ${tokenBalance} ${tokenSymbol} (worth $${tokenValue.toFixed(
          2
        )})? This action cannot be undone.`
      )
    ) {
      // Add to transaction history before removing the token
      addTransaction({
        fromToken: token.symbol,
        toToken: "burn",
        fromAmount: tokenBalance.toString(),
        toAmount: "0",
      });

      // Remove the token from wallet
      removeToken(token.symbol);

      // Success message
      alert(`Successfully burned ${tokenBalance} ${tokenSymbol}.`);
    }
  };

  // Handle opening swap dialog
  const handleOpenSwapDialog = (token: any) => {
    setSwapFromToken(token);
    setShowSwapDialog(true);
  };

  return (
    <>
      <TechBackground />
      <div className="min-h-screen p-4 flex flex-col relative z-10">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-orange-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent">
              Crypto Wallet
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white/80 hover:text-orange-400 hover:bg-orange-500/10"
            >
              <Link href="/">
                <ArrowLeftRight className="h-5 w-5 mr-1" />
                {isMobile ? "" : "Swap"}
              </Link>
            </Button>
            <TransactionHistory
              transactions={transactions}
              onClearTransactions={() => {}}
            />
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Summary Card */}
          <PortfolioSummary
            totalValue={totalValue}
            walletDate={walletDate}
            formattedDate={formattedDate}
            walletLength={wallet.length}
            transactionsLength={transactions.length}
            pricesLoading={pricesLoading}
            refetch={refetch}
            exportWallet={exportWallet}
            importWallet={importWallet}
            handleClearWallet={handleClearWallet}
          />

          {/* Assets List */}
          <AssetList
            wallet={wallet}
            handleOpenSwapDialog={handleOpenSwapDialog}
            handleBurnToken={handleBurnToken}
          />

          {/* Add Token Card */}
          <AddToken
            tokenOptions={tokenOptions}
            tokens={tokens}
            pricesLoading={pricesLoading}
            updateTokenBalance={updateTokenBalance}
            addTransaction={addTransaction}
            wallet={wallet}
          />
        </div>
      </div>

      {/* Swap Dialog */}
      <SwapDialog
        showSwapDialog={showSwapDialog}
        setShowSwapDialog={setShowSwapDialog}
        swapFromToken={swapFromToken}
        tokens={tokens}
        tokenOptions={tokenOptions}
        pricesLoading={pricesLoading}
        updateTokenBalance={updateTokenBalance}
        wallet={wallet}
        addTransaction={addTransaction}
      />
    </>
  );
}
