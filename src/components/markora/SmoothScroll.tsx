import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      wheelMultiplier: 0.2,
      lerp: 0.05,
      syncTouch: true,
      touchMultiplier: 0.6,
    });

    const scrollWindow = window as unknown as { lenis?: Lenis };
    scrollWindow.lenis = lenis;

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();

      if (scrollWindow.lenis === lenis) {
        delete scrollWindow.lenis;
      }
    };
  }, []);

  return <>{children}</>;
}