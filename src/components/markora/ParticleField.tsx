import { useEffect, useRef } from "react";

type Props = { className?: string; density?: number };

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
  r: number;
  seed: number;
};

/**
 * Premium interactive particle field for the hero.
 * Dense drifting blue particles + cursor repulsion, a trailing light source
 * and proximity link lines. DPR-capped, pauses off-screen, respects
 * prefers-reduced-motion.
 */
export function ParticleField({ className, density = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const count = Math.round((mobile ? 90 : 260) * density);

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

    const pts: P[] = Array.from({ length: count }, () => {
      const z = 0.2 + Math.random() * 0.8;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22 * z,
        vy: (Math.random() - 0.5) * 0.22 * z,
        z,
        r: (0.4 + Math.random() * 1.5) * z,
        seed: Math.random() * 100,
      };
    });

    const pointer = { x: w / 2, y: h / 2, tx: w / 2, ty: h / 2, active: false };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.active = true;
    };
    if (!mobile) window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let running = true;
    let t = 0;
    const R = mobile ? 110 : 190;

    const draw = () => {
      t += 1;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      // Ambient cursor glow (soft blue light source that follows the pointer).
      const glow = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        Math.max(w, h) * 0.42,
      );
      glow.addColorStop(0, "rgba(34,211,238,0.14)");
      glow.addColorStop(0.35, "rgba(56,189,248,0.06)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";

      for (const p of pts) {
        if (!reduced) {
          // Gentle flow-field drift.
          const a = Math.sin((p.x + t * 0.6) * 0.0026) + Math.cos((p.y - t * 0.5) * 0.0031);
          p.vx += Math.cos(a * Math.PI) * 0.006 * p.z;
          p.vy += Math.sin(a * Math.PI) * 0.006 * p.z;

          // Cursor repulsion.
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * 1.5 * p.z;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }

          p.vx *= 0.955;
          p.vy *= 0.955;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }

        const twinkle = reduced ? 0.65 : 0.5 + 0.5 * Math.sin(t * 0.02 * p.z + p.seed);
        const near = 1 - Math.min(1, Math.hypot(p.x - pointer.x, p.y - pointer.y) / (R * 1.6));
        const rr = p.r * (1 + near * 1.1);

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr * 6);
        const alpha = (0.16 + 0.5 * near) * twinkle * p.z;
        g.addColorStop(0, `rgba(140,225,255,${alpha})`);
        g.addColorStop(0.4, `rgba(34,211,238,${alpha * 0.45})`);
        g.addColorStop(1, "rgba(34,211,238,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rr * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248,250,252,${(0.25 + 0.55 * near) * twinkle})`;
        ctx.fill();
      }

      // Constellation links only near the cursor — keeps it cheap and premium.
      if (!reduced && pointer.active) {
        const local = pts.filter(
          (p) => Math.abs(p.x - pointer.x) < R * 1.3 && Math.abs(p.y - pointer.y) < R * 1.3,
        );
        for (let i = 0; i < local.length; i++) {
          for (let j = i + 1; j < local.length; j++) {
            const a = local[i]!;
            const b = local[j]!;
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d > 96) continue;
            ctx.strokeStyle = `rgba(34,211,238,${0.16 * (1 - d / 96)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalCompositeOperation = "source-over";
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
  }, [density]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
