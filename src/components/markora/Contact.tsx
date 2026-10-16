import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AmbientParticles } from "./AmbientParticles";
import { LightField } from "./LightField";

const steps = [
  { key: "name", label: "Your name", placeholder: "Full name" },
  { key: "building", label: "What are you building?", placeholder: "A new automotive brand." },
  { key: "ambition", label: "What is the ambition?", placeholder: "Something people remember." },
  { key: "budget", label: "Budget range", placeholder: "$50k — $150k" },
  { key: "contact", label: "Contact information", placeholder: "Email or WhatsApp number" },
] as const;

export function Contact() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const current = steps[step]!;

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values[current.key]?.trim()) return;
    if (step === steps.length - 1) setDone(true);
    else setStep((s) => s + 1);
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-hairline">
      <LightField className="absolute inset-0 h-full w-full opacity-70" density={0.7} />
      <AmbientParticles />
      <div className="relative px-6 py-28 md:px-10 md:py-40">
        <span className="meta">Chapter 07 — Invitation</span>

        <h2 className="display mt-10 text-[12vw] leading-[0.86] md:text-[8vw]">
          <span className="block">Let's build</span>
          <span className="block">something</span>
          <span className="block text-primary">impossible.</span>
        </h2>

        <div className="mt-16 min-h-[190px] max-w-3xl">
          <AnimatePresence mode="wait">
            {!started && (
              <motion.button
                key="cta"
                data-cursor="hover"
                onClick={() => setStarted(true)}
                exit={{ opacity: 0, y: -20 }}
                className="premium-action group flex items-center gap-5 border-b border-ink/40 pb-4 transition-colors hover:border-primary"
              >
                <span className="text-2xl md:text-4xl">Start a project</span>
                <span className="text-2xl transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">
                  →
                </span>
              </motion.button>
            )}

            {started && !done && (
              <motion.form
                key={current.key}
                onSubmit={next}
                initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -26, filter: "blur(8px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="meta mb-6 flex gap-2">
                  {steps.map((s, i) => (
                    <span
                      key={s.key}
                      className={`h-px w-10 ${i <= step ? "bg-primary" : "bg-ink/25"}`}
                    />
                  ))}
                  <span className="ml-3">
                    {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                  </span>
                </div>
                <label className="block text-xl text-ink-dim md:text-2xl" htmlFor={current.key}>
                  {current.label}
                </label>
                <div className="mt-5 flex items-center gap-4 border-b border-ink/30 pb-4 focus-within:border-ink">
                  <input
                    id={current.key}
                    autoFocus
                    value={values[current.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [current.key]: e.target.value }))}
                    placeholder={current.placeholder}
                    className="w-full bg-transparent text-2xl outline-none placeholder:text-ink-faint md:text-4xl"
                  />
                  <button data-cursor="hover" type="submit" className="meta !text-ink">
                    {step === steps.length - 1 ? "Send →" : "Next →"}
                  </button>
                </div>
              </motion.form>
            )}

            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-2xl md:text-4xl">
                  Received, {values["name"]}. We'll answer with a point of view, not a template.
                </p>
                <p className="meta mt-6">Prototype submission — no data leaves this page.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hairline-t mt-28 grid gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Phone", "+971 50 856 4875", "tel:+971508564875"],
            ["Email", "info@mark-ora.com", "mailto:info@mark-ora.com"],
            ["Web", "www.mark-ora.com", "https://mark-ora.com"],
            ["Instagram", "@markorauae", "https://instagram.com/markorauae"],
          ].map(([k, v, href]) => (
            <div key={k as string}>
              <span className="meta">{k}</span>
              <a
                data-cursor="hover"
                href={href as string}
                className="detail-link mt-3 block text-lg text-ink transition-colors hover:text-primary md:text-xl"
              >
                {v}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
