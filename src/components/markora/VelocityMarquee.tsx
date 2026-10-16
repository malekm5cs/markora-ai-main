import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface VelocityMarqueeProps {
  items: string[];
  variant?: "solid" | "ghost";
  className?: string;
}

/**
 * Lando-style marquee: always travels right, accelerates with scroll
 * velocity and skews against the scroll direction. Seamless 4-row loop.
 */
export function VelocityMarquee({ items, variant = "solid", className = "" }: VelocityMarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 380 });
  const boost = useTransform(smoothVelocity, (v) => Math.min(Math.abs(v) / 900, 4.5));
  const skewX = useTransform(smoothVelocity, [-1400, 0, 1400], [4.5, 0, -4.5]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    // Constant rightward drift, boosted by scroll speed (never reverses).
    const moveBy = 5.5 * (delta / 1000) * (1 + boost.get());
    baseX.set(baseX.get() + moveBy);
  });

  const wordClass =
    variant === "solid"
      ? "display px-6 text-[7.5vw] leading-none text-primary-foreground md:px-10 md:text-[4.6vw]"
      : "display text-outline px-6 text-[7.5vw] leading-none md:px-10 md:text-[4.6vw]";
  const starClass =
    variant === "solid"
      ? "text-[3vw] text-primary-foreground/60 md:text-[1.7vw]"
      : "text-[3vw] text-primary md:text-[1.7vw]";

  const strip = (
    <motion.div style={{ x, skewX }} className="flex w-max will-change-transform">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} aria-hidden={row > 0} className="flex w-max shrink-0 items-center">
          {items.map((item, i) => (
            <span key={`${row}-${i}`} className="flex items-center">
              <span className={wordClass}>{item}</span>
              <span className={starClass}>✦</span>
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  );

  if (variant === "solid") {
    // Slight tilt with bleed so the strip feels pasted onto the page, Lando-style.
    return (
      <section aria-label={items.join(" ")} className={`relative overflow-hidden py-12 ${className}`}>
        <div className="-ml-[2vw] w-[104vw] -rotate-1 bg-primary py-4 shadow-[0_0_60px_rgba(34,211,238,0.22)] md:py-5">
          {strip}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label={items.join(" ")}
      className={`relative overflow-hidden border-y border-hairline py-6 md:py-8 ${className}`}
    >
      {strip}
    </section>
  );
}
