import { Globe, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[#0d1b16] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-primary-soft)] text-lg font-black text-[color:var(--color-primary)]">
                O
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">OSHUDH</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Health-first
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Your trusted source for medicines, wellness products, and clinical
              services across Bangladesh.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">
              Service links
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link
                  to="/category/medicines"
                  className="transition hover:text-white"
                >
                  Medicines
                </Link>
              </li>
              <li>
                <Link to="/lab-tests" className="transition hover:text-white">
                  Lab Tests
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="transition hover:text-white">
                  Doctor Consultation
                </Link>
              </li>
              <li>
                <Link
                  to="/upload-prescription"
                  className="transition hover:text-white"
                >
                  Upload Prescription
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/faq" className="transition hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="transition hover:text-white">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">
              Reach us
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-[color:var(--color-primary-soft)]" />
                +880 1700-000000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-[color:var(--color-primary-soft)]" />
                care@oshudh.example
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[color:var(--color-primary-soft)]" />
                Dhanmondi, Dhaka
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">© 2026 OSHUDH Healthcare.</p>
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-slate-700 p-2 transition hover:border-[color:var(--color-primary)] hover:text-white"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-slate-700 p-2 transition hover:border-[color:var(--color-primary)] hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-full border border-slate-700 p-2 transition hover:border-[color:var(--color-primary)] hover:text-white"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
