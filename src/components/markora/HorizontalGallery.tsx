import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import { projects } from "./data";

function Card({
  progress,
  i,
  total,
  project,
}: {
  progress: MotionValue<number>;
  i: number;
  total: number;
  project: (typeof projects)[number];
}) {
  const start = i / total;
  const end = (i + 1) / total;
  const y = useTransform(progress, [start, end], [40, -40]);
  const scale = useTransform(progress, [start - 0.15, start, end], [0.94, 1, 0.97]);
  const imgX = useTransform(progress, [start - 0.2, end], ["-8%", "8%"]);
  const rotateY = useTransform(progress, [start - 0.18, start + 0.08, end], [9, 0, -7]);

  return (
    <motion.article
      style={{ y, scale, rotateY, transformStyle: "preserve-3d" }}
      data-cursor="Scroll →" className="on-dark-media group relative h-[62vh] w-[74vw] shrink-0 overflow-hidden border border-hairline md:h-[66vh] md:w-[42vw]"
    >
      <motion.img
        src={project.image}
        alt={project.title}
        loading="lazy"
        style={{ x: imgX }}
        className="absolute inset-0 h-full w-[118%] object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,15,25,0.92),rgba(11,15,25,0.15))]" />
      <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-center justify-between">
          <span className="meta">{project.index}</span>
          <span className="meta">{project.year}</span>
        </div>
        <div>
          <h3 className="display text-[7vw] leading-[0.9] md:text-[3.2vw]">{project.title}</h3>
          <p className="hairline-t mt-4 pt-4 text-sm text-ink-dim">{project.discipline}</p>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Second horizontal movement of the page: a sideways-travelling gallery
 * of work, with per-card parallax and image counter-drift.
 */
export function HorizontalGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const x = useTransform(eased, [0, 1], ["6vw", "-118vw"]);
  const rot = useTransform(eased, [0, 1], [1.2, -1.2]);
  const headX = useTransform(eased, [0, 1], ["0vw", "-24vw"]);

  return (
    <section ref={ref} className="relative h-[400svh]" aria-label="Work in motion">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div
          style={{ x: headX }}
          className="mb-8 flex items-baseline gap-6 px-6 will-change-transform md:px-10"
        >
          <span className="meta">Chapter 04.5 — In motion</span>
          <Reveal className="display text-[9vw] leading-none md:text-[4vw]">
            Sideways<span className="text-primary">.</span>
          </Reveal>
        </motion.div>

        <motion.div style={{ x, rotate: rot, perspective: 1400 }} className="flex gap-6 will-change-transform md:gap-10">
          {projects.map((p, i) => (
            <Card key={p.index} progress={eased} i={i} total={projects.length} project={p} />
          ))}
        </motion.div>

        <div className="mt-8 flex items-center justify-between px-6 md:px-10">
          <span className="meta">Scroll to travel right →</span>
          <div className="h-px w-32 bg-hairline">
            <motion.div className="h-px origin-left bg-primary/60" style={{ scaleX: eased }} />
          </div>
        </div>
      </div>
    </section>
  );
}
