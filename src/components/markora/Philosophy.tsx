import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const aOpacity = useTransform(scrollYProgress, [0.15, 0.45], [1, 0]);
  const aScale = useTransform(scrollYProgress, [0, 0.45], [1, 1.35]);
  const aBlur = useTransform(scrollYProgress, [0.2, 0.45], ["blur(0px)", "blur(24px)"]);
  const aSplitL = useTransform(scrollYProgress, [0.15, 0.45], ["0%", "-30%"]);
  const aSplitR = useTransform(scrollYProgress, [0.15, 0.45], ["0%", "30%"]);

  const bOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const bScale = useTransform(scrollYProgress, [0.5, 1], [0.8, 1]);
  const bBlur = useTransform(scrollYProgress, [0.5, 0.72], ["blur(20px)", "blur(0px)"]);
  const bX = useTransform(scrollYProgress, [0.5, 1], ["-6vw", "8vw"]);

  return (
    <section ref={ref} className="relative h-[300vh] border-t border-hairline">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: aOpacity, scale: aScale, filter: aBlur }}
          className="display absolute text-center text-[10vw] leading-[0.88]"
        >
          <motion.span style={{ x: aSplitL }} className="block">
            Good design
          </motion.span>
          <motion.span style={{ x: aSplitR }} className="block text-ink-dim">
            gets attention.
          </motion.span>
        </motion.div>

        <motion.div
          style={{ opacity: bOpacity, scale: bScale, x: bX, filter: bBlur }}
          className="display absolute text-center text-[11vw] leading-[0.86]"
        >
          <span className="block">Great experiences</span>
          <span className="block text-primary">stay with you.</span>
        </motion.div>

        <span className="meta absolute bottom-10 left-6 md:left-10">Chapter 05 — Philosophy</span>
      </div>
    </section>
  );
}
