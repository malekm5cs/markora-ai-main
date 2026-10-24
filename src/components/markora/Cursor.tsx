import { useEffect, useRef, useState } from "react";

type CursorState = { label: string; size: number };

export function Cursor() {
  const glow = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({ label: "", size: 64 });
  const [visible, setVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Check for touch device
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reducedMotion) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let magnet: HTMLElement | null = null;
    let lastLabel = "";

    const release = () => {
      if (magnet) {
        magnet.style.translate = "";
        magnet.style.transition = "translate 500ms cubic-bezier(.16,1,.3,1)";
      }
      magnet = null;
    };

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible((v) => v || true);

      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const label = el?.dataset["cursor"] ?? "";

      // Magnetic logic for buttons/links
      const mag = el && (el.tagName === "A" || el.tagName === "BUTTON") && el.offsetWidth < 200 ? el : null;

      if (mag !== magnet) release();

      if (mag) {
        magnet = mag;
        const r = mag.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.12;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.12;
        mag.style.transition = "translate 250ms cubic-bezier(.16,1,.3,1)";
        mag.style.translate = `${dx}px ${dy}px`;
      }

      if (label !== lastLabel) {
        lastLabel = label;
        setState({ label, size: label === "hover" ? 96 : label ? 120 : 64 });
      }
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    const tick = () => {
      // Smooth interpolation for the glow
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;

      if (glow.current) {
        glow.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.addEventListener("pointerleave", handleLeave);
    document.addEventListener("pointerenter", handleEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.removeEventListener("pointerleave", handleLeave);
      document.removeEventListener("pointerenter", handleEnter);
      release();
    };
  }, []);

  const hasLabel = state.label !== "" && state.label !== "hover";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 500ms ease" }}
    >
      <div
        ref={glow}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full"
        style={{
          width: state.size,
          height: state.size,
          transition:
            "width 420ms cubic-bezier(.16,1,.3,1), height 420ms cubic-bezier(.16,1,.3,1), background-color 300ms, scale 300ms cubic-bezier(.16,1,.3,1)",
          backgroundColor: hasLabel ? "var(--color-primary)" : "transparent",
          backgroundImage: hasLabel
            ? "none"
            : "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 40%, transparent) 0%, transparent 70%)",
          scale: isPressed ? 0.8 : 1,
        }}
      >
        {hasLabel && (
          <span
            className="meta !text-[9px] !text-primary-foreground whitespace-nowrap px-2"
            style={{
              opacity: isPressed ? 0.7 : 1,
              transition: "opacity 200ms",
            }}
          >
            {state.label}
          </span>
        )}
      </div>
    </div>
  );
}
