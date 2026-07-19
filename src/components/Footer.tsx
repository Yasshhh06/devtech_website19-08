import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 pt-24 pb-12 border-t border-slate-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-1">
            <div className="text-2xl font-heading font-bold tracking-tight mb-4 text-slate-900">
              DevTech<span className="text-primary">.</span>
            </div>
            <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
              Your Vision. Our Tech. We build world-class enterprise solutions for forward-thinking brands globally.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/devtech-it-solution" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-6">Services</h4>
            <ul className="flex flex-col gap-4 text-slate-500">
              <li><Link href="#services" className="hover:text-primary transition-colors">Website Development</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">Mobile App Development</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">UI UX Design</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">Cyber Security</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">AI Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-slate-500">
              <li><Link href="#about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link href="#careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-6">Contact</h4>
            <ul className="flex flex-col gap-4 text-slate-500">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-slate-400" />
                <a href="mailto:info@devtechitsolution.com" className="hover:text-primary transition-colors">info@devtechitsolution.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-slate-400" />
                <a href="tel:+919326093960" className="hover:text-primary transition-colors">+91 9326093960</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-slate-400" />
                <span>Kalyan, Mumbai</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} DevTech IT Solution. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
