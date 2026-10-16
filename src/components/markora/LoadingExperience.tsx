import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/markora-logo.png";
import { playAscension, isSoundOn } from "@/components/markora/sound";


// Resets on every full page load / refresh, but persists across
// client-side navigations within the same page load.
let hasPlayedThisPageLoad = false;

export function LoadingExperience({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0); // 0 reveal · 1 hold · 2 exit · 3 done
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();
  const [skip] = useState(() => hasPlayedThisPageLoad);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    hasPlayedThisPageLoad = true;
  }, []);

  // Heavenly ascension pad during the intro. Autoplay may be blocked until the
  // first gesture, so we also arm it on the first pointer/key event.
  useEffect(() => {
    if (skip) return;
    let stop: (() => void) | null = null;
    let armed = false;
    const play = () => {
      if (armed || !isSoundOn()) return;
      armed = true;
      stop = playAscension(reduced ? 3.2 : 6.4) ?? null;
    };
    play();
    const arm = () => play();
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    window.addEventListener("pointermove", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("pointermove", arm);
      stop?.();
    };
  }, [skip, reduced]);

  useEffect(() => {
    if (skip) {
      onDoneRef.current();
      return;
    }
    if (reduced) {
      setCount(100);
      const r0 = setTimeout(() => setPhase(1), 900);
      const r1 = setTimeout(() => setPhase(2), 2600);
      const r2 = setTimeout(() => {
        setPhase(3);
        onDoneRef.current();
      }, 3400);
      return () => {
        clearTimeout(r0);
        clearTimeout(r1);
        clearTimeout(r2);
      };
    }
    const a = setTimeout(() => setPhase(1), 150);
    const b = setTimeout(() => setPhase(2), 5600);
    const c = setTimeout(() => {
      setPhase(3);
      onDoneRef.current();
    }, 6700);
    const start = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      const p = Math.min((t - start) / 5400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
      cancelAnimationFrame(raf);
    };
  }, [reduced, skip]);


  if (!mounted || skip || phase === 3) return null;

  if (reduced) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-void px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 2 ? 0 : 1 }}
          transition={{ duration: 0.7, ease: "linear" }}
        >
          <motion.img
            src={logo}
            alt="MarkOra"
            className="w-[72vw] max-w-[620px] md:w-[42vw]"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="mt-6 h-px w-[72vw] max-w-[620px] origin-center bg-accent/60 md:w-[42vw]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="meta mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            Smart Marketing — Real Results
          </motion.span>
        </motion.div>
      </AnimatePresence>
    );
  }


  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-void"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={{
            clipPath: phase === 2 ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)",
            scale: phase === 2 ? 1.04 : 1,
          }}
          transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1] }}
        >
          {/* exit light bar riding the curtain */}
          <motion.div
            className="pointer-events-none absolute left-0 h-[2px] w-full bg-accent"
            style={{ boxShadow: "0 0 40px 6px rgba(34,211,238,0.7)" }}
            initial={{ top: "100%", opacity: 0 }}
            animate={phase === 2 ? { top: "0%", opacity: [0, 1, 1] } : {}}
            transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1] }}
          />
          {/* expanding light rings */}
          {[0, 0.5, 1].map((d) => (
            <motion.div
              key={d}
              className="absolute rounded-full border border-accent/25"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: ["0vw", "70vw", "150vw"],
                height: ["0vw", "70vw", "150vw"],
                opacity: [0, 0.45, 0],
              }}
              transition={{
                duration: 4.6,
                delay: d,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.45, 1],
              }}
            />
          ))}

          {/* slow rotating orbital rings */}
          {[
            { s: "44vmin", dur: 26, dir: 1 },
            { s: "72vmin", dur: 40, dir: -1 },
          ].map((r) => (
            <motion.div
              key={r.s}
              className="absolute rounded-full border border-dashed border-ink/10"
              style={{ width: r.s, height: r.s }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: phase === 2 ? 0 : 1,
                scale: 1,
                rotate: 360 * r.dir,
              }}
              transition={{
                opacity: { duration: 1.2 },
                scale: { duration: 2, ease: [0.16, 1, 0.3, 1] },
                rotate: { duration: r.dur, repeat: Infinity, ease: "linear" },
              }}
            />
          ))}

          {/* corner brackets */}
          {[
            "left-6 top-6 border-l border-t md:left-10 md:top-10",
            "right-6 top-6 border-r border-t md:right-10 md:top-10",
            "left-6 bottom-6 border-l border-b md:left-10 md:bottom-10",
            "right-6 bottom-6 border-r border-b md:right-10 md:bottom-10",
          ].map((cls, i) => (
            <motion.div
              key={cls}
              className={`absolute h-10 w-10 border-accent/40 ${cls}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: phase === 2 ? 0 : 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}

          {/* vertical scan sweep */}
          <motion.div
            className="pointer-events-none absolute left-0 h-24 w-full bg-[linear-gradient(to_bottom,transparent,rgba(34,211,238,0.10),transparent)]"
            initial={{ top: "-20%" }}
            animate={{ top: ["-20%", "110%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
          />


          {/* horizon lines resolving out of darkness */}
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 h-px w-full bg-ink/10"
              style={{ top: `${18 + i * 11}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: phase >= 1 ? 1 : 0, opacity: phase === 2 ? 0 : 1 }}
              transition={{ duration: 1.4, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}

          <div className="relative flex flex-col items-center px-6">
            <div className="overflow-hidden">
              <motion.img
                src={logo}
                alt="MarkOra"
                className="w-[86vw] max-w-[820px] md:w-[52vw]"
                initial={{ y: "115%", filter: "blur(26px)", opacity: 0, scale: 1.12 }}
                animate={
                  phase >= 1
                    ? {
                        y: phase === 2 ? "-118%" : "0%",
                        filter: "blur(0px)",
                        opacity: 1,
                        scale: 1,
                      }
                    : {}
                }
                transition={{ duration: phase === 2 ? 0.9 : 2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <motion.div
              className="mt-6 h-px w-full origin-center bg-accent/60"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: phase >= 1 ? 1 : 0, opacity: phase === 2 ? 0 : 1 }}
              transition={{ duration: 1.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ boxShadow: "0 0 16px 1px rgba(34,211,238,0.5)" }}
            />
            <motion.span
              className="meta mt-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: phase === 1 ? 1 : 0, y: phase >= 1 ? 0 : 12 }}
              transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Smart Marketing — Real Results
            </motion.span>

            {/* staggered discipline ticker */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {["Strategy", "Content", "Performance", "Product", "AI"].map((w, i) => (
                <motion.span
                  key={w}
                  className="meta !text-[9px]"
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={
                    phase >= 1
                      ? { opacity: phase === 2 ? 0 : 1, y: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{ duration: 0.7, delay: 1.4 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                >
                  {w}
                </motion.span>
              ))}
            </div>
          </div>



          <div className="absolute bottom-8 left-0 flex w-full justify-between px-6 md:px-10">
            <span className="meta">Creative Technology Studio</span>
            <motion.span
              className="meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              Entering the experience
            </motion.span>
          </div>

          {/* loading counter */}
          <motion.div
            className="absolute right-6 top-8 flex items-baseline gap-2 md:right-10"
            animate={{ opacity: phase === 2 ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="display text-3xl tabular-nums leading-none">
              {String(count).padStart(3, "0")}
            </span>
            <span className="meta">%</span>
          </motion.div>

          {/* thin loading bar */}
          <div className="absolute inset-x-6 bottom-16 h-px bg-ink/10 md:inset-x-10">
            <div
              className="h-px origin-left bg-accent transition-transform duration-100 ease-linear"
              style={{ transform: `scaleX(${count / 100})`, boxShadow: "0 0 12px 1px rgba(34,211,238,0.6)" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
