import { useEffect, useRef } from "react";

type Props = { className?: string };

/**
 * Interactive "mountain of particles" hero background.
 * Pure HTML5 Canvas 3D: a topographic grid of ~8k glowing particles projected
 * in perspective, slowly rotating, rippling away from the cursor.
 * Renders through a raw ImageData buffer (additive splats) so it holds 60fps.
 */
export function ParticleMountain({ className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

    // grid resolution -> particle count
    const COLS = mobile ? 90 : 130;
    const ROWS = mobile ? 55 : 70; // ~9100 particles on desktop
    const SPREAD = 2.1;

    let w = 0;
    let h = 0;
    let pw = 0;
    let ph = 0;
    let img: ImageData | null = null;
    let buf: Uint8ClampedArray | null = null;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      pw = Math.max(1, Math.floor(w * dpr));
      ph = Math.max(1, Math.floor(h * dpr));
      canvas.width = pw;
      canvas.height = ph;
      img = ctx.createImageData(pw, ph);
      buf = img.data;
    };
    resize();

    // static per-vertex data
    const n = COLS * ROWS;
    const gx = new Float32Array(n);
    const gz = new Float32Array(n);
    const base = new Float32Array(n);
    const tint = new Float32Array(n);

    const ridge = (x: number, z: number) => {
      // layered sines -> mountain range silhouette
      let v = 0;
      v += Math.sin(x * 1.15 + 0.6) * Math.cos(z * 0.85) * 0.55;
      v += Math.sin(x * 2.3 - z * 1.1) * 0.22;
      v += Math.cos(x * 4.1 + z * 2.7) * 0.09;
      v += Math.sin((x * x + z * z) * 0.9) * 0.07;
      const falloff = Math.exp(-(x * x) * 0.28) * 0.9 + 0.25;
      return v * falloff * 3.4;
    };

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        const x = (c / (COLS - 1) - 0.5) * SPREAD * 2;
        const z = (r / (ROWS - 1) - 0.5) * SPREAD * 2;
        gx[i] = x;
        gz[i] = z;
        base[i] = ridge(x, z);
        tint[i] = Math.random();
      }
    }

    // pointer
    let mx = 0.0;
    let mz = -99;
    let tmx = 0;
    let tmz = -99;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      tmx = nx * SPREAD * 2.4;
      tmz = ny * SPREAD * 2.4;
    };
    const onLeave = () => {
      tmz = -99;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver((entries) => (visible = entries[0]?.isIntersecting ?? true), {
      threshold: 0,
    });
    io.observe(canvas);

    // theme: light mode paints a cream field with dark slate-cyan particles
    let light = document.documentElement.classList.contains("light");
    const onTheme = (e: Event) => {
      light = (e as CustomEvent<string>).detail === "light";
    };
    window.addEventListener("markora-theme", onTheme);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let raf = 0;
    let t = 0;
    const start = performance.now();

    let idle = 1; // 1 = cursor away (slow ambient flow), 0 = cursor engaged
    let flow = 0; // time accumulator that runs slower when idle

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible || !img || !buf) return;

      const prev = t;
      t = (now - start) * 0.001;
      const dt = Math.min(0.05, Math.max(0, t - prev));

      const engaged = tmz > -50 ? 1 : 0;
      idle += (1 - engaged - idle) * 0.03;
      // slow, dreamy drift when untouched; livelier when the cursor is on it
      flow += dt * (0.34 + (1 - idle) * 0.9);

      mx += (tmx - mx) * 0.08;
      mz += (tmz - mz) * 0.08;

      // clear to theme background: deep midnight black, or pure white in light mode
      if (light) {
        for (let p = 0; p < buf.length; p += 4) {
          buf[p] = 255;
          buf[p + 1] = 255;
          buf[p + 2] = 255;
          buf[p + 3] = 255;
        }
      } else {
        buf.fill(0);
        for (let p = 3; p < buf.length; p += 4) buf[p] = 255;
      }

      const rot = reduced ? 0.4 : flow * 0.11;
      const cs = Math.cos(rot);
      const sn = Math.sin(rot);
      const tilt = 0.34;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const focal = ph * 1.5;
      const cxp = pw * 0.5;
      const cyp = ph * 0.55;
      const wave = reduced ? 0 : flow;
      // slow global "breath": the whole range swells and settles
      const breath = reduced
        ? 1
        : 1 +
          (Math.sin(flow * 0.42) * 0.3 + Math.sin(flow * 0.17 + 1.3) * 0.16) *
            (0.55 + idle * 0.85);
      const swell = reduced ? 0 : Math.sin(flow * 0.31) * (0.12 + idle * 0.22);

      for (let i = 0; i < n; i++) {
        const x0 = gx[i]!;
        const z0 = gz[i]!;

        // pointer ripple
        const dx = x0 - mx;
        const dz = z0 - mz;
        const d2 = dx * dx + dz * dz;
        const pull = Math.exp(-d2 * 1.5) * (1 - idle);
        const d = Math.sqrt(d2);

        let y =
          (base[i]! +
            // layered travelling swells: continuous flow even at rest
            Math.sin(wave * 0.9 + x0 * 1.4 + z0 * 1.1) * 0.2 +
            Math.sin(wave * 0.55 - x0 * 0.7 + z0 * 1.9) * 0.16 +
            Math.cos(wave * 0.33 + (x0 + z0) * 0.5) * (0.24 + idle * 0.16)) *
            breath +
          swell +
          pull * 0.85 * Math.cos(d * 5.0 - wave * 3.2);



        // rotate around Y
        const xr = x0 * cs - z0 * sn;
        const zr = x0 * sn + z0 * cs;

        // tilt around X
        const yr = y * ct - zr * st;
        const zz = y * st + zr * ct + 4.6;
        if (zz <= 0.3) continue;

        const k = focal / zz;
        const sx = (cxp + xr * k) | 0;
        const sy = (cyp - yr * k) | 0;
        if (sx < 1 || sy < 1 || sx >= pw - 1 || sy >= ph - 1) continue;

        // depth + height driven brightness
        const depth = Math.max(0, Math.min(1, (7.6 - zz) / 4.2));
        const lift = Math.max(0, Math.min(1, (y + 0.6) / 2.4));
        let a = (0.35 + depth * 1.15) * (0.3 + lift * 1.7) + pull * 0.8;
        if (a > 1) a = 1;

        // site palette: sky -> cyan (additive glow on dark, ink splats on light)
        const mixv = tint[i]! * 0.6 + lift * 0.4;
        const rC = (30 + 26 * (1 - mixv)) * a;
        const gC = (150 + 61 * mixv) * a;
        const bC = (240 + 8 * (1 - mixv)) * a;

        const idx = (sy * pw + sx) * 4;
        if (light) {
          // subtractive: darken the cream field toward deep slate-cyan
          const dR = (170 + 40 * mixv) * a;
          const dG = (120 + 60 * (1 - mixv)) * a;
          const dB = (90 + 30 * (1 - mixv)) * a;
          buf[idx] = Math.max(14, buf[idx]! - dR);
          buf[idx + 1] = Math.max(30, buf[idx + 1]! - dG);
          buf[idx + 2] = Math.max(48, buf[idx + 2]! - dB);

          const g = 0.55;
          const off = a > 0.55 ? [4, pw * 4, pw * 4 + 4] : [4, pw * 4];
          for (let o = 0; o < off.length; o++) {
            const j = idx + off[o]!;
            buf[j] = Math.max(14, buf[j]! - dR * g);
            buf[j + 1] = Math.max(30, buf[j + 1]! - dG * g);
            buf[j + 2] = Math.max(48, buf[j + 2]! - dB * g);
          }
        } else {
          buf[idx] = Math.min(255, buf[idx]! + rC);
          buf[idx + 1] = Math.min(255, buf[idx + 1]! + gC);
          buf[idx + 2] = Math.min(255, buf[idx + 2]! + bC);

          // 2x2 splat for near/bright particles -> glow
          if (true) {
            const g = 0.7;
            const off = a > 0.55
              ? [4, -4, pw * 4, -pw * 4, pw * 4 + 4, pw * 4 - 4]
              : [4, pw * 4, pw * 4 + 4];
            for (let o = 0; o < off.length; o++) {
              const j = idx + off[o]!;
              buf[j] = Math.min(255, buf[j]! + rC * g);
              buf[j + 1] = Math.min(255, buf[j + 1]! + gC * g);
              buf[j + 2] = Math.min(255, buf[j + 2]! + bC * g);
            }
          }
        }
      }

      ctx.putImageData(img, 0, 0);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("markora-theme", onTheme);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
