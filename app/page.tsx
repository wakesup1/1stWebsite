"use client";

import { useState, useEffect } from "react";

// Type definitions for transaction data
type Transaction = {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  // State management for transactions and form inputs
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch transactions from database on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch all transactions from API
  const fetchTransactions = async () => {
    try {
      setFetching(true);
      const response = await fetch("/api/transactions");
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setFetching(false);
    }
  };

  // Calculate total income, expenses, and balance
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Handle adding a new transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category) return;

    setLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category,
          description,
          date: new Date(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh transactions list
        await fetchTransactions();
        
        // Reset form fields
        setAmount("");
        setCategory("");
        setDescription("");
      } else {
        alert("Failed to add transaction: " + data.error);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Refresh transactions list
        await fetchTransactions();
      } else {
        alert("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  // Format date to Thai locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            💰 Budget Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your income and expenses with cloud storage
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Balance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Balance
                </p>
                <p
                  className={`text-3xl font-bold ${
                    balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ฿{balance.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">💵</div>
            </div>
          </div>

          {/* Income Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100 mb-1">Total Income</p>
                <p className="text-3xl font-bold">
                  ฿{totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-100 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold">
                  ฿{totalExpense.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">📉</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Transaction Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Add Transaction
              </h2>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Type Selection */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      type === "income"
                        ? "bg-green-500 text-white shadow-lg scale-105"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      type === "expense"
                        ? "bg-red-500 text-white shadow-lg scale-105"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    Expense
                  </button>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (฿)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Category Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Food, Salary, Transport"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add notes..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Adding..." : "Add Transaction"}
                </button>
              </form>
            </div>
          </div>

          {/* Transaction List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Transaction History
              </h2>

              {fetching ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading transactions...
                  </p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No transactions yet. Add your first transaction!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                        transaction.type === "income"
                          ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                          : "bg-red-50 dark:bg-red-900/20 border-red-500"
                      } hover:shadow-md transition-all`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {transaction.type === "income" ? "💰" : "💸"}
                          </span>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {transaction.category}
                          </h3>
                        </div>
                        {transaction.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
                            {transaction.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500 ml-7 mt-1">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p
                          className={`text-xl font-bold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}฿
                          {transaction.amount.toLocaleString()}
                        </p>
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction._id)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                          title="Delete transaction"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
