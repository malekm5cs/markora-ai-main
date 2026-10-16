import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Dimension3D } from "./Dimension3D";

const lines = ["We bridge the gap", "between where a", "business is and where", "it could be digitally."];

const facts = [
  [
    "Practice",
    "A full-funnel marketing and development studio based in the UAE. Content, campaigns, websites and AI systems are handled inside one room — no hand-offs, no agencies of agencies, no diluted intent between the idea and the thing that ships.",
  ],
  [
    "Team",
    "Marketers, content creators, developers and digital strategists working fluently in English and Arabic. We speak to the Gulf the way the Gulf actually speaks — for founders launching their first venture and for regional brands defending market share.",
  ],
  [
    "Method",
    "No one-size-fits-all packages. We start at the number the client needs to move, work backwards through the funnel, and build only what earns its place. Every engagement is designed against a target, then measured against it out loud.",
  ],
  [
    "Vision",
    "To empower businesses across the UAE with strategies that turn content into real customer acquisition — attention that converts, not attention that flatters a dashboard.",
  ],
  [
    "Mission",
    "To become the most trusted, results-oriented digital partner in the Middle East, making world-class creative and engineering available to any size of business.",
  ],
  [
    "Standard",
    "Smart marketing, real results. If a detail does not move the number or the brand, it does not ship. Taste is a discipline here, not a mood.",
  ],
];

const pillars = [
  ["01", "Attention is earned", "Nobody owes your brand a second look. We design the first two seconds like the whole business depends on them — because it does."],
  ["02", "Craft compounds", "A sharper frame, a faster page, a cleaner line of copy. Small margins stacked relentlessly become an unfair advantage."],
  ["03", "Numbers keep score", "Creative that cannot be traced to pipeline is decoration. We ship work that survives a spreadsheet."],
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const factsY = useTransform(scrollYProgress, [0.4, 1], [70, -70]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative border-t border-hairline px-6 py-24 md:px-10 md:py-36"
    >
      <span className="meta">Chapter 06 — Studio</span>

      <h2 className="display mt-10 text-[8.5vw] leading-[0.9] md:text-[5.4vw]">
        {lines.map((l, i) => (
          <span key={l} className="block overflow-hidden pb-[0.02em]">
            <motion.span
              className={`block ${i === 3 ? "text-primary" : ""}`}
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1.1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {l}
            </motion.span>
          </span>
        ))}
      </h2>

      <motion.p
        className="mt-12 max-w-3xl text-lg leading-relaxed text-ink-dim md:text-xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        Most brands are not invisible because they are bad. They are invisible because they sound like everyone else.
        MarkOra exists to break that silence — with work sharp enough to stop a scroll, built on systems disciplined
        enough to keep the growth after the campaign ends.
      </motion.p>

      <div className="mt-20 grid items-center gap-14 md:grid-cols-2">
        <Dimension3D />
        <div className="space-y-8">
          {pillars.map(([n, t, d]) => (
            <motion.div
              key={n}
              className="detail-line border-t border-hairline pt-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="meta text-primary">{n}</span>
              <h3 className="display mt-3 text-2xl leading-none md:text-3xl">{t}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink-dim">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div style={{ y: factsY }} className="mt-20 grid gap-10 md:grid-cols-3">
        {facts.map(([k, v], i) => (
          <motion.div
            key={k}
            className="detail-line border-t border-hairline pt-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="meta">{k}</h3>
            <p className="mt-4 text-base leading-relaxed text-ink-dim">{v}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

