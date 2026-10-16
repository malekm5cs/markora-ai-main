import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";
import logo from "@/assets/markora-logo.png";
import { AmbientParticles } from "./AmbientParticles";

type FaceKind = "logo" | "m" | "star";

const faces: { t: string; kind: FaceKind }[] = [
  { t: "translateZ(var(--half))", kind: "logo" },
  { t: "rotateY(180deg) translateZ(var(--half))", kind: "logo" },
  { t: "rotateY(90deg) translateZ(var(--half))", kind: "m" },
  { t: "rotateY(-90deg) translateZ(var(--half))", kind: "m" },
  { t: "rotateX(90deg) translateZ(var(--half))", kind: "star" },
  { t: "rotateX(-90deg) translateZ(var(--half))", kind: "star" },
];

function FaceContent({ kind }: { kind: FaceKind }) {
  if (kind === "logo") {
    return (
      <img
        src={logo}
        alt=""
        className="w-[68%] opacity-90"
        style={{ filter: "drop-shadow(0 0 14px rgba(34,211,238,0.5))" }}
      />
    );
  }
  if (kind === "m") {
    return (
      <span className="display text-outline-cyan text-[11vmin] leading-none select-none">M</span>
    );
  }
  return <span className="text-[4vmin] text-primary/60 select-none">✦</span>;
}

/** GPU-only CSS 3D object: a rotating wireframe cube carrying the MarkOra mark. */
export function Dimension3D() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [22, -22]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-30, 30]), { stiffness: 120, damping: 18 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      className="relative grid h-[320px] place-items-center overflow-hidden md:h-[420px]"
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ perspective: "1100px" }}
    >
      <AmbientParticles />
      <div className="pointer-events-none absolute h-[46vmin] w-[46vmin] rounded-full bg-primary/10 blur-[90px]" />

      <motion.div
        className="relative"
        style={{
          rotateX: rx,
          rotateY: ry,
          transformStyle: "preserve-3d",
          width: "clamp(140px, 22vmin, 240px)",
          height: "clamp(140px, 22vmin, 240px)",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", ["--half" as string]: "calc(clamp(140px, 22vmin, 240px) / 2)" }}
          animate={{ rotateY: 360, rotateX: 360 }}
          transition={{
            rotateY: { duration: 26, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 44, repeat: Infinity, ease: "linear" },
          }}
        >
          {faces.map((f) => (
            <div
              key={f.t}
              className="absolute inset-0 grid place-items-center border border-primary/35 bg-void/40"
              style={{ transform: f.t, boxShadow: "inset 0 0 40px rgba(34,211,238,0.12)" }}
            >
              <FaceContent kind={f.kind} />
            </div>
          ))}

          {/* inner counter-rotating core */}
          <motion.div
            className="absolute inset-[30%] border border-ink/25"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateZ: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </motion.div>

      <span className="meta pointer-events-none absolute bottom-0 left-0">Fig. 01 — The operating model</span>
      <span className="meta pointer-events-none absolute bottom-0 right-0">Move to rotate</span>
    </div>
  );
}
