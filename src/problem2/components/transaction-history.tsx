import { useState } from "react";
import { Button } from "./ui/button";
import { ClipboardList, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Transaction } from "@/hooks/use-transactions";
import HistoryType from "./bussiness/transaction/history-type";

interface TransactionHistoryProps {
  readonly transactions: Transaction[];
  readonly onClearTransactions: () => void;
}

export default function TransactionHistory({
  transactions,
  onClearTransactions,
}: TransactionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-white/80 hover:text-orange-400 hover:bg-orange-500/10"
        onClick={() => setIsOpen(true)}
      >
        <ClipboardList className="h-5 w-5 mr-1" />
        Transaction History
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black/90 border border-white/10 backdrop-blur-md text-white max-w-2xl w-full rounded-lg p-6 relative">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent">
                Transaction History
              </h3>
            </div>

            <button
              className="absolute right-4 top-4 rounded-full h-6 w-6 inline-flex items-center justify-center text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ClipboardList className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm mt-1">
                  Your swap history will appear here
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-[60vh] overflow-auto pr-1">
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-400">
                            {format(tx.date, "dd/MM/yyyy HH:mm:ss")}
                          </span>
                          <div className="bg-green-500/20 text-green-400 text-xs py-1 px-2 rounded-full">
                            Completed
                          </div>
                        </div>{" "}
                        <HistoryType tx={tx} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onClearTransactions}
                    className="bg-red-900/30 text-red-400 hover:bg-red-900/50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Clear History
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
