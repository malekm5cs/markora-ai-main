import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CaseStudy } from "./CaseStudy";
import { projects, type Project } from "./data";

export function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const [hover, setHover] = useState<Project | null>(null);

  useEffect(() => {
    const openProject = (event: Event) => {
      const project = projects.find((p) => p.index === (event as CustomEvent<string>).detail);
      if (project) setOpen(project);
    };
    window.addEventListener("markora-open-project", openProject);
    return () => window.removeEventListener("markora-open-project", openProject);
  }, []);

  return (
    <section id="work" className="relative border-t border-hairline py-24 md:py-36">
      <div className="mb-14 flex items-baseline justify-between px-6 md:px-10">
        <span className="meta">Chapter 04 — Selected Work</span>
        <span className="meta">{projects.length} environments</span>
      </div>

      {/* Desktop: floating preview follows the hovered index row. */}
      <div className="pointer-events-none fixed top-1/2 right-10 z-[5] hidden h-[38vh] w-[30vw] -translate-y-1/2 overflow-hidden lg:block">
        <AnimatePresence>
          {hover && (
            <motion.div
              key={hover.index}
              initial={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              {hover.video ? (
                <video
                  src={hover.video}
                  poster={hover.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img src={hover.image} alt="" className="h-full w-full object-cover" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10">
        {projects.map((p, i) => (
          <motion.button
            key={p.index}
            data-cursor="View →"
            onMouseEnter={() => setHover(p)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setOpen(p)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.9, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="quiet-row group block w-full border-b border-hairline text-left first:border-t"
          >
            <div className="flex items-center gap-5 px-6 py-6 transition-[padding] duration-500 group-hover:px-8 md:px-10 md:py-8 md:group-hover:px-14">
              <span className="meta w-8 shrink-0 transition-colors duration-300 group-hover:text-primary">{p.index}</span>
              <span className="display min-w-0 flex-1 truncate text-[8vw] leading-[0.95] transition-opacity duration-500 group-hover:opacity-100 lg:text-[4.6vw] lg:opacity-70">
                {p.title}
              </span>
              <span className="meta hidden shrink-0 md:block">{p.discipline}</span>
              <span className="meta hidden shrink-0 lg:block">{p.year}</span>
            </div>
            <div className="overflow-hidden px-6 pb-6 lg:hidden">
              {p.video ? (
                <video
                  src={p.video}
                  poster={p.image}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="none"
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  width={1600}
                  height={1000}
                  className="aspect-[16/10] w-full object-cover"
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && <CaseStudy project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
