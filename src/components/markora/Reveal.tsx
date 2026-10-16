import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** "mask" clips the content upward, "blur" fades it in from a soft blur. */
  mode?: "mask" | "blur";
};

/**
 * Scroll-triggered reveal used across the page for a consistent
 * editorial entrance, Lando-style: content rises out of a clip mask.
 */
export function Reveal({ children, delay = 0, className = "", mode = "mask" }: Props) {
  if (mode === "blur") {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
