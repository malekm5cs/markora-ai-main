
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const progress = { v: 0 };

const chapters = [
  {
    n: "01",
    t: "Discover",
    d: "We map the problem until it becomes a shape.",
  },
  {
    n: "02",
    t: "Design",
    d: "Form follows feeling — systems, motion, voice.",
  },
  {
    n: "03",
    t: "Build",
    d: "Engineered for speed, scale and delight.",
  },
];

function Shapes({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const ico = useRef<THREE.Mesh>(null);
  const box = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const p = progress.v;
    const t = state.clock.elapsedTime;

    // Determine dominant chapter with smooth blending
    const w = [0, 1, 2].map((i) =>
      Math.max(0, 1 - Math.abs(p * 2 - i) * 1.4)
    );

    const meshes = [
      ico.current,
      knot.current,
      box.current,
    ];

    meshes.forEach((m, i) => {
      if (!m) return;

      const s = THREE.MathUtils.damp(
        m.scale.x,
        w[i]! * 1.15 + 0.0001,
        6,
        dt
      );

      m.scale.setScalar(s);

      m.rotation.x = t * 0.3 + p * Math.PI * 2;
      m.rotation.y = t * 0.4 + p * Math.PI * 3;
    });

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        state.pointer.x * 0.5,
        3,
        dt
      );

      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        -state.pointer.y * 0.3,
        3,
        dt
      );
    }

    if (ring.current) {
      ring.current.rotation.z =
        p * Math.PI * 4 + t * 0.1;

      ring.current.rotation.x =
        1.1 + Math.sin(p * Math.PI) * 0.5;
    }
  });

  const glass = (
    <MeshTransmissionMaterial
      thickness={0.6}
      roughness={0.05}
      transmission={1}
      ior={1.4}
      chromaticAberration={0.6}
      anisotropy={0.3}
      distortion={0.3}
      distortionScale={0.4}
      temporalDistortion={0.15}
      color={color}
      backside
      samples={6}
      resolution={512}
    />
  );

  return (
    <group ref={group}>
      <mesh ref={ico}>
        <icosahedronGeometry args={[1.3, 0]} />
        {glass}
      </mesh>

      <mesh ref={knot} scale={0}>
        <torusKnotGeometry args={[0.85, 0.3, 200, 32]} />
        {glass}
      </mesh>

      <mesh ref={box} scale={0}>
        <boxGeometry args={[1.6, 1.6, 1.6, 4, 4, 4]} />
        <meshStandardMaterial
          color={color}
          wireframe
        />
      </mesh>

      <group ref={ring}>
        {[2.2, 2.6, 3].map((r, i) => (
          <mesh
            key={r}
            rotation={[0, i * 0.4, 0]}
          >
            <torusGeometry args={[r, 0.006, 6, 200]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.35 - i * 0.08}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Chapter({
  i,
  p,
}: {
  i: number;
  p: MotionValue<number>;
}) {
  const c = chapters[i]!;
  const center = i / 2;

  const opacity = useTransform(
    p,
    [
      center - 0.3,
      center - 0.1,
      center + 0.1,
      center + 0.3,
    ],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    p,
    [center - 0.3, center + 0.3],
    [60, -60]
  );

  const blur = useTransform(
    p,
    [
      center - 0.3,
      center - 0.1,
      center + 0.1,
      center + 0.3,
    ],
    [10, 0, 0, 10]
  );

  const filter = useTransform(
    blur,
    (b) => `blur(${b}px)`
  );

  return (
    <motion.div
      style={{ opacity, y, filter }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <span className="meta mb-4 text-primary">
        Phase {c.n}
      </span>

      <h3 className="display text-[clamp(3rem,8vw,8rem)] leading-[0.9]">
        {c.t}
      </h3>

      <p className="mt-6 max-w-[28ch] text-ink-dim">
        {c.d}
      </p>
    </motion.div>
  );
}

export function ScrollMorph3D() {
  const ref = useRef<HTMLElement>(null);

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [color, setColor] = useState("");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
  });

  const bar = useTransform(
    p,
    [0, 1],
    ["0%", "100%"]
  );

  useMotionValueEvent(p, "change", (v) => {
    progress.v = v;
  });

  useEffect(() => {
    setMounted(true);

    const c = getComputedStyle(
      document.documentElement
    )
      .getPropertyValue("--brand-cyan")
      .trim();

    setColor(c || "#22d3ee");

    const io = new IntersectionObserver(
      ([e]) => {
        setActive(Boolean(e?.isIntersecting));
      },
      {
        rootMargin: "200px",
      }
    );

    if (ref.current) {
      io.observe(ref.current);
    }

    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[320svh] border-y border-hairline bg-void"
      aria-label="Our process"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">

        {/* 3D Animation */}
        <div className="absolute inset-0 md:left-[35%]">
          {mounted && color && (
            <Canvas
              frameloop={active ? "always" : "never"}
              dpr={[1, 1.5]}
              camera={{
                position: [0, 0, 6],
                fov: 45,
              }}
              gl={{
                alpha: true,
                antialias: true,
              }}
            >
              <ambientLight intensity={0.4} />

              <directionalLight
                position={[3, 4, 5]}
                intensity={2}
              />

              <Environment resolution={256}>
                <Lightformer
                  intensity={3}
                  position={[0, 4, 2]}
                  scale={[10, 2, 1]}
                />

                <Lightformer
                  intensity={2}
                  color={color}
                  position={[-5, 0, 2]}
                  scale={[2, 10, 1]}
                />

                <Lightformer
                  intensity={2}
                  position={[5, -1, 2]}
                  scale={[2, 6, 1]}
                />
              </Environment>

              <Shapes color={color} />
            </Canvas>
          )}
        </div>

        {/* Section Header */}
        <div className="pointer-events-none absolute inset-x-6 top-24 z-10 flex justify-between md:inset-x-10">
          <span className="meta">
            The process
          </span>

          <span className="meta">
            Scroll to transform
          </span>
        </div>

        {/* Chapter Text */}
        <div className="pointer-events-none relative z-10 mx-6 h-full md:mx-10 md:w-[45%]">
          {chapters.map((_, i) => (
            <Chapter
              key={i}
              i={i}
              p={p}
            />
          ))}
        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute inset-x-6 bottom-8 z-10 h-px bg-hairline md:inset-x-10">
          <motion.div
            style={{ width: bar }}
            className="h-full bg-primary"
          />
        </div>
      </div>
    </section>
  );
}
