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
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/helpers/format-currency";
import { ArrowLeftRight, Flame } from "lucide-react";
import { useState } from "react";

interface Asset {
  name: string;
  symbol: string;
  balance: number;
  value: number;
  price: number;
}

interface AssetListProps {
  wallet: Asset[];
  handleOpenSwapDialog: (asset: Asset) => void;
  handleBurnToken: (asset: Asset) => void;
}

export function AssetList({
  wallet,
  handleOpenSwapDialog,
  handleBurnToken,
}: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Card className="w-full shadow-2xl backdrop-blur-xl bg-white/5 border border-white/10 relative overflow-hidden lg:col-span-2">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/10 pointer-events-none" />

      <CardHeader className="relative">
        <CardTitle className="text-xl font-bold text-white">
          Your Assets
        </CardTitle>
        <CardDescription className="text-gray-300">
          Manage your cryptocurrency holdings
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        {/* Search input */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search coins by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white focus:bg-white/10 focus:border-orange-400/50"
          />
        </div>

        {wallet.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-2 opacity-50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <p>No assets yet</p>
            <p className="text-sm">Add tokens to your wallet to get started</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-4">
            {(() => {
              const filteredWallet = wallet.filter(
                (token) =>
                  token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (filteredWallet.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mb-2 opacity-50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <p>No matching assets found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {filteredWallet.map((token) => (
                    <div
                      key={token.symbol}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {/* Token Icon */}{" "}
                          <div className="relative">
                            {" "}
                            <img
                              src={`/tokens/${token.symbol.toUpperCase()}.svg`}
                              alt={token.symbol}
                              className="w-10 h-10 rounded-full"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget
                                  .nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                            <div
                              className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center absolute top-0 left-0"
                              style={{ display: "none" }}
                            >
                              {token.symbol.slice(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {token.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {token.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {/* Swap Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenSwapDialog(token)}
                            className="h-8 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border-blue-500/20"
                          >
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            Swap
                          </Button>{" "}
                          {/* Burn Button */}{" "}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBurnToken(token)}
                            className="h-8 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Flame className="h-3 w-3 mr-1" />
                            Burn
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-4 text-right">
                        <div>
                          <div className="text-sm text-gray-400">Amount</div>
                          <div className="font-mono text-white">
                            {token.balance.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Value</div>
                          <div className="font-mono text-white">
                            {formatCurrency(token.value)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                          1 {token.symbol.toUpperCase()} = $
                          {token.price.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
