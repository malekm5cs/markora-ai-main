import { useEffect, useRef } from "react";

/**
 * Site-wide ambient layer: slow floating glowing particles that drift upward
 * and parallax gently with the cursor. Sits behind all content (except the
 * hero, which has its own particle mountain).
 */
export function AmbientParticles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.min(150, Math.round((w * h) / 14000));
    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 1.9,
      s: 0.06 + Math.random() * 0.28,
      d: Math.random() * Math.PI * 2,
      z: 0.3 + Math.random() * 0.7,
      tw: Math.random() * Math.PI * 2,
      // wandering: each particle traces its own slow lissajous orbit
      wa: Math.random() * Math.PI * 2,
      wb: Math.random() * Math.PI * 2,
      wsa: 0.09 + Math.random() * 0.22,
      wsb: 0.07 + Math.random() * 0.19,
      wrx: 10 + Math.random() * 40,
      wry: 8 + Math.random() * 30,
      br: Math.random() * Math.PI * 2,
      // spring offsets driven by the cursor, settle back to zero
      ax: 0,
      ay: 0,
      vx: 0,
      vy: 0,
    }));

    let mx = 0;
    let my = 0;
    let px = 0;
    let py = 0;
    // cursor position in canvas space (-1 when absent)
    let cxPos = -9999;
    let cyPos = -9999;
    let cursorOn = 0;
    let rippleT = 999;
    let rippleX = 0;
    let rippleY = 0;
    const move = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      const rect = canvas.getBoundingClientRect();
      cxPos = e.clientX - rect.left;
      cyPos = e.clientY - rect.top;
      cursorOn = cxPos >= -80 && cxPos <= w + 80 && cyPos >= -80 && cyPos <= h + 80 ? 1 : 0;
    };
    const down = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      rippleX = e.clientX - rect.left;
      rippleY = e.clientY - rect.top;
      rippleT = 0;
    };

    let raf = 0;
    let t = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      t += 0.016;
      if (rippleT < 2) rippleT += 0.016;
      px += (mx - px) * 0.04;
      py += (my - py) * 0.04;
      ctx.clearRect(0, 0, w, h);

      // global breath: whole field slowly inhales and exhales together
      const breath = 0.5 + 0.5 * Math.sin(t * 0.32);
      const breathScale = 0.78 + breath * 0.55;

      for (const p of parts) {
        if (!reduced) {
          p.y -= p.s * (0.55 + breath * 0.9);
          p.x += Math.sin(t * 0.4 + p.d) * 0.18;
          p.tw += 0.012;
          p.wa += p.wsa * 0.016;
          p.wb += p.wsb * 0.016;
          p.br += 0.01;
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
        }
        // wander offset (own orbit) + breath expansion away from centre
        const wx = Math.sin(p.wa) * p.wrx * p.z;
        const wy = Math.cos(p.wb) * p.wry * p.z;
        const cx = (p.x - w / 2) * 0.05 * (breath - 0.5) * p.z;
        const cy = (p.y - h / 2) * 0.05 * (breath - 0.5) * p.z;

        // cursor attraction + ripple, resolved as a spring that settles home
        let fx = 0;
        let fy = 0;
        let excite = 0;
        if (!reduced) {
          const dx = cxPos - (p.x + wx);
          const dy = cyPos - (p.y + wy);
          const dist = Math.hypot(dx, dy) || 1;
          const R = 260;
          if (cursorOn && dist < R) {
            const fall = 1 - dist / R;
            const pull = fall * fall * 34 * (0.5 + p.z);
            fx += (dx / dist) * pull;
            fy += (dy / dist) * pull;
            // tangential swirl so they orbit the cursor rather than collapse
            fx += (-dy / dist) * fall * 16 * p.z;
            fy += (dx / dist) * fall * 16 * p.z;
            excite = Math.max(excite, fall);
          }
          if (rippleT < 1.6) {
            const rd = Math.hypot(p.x - rippleX, p.y - rippleY) || 1;
            const front = rippleT * 620;
            const band = Math.exp(-Math.pow((rd - front) / 90, 2)) * (1 - rippleT / 1.6);
            const push = band * 46 * (0.5 + p.z);
            fx += ((p.x - rippleX) / rd) * push;
            fy += ((p.y - rippleY) / rd) * push;
            excite = Math.max(excite, band);
          }
        }
        // critically-damped-ish spring back to the natural orbit
        p.vx += (fx - p.ax) * 0.14 - p.vx * 0.16;
        p.vy += (fy - p.ay) * 0.14 - p.vy * 0.16;
        p.ax += p.vx;
        p.ay += p.vy;

        const ox = -px * 26 * p.z + wx + cx + p.ax;
        const oy = -py * 18 * p.z + wy + cy + p.ay;
        const alpha =
          (0.16 + 0.2 * (0.5 + 0.5 * Math.sin(p.tw))) * p.z * (0.65 + breath * 0.7) *
          (0.7 + 0.3 * (0.5 + 0.5 * Math.sin(p.br))) * (1 + excite * 1.9);
        const r = p.r * (0.7 + p.z * 0.6) * breathScale * (1 + excite * 0.7);

        const g = ctx.createRadialGradient(p.x + ox, p.y + oy, 0, p.x + ox, p.y + oy, r * 6);
        g.addColorStop(0, `hsla(206, 90%, 74%, ${alpha})`);
        g.addColorStop(1, "hsla(206, 90%, 60%, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(200, 100%, 88%, ${Math.min(1, alpha * 2.2)})`;
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, r * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(render);

    const leave = () => {
      cursorOn = 0;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
