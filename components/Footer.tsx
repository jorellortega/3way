import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950/60 text-purple-200 border-t border-purple-800/40 mt-auto">
      <div className="container mx-auto px-4 py-6 md:px-6 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-purple-300">&copy; {new Date().getFullYear()} Paradise Baddies. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="/terms" className="text-sm hover:text-white transition-colors">
            Terms of Use
          </Link>
          <Link href="/privacy" className="text-sm hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
} 