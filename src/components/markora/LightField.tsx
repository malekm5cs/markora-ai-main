import { useEffect, useRef } from "react";

type Props = { density?: number; className?: string; interactive?: boolean };

/**
 * Atmospheric point-light field. GPU-light 2D canvas, DPR-capped,
 * pauses when off-screen, disabled for prefers-reduced-motion.
 */
export function LightField({ density = 1, className, interactive = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const count = Math.round((mobile ? 40 : 110) * density);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.random() * 0.75,
      s: 0.2 + Math.random() * 0.9,
      v: (Math.random() - 0.5) * 0.00018,
    }));

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = e.clientY / window.innerHeight;
    };
    if (interactive && !mobile) window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let running = true;
    let t = 0;

    const draw = () => {
      t += 1;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        if (!reduced) p.y += p.v * p.z * 60;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;
        const px = (p.x + (pointer.x - 0.5) * 0.06 * p.z) * w;
        const py = (p.y + (pointer.y - 0.5) * 0.04 * p.z) * h;
        const twinkle = reduced ? 0.6 : 0.45 + 0.55 * Math.sin(t * 0.01 * p.z + p.x * 20);
        const r = p.s * (0.6 + p.z);
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.z > 0.88
            ? `rgba(34,211,238,${0.5 * twinkle})`
            : `rgba(255,255,255,${0.28 * twinkle * p.z})`;
        ctx.fill();
      }

      // Soft light source reacting to the pointer.
      const g = ctx.createRadialGradient(
        pointer.x * w,
        pointer.y * h,
        0,
        pointer.x * w,
        pointer.y * h,
        Math.max(w, h) * 0.45,
      );
      g.addColorStop(0, "rgba(34,211,238,0.10)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (running) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(([entry]) => {
      const on = !!entry?.isIntersecting;
      if (on && !running) {
        running = true;
        raf = requestAnimationFrame(draw);
      } else if (!on && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density, interactive]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
