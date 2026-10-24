import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Copy, Gamepad2, History, MessageSquarePlus, Mic, MicOff, RefreshCw, Send, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { answer, defaultSuggestions, type Action, type Reply } from "./ora-brain";

const pointer = { x: 0, y: 0 };

function Robot({ color, talking, hovered }: { color: string; talking: boolean; hovered: boolean }) {
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const antenna = useRef<THREE.Mesh>(null);
  const blink = useRef({ t: 0, next: 2.5 });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, pointer.x * 0.9, 5, dt);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, -pointer.y * 0.6, 5, dt);
      const s = hovered ? 1.08 : 1;
      head.current.scale.setScalar(THREE.MathUtils.damp(head.current.scale.x, s, 6, dt));
    }
    if (eyes.current) {
      const b = blink.current;
      b.t += dt;
      let sy = 1;
      if (b.t > b.next) {
        sy = Math.max(0.08, Math.abs(Math.cos((b.t - b.next) * 18)));
        if (b.t > b.next + 0.18) { b.t = 0; b.next = 2 + Math.random() * 3; }
      }
      if (talking) sy = 0.6 + Math.abs(Math.sin(t * 12)) * 0.4;
      eyes.current.scale.y = sy;
      eyes.current.position.x = pointer.x * 0.06;
      eyes.current.position.y = pointer.y * 0.05;
    }
    if (antenna.current) {
      const m = antenna.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.5 + Math.sin(t * (talking ? 14 : 3)) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={head}>
        <RoundedBox args={[1.6, 1.25, 1.2]} radius={0.32} smoothness={6}>
          <meshStandardMaterial color="#1a2030" metalness={0.85} roughness={0.25} />
        </RoundedBox>
        {/* visor */}
        <RoundedBox args={[1.3, 0.75, 0.1]} radius={0.2} position={[0, 0.02, 0.58]}>
          <meshStandardMaterial color="#05080f" metalness={0.4} roughness={0.1} />
        </RoundedBox>
        <group ref={eyes} position={[0, 0.02, 0.65]}>
          <mesh position={[-0.3, 0, 0]}>
            <capsuleGeometry args={[0.09, 0.14, 6, 12]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <capsuleGeometry args={[0.09, 0.14, 6, 12]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        </group>
        {/* ears */}
        {[-0.86, 0.86].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.14, 24]} />
            <meshStandardMaterial color="#2a3245" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        {/* antenna */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
          <meshStandardMaterial color="#3a4458" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh ref={antenna} position={[0, 1, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={color} transparent toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}


type Msg = Reply & { id: number; from: "bot" | "user"; q?: string; seed?: number };
type Lead = { step: "name" | "email" | "details"; name?: string; email?: string } | null;
type Thread = { id: string; title: string; updatedAt: number; msgs: Msg[]; lead: Lead };

const STORE = "ora-threads-v1";
const LEGACY = "ora-chat-v1";
const MAX_THREADS = 30;
const MAX_MSGS = 80;
const greeting: Msg = { id: 0, from: "bot", text: "Hi, I'm Ora — MarkOra's guide. Ask me about the studio, or try a joke, a tip or some quick maths.", suggest: defaultSuggestions };
let uid = Date.now();

type SR = { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void; stop: () => void };

function ago(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString([], { day: "numeric", month: "short" });
}

export function RobotCompanion() {
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState("#3d8bff");
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [nudge, setNudge] = useState(true);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOk, setVoiceOk] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rec = useRef<SR | null>(null);
  const loaded = useRef(false);
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    let list: Thread[] = [];
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "null");
      if (Array.isArray(saved?.threads)) list = saved.threads;
    } catch { /* ignore */ }
    if (!list.length) {
      try {
        const legacy = JSON.parse(localStorage.getItem(LEGACY) || "null");
        if (legacy?.msgs?.length > 1) {
          list = [{ id: `t${++uid}`, title: "Previous conversation", updatedAt: Date.now(), msgs: legacy.msgs, lead: legacy.lead ?? null }];
        }
      } catch { /* ignore */ }
    }
    if (list.length) {
      list.sort((a, b) => b.updatedAt - a.updatedAt);
      setThreads(list);
      setActiveId(list[0]!.id);
      activeIdRef.current = list[0]!.id;
    }
    loaded.current = true;
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    setVoiceOk(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    const c = getComputedStyle(document.documentElement).getPropertyValue("--ora-blue").trim();
    if (c) setColor(c);
    const move = (e: PointerEvent) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      pointer.x = THREE.MathUtils.clamp((e.clientX - cx) / (window.innerWidth / 2), -1, 1);
      pointer.y = THREE.MathUtils.clamp(-(e.clientY - cy) / (window.innerHeight / 2), -1, 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const hide = setTimeout(() => setNudge(false), 20000);
    return () => clearTimeout(hide);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      const trimmed = threads.slice(0, MAX_THREADS).map((t) => ({ ...t, msgs: t.msgs.slice(-MAX_MSGS) }));
      localStorage.setItem(STORE, JSON.stringify({ threads: trimmed }));
    } catch { /* ignore */ }
  }, [threads]);

  const active = threads.find((t) => t.id === activeId) ?? null;
  const msgs = active?.msgs ?? [greeting];
  const lead = active?.lead ?? null;

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, activeId]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); rec.current?.stop(); }, []);

  useEffect(() => { if (open && !showHistory) inputRef.current?.focus(); }, [open, typing, activeId, showHistory]);


  const patchActive = (patch: Partial<Thread>) => {
    const tid = activeIdRef.current;
    if (!tid) return;
    setThreads((ts) => ts.map((t) => (t.id === tid ? { ...t, ...patch, updatedAt: Date.now() } : t)));
  };
  const setMsgs = (fn: (m: Msg[]) => Msg[]) => patchActive({ msgs: fn(active?.msgs ?? [greeting]) });
  const setLead = (l: Lead) => patchActive({ lead: l });

  const ensureThread = (titleSeed?: string) => {
    if (activeIdRef.current) return activeIdRef.current;
    const id = `t${++uid}`;
    const thread: Thread = {
      id,
      title: titleSeed ? titleSeed.slice(0, 42) : "New conversation",
      updatedAt: Date.now(),
      msgs: [{ ...greeting, id: ++uid }],
      lead: null,
    };
    setThreads((ts) => [thread, ...ts]);
    activeIdRef.current = id;
    setActiveId(id);
    return id;
  };

  const selectThread = (id: string) => {
    activeIdRef.current = id;
    setActiveId(id);
    setShowHistory(false);
  };

  const deleteThread = (id: string) => {
    setThreads((ts) => ts.filter((t) => t.id !== id));
    if (activeIdRef.current === id) { activeIdRef.current = null; setActiveId(null); }
  };

  const newChat = () => {
    activeIdRef.current = null;
    setActiveId(null);
    setShowHistory(false);
    setInput("");
  };

  const botSay = (reply: Reply, extra?: Partial<Msg>) => {
    const tid = activeIdRef.current;
    setTyping(true);
    timer.current = setTimeout(() => {
      if (tid) {
        setThreads((ts) => ts.map((t) => (t.id === tid ? { ...t, msgs: [...t.msgs, { id: ++uid, from: "bot", ...reply, ...extra }], updatedAt: Date.now() } : t)));
      }
      setTyping(false);
    }, 450 + Math.min(reply.text.length * 4, 600));
  };

  const startLead = () => {
    ensureThread();
    setLead({ step: "name" });
    botSay({ text: "Lovely! First — what's your name? (Type “cancel” anytime to stop.)" });
  };

  const navigate = (action: Action) => {
    if (action.lead) { startLead(); return; }
    if (action.href) { window.location.href = action.href; return; }
    if (action.theme) { window.dispatchEvent(new CustomEvent("markora-set-theme", { detail: action.theme })); return; }
    if (action.project) {
      window.dispatchEvent(new CustomEvent("markora-open-project", { detail: action.project }));
    } else if (action.section) {
      const el = document.getElementById(action.section);
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement, options?: object) => void } }).lenis;
      if (el && lenis) lenis.scrollTo(el, { offset: -80, duration: 1.3 });
      else el?.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  const handleLead = (text: string) => {
    if (!lead) return;
    if (/^cancel$/i.test(text)) { setLead(null); botSay({ text: "No problem, enquiry cancelled. Anything else?", suggest: defaultSuggestions }); return; }
    if (lead.step === "name") {
      setLead({ step: "email", name: text });
      botSay({ text: `Nice to meet you, ${text.split(" ")[0]}! What's the best email to reach you?` });
    } else if (lead.step === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) { botSay({ text: "Hmm, that doesn't look like an email. Could you check it?" }); return; }
      setLead({ ...lead, step: "details", email: text });
      botSay({ text: "Got it. Finally, tell me a little about the project — what you need, timing, budget if you have one." });
    } else {
      const entry = { name: lead.name!, email: lead.email!, details: text, at: new Date().toISOString() };
      try { localStorage.setItem("ora-leads", JSON.stringify([...JSON.parse(localStorage.getItem("ora-leads") || "[]"), entry])); } catch { /* ignore */ }
      setLead(null);
      const body = encodeURIComponent(`Name: ${entry.name}\nEmail: ${entry.email}\n\n${entry.details}`);
      botSay({
        text: `Thanks ${entry.name.split(" ")[0]}! Here's your enquiry:\n• ${entry.email}\n• ${entry.details}\nTap below to send it straight to the studio.`,
        actions: [{ label: "Send enquiry", href: `mailto:info@mark-ora.com?subject=${encodeURIComponent(`New project — ${entry.name}`)}&body=${body}` }],
      });
    }
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    ensureThread(t);
    setThreads((ts) => ts.map((th) => (th.id === activeIdRef.current && th.title === "New conversation" ? { ...th, title: t.slice(0, 42) } : th)));
    setMsgs((m) => [...m, { id: ++uid, from: "user", text: t }]);
    setInput("");
    if (lead) { handleLead(t); return; }
    const seed = Math.floor(Math.random() * 1000);
    botSay(answer(t, seed), { q: t, seed });
  };

  const regenerate = (m: Msg) => {
    if (typing || !m.q) return;
    const seed = (m.seed ?? 0) + 1;
    const tid = activeIdRef.current;
    setTyping(true);
    timer.current = setTimeout(() => {
      if (tid) {
        setThreads((ts) => ts.map((t) => (t.id === tid ? { ...t, msgs: t.msgs.map((x) => (x.id === m.id ? { ...x, ...answer(m.q!, seed), seed } : x)), updatedAt: Date.now() } : t)));
      }
      setTyping(false);
    }, 400);
  };

  const copy = async (m: Msg) => {
    try { await navigator.clipboard.writeText(m.text); setCopied(m.id); setTimeout(() => setCopied(null), 1500); } catch { /* ignore */ }
  };

  const toggleVoice = () => {
    if (listening) { rec.current?.stop(); return; }
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = navigator.language || "en-US";
    r.interimResults = true;
    let finalText = "";
    r.onresult = (e) => {
      finalText = Array.from(e.results).map((x) => x[0]?.transcript ?? "").join("");
      setInput(finalText);
    };
    r.onend = () => { setListening(false); if (finalText.trim()) send(finalText); };
    r.onerror = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const last = [...msgs].reverse().find((m) => m.from === "bot");
  const chips = lead ? ["cancel"] : last?.suggest ?? defaultSuggestions;
  const lastBotId = last?.id;
  const savedThreads = threads.filter((t) => t.msgs.length > 1);

  return (
    <div className="fixed right-4 bottom-4 z-[80] flex flex-col items-end gap-3 md:right-6 md:bottom-6" data-lenis-prevent>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative flex h-[min(540px,calc(100svh-9rem))] w-[min(370px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-md border border-hairline bg-void/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">Ora</p>
                <p className="meta flex items-center gap-1.5 !text-[10px]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--ora-blue)]" />{listening ? "Listening…" : lead ? "Taking your enquiry" : "Online"}</p>
              </div>
              <div className="flex">
                <Button variant="ghost" size="icon" onClick={() => { setOpen(false); document.getElementById("ora-play")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }} data-cursor="hover" className="text-ink-dim hover:text-ink" aria-label="Play with Ora" title="Play with Ora"><Gamepad2 size={15} /></Button>
                <Button variant="ghost" size="icon" onClick={() => setShowHistory((h) => !h)} data-cursor="hover" className="text-ink-dim hover:text-ink" aria-label="Chat history" title="Chat history"><History size={15} /></Button>
                <Button variant="ghost" size="icon" onClick={newChat} data-cursor="hover" className="text-ink-dim hover:text-ink" aria-label="Start new chat" title="Start new chat"><MessageSquarePlus size={15} /></Button>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} data-cursor="hover" className="text-ink-dim hover:text-ink" aria-label="Close chat"><X size={16} /></Button>
              </div>
            </div>
            <div ref={list} className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group max-w-[90%] whitespace-pre-line rounded-md px-3 py-2 text-sm leading-relaxed ${m.from === "bot" ? "text-ink" : "ml-auto bg-[var(--ora-blue)] text-[var(--ora-blue-ink)]"}`}
                >
                  {m.text}
                  {m.actions && <div className="mt-2 flex flex-wrap gap-2">
                    {m.actions.map((action) => <Button key={action.label} variant="outline" size="sm" onClick={() => navigate(action)} className="h-auto min-h-8 border-[var(--ora-blue)]/40 bg-transparent px-2 py-1 text-left text-xs text-[var(--ora-blue)] hover:border-[var(--ora-blue)] hover:bg-[var(--ora-blue)]/10 hover:text-[var(--ora-blue)]">{action.label}<ArrowRight size={12} /></Button>)}
                  </div>}
                  {m.from === "bot" && m.id !== 0 && (
                    <div className={`mt-1 flex gap-1 text-ink-faint transition ${m.id === lastBotId ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      <button type="button" onClick={() => copy(m)} aria-label="Copy reply" className="rounded p-1 hover:text-[var(--ora-blue)]">{copied === m.id ? <Check size={12} /> : <Copy size={12} />}</button>
                      {m.q && <button type="button" onClick={() => regenerate(m)} aria-label="Regenerate reply" className="rounded p-1 hover:text-[var(--ora-blue)]"><RefreshCw size={12} /></button>}
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div aria-label="Ora is typing" className="flex w-fit gap-1 rounded-md bg-card px-3 py-3">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-ink-dim" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.12 }} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {chips.map((s) => (
                <Button key={s} variant="outline" size="sm" disabled={typing} onClick={() => send(s)} data-cursor="hover" className="h-7 rounded-full border-hairline bg-transparent px-2.5 text-[11px] font-normal text-ink-dim transition hover:border-[var(--ora-blue)] hover:bg-[var(--ora-blue)]/10 hover:text-[var(--ora-blue)]">
                  {s}
                </Button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2 border-t border-hairline p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "Listening…" : lead?.step === "email" ? "you@email.com" : "Ask Ora anything…"}
                className="flex-1 rounded-md border border-hairline bg-transparent px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-[var(--ora-blue)]"
              />
              {voiceOk && (
                <Button type="button" size="icon" variant={listening ? "default" : "outline"} onClick={toggleVoice} data-cursor="hover" aria-label={listening ? "Stop listening" : "Speak to Ora"} className={`h-9 w-9 shrink-0 ${listening ? "animate-pulse" : "border-hairline bg-transparent text-ink-dim hover:text-[var(--ora-blue)]"}`}>
                  {listening ? <MicOff size={16} /> : <Mic size={16} />}
                </Button>
              )}
              <Button type="submit" size="icon" disabled={!input.trim() || typing} data-cursor="hover" aria-label="Send message" className="h-9 w-9 shrink-0"><Send size={16} /></Button>
            </form>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 top-[57px] bottom-0 z-10 flex flex-col border-t border-hairline bg-void/98 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="meta !text-ink">History{savedThreads.length ? ` · ${savedThreads.length}` : ""}</p>
                    <button type="button" onClick={() => setShowHistory(false)} data-cursor="hover" aria-label="Close history" className="rounded p-1 text-ink-faint hover:text-ink"><X size={14} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-2 pb-3">
                    {savedThreads.length === 0 && (
                      <p className="px-2 py-6 text-sm text-ink-faint">No past chats yet. Everything you talk about with Ora is saved here, in this browser only.</p>
                    )}
                    {savedThreads.map((t) => (
                      <div key={t.id} className={`group flex items-center rounded-md transition ${t.id === activeId ? "bg-[var(--ora-blue)]/10" : "hover:bg-card"}`}>
                        <button type="button" onClick={() => selectThread(t.id)} className="min-w-0 flex-1 px-2 py-2.5 text-left">
                          <p className={`truncate text-sm ${t.id === activeId ? "text-[var(--ora-blue)]" : "text-ink"}`}>{t.title}</p>
                          <p className="meta mt-0.5 !text-[10px]">{ago(t.updatedAt)} · {t.msgs.length - 1} messages</p>
                        </button>
                        <button type="button" onClick={() => deleteThread(t.id)} data-cursor="hover" aria-label={`Delete chat: ${t.title}`} className="mr-1 rounded p-2 text-ink-faint opacity-0 transition group-hover:opacity-100 hover:text-red-400">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-hairline p-3">
                    <Button variant="outline" size="sm" onClick={newChat} data-cursor="hover" className="w-full border-hairline bg-transparent text-xs font-normal text-ink-dim hover:border-[var(--ora-blue)] hover:text-[var(--ora-blue)]">
                      <MessageSquarePlus size={13} /> Start new chat
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {nudge && !open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="pointer-events-none absolute right-0 bottom-full mb-5 flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-hairline bg-void/95 py-2.5 pr-4 pl-3 text-sm font-medium text-ink shadow-2xl backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ora-blue)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ora-blue)]" />
              </span>
              Hey there, I’m Ora. Ask me anything.
              <span className="absolute -bottom-1 right-10 h-2 w-2 rotate-45 border-r border-b border-hairline bg-void md:right-12" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!open && hovered && !nudge && (
            <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="meta absolute top-1/2 right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-full border border-hairline bg-void/80 px-3 py-1.5 backdrop-blur">
              Chat with Ora
            </motion.span>
          )}
        </AnimatePresence>
        <Button
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          data-cursor="hover"
          aria-label={open ? "Close chat" : "Open chat with Ora"}
          variant="ghost" className="premium-action relative h-24 w-24 rounded-full p-0 hover:bg-transparent md:h-28 md:w-28"
        >
          <span className="pointer-events-none absolute inset-3 rounded-full bg-[var(--ora-blue)]/25 blur-2xl" />
          <div ref={wrap} className="absolute inset-0">
            {mounted && (
              <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.6], fov: 40 }} gl={{ alpha: true, antialias: true }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 3, 4]} intensity={2} />
                <pointLight position={[-2, -1, 2]} intensity={6} color={color} />
                <Robot color={color} talking={typing || listening} hovered={hovered} />
              </Canvas>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}
