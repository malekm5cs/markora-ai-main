import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Layers, Mail, Sparkles, Users, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import logo from "@/assets/markora-logo.png";
import { useSoundOn } from "./sound";
import { ThemeToggle } from "./ThemeToggle";

const items = [
  { label: "Work", href: "#work", Icon: Layers },
  { label: "Services", href: "#capabilities", Icon: Sparkles },
  { label: "About", href: "#about", Icon: Users },
  { label: "Contact", href: "#contact", Icon: Mail },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useSoundOn();
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const barOpacity = useTransform(scrollY, [0, 260], [1, 0]);
  const barBlur = useTransform(scrollY, [0, 260], ["blur(14px)", "blur(0px)"]);

  const go = (href: string) => {
    setActive(href);
    setOpen(false);
    const scroll = () => {
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      const headerHeight = headerRef.current?.clientHeight ?? 72;
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: unknown) => void } }).lenis;
      if (lenis) lenis.scrollTo(el, { offset: -(headerHeight + 12), duration: 1.6 });
      else el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", href);
    };
    requestAnimationFrame(scroll);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 z-[70] flex w-full items-center justify-between px-6 py-3 md:px-10"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 border-b border-hairline bg-void/85"
          style={{ opacity: barOpacity, backdropFilter: barBlur }}
        />
        <a
  href="#top"
  onClick={(event) => {
    event.preventDefault();
    go("#top");
  }}
  data-cursor="hover"
  className="block"
  aria-label="MarkOra home"
>
  <img src={logo} alt="MarkOra" className="h-13 w-auto md:h-16" />
</a>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 md:flex">
            {items.map((i) => {
              const isActive = active === i.href;
              return (
                <motion.a
                  key={i.label}
                  href={i.href}
                  data-cursor="hover"
                  onClick={(event) => {
                    event.preventDefault();
                    go(i.href);
                  }}
                  whileHover="hover"
                  whileTap={{ scale: 0.94 }}
                  animate={isActive ? "hover" : "rest"}
                  initial="rest"
                  className="meta group relative flex items-center gap-2 !text-ink/70 transition-colors hover:!text-ink"
                >
                  <motion.span
                    className="grid place-items-center"
                    variants={{
                      rest: { rotate: 0, scale: 1, opacity: 0.55 },
                      hover: { rotate: -12, scale: 1.25, opacity: 1 },
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 16 }}
                  >
                    <i.Icon size={13} strokeWidth={1.6} />
                  </motion.span>
                  <span className={isActive ? "!text-ink" : undefined}>{i.label}</span>
                  <motion.span
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left bg-primary"
                    style={{ boxShadow: "0 0 10px 1px rgba(34,211,238,0.6)" }}
                    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary"
                      style={{ boxShadow: "0 0 10px 2px rgba(34,211,238,0.7)" }}
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          <ThemeToggle />

          <motion.button
            data-cursor="hover"
            onClick={() => setSoundOn(!soundOn)}
            aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
            whileTap={{ scale: 0.9 }}
            className="meta hidden items-center gap-2 !text-ink/70 transition-colors hover:!text-ink md:flex"
          >
            <motion.span
              key={soundOn ? "on" : "off"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="grid place-items-center"
            >
              {soundOn ? (
                <Volume2 size={13} strokeWidth={1.6} className="text-primary" />
              ) : (
                <VolumeX size={13} strokeWidth={1.6} />
              )}
            </motion.span>
            Sound {soundOn ? "on" : "off"}
          </motion.button>

          <motion.button
            data-cursor="hover"
            onClick={() => go("#contact")}
            aria-label="Start a project"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            initial="rest"
            animate="rest"
            className="group relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-ink/40 transition-colors duration-500 hover:border-primary md:h-14 md:w-14"
          >
            <span className="absolute inset-0 rounded-full bg-primary/0 transition-all duration-500 group-hover:bg-primary/10 group-hover:blur-[2px]" />
            <motion.span
              className="absolute inset-[5px] rounded-full border border-dashed border-primary/25"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
            <span className="meta relative text-center !text-[7px] leading-[1.35] md:!text-[8px]">
              Start
              <br />
              project
            </span>
            <motion.span
              className="absolute right-2 top-2 text-primary"
              variants={{
                rest: { opacity: 0, x: -4, y: 4 },
                hover: { opacity: 1, x: 0, y: 0 },
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ArrowUpRight size={11} strokeWidth={1.8} />
            </motion.span>
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full border border-primary/0"
              variants={{
                rest: { scale: 1, borderColor: "rgba(34,211,238,0)" },
                hover: { scale: 1.12, borderColor: "rgba(34,211,238,0.4)" },
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.button>

          <button
            data-cursor="hover"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="meta !text-ink md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[65] flex flex-col justify-center bg-void px-6"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
          >
            {items.map((i, idx) => (
              <motion.a
                key={i.label}
                href={i.href}
                onClick={(event) => {
                  event.preventDefault();
                  go(i.href);
                }}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileTap={{ scale: 0.97, color: "var(--brand-cyan)" }}
                transition={{ delay: 0.25 + idx * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="display flex items-center justify-between border-b border-hairline py-5 text-left text-[13vw]"
              >
                {i.label}
                <motion.span
                  className="text-primary"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.2 }}
                >
                  <i.Icon size={20} strokeWidth={1.4} />
                </motion.span>
              </motion.a>
            ))}
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="meta mt-10 flex items-center gap-2 !text-ink/70"
              aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
            >
              {soundOn ? (
                <Volume2 size={13} strokeWidth={1.6} className="text-primary" />
              ) : (
                <VolumeX size={13} strokeWidth={1.6} />
              )}
              Sound {soundOn ? "on" : "off"}
            </button>
            <p className="meta mt-4">MarkOra — Creative Technology Studio</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
