import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Lightformer, Environment } from "@react-three/drei";
import { type MotionValue, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeToggle";

const COUNT = 8500;

const vertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  attribute vec3 aScatter;
  uniform float uTime;
  uniform float uForm;
  uniform vec2 uPointer;
  varying float vLight;
  void main() {
    float delay = fract(aPhase * 0.159) * 0.35;
    float f = smoothstep(delay, delay + 0.65, uForm);
    vec3 p = mix(aScatter, position, f);
    // spiral infall while forming
    float a = (1.0 - f) * 3.0;
    p.xy = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xy;
    float ripple = sin(aPhase * 4.0 + uTime * 0.48) * 0.095;
    p += normalize(p) * ripple;
    float d = distance(p.xy, uPointer * 2.7);
    vec2 pull = uPointer * 2.7 - p.xy;
    p.xy += pull * exp(-d * d * 0.9) * 0.35;
    p.z += exp(-d * d * 0.9) * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(9.0, aSize * (19.0 / -mv.z));
    vLight = 0.55 + 0.45 * sin(aPhase * 5.0 + uTime * 0.8);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vLight;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = 1.0 - smoothstep(0.03, 0.20, d);
    float glow = 1.0 - smoothstep(0.12, 0.5, d);
    float alpha = (core * 1.0 + glow * 0.36) * vLight;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function Sculpture({ color, reduced, light, formation }: { color: string; reduced: boolean; light: boolean; formation: MotionValue<number> }) {
  const points = useRef<THREE.Points>(null);
  const core = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    const scatter = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const radius = 1.55 + (Math.random() - 0.5) * 0.55;
      const tube = 0.62 + (Math.random() - 0.5) * 0.32;
      positions[i * 3] = (radius + tube * Math.cos(v)) * Math.cos(u);
      positions[i * 3 + 1] = (radius + tube * Math.cos(v)) * Math.sin(u);
      positions[i * 3 + 2] = tube * Math.sin(v) * 1.45;
      phases[i] = u + v;
      sizes[i] = 1.0 + Math.random() * 2.2;
      const r = 6 + Math.random() * 8, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      scatter[i * 3] = r * Math.sin(ph) * Math.cos(th);
      scatter[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      scatter[i * 3 + 2] = r * Math.cos(ph) * 0.5;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    result.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    result.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return result;
  }, []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uForm: { value: 0 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uColor: { value: new THREE.Color(color) },
    },
  }), []);

  useEffect(() => {
    material.uniforms['uColor']?.value.set(color);
    material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    material.needsUpdate = true;
  }, [color, material, light]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const form = material.uniforms['uForm'];
    if (form) form.value = reduced ? 1 : THREE.MathUtils.damp(form.value, formation.get(), 5, dt);
    if (!reduced) {
      const time = material.uniforms['uTime'];
      if (time) time.value += dt;
      if (points.current) {
        points.current.rotation.y += dt * 0.09;
        points.current.rotation.z += dt * 0.035;
      }
      if (core.current) {
        core.current.rotation.y -= dt * 0.11;
        core.current.rotation.x += dt * 0.05;
      }
      material.uniforms['uPointer']?.value.lerp(
        new THREE.Vector2(pointer.x * 2.5, pointer.y * 2.5),
        1 - Math.exp(-3 * dt),
      );
      state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, pointer.x * 0.35, 2, dt);
      state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, pointer.y * 0.25, 2, dt);
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <Environment>
        <Lightformer intensity={2} position={[0, 4, 2]} scale={[8, 2, 1]} />
        <Lightformer intensity={1.5} color={color} position={[-4, 0, 1]} scale={[2, 8, 1]} />
      </Environment>
      <points ref={points} geometry={geometry} material={material} frustumCulled={false} rotation={[0.55, 0, -0.25]} />
      <Float speed={reduced ? 0 : 0.6} rotationIntensity={reduced ? 0 : 0.15} floatIntensity={reduced ? 0 : 0.25}>
        <group ref={core} rotation={[0.45, -0.1, 0.25]}>
          <mesh>
            <torusGeometry args={[1.15, 0.012, 8, 180]} />
            <meshBasicMaterial color={color} transparent opacity={0.38} />
          </mesh>
          <mesh rotation={[0.6, 0.5, 0]}>
            <torusGeometry args={[1.72, 0.006, 6, 200]} />
            <meshBasicMaterial color={color} transparent opacity={0.18} />
          </mesh>
          <mesh rotation={[1.15, -0.35, 0]}>
            <torusGeometry args={[2.15, 0.003, 6, 200]} />
            <meshBasicMaterial color={color} transparent opacity={0.1} />
          </mesh>
        </group>
      </Float>
    </>
  );
}

