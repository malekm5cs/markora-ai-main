import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ParticleMountain } from "./ParticleMountain";
import { playClick, playHover } from "./sound";

const lines = ["We build", "what comes", "next."];

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-void"
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <ParticleMountain className="h-full w-full" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(34,211,238,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_-10%,rgba(56,189,248,0.10),transparent_70%)]" />

      <motion.div
        style={{ y, opacity: fade }}
        className="relative flex flex-col items-center px-6 text-center md:px-10"
      >
        <motion.div
          className="mb-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <span className="h-px w-10 bg-primary" />
          <span className="meta">Creative Technology Studio — Est. Dubai</span>
          <span className="h-px w-10 bg-primary" />
        </motion.div>

        <h1 className="display text-[14vw] leading-[0.84] md:text-[9vw]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.02em]">
              <motion.span
                className="block"
                initial={{ y: "112%", filter: "blur(18px)", letterSpacing: "0.06em" }}
                animate={ready ? { y: "0%", filter: "blur(0px)", letterSpacing: "-0.045em" } : {}}
                transition={{ duration: 1.5, delay: 0.15 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
              >
                {i === 2 ? (
                  <>
                    next<span className="text-primary">.</span>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-8 max-w-md text-sm leading-relaxed text-ink-dim"
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.85, duration: 1 }}
        >
          MarkOra is a creative technology studio working where design, engineering and
          intelligence stop being separate disciplines.
        </motion.p>

        <motion.a
          href="#contact"
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          data-cursor="hover" className="premium-action group relative mt-10 inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-8 py-4 text-xs uppercase tracking-[0.28em] text-ink backdrop-blur-sm transition-colors hover:bg-primary/20"
          initial={{ opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.05, duration: 0.9 }}
          style={{ boxShadow: "0 0 40px -8px var(--color-primary)" }}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: "0 0 70px -4px var(--color-primary)" }} />
          Start a project
          <span className="h-px w-6 bg-primary transition-all duration-300 group-hover:w-10" />
        </motion.a>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.3, duration: 1 }}
      >
        <span className="meta">Scroll to enter</span>
        <motion.span
          className="block h-8 w-px bg-ink/40"
          animate={{ scaleY: [0.2, 1, 0.2] }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
