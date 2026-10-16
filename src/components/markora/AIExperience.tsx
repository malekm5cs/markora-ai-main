import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type Reading = {
  hue: number;
  register: string;
  material: string;
  motion: string;
  statement: string;
  keywords: string[];
};

const lexicon: { match: RegExp; hue: number; register: string; material: string; motion: string }[] =
  [
    { match: /car|auto|motor|drive|speed|race/i, hue: 12, register: "Performance", material: "Lacquer, carbon, cold chrome", motion: "Acceleration curves, hard cuts" },
    { match: /food|chef|restaurant|coffee|taste|kitchen/i, hue: 38, register: "Ritual", material: "Ceramic, steam, low tungsten", motion: "Slow dissolves, held frames" },
    { match: /ai|intelligen|data|model|robot|software/i, hue: 250, register: "Systemic", material: "Glass, light, structured noise", motion: "Generative drift, precise snaps" },
    { match: /fashion|luxur|jewel|beauty|perfume/i, hue: 320, register: "Desire", material: "Silk, shadow, single highlight", motion: "Weightless glide, long holds" },
    { match: /energy|industr|construct|infra|engineer/i, hue: 200, register: "Monumental", material: "Steel, haze, distance", motion: "Camera-scale movement" },
    { match: /music|art|film|culture|gallery/i, hue: 285, register: "Expressive", material: "Grain, projection, ink", motion: "Rhythmic, edited to beat" },
  ];

function interpret(input: string): Reading {
  const hit = lexicon.find((l) => l.match.test(input));
  const words = input.trim().split(/\s+/).filter((w) => w.length > 3).slice(0, 3);
  const base = hit ?? {
    hue: 187,
    register: "Contemporary",
    material: "Near-black, white type, one light",
    motion: "Restrained, choreographed",
  };
  return {
    hue: base.hue,
    register: base.register,
    material: base.material,
    motion: base.motion,
    keywords: words.length ? words : ["ambition"],
    statement: `${base.register} is the entry point. We would build ${input.trim().replace(/\.$/, "")} as an environment rather than a page — a first frame that withholds, a second that commits, and a structure the visitor remembers after they close the tab.`,
  };
}

export function AIExperience() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const reading = useMemo(() => (submitted ? interpret(submitted) : null), [submitted]);

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setThinking(true);
    setSubmitted(null);
    setTimeout(() => {
      setSubmitted(value);
      setThinking(false);
    }, 1100);
  };

  return (
    <section
      className="relative overflow-hidden border-t border-hairline py-24 transition-colors duration-1000 md:py-36"
      style={{
        backgroundImage: reading
          ? `radial-gradient(90% 60% at 50% 0%, hsl(${reading.hue} 80% 45% / 0.16), transparent 70%)`
          : "radial-gradient(90% 60% at 50% 0%, hsl(187 82% 52% / 0.10), transparent 70%)",
      }}
    >
      <div className="px-6 md:px-10">
        <div className="mb-14 flex items-baseline justify-between">
          <span className="meta">Chapter 03 — Intelligence</span>
          <span className="meta">Local interpretation prototype</span>
        </div>

        <h2 className="display text-[11vw] leading-[0.88] md:text-[6.5vw]">
          What are you
          <br />
          building<span style={{ color: `hsl(${reading?.hue ?? 187} 90% 62%)` }}>?</span>
        </h2>

        <form onSubmit={run} className="mt-12 max-w-3xl">
          <div className="flex items-center gap-4 border-b border-ink/25 pb-4 focus-within:border-ink/70">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="A futuristic automotive brand."
              aria-label="What are you building?"
              className="w-full bg-transparent text-lg outline-none placeholder:text-ink-faint md:text-2xl"
            />
            <button data-cursor="hover" type="submit" className="meta !text-ink whitespace-nowrap">
              Interpret →
            </button>
          </div>
        </form>

        <div className="mt-12 min-h-[220px]">
          <AnimatePresence mode="wait">
            {thinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="meta"
              >
                Reading intent…
              </motion.div>
            )}
            {reading && !thinking && (
              <motion.div
                key={submitted}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-10 md:grid-cols-[1fr_1.4fr]"
              >
                <dl className="space-y-6">
                  {[
                    ["Register", reading.register],
                    ["Material", reading.material],
                    ["Motion", reading.motion],
                  ].map(([k, v]) => (
                    <div key={k} className="border-t border-hairline pt-3">
                      <dt className="meta">{k}</dt>
                      <dd className="mt-2 text-sm text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p
                  className="text-xl leading-snug text-ink md:text-3xl"
                  style={{ textShadow: `0 0 60px hsl(${reading.hue} 90% 55% / 0.35)` }}
                >
                  {reading.statement}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
