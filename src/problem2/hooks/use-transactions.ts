import { useState, useEffect } from "react";

export type Transaction = {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  date: Date;
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const savedTransactions = localStorage.getItem("crypto-transactions");
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        // Convert string dates back to Date objects
        const transactionsWithDates = parsedTransactions.map((tx: any) => ({
          ...tx,
          date: new Date(tx.date),
        }));
        setTransactions(transactionsWithDates);
      } catch (error) {
        console.error("Failed to parse transactions from localStorage:", error);
      }
    }
  }, []);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date(),
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);

    // Save to localStorage
    try {
      localStorage.setItem(
        "crypto-transactions",
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.error("Failed to save transactions to localStorage:", error);
    }
  };

  // Clear all transactions
  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem("crypto-transactions");
  };

  return {
    transactions,
    addTransaction,
    clearTransactions,
  };
};
