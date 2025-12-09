import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function LandingFooter() {
  const footerLinks = {
    help: [
      { name: "Help Center", href: "/help" },
      { name: "Support", href: "/support" },
      { name: "FAQs", href: "/faqs" },
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Legal", href: "/legal" },
    ],
  };

  return (
    <footer className="bg-muted/20 backdrop-blur-xl border-t-2 border-primary/20 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <div className="relative w-60 h-32">
              <Image
                src="/zoku-logo.png"
                alt="Zoku"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered stock pattern recognition and real-time alerts for smarter trading decisions.
            </p>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Help & Support</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 flex items-center justify-center border border-primary/10"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 flex items-center justify-center border border-primary/10"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Zoku. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
