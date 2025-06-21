"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-paradisePink mb-2">Paradise Baddies – Privacy Policy</h1>
          <p className="text-sm text-purple-400 mb-8">Effective Date: [Insert Date]</p>

          <div className="space-y-8 text-purple-200">
            <p>
              At Paradise Baddies, your privacy is important to us. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website www.paradisebaddies.com (“Website”),
              whether you are a User or a Creator.
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">1. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  <strong>Personal Identification:</strong> Name, email address, date of birth, payment information,
                  identification documents (for creators).
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, device ID, and usage statistics.
                </li>
                <li>
                  <strong>Content Data:</strong> Uploaded media, messages, comments, and metadata associated with content.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>To operate and maintain the Platform.</li>
                <li>To process transactions and payouts.</li>
                <li>To verify identity and prevent fraud.</li>
                <li>To communicate with you about your account and updates.</li>
                <li>To improve user experience and platform security.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">3. Sharing Your Information</h2>
              <p>We do not sell your personal information. We may share your data with:</p>
              <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
                <li>Payment processors for transactions and payouts.</li>
                <li>Verification partners for identity validation.</li>
                <li>Legal authorities when required by law or to protect our rights.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">4. Cookies and Tracking</h2>
              <p>
                We use cookies and tracking tools to enhance your experience, analyze usage, and provide targeted
                advertising. You can manage your preferences via your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">5. Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  <strong>Access:</strong> You can request access to your personal data.
                </li>
                <li>
                  <strong>Correction:</strong> You can request corrections to inaccurate data.
                </li>
                <li>
                  <strong>Deletion:</strong> You can request deletion of your account and associated data.
                </li>
                <li>
                  <strong>Objection:</strong> You can object to certain types of data processing.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">6. Data Retention</h2>
              <p>
                We retain your data as long as necessary to provide services and fulfill legal obligations. Upon account
                deletion, most data will be purged, except as required by law or for fraud prevention.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">7. Data Security</h2>
              <p>
                We implement security measures including encryption, firewalls, and access controls to protect your data.
                However, no system is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">8. Children's Privacy</h2>
              <p>Our platform is for adults only (18+). We do not knowingly collect data from children.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">9. International Users</h2>
              <p>
                By using our platform, you consent to your data being transferred and processed in the United States or
                other countries where we operate.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">10. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. Continued use of the platform after updates constitutes your
                acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-paradisePink mb-4">11. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, contact: 
                <a href="mailto:support@paradisebaddies.com" className="text-paradiseGold hover:underline ml-1">
                  support@paradisebaddies.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 