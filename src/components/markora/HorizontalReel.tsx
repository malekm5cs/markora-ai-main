import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const panels = [
  { index: "01", word: "Design", note: "Systems, identity and interface built as one language." },
  { index: "02", word: "Engineer", note: "Performance-first builds. Motion that never feels bolted on." },
  { index: "03", word: "Intelligence", note: "AI woven into the product, not stapled to the surface." },
  { index: "04", word: "Environments", note: "Not websites. Places people move through." },
];

function Panel({
  progress,
  i,
  data,
}: {
  progress: MotionValue<number>;
  i: number;
  data: (typeof panels)[number];
}) {
  const y = useTransform(progress, [i / 4, (i + 1) / 4], [60, -60]);
  const opacity = useTransform(
    progress,
    [(i - 0.7) / 4, i / 4, (i + 0.9) / 4, (i + 1.5) / 4],
    [0, 1, 1, 0.15],
  );
  const x = useTransform(progress, [i / 4, (i + 1) / 4], [80, -40]);
  const rotateY = useTransform(progress, [(i - 0.6) / 4, i / 4, (i + 1) / 4], [18, 0, -9]);
  const depth = useTransform(progress, [(i - 0.6) / 4, i / 4, (i + 1) / 4], [-180, 0, -100]);

  return (
    <article className="relative flex h-[100svh] w-screen shrink-0 flex-col justify-center border-r border-hairline px-6 md:px-14">
      <span className="meta absolute top-1/2 right-6 -translate-y-1/2 md:right-10">{data.index}</span>
      <motion.h3 className="display text-[16vw] leading-[0.84] md:text-[11vw]" style={{ y, opacity, rotateY, z: depth, transformStyle: "preserve-3d" }}>
        {data.word}
        <span className="text-primary">.</span>
      </motion.h3>
      <motion.p
        className="hairline-t mt-8 max-w-md pt-5 text-sm leading-relaxed text-ink-dim"
        style={{ x }}
      >
        {data.note}
      </motion.p>
    </article>
  );
}

/**
 * Pinned section that converts vertical scroll into horizontal travel,
 * Lando-style: sticky viewport, sideways panels, parallax per panel.
 */
export function HorizontalReel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const x = useTransform(eased, [0, 1], ["0%", "-75%"]);
  const skewX = useTransform(eased, [0, 0.5, 1], [0, -3, 0]);

  return (
    <section ref={ref} className="relative h-[420svh]" aria-label="Studio disciplines">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-24 md:px-10">
          <span className="meta">Scrolling sideways</span>
          <span className="meta">Keep going right →</span>
        </div>

        <motion.div style={{ x, skewX, perspective: 1200 }} className="flex w-[400vw] will-change-transform">
          {panels.map((p, i) => (
            <Panel key={p.word} progress={eased} i={i} data={p} />
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-hairline" />
      </div>
    </section>
  );
}
