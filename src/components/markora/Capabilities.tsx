import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { capabilities } from "./data";

export function Capabilities() {
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="capabilities" className="relative border-t border-hairline py-24 md:py-36">
      <div className="mb-14 flex items-baseline justify-between px-6 md:px-10">
        <span className="meta">Chapter 02 — Capabilities</span>
        <span className="meta">Eight disciplines / one practice</span>
      </div>

      <div className="relative">
        {capabilities.map((c, i) => {
          const dim = hover !== null && hover !== i;
          const open = active === i;
          return (
            <motion.div
              key={c.word}
              className="border-b border-hairline first:border-t"
              initial={{ opacity: 0, y: 44, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.85, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                data-cursor="hover"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setActive(open ? null : i)}
                className="quiet-row group flex w-full items-baseline gap-6 px-6 py-5 text-left md:px-10 md:py-7"
                aria-expanded={open}
              >
                <span className="meta w-10 shrink-0 transition-colors duration-300 group-hover:text-primary">{String(i + 1).padStart(2, "0")}</span>
                <motion.span
                  animate={{
                    opacity: dim ? 0.28 : 1,
                    x: hover === i ? 18 : 0,
                    filter: dim ? "blur(2px)" : "blur(0px)",
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="display min-w-0 flex-1 text-[11vw] leading-[0.9] md:text-[7vw]"
                >
                  {c.word}
                  <span className={open || hover === i ? "text-primary" : "text-ink-faint"}>.</span>
                </motion.span>
                <span className="meta hidden shrink-0 transition-transform duration-500 group-hover:-translate-x-2 sm:block">{c.line}</span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl px-6 pb-8 text-sm leading-relaxed text-ink-dim md:px-10 md:pl-[calc(2.5rem+2.5rem)] md:text-base">
                      {c.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
