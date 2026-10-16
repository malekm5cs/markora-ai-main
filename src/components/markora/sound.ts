import { useEffect, useState } from "react";

/**
 * MarkOra sound system — synthesized UI sounds (no audio files needed).
 * Lando-style futuristic tick on click, soft blip on hover.
 */

type Listener = (on: boolean) => void;

let ctx: AudioContext | null = null;
let enabled = true;
const listeners = new Set<Listener>();

function ensureCtx(): AudioContext {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isSoundOn() {
  return enabled;
}

export function setSoundOn(v: boolean) {
  enabled = v;
  try {
    window.localStorage.setItem("markora-sound", v ? "1" : "0");
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l(v));
}

export function onSoundChange(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function initSoundPref() {
  try {
    enabled = window.localStorage.getItem("markora-sound") !== "0";
  } catch {
    /* private mode */
  }
}

/** Shared soft reverb-ish tail so every sound sits in the same room. */
let bus: GainNode | null = null;
function output(ac: AudioContext): GainNode {
  if (!bus || bus.context !== ac) {
    bus = ac.createGain();
    bus.gain.value = 0.9;

    const conv = ac.createConvolver();
    const len = Math.floor(ac.sampleRate * 0.35);
    const ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3.2;
    }
    conv.buffer = ir;
    const wet = ac.createGain();
    wet.gain.value = 0.16;
    bus.connect(conv);
    conv.connect(wet);
    wet.connect(ac.destination);
    bus.connect(ac.destination);
  }
  return bus;
}

/** Refined click: soft wooden tick + short tonal body. Precise, never beepy. */
export function playClick() {
  if (!enabled || typeof window === "undefined") return;
  try {
    const ac = ensureCtx();
    const out = output(ac);
    const t = ac.currentTime;

    // tiny filtered transient
    const len = Math.floor(ac.sampleRate * 0.018);
    const buffer = ac.createBuffer(1, len, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.2;
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 1.6;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.05, t);
    ng.gain.exponentialRampToValueAtTime(0.0006, t + 0.035);
    noise.connect(bp).connect(ng).connect(out);
    noise.start(t);

    // tonal body — perfect fifth, quick decay
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(4200, t);
    lp.frequency.exponentialRampToValueAtTime(1100, t + 0.12);
    lp.connect(out);

    for (const [freq, gain] of [
      [392, 0.055],
      [587.33, 0.03],
      [783.99, 0.016],
    ] as const) {
      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0004, t + 0.19);
      osc.connect(g).connect(lp);
      osc.start(t);
      osc.stop(t + 0.22);
    }

    // gentle weight underneath
    const sub = ac.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(130, t);
    sub.frequency.exponentialRampToValueAtTime(88, t + 0.1);
    const sg = ac.createGain();
    sg.gain.setValueAtTime(0.035, t);
    sg.gain.exponentialRampToValueAtTime(0.0005, t + 0.13);
    sub.connect(sg).connect(out);
    sub.start(t);
    sub.stop(t + 0.15);
  } catch {
    /* audio blocked */
  }
}

/** Hover: breathy, almost subliminal air-tick. */
export function playHover() {
  if (!enabled || typeof window === "undefined") return;
  try {
    const ac = ensureCtx();
    const out = output(ac);
    const t = ac.currentTime;

    const len = Math.floor(ac.sampleRate * 0.08);
    const buffer = ac.createBuffer(1, len, ac.sampleRate);
    const d = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / len);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 2.2;
    bp.frequency.setValueAtTime(2600, t);
    bp.frequency.exponentialRampToValueAtTime(4200, t + 0.08);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.012, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0004, t + 0.1);
    src.connect(bp).connect(g).connect(out);
    src.start(t);

    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1174.66, t);
    const og = ac.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.008, t + 0.02);
    og.gain.exponentialRampToValueAtTime(0.0003, t + 0.11);
    osc.connect(og).connect(out);
    osc.start(t);
    osc.stop(t + 0.13);
  } catch {
    /* audio blocked */
  }
}

