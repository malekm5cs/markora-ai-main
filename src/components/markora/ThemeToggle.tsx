import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";

function apply(t: Theme) {
  document.documentElement.classList.toggle("light", t === "light");
  document.documentElement.style.colorScheme = t;
  window.dispatchEvent(new CustomEvent("markora-theme", { detail: t }));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("markora-theme") as Theme | null;
    if (saved) { setTheme(saved); apply(saved); }
  }, []);

  useEffect(() => {
    const on = (e: Event) => {
      const t = (e as CustomEvent<Theme>).detail;
      if (t !== "light" && t !== "dark") return;
      setTheme(t);
      apply(t);
      localStorage.setItem("markora-theme", t);
    };
    window.addEventListener("markora-set-theme", on);
    return () => window.removeEventListener("markora-set-theme", on);
  }, []);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const x = e.clientX, y = e.clientY;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const commit = () => { flushSync(() => setTheme(next)); apply(next); localStorage.setItem("markora-theme", next); };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return commit();
    const vt = doc.startViewTransition(commit);
    vt.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`],
          filter: ["blur(12px) saturate(1.6)", "blur(0px) saturate(1)"],
        },
        { duration: 1100, easing: "cubic-bezier(.76,0,.24,1)", pseudoElement: "::view-transition-new(root)" },
      );
      document.documentElement.animate(
        { transform: ["scale(1)", "scale(0.96)"], filter: ["brightness(1)", "brightness(0.6)"] },
        { duration: 1100, easing: "cubic-bezier(.76,0,.24,1)", pseudoElement: "::view-transition-old(root)" },
      );
    });
  };

  return (
    <motion.button
      data-cursor="hover"
      onClick={toggle}
      whileTap={{ scale: 0.85, rotate: -20 }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-hairline text-ink/80 transition-colors hover:border-primary hover:text-primary"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="grid place-items-center"
        >
          {theme === "dark" ? <Moon size={14} strokeWidth={1.6} /> : <Sun size={14} strokeWidth={1.6} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/** Subscribe to the current theme (for canvases that need explicit colors). */
export function useTheme(): Theme {
  const [t, setT] = useState<Theme>("dark");
  useEffect(() => {
    setT(document.documentElement.classList.contains("light") ? "light" : "dark");
    const on = (e: Event) => setT((e as CustomEvent<Theme>).detail);
    window.addEventListener("markora-theme", on);
    return () => window.removeEventListener("markora-theme", on);
  }, []);
  return t;
}
