'use client';
import React, { useState } from "react";

const mockTransactions = [
  { id: 1, date: "2024-06-01", type: "Payout", amount: 120.00, status: "Completed" },
  { id: 2, date: "2024-05-25", type: "Sale", amount: 50.00, status: "Completed" },
  { id: 3, date: "2024-05-20", type: "Sale", amount: 30.00, status: "Completed" },
  { id: 4, date: "2024-05-15", type: "Payout", amount: 100.00, status: "Completed" },
];

export default function PaymentsPage() {
  const [showUpdate, setShowUpdate] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-paradisePink mb-2 text-center">Payments & Revenue</h1>
        <p className="text-center text-paradiseBlack mb-6">Track your revenue and manage your payment methods. All payments are processed securely.</p>
        <div className="mb-8 flex flex-col items-center">
          <div className="text-lg font-semibold text-paradiseBlack">Total Revenue</div>
          <div className="text-4xl font-bold text-paradisePink">$300.00</div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-paradisePink mb-2">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border rounded-lg">
              <thead className="bg-paradisePink text-white">
                <tr>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Type</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map(tx => (
                  <tr key={tx.id} className="border-b last:border-b-0">
                    <td className="py-2 px-4 text-black">{tx.date}</td>
                    <td className="py-2 px-4 text-black">{tx.type}</td>
                    <td className="py-2 px-4 text-black">${tx.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 text-black">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="px-6 py-2 rounded bg-paradisePink text-white font-bold hover:bg-paradiseGold hover:text-paradiseBlack transition mb-2"
            onClick={() => setShowUpdate(!showUpdate)}
          >
            {showUpdate ? "Hide Payment Update" : "Update Payment Method"}
          </button>
          {showUpdate && (
            <div className="w-full bg-paradiseGold/20 rounded p-4 mt-2">
              <h3 className="font-bold text-paradisePink mb-2">Update Payment Method</h3>
              <p className="text-paradiseBlack mb-2 text-sm">To update your payment info, you will be redirected to our secure payment portal.</p>
              <button className="px-4 py-2 rounded bg-paradisePink text-white font-bold hover:bg-paradiseGold hover:text-paradiseBlack transition">
                Update Payment Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 