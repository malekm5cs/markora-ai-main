import { useEffect, useRef, useState } from "react";

type CursorState = { label: string; size: number };

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({ label: "", size: 28 });
  const [visible, setVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Check for touch device
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reducedMotion) return;

    // Hide native cursor
    document.documentElement.classList.add("custom-cursor-active");
    
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
        setState({ label, size: label === "hover" ? 48 : label ? 88 : 28 });
      }
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    const tick = () => {
      // Smooth interpolation for the ring
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;
      
      if (ring.current) {
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
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
      document.documentElement.classList.remove("custom-cursor-active");
      release();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 500ms ease" }}
    >
      {/* Outer Ring */}
      <div
        ref={ring}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-primary/60 shadow-[0_0_24px_var(--color-primary)]"
        style={{
          width: state.size,
          height: state.size,
          transition: "width 420ms cubic-bezier(.16,1,.3,1), height 420ms cubic-bezier(.16,1,.3,1), background-color 300ms, scale 300ms cubic-bezier(.16,1,.3,1)",
          backgroundColor: state.label && state.label !== "hover" ? "var(--color-primary)" : "transparent",
          scale: isPressed ? 0.8 : 1,
        }}
      >
        {state.label && state.label !== "hover" && (
          <span 
            className="meta !text-[9px] !text-primary-foreground whitespace-nowrap px-2"
            style={{ 
              opacity: isPressed ? 0.7 : 1,
              transition: "opacity 200ms"
            }}
          >
            {state.label}
          </span>
        )}
      </div>

      {/* Inner Dot */}
      <div 
        ref={dot} 
        className="fixed top-0 left-0 h-1 w-1 rounded-full bg-primary transition-transform duration-200"
        style={{
          scale: isPressed ? 4 : 1,
          opacity: isPressed ? 0.4 : 1,
        }}
      />
    </div>
  );
}
