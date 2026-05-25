import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  DollarSign,
  Send,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

// Mock Transaction Data
const initialTransactions = [
  {
    id: "txn_1",
    type: "deposit",
    amount: 150000,
    date: "2026-05-24",
    status: "completed",
    entity: "Stripe Payout",
  },
  {
    id: "txn_2",
    type: "transfer",
    amount: -25000,
    date: "2026-05-22",
    status: "completed",
    entity: "TechStart Inc. (Seed Funding)",
  },
  {
    id: "txn_3",
    type: "withdrawal",
    amount: -5000,
    date: "2026-05-20",
    status: "pending",
    entity: "JazzCash Wallet",
  },
  {
    id: "txn_4",
    type: "deposit",
    amount: 12000,
    date: "2026-05-18",
    status: "completed",
    entity: "SadaPay Account",
  },
  {
    id: "txn_5",
    type: "withdrawal",
    amount: -1500,
    date: "2026-05-15",
    status: "completed",
    entity: "EasyPaisa",
  },
];

export const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(130500);
  const [transactions, setTransactions] = useState(initialTransactions);

  // Modal States
  const [activeAction, setActiveAction] = useState<
    "none" | "deposit" | "withdraw" | "transfer"
  >("none");
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("stripe");
  const [dealTarget, setDealTarget] = useState("TechStart Inc.");

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    let newTxn = {
      id: `txn_${Date.now()}`,
      type: activeAction,
      amount: activeAction === "deposit" ? numAmount : -numAmount,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      entity:
        activeAction === "transfer"
          ? `${dealTarget} (Deal Funding)`
          : selectedMethod.toUpperCase(),
    };

    setTransactions([newTxn, ...transactions]);
    setBalance((prev) =>
      activeAction === "deposit" ? prev + numAmount : prev - numAmount,
    );

    // Reset and close
    setAmount("");
    setActiveAction("none");
    alert(
      `${activeAction.charAt(0).toUpperCase() + activeAction.slice(1)} of $${numAmount.toLocaleString()} successful!`,
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" size="sm">
            <CheckCircle size={12} className="mr-1 inline" /> Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" size="sm">
            <Clock size={12} className="mr-1 inline" /> Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="gray" size="sm">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Wallet & Payments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your funds, track deals, and review transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card (Stripe Style) */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border-none shadow-xl text-white">
            <CardBody className="p-8">
              <p className="text-gray-400 font-medium mb-1">
                Available Balance
              </p>
              <h2 className="text-4xl font-bold tracking-tight mb-8">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h2>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 border-none font-semibold"
                  onClick={() => setActiveAction("deposit")}
                >
                  <Plus size={18} className="mr-2" /> Add Funds
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                    onClick={() => setActiveAction("withdraw")}
                  >
                    <ArrowDownLeft size={18} className="mr-2" /> Withdraw
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 border-none"
                    onClick={() => setActiveAction("transfer")}
                  >
                    <Send size={18} className="mr-2" /> Fund Deal
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-full ${txn.type === "deposit" ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"}`}
                          >
                            {txn.type === "deposit" ? (
                              <ArrowDownLeft size={16} />
                            ) : (
                              <ArrowUpRight size={16} />
                            )}
                          </div>
                          <span className="capitalize font-medium text-gray-900 dark:text-gray-200">
                            {txn.type}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                        {txn.entity}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-500 text-sm">
                        {txn.date}
                      </td>
                      <td
                        className={`p-4 text-right font-semibold ${txn.amount > 0 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}
                      >
                        {txn.amount > 0 ? "+" : ""}
                        {txn.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td className="p-4">{getStatusBadge(txn.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Overlay Modal Mock */}
      {activeAction !== "none" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm rounded-xl">
          <Card className="w-full max-w-md shadow-2xl animate-fade-in border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {activeAction === "transfer"
                  ? "Fund a Deal"
                  : `${activeAction} Funds`}
              </h3>
              <button
                onClick={() => setActiveAction("none")}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
              >
                &times;
              </button>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleTransactionSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-medium dark:text-white"
                    />
                  </div>
                </div>

                {activeAction === "transfer" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Target Deal
                    </label>
                    <select
                      value={dealTarget}
                      onChange={(e) => setDealTarget(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                    >
                      <option>TechStart Inc.</option>
                      <option>GreenEnergy Solutions</option>
                      <option>HealthAI Dynamics</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Method
                    </label>
                    <select
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                    >
                      <option value="stripe">Credit Card (Stripe)</option>
                      <option value="bank">Wire Transfer</option>
                      <option value="jazzcash">JazzCash Wallet</option>
                      <option value="easypaisa">EasyPaisa</option>
                      <option value="sadapay">SadaPay Account</option>
                    </select>
                  </div>
                )}

                <Button type="submit" fullWidth className="py-3 mt-2 text-lg">
                  Confirm{" "}
                  {activeAction === "transfer"
                    ? "Funding"
                    : activeAction.charAt(0).toUpperCase() +
                      activeAction.slice(1)}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};
