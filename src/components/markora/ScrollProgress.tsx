import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);
  const [pct, setPct] = useState(0);

  useEffect(() => scrollYProgress.on("change", (v) => setPct(Math.round(v * 100))), [scrollYProgress]);

  return (
    <>
      {/* top progress line */}
      <motion.div
        style={{ scaleX, opacity }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[99] h-px origin-left bg-gradient-to-r from-primary via-accent to-primary"
      />

      {/* side percentage readout */}
      <motion.div

        style={{ opacity }}
        className="pointer-events-none fixed bottom-8 right-6 z-[95] hidden items-center gap-3 md:flex"
      >
        <div className="relative h-24 w-px bg-ink/15">
          <motion.div
            className="absolute left-0 top-0 w-px origin-top bg-accent"
            style={{ height: "100%", scaleY: scaleX }}
          />
        </div>
        <span className="meta tabular-nums text-ink/50">
          {String(pct).padStart(3, "0")}
        </span>
      </motion.div>
    </>
  );
}
