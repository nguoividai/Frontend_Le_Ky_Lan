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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/helpers/format-currency";

import { cn } from "@/lib/utils";
import { RefreshCw, Trash2, Save, Upload, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface PortfolioSummaryProps {
  totalValue: number;
  walletDate: string;
  formattedDate: string;
  walletLength: number;
  transactionsLength: number;
  pricesLoading: boolean;
  refetch: () => void;
  exportWallet: () => string;
  importWallet: (data: string) => boolean;
  handleClearWallet: () => void;
}

export function PortfolioSummary({
  totalValue,
  walletDate,
  formattedDate,
  walletLength,
  transactionsLength,
  pricesLoading,
  refetch,
  exportWallet,
  importWallet,
  handleClearWallet,
}: PortfolioSummaryProps) {
  const [backupData, setBackupData] = useState("");
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState("");

  const handleImportWallet = () => {
    if (!importData) {
      setImportError("Please enter wallet data");
      return;
    }

    try {
      const success = importWallet(importData);
      if (success) {
        setImportData("");
        setImportError("");
      } else {
        setImportError("Invalid wallet data format");
      }
    } catch (error) {
      console.error("Import error:", error);
      setImportError("Failed to import wallet data");
    }
  };

  return (
    <Card className="w-full shadow-2xl backdrop-blur-xl bg-white/5 border border-white/10 relative overflow-hidden lg:col-span-3">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-blue-500/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/5 to-transparent pointer-events-none" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-bold text-white">
            Portfolio Summary
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-gray-400">
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
        </div>
        <CardDescription className="text-gray-300">
          Track your crypto assets and monitor their performance
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          {" "}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-gray-400 text-sm">Total Value</div>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(totalValue)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Last updated: {walletDate}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="bg-white/5 border min-w-[120px] border-white/10 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Assets</div>
                <div className="text-xl font-semibold text-white">
                  {walletLength}
                </div>
              </div>

              <div className="bg-white/5 border min-w-[120px] border-white/10 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Transactions</div>
                <div className="text-xl font-semibold text-white">
                  {transactionsLength}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Dialog>
                {" "}
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs min-w-[120px] bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    onClick={() => setBackupData(exportWallet())}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Backup
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Wallet Backup/Restore
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Backup your wallet data or restore from a previous backup
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="backup" className="text-white">
                        Wallet Backup Data
                      </Label>
                      <div className="relative">
                        <ScrollArea className="h-32">
                          <pre className="text-xs bg-black/40 p-2 rounded border border-white/10 overflow-auto">
                            {backupData}
                          </pre>
                        </ScrollArea>
                        <Button
                          variant="secondary"
                          className="absolute top-1 right-1 h-6 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(backupData);
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="restore" className="text-white">
                        Restore from Backup
                      </Label>
                      <Input
                        id="restore"
                        placeholder="Paste your backup data here"
                        value={importData}
                        onChange={(e) => {
                          setImportData(e.target.value);
                          setImportError("");
                        }}
                        className="bg-black/40 border-white/10 text-white"
                      />
                      <div className="mt-1"></div>
                      {importError && (
                        <div className="text-red-400 text-xs flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {importError}
                        </div>
                      )}
                      <Button
                        onClick={handleImportWallet}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Restore Wallet
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-white/5 min-w-[120px] border-white/10 text-red-300 hover:text-red-200 hover:bg-red-950/30"
                onClick={handleClearWallet}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
