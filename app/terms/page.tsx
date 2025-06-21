"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfUsePage() {
  return (
    <div className="bg-gradient-to-br from-gray-950 via-purple-950/80 to-gray-950 text-purple-100 min-h-screen">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
        <div className="mb-8">
          <Link href="/auth/signup" className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-400">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </Link>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-900/50 p-8 rounded-lg border border-purple-800/50">
          <h1 className="text-3xl font-bold text-paradisePink mb-2">Paradise Baddies – Terms of Use</h1>
          <p className="text-sm text-purple-400 mb-8">Effective Date: [Insert Date]</p>

          <div className="space-y-8 text-purple-200">
            <p>
              Welcome to Paradise Baddies (“Platform,” “we,” “us,” or “our”). These Terms of Use (“Terms”) govern your
              access to and use of www.paradisebaddies.com (“Website”) as a User or a Creator. By signing up, accessing, or
              using the Platform in any capacity, you agree to be legally bound by these Terms.
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">1. Eligibility</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>You must be 18 years or older and have the legal capacity to enter into a binding agreement.</li>
                <li>You must not be located in a country or region that is subject to embargo or trade sanctions.</li>
                <li>
                  AI content creators must be represented by a verified human user (owner/agent), who accepts full
                  responsibility for compliance.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">2. Account Types</h2>
              <h3 className="text-xl font-semibold text-purple-300 mb-2 mt-4">Users (Fans/Buyers)</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>May access free or paid content from Creators.</li>
                <li>May subscribe to Creators, purchase content, tip, or engage with content as permitted.</li>
                <li>Must not redistribute, download, record, or share any content without written permission.</li>
              </ul>
              <h3 className="text-xl font-semibold text-purple-300 mb-2 mt-4">Creators (Humans or AI-managed)</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Can upload, post, and monetize content (photos, videos, audio, written works, AI art, or AI video).</li>
                <li>Are solely responsible for the legality, ownership, and originality of the content they upload.</li>
                <li>AI-generated content must be clearly labeled as such when posted.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">3. AI Content Policy</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>We allow content created by or with the help of AI tools (e.g., images, voice, video, avatars).</li>
                <li>All AI content must not misrepresent real people without their consent.</li>
                <li>
                  Deepfakes or impersonations of celebrities, private individuals, or public figures are prohibited unless
                  clearly satirical and labeled appropriately.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">4. Payment and Payouts</h2>
              <h3 className="text-xl font-semibold text-purple-300 mb-2 mt-4">Users:</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>You agree to pay for any subscriptions, tips, or paid content as listed.</li>
                <li>All sales are final unless otherwise required by law.</li>
              </ul>
              <h3 className="text-xl font-semibold text-purple-300 mb-2 mt-4">Creators:</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  You retain ownership of your content but grant Paradise Baddies a limited license to host and distribute it
                  on the platform.
                </li>
                <li>You receive a percentage of earnings (specified in your Creator Dashboard).</li>
                <li>Payouts may be withheld if there are ongoing investigations, chargebacks, or legal concerns.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">5. Content Guidelines</h2>
              <p>You may not post or engage with content that:</p>
              <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
                <li>Involves minors or non-consensual activity</li>
                <li>Promotes hate, violence, terrorism, or illegal activities</li>
                <li>Contains doxxing, threats, or personal attacks</li>
                <li>Misuses copyrighted material or impersonates others</li>
              </ul>
              <p className="mt-4">We reserve the right to remove any content or suspend accounts that violate these terms.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">6. Account Termination</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>You may delete your account at any time.</li>
                <li>
                  We may suspend or terminate your account if you violate our terms, engage in fraud, or create legal risk
                  for the platform.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">7. Privacy & Data</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>We collect personal and payment data for account creation, verification, and transaction purposes.</li>
                <li>You agree to our <Link href="/privacy" className="text-paradiseGold hover:underline">Privacy Policy</Link>, which details how we use and protect your data.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">8. Dispute Resolution</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  Any disputes will be handled through binding arbitration or small claims court in [Insert State/Country].
                </li>
                <li>You waive class action rights by using this site.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">9. Modifications</h2>
              <p>
                We may update these Terms at any time. Continued use of the site after updates constitutes acceptance of the
                new terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">10. Contact</h2>
              <p>For questions or disputes, contact: <a href="mailto:support@paradisebaddies.com" className="text-paradiseGold hover:underline">support@paradisebaddies.com</a></p>
            </div>

            <div className="text-lg font-bold text-center text-paradisePink p-4 mt-8 border-2 border-dashed border-paradiseGold rounded-lg bg-paradiseGold/10">
              <p>🚨 By clicking “Sign Up,” you acknowledge that you've read, understood, and agree to these Terms of Use.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 