import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const first = ["The internet doesn't need", "another website."];
const second = ["It needs", "experiences."];

export function ExperienceIntro() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const breakProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const blur = useTransform(breakProgress, (v) => `blur(${v * 18}px)`);
  const opacityA = useTransform(scrollYProgress, [0.28, 0.48], [1, 0]);
  const yA = useTransform(scrollYProgress, [0.1, 0.5], [0, 260]);
  const opacityB = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);
  const yB = useTransform(scrollYProgress, [0.5, 1], [220, 60]);
  const scaleB = useTransform(scrollYProgress, [0.5, 0.9], [0.92, 1]);

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-6 md:px-10">
        <motion.h2
          style={{ opacity: opacityA, y: yA, filter: blur }}
          className="display absolute max-w-[92vw] text-[9vw] leading-[0.88] text-ink-dim"
        >
          {first.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </motion.h2>

        <motion.h2
          style={{ opacity: opacityB, y: yB, scale: scaleB }}
          className="display max-w-[92vw] text-[11vw] leading-[0.86]"
        >
          <span className="block">{second[0]}</span>
          <span className="block text-primary">{second[1]}</span>
        </motion.h2>

        <span className="meta absolute bottom-10 left-6 md:left-10">Chapter 01 — Position</span>
      </div>
    </section>
  );
}