/** Cinematic filtered swoosh for panels and overlays. */
export function playWhoosh() {
  if (!enabled || typeof window === "undefined") return;
  try {
    const ac = ensureCtx();
    const out = output(ac);
    const t = ac.currentTime;
    const len = Math.floor(ac.sampleRate * 0.7);
    const buffer = ac.createBuffer(1, len, ac.sampleRate);
    const d = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / len);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(220, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.45);
    bp.frequency.exponentialRampToValueAtTime(500, t + 0.7);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.045, t + 0.14);
    g.gain.exponentialRampToValueAtTime(0.0005, t + 0.7);
    src.connect(bp).connect(g).connect(out);
    src.start(t);
  } catch {
    /* audio blocked */
  }
}

/**
 * Heavenly ascension pad — a slow, choir-like major chord that blooms and
 * fades. Used for the loading experience.
 */
export function playAscension(duration = 6) {
  if (!enabled || typeof window === "undefined") return () => {};
  try {
    const ac = ensureCtx();
    const out = output(ac);
    const t = ac.currentTime + 0.05;

    const master = ac.createGain();
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(0.11, t + duration * 0.45);
    master.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(700, t);
    lp.frequency.exponentialRampToValueAtTime(4200, t + duration * 0.7);
    lp.connect(master).connect(out);

    // Cmaj9-ish stack, shimmering octaves
    const chord = [130.81, 196, 261.63, 329.63, 392, 493.88, 523.25];
    const stops: OscillatorNode[] = [];
    chord.forEach((f, i) => {
      for (const detune of [-5, 5]) {
        const osc = ac.createOscillator();
        osc.type = i > 3 ? "sine" : "triangle";
        osc.frequency.value = f;
        osc.detune.value = detune;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.5 / (i + 2), t + 1.2 + i * 0.28);
        g.gain.linearRampToValueAtTime(0.0001, t + duration);
        // slow vibrato for a breathing, choral feel
        const lfo = ac.createOscillator();
        lfo.frequency.value = 0.16 + i * 0.04;
        const lg = ac.createGain();
        lg.gain.value = 3.5;
        lfo.connect(lg).connect(osc.detune);
        lfo.start(t);
        lfo.stop(t + duration + 0.2);
        osc.connect(g).connect(lp);
        osc.start(t);
        osc.stop(t + duration + 0.2);
        stops.push(osc);
      }
    });

    // airy top shimmer
    const len = Math.floor(ac.sampleRate * duration);
    const buffer = ac.createBuffer(1, len, ac.sampleRate);
    const d = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / len);
    const air = ac.createBufferSource();
    air.buffer = buffer;
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 5200;
    const ag = ac.createGain();
    ag.gain.value = 0.02;
    air.connect(hp).connect(ag).connect(master);
    air.start(t);

    return () => {
      try {
        const now = ac.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        stops.forEach((o) => o.stop(now + 1));
        air.stop(now + 1);
      } catch {
        /* already stopped */
      }
    };
  } catch {
    return () => {};
  }
}

/** React state mirror of the sound toggle. */
export function useSoundOn(): [boolean, (v: boolean) => void] {
  const [on, setOn] = useState(true);
  useEffect(() => {
    initSoundPref();
    setOn(isSoundOn());
    return onSoundChange(setOn);
  }, []);
  return [on, setSoundOn];
}

/**
 * Global delegation: any click on a link/button plays the tick,
 * hovering one plays the soft blip. Mount once at the page root.
 */
export function useGlobalSounds() {
  useEffect(() => {
    initSoundPref();
    let lastHover: Element | null = null;

    const click = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("a, button, [role='button'], [data-sound]")) playClick();
    };
    const over = (e: MouseEvent) => {
      const t =
        (e.target as HTMLElement | null)?.closest?.("a, button, [role='button']") ?? null;
      if (t && t !== lastHover) playHover();
      lastHover = t;
    };

    document.addEventListener("click", click);
    document.addEventListener("mouseover", over);
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("mouseover", over);
    };
  }, []);
}
