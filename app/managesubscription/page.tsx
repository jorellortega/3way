"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, AlertCircle } from "lucide-react";

const currentPlan = {
  name: "Premium Plan",
  price: 15.00,
  renewalDate: "November 15, 2025",
};

const billingHistory = [
  { date: "October 15, 2024", amount: 15.00, status: "Paid", invoiceId: "INV-20241015" },
  { date: "September 15, 2024", amount: 15.00, status: "Paid", invoiceId: "INV-20240915" },
  { date: "August 15, 2024", amount: 15.00, status: "Paid", invoiceId: "INV-20240815" },
  { date: "July 15, 2024", amount: 15.00, status: "Paid", invoiceId: "INV-20240715" },
];

export default function ManageSubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Manage Your Subscription</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          View your current plan, billing history, and manage your subscription details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                  <p className="text-gray-500">Renews on {currentPlan.renewalDate}</p>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <p className="text-2xl font-bold">${currentPlan.price.toFixed(2)}<span className="text-base font-normal text-gray-500">/month</span></p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button>Change Plan</Button>
                <Button variant="outline">Update Payment Method</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((item) => (
                    <TableRow key={item.invoiceId}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell><Badge variant={item.status === 'Paid' ? 'default' : 'destructive'}>{item.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="flex flex-row items-center gap-2">
               <AlertCircle className="h-5 w-5 text-red-600" />
               <CardTitle className="text-red-800">Cancel Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-red-700">
                If you cancel your subscription, you will lose access to all premium content and features at the end of your current billing cycle. This action cannot be undone.
              </CardDescription>
              <Button variant="destructive" className="w-full mt-4">
                I want to cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 