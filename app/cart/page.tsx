'use client';
import React, { useContext } from 'react';
import { CartContext } from '../cart-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cart } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-paradiseWhite bg-opacity-90 p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold text-paradisePink mb-6 text-center">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center text-paradiseBlack text-lg mb-8">Your cart is empty.</div>
        ) : (
          <>
            <ul className="divide-y divide-paradiseGold/30 mb-6">
              {cart.map((item, idx) => (
                <li key={item.id + '-' + idx} className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold text-paradiseBlack">{item.name}</div>
                    <div className="text-paradiseGold">${item.price.toFixed(2)}</div>
                  </div>
                  {/* Remove button placeholder for future logic */}
                  <Button variant="ghost" size="icon" className="text-paradisePink hover:text-paradiseGold">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-paradiseBlack">Total:</span>
              <span className="text-2xl font-bold text-paradisePink">${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite text-lg font-bold py-3">
                Proceed to Checkout
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
} 