export function OrbitalSculpture() {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [color, setColor] = useState("");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const eased = useSpring(scrollYProgress, { stiffness: 70, damping: 25 });
  const formation = useTransform(eased, [0, 0.12, 0.38, 0.78, 1], [0, 0, 1, 1, 0.25]);
  const sculptureY = useTransform(eased, [0, 0.5, 1], [120, 0, -120]);
  const sculptureScale = useTransform(eased, [0, 0.5, 1], [0.82, 1, 0.82]);
  const copyY = useTransform(eased, [0, 1], [80, -80]);
  const theme = useTheme();
  const wellX = useSpring(0, { stiffness: 120, damping: 20 });
  const wellY = useSpring(0, { stiffness: 120, damping: 20 });

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const cssColor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    if (cssColor) setColor(cssColor);
    const observer = new IntersectionObserver(([entry]) => setActive(Boolean(entry?.isIntersecting)), { rootMargin: "200px" });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); wellX.set(e.clientX - r.left); wellY.set(e.clientY - r.top - Math.max(0, -r.top)); }} className="relative h-[135svh] overflow-clip border-y border-hairline bg-void" aria-label="The shape of what comes next">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-6 top-24 z-10 flex justify-between md:inset-x-10">
          <span className="meta">A new dimension</span>
          <span className="meta">Fig. 01 / Form in motion</span>
        </div>
        <motion.div aria-hidden style={{ x: wellX, y: wellY }} className="pointer-events-none absolute top-0 left-0 z-0 -mt-36 -ml-36 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <motion.div style={{ y: reduced ? 0 : sculptureY, scale: reduced ? 1 : sculptureScale }} className="absolute inset-0">
          {mounted && color && <Canvas frameloop={active && !reduced ? "always" : "demand"} dpr={[1, 1.5]} camera={{ position: [0, 0, 7.8], fov: 48 }} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
            <Sculpture color={color} reduced={reduced} light={theme === "light"} formation={formation} />
          </Canvas>}
        </motion.div>
        <motion.div style={{ y: reduced ? 0 : copyY }} className="pointer-events-none absolute inset-x-6 bottom-16 z-10 flex flex-col items-start justify-between gap-6 md:inset-x-10 md:bottom-14 md:flex-row md:items-end">
          <h2 className="display max-w-full text-4xl leading-[1.05] tracking-normal sm:text-6xl lg:text-8xl xl:text-9xl">
            <SplitWord text="Ideas with" p={eased} start={0.12} reduced={reduced} /><br />
            <SplitWord text="gravity." p={eased} start={0.18} reduced={reduced} className="text-primary" />
          </h2>
          <p className="max-w-[25ch] border-t border-primary/50 pt-4 text-sm leading-relaxed text-ink-dim md:text-right">
            Built to move people. Made to stay with them.
          </p>
        </motion.div>
        <div className="pointer-events-none absolute inset-x-6 bottom-5 flex justify-between md:inset-x-10">
          <span className="meta">MarkOra / 2026</span><span className="meta">Move to interact</span>
        </div>
      </div>
    </section>
  );
}

function Letter({ ch, p, at, reduced }: { ch: string; p: MotionValue<number>; at: number; reduced: boolean }) {
  const y = useTransform(p, [at, at + 0.12], ["110%", "0%"]);
  const rotate = useTransform(p, [at, at + 0.12], [18, 0]);
  const opacity = useTransform(p, [at, at + 0.08], [0, 1]);
  return (
    <span className="inline-block overflow-hidden align-bottom pt-[0.08em] pb-[0.12em] -my-[0.1em]">
      <motion.span className="inline-block origin-bottom-left" style={{ y: reduced ? 0 : y, rotate: reduced ? 0 : rotate, opacity: reduced ? 1 : opacity }}>{ch === " " ? "\u00a0" : ch}</motion.span>
    </span>
  );
}

function SplitWord({ text, p, start, reduced, className = "" }: { text: string; p: MotionValue<number>; start: number; reduced: boolean; className?: string }) {
  return (
    <span className={`whitespace-nowrap ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => <Letter key={i} ch={ch} p={p} at={start + i * 0.012} reduced={reduced} />)}
    </span>
  );
}
