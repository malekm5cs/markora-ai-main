import { ArrowUp, ArrowUpRight, Instagram, Layers, Mail, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";
import logo from "@/assets/markora-logo.png";

const navItems = [
  { label: "Home", href: "#top", Icon: null },
  { label: "Work", href: "#work", Icon: Layers },
  { label: "Services", href: "#capabilities", Icon: Sparkles },
  { label: "About", href: "#about", Icon: Users },
  { label: "Contact", href: "#contact", Icon: Mail },
];

const socialItems = [
  { label: "Instagram", href: "https://instagram.com/markorauae" },
  { label: "Email", href: "mailto:info@mark-ora.com" },
  { label: "Phone", href: "tel:+971508564875" },
];

export function Footer() {
  const go = (href: string) => {
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) {
      window.open(href, "_blank");
      return;
    }
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: unknown) => void } }).lenis;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", href);
  };

  return (
    <footer className="relative border-t border-hairline bg-void px-6 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
            data-cursor="hover"
            aria-label="MarkOra home"
            className="inline-block"
          >
            <img src={logo} alt="MarkOra" className="h-7 w-auto md:h-8" />
          </a>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-dim">
            A creative technology studio where design, engineering and intelligence stop being
            separate disciplines.
          </p>
          <a
            href="https://instagram.com/markorauae"
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="mt-6 inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-primary"
            aria-label="MarkOra on Instagram"
          >
            <Instagram size={16} strokeWidth={1.6} />
            <span className="meta">@markorauae</span>
          </a>
        </div>

        <div>
          <span className="meta">Navigation</span>
          <nav className="mt-5 flex flex-col gap-3">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.href);
                }}
                data-cursor="hover"
                className="group flex items-center gap-2 text-sm text-ink/70 transition-colors hover:text-ink"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {item.Icon && <item.Icon size={14} strokeWidth={1.6} className="text-ink/40 transition-colors group-hover:text-primary" />}
                <span>{item.label}</span>
              </motion.a>
            ))}
          </nav>
        </div>

        <div>
          <span className="meta">Connect</span>
          <nav className="mt-5 flex flex-col gap-3">
            {socialItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                data-cursor="hover"
                className="group flex items-center gap-2 text-sm text-ink/70 transition-colors hover:text-ink"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <span>{item.label}</span>
                <ArrowUpRight size={12} strokeWidth={1.8} className="text-ink/40 transition-colors group-hover:text-primary" />
              </motion.a>
            ))}
          </nav>
        </div>

        <div>
          <span className="meta">Studio</span>
          <div className="mt-5 flex flex-col gap-3 text-sm text-ink/70">
            <span>Dubai, United Arab Emirates</span>
            <span>Sun — Thu · 9:00 — 18:00</span>
            <button
              type="button"
              onClick={() => go("#top")}
              data-cursor="hover"
              className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-hairline px-4 py-2 text-ink transition-colors hover:border-primary hover:text-primary"
            >
              <span className="meta">Back to top</span>
              <ArrowUp size={12} strokeWidth={1.8} className="transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="hairline-t mt-16 flex flex-col justify-between gap-4 pt-8 sm:flex-row">
        <span className="meta">MarkOra L.L.C — Smart Marketing, Real Results</span>
        <span className="meta">United Arab Emirates — English & Arabic</span>
        <span className="meta">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
