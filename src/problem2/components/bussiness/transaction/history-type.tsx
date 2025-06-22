import { Flame, Plus } from "lucide-react"; // Assuming you're using lucide-react for icons
import { memo } from "react";

interface TransactionProps {
  readonly fromAmount: string | number;
  readonly fromToken: string;
  readonly toAmount?: string | number;
  readonly toToken: string;
}

function HistoryType({ tx }: { readonly tx: TransactionProps }) {
  if (tx.toToken === "burn") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="font-mono text-md">{tx.fromAmount}</div>
          <div className="text-sm text-orange-400">
            {tx.fromToken.toUpperCase()}
          </div>
        </div>
        <div className="bg-red-500/20 px-3 py-1 rounded-full flex items-center gap-1">
          <Flame className="h-3 w-3 text-red-400" />
          <span className="text-xs text-red-400">BURNED</span>
        </div>
      </div>
    );
  }

  if (tx.fromToken === "add") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="font-mono text-md">{tx.toAmount}</div>
          <div className="text-sm text-orange-400">
            {tx.toToken.toUpperCase()}
          </div>
        </div>
        <div className="bg-green-500/20 px-3 py-1 rounded-full flex items-center gap-1">
          <Plus className="h-3 w-3 text-green-400" />
          <span className="text-xs text-green-400">ADD</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
      <div>
        <div className="font-mono text-md">{tx.fromAmount}</div>
        <div className="text-sm text-orange-400">
          {tx.fromToken.toUpperCase()}
        </div>
      </div>
      <div className="text-gray-400">→</div>
      <div>
        <div className="font-mono text-md">{tx.toAmount}</div>
        <div className="text-sm text-blue-400">{tx.toToken.toUpperCase()}</div>
      </div>
    </div>
  );
}

export default memo(HistoryType);
