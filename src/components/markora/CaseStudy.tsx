import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Project } from "./data";
import { playWhoosh } from "./sound";

type Lenis = { stop: () => void; start: () => void };

export function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.12]);
  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);

  useEffect(() => {
    playWhoosh();
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
      window.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[75] bg-void"
      initial={{ clipPath: "inset(45% 0 45% 0)", opacity: 0 }}
      animate={{ clipPath: "inset(0% 0 0% 0)", opacity: 1 }}
      exit={{ clipPath: "inset(45% 0 45% 0)", opacity: 0 }}
      transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1] }}
    >
      {/* Close: bottom-centre pill, out of the way of the hero title. */}
      <motion.button
        data-cursor="hover"
        data-lenis-prevent
        onClick={onClose}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="meta fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-hairline bg-void/80 px-5 py-3 !text-ink backdrop-blur-md transition-colors hover:border-primary md:bottom-8"
      >
        <X size={13} strokeWidth={1.8} className="text-primary" />
        Close
      </motion.button>

      {/* Reading progress for the case study itself. */}
      <div className="pointer-events-none fixed top-0 left-0 z-20 h-px w-full bg-hairline">
        <motion.div className="h-px origin-left bg-primary" style={{ scaleX: scrollYProgress }} />
      </div>

      <div ref={scrollRef} data-lenis-prevent className="h-full w-full overflow-y-auto overscroll-contain">
        <div className="relative h-[70svh] w-full overflow-hidden">
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full"
          >
            <motion.div style={{ y: mediaY, scale: mediaScale }} className="h-full w-full">
              {project.video ? (
                <video
                  src={project.video}
                  poster={project.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  width={1600}
                  height={1000}
                  className="h-full w-full object-cover"
                />
              )}
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-void/40" />
          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="absolute bottom-8 left-6 md:left-10">
            <span className="meta">{project.index}</span>
            <h2 className="display mt-3 text-[11vw] leading-[0.88] md:text-[7vw]">{project.title}</h2>
          </motion.div>
        </div>

        <div className="grid gap-12 px-6 py-20 pb-32 md:grid-cols-2 md:px-10">
          {[
            ["The Idea", project.idea],
            ["The Direction", project.direction],
            ["The Experience", project.experience],
          ].map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ root: scrollRef, once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-hairline pt-5"
            >
              <h3 className="meta">{k}</h3>
              <p className="mt-4 text-xl leading-snug md:text-2xl">{v}</p>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-hairline pt-5"
          >
            <h3 className="meta">The Approach</h3>
            <ul className="mt-4 space-y-2">
              {project.approach.map((a, i) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ root: scrollRef, once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.07 }}
                  className="flex items-baseline gap-3 text-sm text-ink-dim"
                >
                  <span className="text-primary">—</span>
                  {a}
                </motion.li>
              ))}
            </ul>
            <p className="meta mt-10">
              {project.discipline} / {project.year}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
