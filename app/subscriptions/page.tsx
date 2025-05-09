import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SubscriptionsPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-paradisePink">Choose Your Subscription Plan</h1>
        <p className="mt-4 text-paradiseWhite">
          Get unlimited access to premium digital content with our flexible subscription plans.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
        {/* Basic Plan */}
        <div className="flex flex-col rounded-lg border border-paradiseGold bg-paradiseWhite p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-paradisePink">Basic</h3>
            <p className="text-sm text-paradiseGold">For casual browsers</p>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold text-paradisePink">$9.99</span>
            <span className="text-paradiseGold">/month</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm text-paradiseGold">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Access to standard content
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              10 downloads per month
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Standard resolution
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Personal use only
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Basic support
            </li>
          </ul>
          <div className="mt-auto space-y-3">
            <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">Subscribe Monthly</Button>
            <Button variant="outline" className="w-full border-paradiseGold text-paradisePink hover:bg-paradiseGold/10">$99.99/year (Save 17%)</Button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="relative flex flex-col rounded-lg border border-paradiseGold bg-paradiseWhite p-6 shadow-md">
          <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-paradisePink px-3 py-1 text-xs font-semibold text-paradiseWhite">
            Most Popular
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-paradisePink">Premium</h3>
            <p className="text-sm text-paradiseGold">For enthusiasts</p>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold text-paradisePink">$19.99</span>
            <span className="text-paradiseGold">/month</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm text-paradiseGold">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Access to premium content
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              50 downloads per month
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              High resolution
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Personal and small commercial use
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Priority support
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Early access to new content
            </li>
          </ul>
          <div className="mt-auto space-y-3">
            <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">Subscribe Monthly</Button>
            <Button variant="outline" className="w-full border-paradiseGold text-paradisePink hover:bg-paradiseGold/10">$199.99/year (Save 17%)</Button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="flex flex-col rounded-lg border border-paradiseGold bg-paradiseWhite p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-paradisePink">Pro</h3>
            <p className="text-sm text-paradiseGold">For professionals</p>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold text-paradisePink">$39.99</span>
            <span className="text-paradiseGold">/month</span>
          </div>
          <ul className="mb-6 space-y-2 text-sm text-paradiseGold">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Access to all content
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Unlimited downloads
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Maximum resolution
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Full commercial usage rights
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              24/7 priority support
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Exclusive content access
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-paradisePink" />
              Custom content requests
            </li>
          </ul>
          <div className="mt-auto space-y-3">
            <Button className="w-full bg-paradisePink hover:bg-paradiseGold text-paradiseWhite">Subscribe Monthly</Button>
            <Button variant="outline" className="w-full border-paradiseGold text-paradisePink hover:bg-paradiseGold/10">$399.99/year (Save 17%)</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-lg border border-paradiseGold bg-paradiseWhite p-6">
        <h2 className="text-xl font-bold text-paradisePink">Frequently Asked Questions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-paradisePink">Can I cancel my subscription anytime?</h3>
            <p className="mt-1 text-sm text-paradiseGold">
              Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing
              period.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-paradisePink">How do downloads work?</h3>
            <p className="mt-1 text-sm text-paradiseGold">
              Downloads are counted when you save content to your device. Unused downloads don't roll over to the next
              month.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-paradisePink">What payment methods do you accept?</h3>
            <p className="mt-1 text-sm text-paradiseGold">
              We accept all major credit cards, PayPal, and Apple Pay. All transactions are secure and encrypted.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-paradisePink">Can I upgrade my plan later?</h3>
            <p className="mt-1 text-sm text-paradiseGold">
              Yes, you can upgrade your plan at any time. The new rate will be prorated for the remainder of your
              billing cycle.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-paradiseGold">
            Have more questions?{" "}
            <Link href="/contact" className="text-paradisePink hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
