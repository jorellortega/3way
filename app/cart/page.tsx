"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartContext } from "@/app/cart-context";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

export default function CartPage() {
  const { cart } = useContext(CartContext);
  const [supabase] = useState(() => createClientComponentClient<Database>());

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950 text-purple-100 min-h-screen">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <h1 className="text-3xl font-bold text-paradisePink mb-8">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center bg-gray-900/50 p-8 rounded-lg border border-purple-800/50">
            <h2 className="text-2xl font-semibold mb-4 text-purple-200">Your cart is empty.</h2>
            <p className="text-purple-300 mb-6">Looks like you haven't added any content yet.</p>
            <Link href="/browse">
              <Button className="bg-paradisePink hover:bg-paradiseGold text-white font-semibold">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/50 border border-purple-800/50">
                  <div className="w-24 h-24 relative rounded overflow-hidden bg-gray-800 flex-shrink-0">
                    {item.thumbnail_url ? (
                      <Image
                        src={supabase.storage.from('files').getPublicUrl(item.thumbnail_url).data.publicUrl || ''}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-300 text-xs">No Thumbnail</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-purple-300">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${item.price?.toFixed(2)}</p>
                    <button className="text-purple-400 hover:text-red-500 mt-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-purple-800/50 h-fit">
              <h2 className="text-2xl font-bold text-paradisePink mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-purple-200">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Taxes & Fees</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-purple-700 my-2"></div>
                <div className="flex justify-between font-bold text-white text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/payment/process">
                <Button className="w-full mt-6 bg-paradisePink hover:bg-paradiseGold text-white font-semibold">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 