import { useEffect, useRef } from "react";

export function OraPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 1, height = 1, raf = 0, last = 0, visible = false;
    let hasPointer = false;
    const robot = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const trail: { x: number; y: number; a: number }[] = [];

    const theme = () => {
      const css = getComputedStyle(document.documentElement);
      return {
        blue: css.getPropertyValue("--ora-blue").trim(),
        ink: css.getPropertyValue("--ora-blue-ink").trim(),
        line: css.getPropertyValue("--hairline").trim(),
        surface: css.getPropertyValue("--card").trim(),
        accent: css.getPropertyValue("--primary").trim(),
        faint: css.getPropertyValue("--ink-faint").trim(),
      };
    };
    let colors = theme();

    const draw = (time: number) => {
      const dt = Math.min((time - last) / 1000 || 0, 0.05);
      last = time;

      // Smooth follow
      const dx = target.x - robot.x;
      const dy = target.y - robot.y;
      const ease = reduced ? 1 : Math.min(1, dt * 6);
      robot.x += dx * ease;
      robot.y += dy * ease;

      // Trail
      if (!reduced && hasPointer) {
        trail.push({ x: robot.x, y: robot.y, a: 1 });
        if (trail.length > 24) trail.shift();
        for (const p of trail) p.a *= 0.92;
      }

      ctx.clearRect(0, 0, width, height);

      // Dot grid
      ctx.fillStyle = colors.line;
      for (let x = 24; x < width; x += 32)
        for (let y = 24; y < height; y += 32) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }

      // Trail
      if (!reduced) {
        for (const p of trail) {
          ctx.fillStyle = colors.accent;
          ctx.globalAlpha = p.a * 0.25;
          ctx.beginPath();
          ctx.arc(p.x, p.y + 10, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Subtle tilt based on velocity
      const tilt = Math.max(-0.18, Math.min(0.18, dx * 0.004));
      const bob = reduced ? 0 : Math.sin(time / 600) * 2;

      ctx.save();
      ctx.translate(robot.x, robot.y + bob);
      ctx.rotate(tilt);

      // Shadow
      ctx.fillStyle = colors.line;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.ellipse(0, 36, 42, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Antenna
      ctx.strokeStyle = colors.blue;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -36);
      ctx.lineTo(0, -49);
      ctx.stroke();
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(0, -51, 4, 0, Math.PI * 2);
      ctx.fill();
      if (!reduced) {
        ctx.globalAlpha = 0.35 + Math.sin(time / 400) * 0.25;
        ctx.beginPath();
        ctx.arc(0, -51, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Arms
      ctx.fillStyle = colors.blue;
      ctx.beginPath();
      ctx.roundRect(-43, -12, 10, 23, 4);
      ctx.roundRect(33, -12, 10, 23, 4);
      ctx.fill();

      // Head/body
      ctx.beginPath();
      ctx.roundRect(-35, -33, 70, 60, 16);
      ctx.fill();

      // Face plate
      ctx.fillStyle = colors.surface;
      ctx.beginPath();
      ctx.roundRect(-28, -24, 56, 39, 10);
      ctx.fill();

      // Eyes track target
      const eyeX = Math.max(-3, Math.min(3, (target.x - robot.x) / 25));
      const eyeY = Math.max(-2, Math.min(2, (target.y - robot.y) / 25));
      ctx.fillStyle = colors.blue;
      const blink = !reduced && time % 4200 < 110;
      for (const x of [-12, 12]) {
        ctx.beginPath();
        ctx.roundRect(x - 4 + eyeX, -13 + eyeY, 8, blink ? 2 : 15, 4);
        ctx.fill();
      }

      // Mouth
      ctx.fillStyle = colors.ink;
      ctx.beginPath();
      ctx.roundRect(-9, 21, 18, 2, 1);
      ctx.fill();

      ctx.restore();

      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };

    const requestDraw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!hasPointer) {
        robot.x = width / 2;
        robot.y = height / 2;
        target.x = robot.x;
        target.y = robot.y;
      }
      requestDraw();
    };

    const position = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      return {
        x: Math.max(55, Math.min(width - 55, event.clientX - bounds.left)),
        y: Math.max(60, Math.min(height - 45, event.clientY - bounds.top)),
      };
    };
    const move = (event: PointerEvent) => {
      hasPointer = true;
      Object.assign(target, position(event));
      if (reduced) requestDraw();
    };
    const leave = () => {
      hasPointer = false;
      target.x = width / 2;
      target.y = height / 2;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      last = 0;
      if (visible) requestDraw();
      else cancelAnimationFrame(raf);
    });
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      colors = theme();
      requestDraw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section
      id="ora-play"
      aria-labelledby="ora-play-title"
      className="border-y border-hairline bg-void px-6 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="meta mb-4">Ora / Presence</p>
            <h2 id="ora-play-title" className="display text-4xl tracking-normal md:text-6xl">
              She follows your lead.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-dim">
            Move your cursor across the field. Ora tracks every motion — a small demonstration of attention, response, and craft.
          </p>
        </div>
        <div className="relative h-[360px] overflow-hidden border-y border-hairline md:h-[460px]">
          <canvas ref={canvasRef} className="h-full w-full touch-pan-y" aria-label="Ora follows your cursor" />
        </div>
      </div>
    </section>
  );
}
