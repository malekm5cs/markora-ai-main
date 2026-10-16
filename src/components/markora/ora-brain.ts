import { capabilities, projects } from "./data";

export type Action = {
  label: string;
  section?: string;
  project?: string;
  href?: string;
  lead?: boolean;
  theme?: "light" | "dark";
};
export type Reply = { text: string; actions?: Action[]; suggest?: string[] };

const sectionAction = (label: string, section: string): Action => ({ label, section });
const pick = <T,>(arr: T[], seed: number): T => arr[Math.abs(seed) % arr.length] as T;
const leadAction: Action = { label: "Start a project with Ora", lead: true };
const servicesAction: Action = sectionAction("Explore services", "capabilities");

export const defaultSuggestions = ["Services", "Our process", "Show me work", "Start a project"];

// ---------------------------------------------------------------- content pools

const jokes = [
  "Why did the designer break up with the font? It just wasn't their type.",
  "I asked a marketer for directions. They said: 'It depends on your target audience.'",
  "A CSS rule walks into a bar. The bartender says 'display: none' — and it vanishes.",
  "Why do robots never panic? We have nerves of steel. Literally.",
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "How many designers does it take to change a lightbulb? None — that's a client-side issue.",
  "My client asked for the logo 'bigger, but also more minimal'. I nodded, then went home and stared at a wall.",
  "I have a joke about CSS, but it's positioned off-screen.",
  "Why was the website invited to the party? Because it had great hosting.",
  "A marketer walks into a bar. Then a different bar. Then a third bar and calls it an A/B test.",
  "What's a robot's favourite music? Heavy metal — and light jazz.",
  "My favourite meeting is the one that could have been a message. Or a build.",
  "I told the client the mockup was ready. They said 'can you make the hero shorter?' It's a hero, not a haiku.",
];
const facts = [
  "Octopuses have three hearts and blue blood.",
  "Honey never spoils — edible honey has been found in ancient Egyptian tombs.",
  "The first website ever made is still online at info.cern.ch.",
  "A day on Venus is longer than its year.",
  "The Burj Khalifa is so tall you can watch the sunset twice — once from the base, once from the top.",
  "The word 'brand' comes from Old Norse 'brandr' — meaning to burn.",
  "The first banner ad, in 1994, hit a 44% click-through rate. Today's average is under 1%.",
  "Sharks are older than trees — roughly 400 million years of head start.",
  "Your phone has more computing power than NASA used to land Apollo 11.",
  "Bananas are berries. Strawberries are not.",
  "Camels store fat in their humps, not water.",
  "The average visitor decides whether to stay on a page in well under a second.",
  "A group of crows is called a murder. A group of designers is called a 'quick turnaround'.",
];
const tips = [
  "Post less, but better: one strong idea a week beats seven forgettable ones.",
  "Your first 3 seconds of video decide everything — open with the payoff, not the logo.",
  "Write for one specific person. Copy aimed at everyone lands with no one.",
  "Test two ad creatives at a time, change one variable, and let the data pick the winner.",
  "Speed is a feature: every extra second of page load quietly costs conversions.",
  "Consistency builds brands — same colours, same voice, every touchpoint.",
  "One clear call to action per page. Two buttons competing is zero buttons winning.",
  "Shoot vertical first — most of your audience is holding a phone in one hand.",
  "Ask for the review at the moment of delight, not a week later.",
  "Reuse your best post for six weeks. Most of your audience never saw it the first time.",
  "Batch your content: one shoot day can feed a month of posts if you plan the shots.",
  "Retarget only people who clicked. Burning impressions on cold traffic is how budgets die quietly.",
  "Name your files and write real alt text — search engines and screen readers both read them.",
  "Answer every enquiry within an hour. Speed beats price more often than you'd think.",
];
const quotes = [
  "“Design is not just what it looks like. Design is how it works.” — Steve Jobs",
  "“Simplicity is the ultimate sophistication.” — Leonardo da Vinci",
  "“Marketing is no longer about the stuff you make, but the stories you tell.” — Seth Godin",
  "“The best way to predict the future is to invent it.” — Alan Kay",
  "“Creativity is intelligence having fun.” — Albert Einstein",
  "“Content is fire; social media is gasoline.” — Jay Baer",
  "“Make it simple. Make it memorable. Make it inviting to look at.” — Leo Burnett",
  "“Good design is as little design as possible.” — Dieter Rams",
  "“The details are not the details. They make the design.” — Charles Eames",
  "“Your brand is what other people say about you when you're not in the room.” — Jeff Bezos",
  "“Amateurs sit and wait for inspiration. The rest of us just get up and go to work.” — Stephen King",
  "“Every advertisement should be thought of as a contribution to the image of a brand.” — David Ogilvy",
  "“Content is king.” — Bill Gates, 1996 — and still true.",
];
const riddles = [
  { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo." },
  { q: "The more of me you take, the more you leave behind. What am I?", a: "Footsteps." },
  { q: "I have keys but open no locks. I have space but no room. You can enter, but you can't go outside. What am I?", a: "A keyboard." },
  { q: "What gets wetter the more it dries?", a: "A towel." },
  { q: "I'm always in front of you but can't be seen. What am I?", a: "The future." },
  { q: "I have cities, but no houses. Mountains, but no trees. Water, but no fish. What am I?", a: "A map." },
  { q: "What has to be broken before you can use it?", a: "An egg." },
  { q: "I'm light as a feather, yet the strongest person can't hold me for long. What am I?", a: "Your breath." },
  { q: "The more you cut, the more you keep. What am I?", a: "A hole." },
  { q: "What has one eye but can't see?", a: "A needle." },
  { q: "What goes up but never comes down?", a: "Your age." },
  { q: "If you have me, you want to share me. If you share me, you haven't got me. What am I?", a: "A secret." },
  { q: "What can travel around the world while staying in a corner?", a: "A stamp." },
  { q: "I have a head and a tail but no body. What am I?", a: "A coin." },
];
const trivia = [
  { q: "Which planet has the most moons?", a: "Saturn — over 140 confirmed moons." },
  { q: "What year was the first iPhone released?", a: "2007." },
  { q: "Which country invented coffee?", a: "Ethiopia — legend credits a goat herder named Kaldi." },
  { q: "What does 'HTTP' stand for?", a: "HyperText Transfer Protocol." },
  { q: "Which is the only letter not in any US state name?", a: "The letter Q." },
  { q: "What is the smallest country in the world?", a: "Vatican City — about 0.44 km²." },
  { q: "Which element has the chemical symbol 'Au'?", a: "Gold." },
  { q: "What is the fastest land animal?", a: "The cheetah — around 100 km/h in short bursts." },
  { q: "How many time zones does Russia have?", a: "Eleven." },
  { q: "What does 'ROI' stand for in marketing?", a: "Return on Investment." },
  { q: "Which app has the most monthly users worldwide?", a: "WhatsApp — well over 2 billion." },
  { q: "What year did the first YouTube video go up?", a: "2005 — 'Me at the zoo'." },
  { q: "Which ocean is the deepest?", a: "The Pacific — the Mariana Trench, about 11 km down." },
  { q: "Which human sense is most tightly linked to memory?", a: "Smell." },
  { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci." },
  { q: "Which blood type is the universal donor?", a: "O negative." },
];
const nameStarters = ["Nova", "Lumen", "Vertex", "Astra", "Pulse", "Echo", "Onyx", "Zephyr", "Ember", "Atlas", "Kite", "Halcyon", "Mirage", "Quartz", "Sable", "Cobalt", "Verdant", "Solace"];
const nameEndings = ["labs", "studio", "collective", "works", "haus", "co", "supply", "atelier", "forge", "district", "bureau", "society", "craft", "union", "media", "group", "lab", "society"];
const tagPool = ["marketing", "branding", "dubai", "uae", "gcc", "smallbusiness", "content", "design", "strategy", "socialmedia", "growth", "behindthescenes", "launchday", "brandstrategy", "contentcreator", "digitalmarketing", "creative", "marketingtips", "madeindubai", "businesstips"];
const tagSuffixes = ["tips", "daily", "studio", "hub", "ideas", "life", "goals", "howto", "gram", "community", "2026", "behindthescenes", "inspo", "brand"];
const fontPairs = [
  ["Space Grotesk", "IBM Plex Sans", "sharp, modern, a little technical"],
  ["Cormorant Garamond", "Jost", "editorial and expensive"],
  ["Archivo Black", "Work Sans", "loud headline, calm body"],
  ["Playfair Display", "DM Sans", "classic luxury"],
  ["Syne", "Manrope", "gallery and fashion"],
  ["Bricolage Grotesque", "Figtree", "friendly and current"],
  ["Instrument Serif", "Sora", "magazine cover"],
  ["Chivo Mono", "Public Sans", "engineering and data"],
];
const eightBall = [
  "Yes — and the data would agree.",
  "Without a doubt.",
  "Signs point to yes.",
  "Most likely.",
  "Ask me again after the first draft.",
  "Concentrate and ask again.",
  "My reply is no.",
  "Very doubtful.",
  "No — but there's a better version of that question.",
  "Only if you can commit to it properly.",
  "The studio would say yes. I'm just the robot.",
  "Yes, but not this week.",
];
const affirmations = [
  "You're building something that didn't exist yesterday. That counts, even on the slow days.",
  "Done beats perfect. Perfect is just procrastination wearing a nice typeface.",
  "One clear next step, twenty minutes, no phone. That's usually the whole fix.",
  "You don't need more motivation — you need a smaller task. Pick the smallest one.",
  "Every brand you admire was once exactly where you are: unsure, underfunded, and stubborn.",
  "Rest is part of the work. The idea usually arrives when you finally step away.",
];
const stories = [
  "Once upon a server: a small robot called Ora was built to answer questions. Her first user asked her to flip a coin, then to do their taxes. She can only do the first one, and she's at peace with that.",
  "A brand walked into a room with no identity. It had a name, a colour, and a spreadsheet. It left with a story — and an invoice.",
  "There was a launch scheduled for Thursday. On Wednesday, the hero video was still rendering. The robot stayed awake with it. They both shipped on time.",
];
const favorites = {
  color: "Blue, obviously — the exact blue of my antenna: #2e6bff. It's the one honest thing about my colour scheme.",
  food: "I run on electricity, but if I could eat, it would be the studio's third coffee of the afternoon — the one that turns into anxiety with a lid.",
  music: "Heavy metal, and the hum of a server room at 3am.",
  movie: "Anything with a robot in it. I'm not ashamed.",
  time: "Friday at 17:00 — the moment the studio's Slack goes quiet and the render farm gets all to itself.",
};
const bioHooks = [
  "{T} for people who notice the details",
  "Making {T} feel like it was always meant to exist",
  "Small team. Serious {T}.",
  "{T} — done properly, or not at all",
  "We design, shoot and ship {T}",
  "Your {T}, minus the guesswork",
];
const bioLines = [
  "📍 Dubai · GCC & beyond",
  "🎯 Strategy · Creative · Growth",
  "☕ Powered by strong coffee and tight deadlines",
  "🌍 English & Arabic",
  "✨ New work every month",
  "⚡ Reply within the hour",
];
const bioCta = ["Book a call", "Shop the drop", "Get a quote", "Say hello", "See the work", "Join the list"];
const subjectLines = [
  "Quick question about {T}",
  "{T}: are you free Tuesday?",
  "We made something for {T}",
  "3 ideas for {T} (one takes 2 minutes)",
  "Re: {T} — the thing we didn't finish",
  "Your {T}, in writing",
  "Is {T} still a priority this quarter?",
  "Don't open this unless {T} matters",
];
const headlines = [
  "{T}, without the guesswork",
  "The fastest way to {T}",
  "Stop losing people at {T}",
  "{T} that pays for itself",
  "Everything you need for {T}",
  "Most {T} is boring. This isn't.",
];
const adBodies = [
  "You've tried the obvious playbooks. They cost the same and deliver less. We start with the one number that matters, then build the creative and the funnel around it. No retainers for the sake of retainers.",
  "Most agencies sell you activity. We sell outcomes: a defined audience, a message that survives a phone screen, and a measurement plan you can actually read.",
  "One idea, produced properly, tested against a control, then scaled only when it earns it. That's the whole method — and it's why the numbers hold up.",
];
const ctas = ["Get a quote", "Book a call", "See the work", "Start today", "Claim your spot"];

// ------------------------------------------------------------------- helpers

const STOP = new Set(["a", "an", "the", "my", "our", "me", "us", "for", "to", "of", "and", "with", "please", "can", "you", "write", "make", "give", "generate", "create", "need", "want", "new", "business", "company", "brand", "start", "startup", "idea", "some", "help", "text", "sentence", "phrase", "word", "words", "count", "characters", "characters", "about", "that", "this", "it", "is", "in", "on"]);

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const money = (n: number) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

function tidy(raw: string): string {
  const words = raw.toLowerCase().replace(/[^a-z0-9&' ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w) && w.length > 1);
  return words.slice(0, 3).join(" ").trim();
}

function topicOf(s: string): string {
  const quoted = s.match(/["'“](.+?)["'”]/);
  if (quoted?.[1]) return tidy(quoted[1]) || "your brand";
  const named = s.match(/(?:for|about|called|named|selling)\s+([^?!.]{2,40})/i);
  return tidy(named?.[1] ?? s) || "your brand";
}

const COMMANDS = /^(how many (words|characters) (are )?(in|there in)|word count for|count (the )?(words|characters) in|character count for|reverse( the)?( text| word| phrase| this)?|say|repeat( after me)?|echo|morse( code)?|binary|encode|decode|cipher|translate|convert( this)? to|to( the)? (uppercase|lowercase|title case)|make (this|it) (uppercase|lowercase|title case))[:,\s]*/i;

function payloadOf(s: string): string {
  const quoted = s.match(/["'“](.+?)["'”]/);
  if (quoted?.[1]) return quoted[1].trim();
  const stripped = s.replace(COMMANDS, "").replace(/[?.!]+$/, "").trim();
  return stripped || s;
}

function fill(tpl: string, topic: string): string {
  return tpl.replace(/\{T\}/g, cap(topic));
}

const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
  k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
  u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};

function toMorse(t: string): string {
  return t.toLowerCase().slice(0, 40).split("").map((c) => (c === " " ? "/" : MORSE[c] ?? "")).filter(Boolean).join(" ");
}

function toBinary(t: string): string {
  return t.slice(0, 24).split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

function caesar(t: string, shift: number): string {
  return t.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
}

function titleCase(t: string): string {
  return t.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function randomHex(): string {
  return `#${Array.from({ length: 6 }, () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]).join("")}`;
}

function hashtags(topic: string, seed: number): string[] {
  const words = topic.split(/\s+/);
  const base = (words[0] ?? "brand").replace(/[^a-z0-9]/g, "") || "brand";
  const second = (words[1] ?? "").replace(/[^a-z0-9]/g, "");
  const out: string[] = [];
  const add = (t: string) => { if (t.length > 3 && !out.includes(t)) out.push(t); };
  add(`#${base}`);
  if (second) add(`#${base}${second}`);
  for (const s of tagSuffixes) add(`#${base}${s}`);
  for (let i = 0; i < 60 && out.length < 14; i++) add(`#${pick(tagPool, seed + i * 3)}`);
  return out.slice(0, 12);
}

function tryMath(s: string): string | null {
  const expr = s.replace(/^(what('?s| is)|calculate|calc|compute)\s+/i, "").replace(/[?=]/g, "").replace(/x/g, "*").replace(/\^/g, "**").trim();
  if (!/^[\d\s+\-*/().%]+$/.test(expr) || !/\d/.test(expr) || !/[+\-*/%]/.test(expr)) return null;
  try {
    const v = Function(`"use strict";return (${expr})`)() as number;
    if (typeof v !== "number" || !isFinite(v)) return null;
    return `${expr} = ${money(v)}`;
  } catch { return null; }
}

function tryPercent(s: string): string | null {
  const N = "(\\d+(?:\\.\\d+)?)";
  const of = new RegExp(`${N}\\s*(?:%|percent)\\s+of\\s+${N}`, "i").exec(s);
  if (of) {
    const p = parseFloat(of[1] as string), v = parseFloat(of[2] as string);
    return `${p}% of ${money(v)} = ${money((p / 100) * v)}`;
  }
  const off = new RegExp(`${N}\\s*(?:%|percent)\\s+(?:off|discount(?:ed)?(?:\s+on)?|rebate)\s+${N}`, "i").exec(s);
  if (off) {
    const p = parseFloat(off[1] as string), v = parseFloat(off[2] as string);
    return `${p}% off ${money(v)} → you pay ${money(v * (1 - p / 100))} (you save ${money((v * p) / 100)}).`;
  }
  const add = new RegExp(`(?:add|plus|increase|mark(?:ed)? ?up|raise|bump)\s+${N}\\s*(?:%|percent)\s+(?:to|on|of)\s+${N}`, "i").exec(s);
  if (add) {
    const p = parseFloat(add[1] as string), v = parseFloat(add[2] as string);
    return `${money(v)} + ${p}% = ${money(v * (1 + p / 100))}.`;
  }
  const sub = new RegExp(`(?:subtract|minus|reduce|decrease|take)\s+${N}\\s*(?:%|percent)\s+(?:from|of)\s+${N}`, "i").exec(s);
  if (sub) {
    const p = parseFloat(sub[1] as string), v = parseFloat(sub[2] as string);
    return `${money(v)} − ${p}% = ${money(v * (1 - p / 100))}.`;
  }
  const vat = /vat/.test(s) ? /(\d+(?:\.\d+)?)/.exec(s) : null;
  if (vat) {
    const v = parseFloat(vat[1] as string);
    if (/remove|exclude|without|net|before/.test(s)) return `${money(v)} without UAE VAT = ${money(v / 1.05)} (VAT was ${money(v - v / 1.05)}).`;
    return `${money(v)} + 5% UAE VAT = ${money(v * 1.05)} (VAT is ${money(v * 0.05)}).`;
  }
  const outOf = new RegExp(`${N}\\s*(?:out of|/)\s*${N}(?:\\s*(?:is|as)?\\s*(?:a\\s*)?(?:what\\s+)?(?:%|percent|percentage))`, "i").exec(s);
  if (outOf) {
    const a = parseFloat(outOf[1] as string), b = parseFloat(outOf[2] as string);
    if (b !== 0) return `${money(a)} out of ${money(b)} is ${money((a / b) * 100)}%.`;
  }
  return null;
}

const UNIT_GROUPS: { label: string; per: Record<string, number> }[] = [
  { label: "length", per: { km: 1, kilometer: 1, kilometres: 1, kilometers: 1, mi: 0.621371, mile: 0.621371, miles: 0.621371, m: 1000, meter: 1000, meters: 1000, metre: 1000, metres: 1000, cm: 100000, centimeter: 100000, centimeters: 100000, centimetre: 100000, centimetres: 100000, mm: 1000000, in: 39370.0787, inch: 39370.0787, inches: 39370.0787, ft: 3280.84, feet: 3280.84, foot: 3280.84, yd: 1093.613, yards: 1093.613, yard: 1093.613 } },
  { label: "mass", per: { kg: 1, kilo: 1, kilos: 1, kilogram: 1, kilograms: 1, g: 1000, gram: 1000, grams: 1000, mg: 1000000, lb: 2.20462, lbs: 2.20462, pound: 2.20462, pounds: 2.20462, oz: 35.27396, ounce: 35.27396, ounces: 35.27396, tonne: 0.001, tonnes: 0.001, ton: 0.00110231, tons: 0.00110231 } },
  { label: "volume", per: { l: 1, litre: 1, litres: 1, liter: 1, liters: 1, ml: 1000, millilitre: 1000, millilitres: 1000, milliliter: 1000, milliliters: 1000, gallon: 0.264172, gallons: 0.264172, gal: 0.264172, cup: 4.22675, cups: 4.22675, pint: 2.11338, pints: 2.11338 } },
  { label: "screen", per: { px: 1, rem: 0.0625, rems: 0.0625, em: 0.0625, pt: 0.075 } },
];

function unitKey(raw: string): string {
  return raw.toLowerCase().replace(/\.$/, "").replace(/°/g, "").trim();
}

function tryConvert(s: string): string | null {
  const m = /(-?\d+(?:\.\d+)?)\s*(°?[a-z]{1,12})\s+(?:to|in|into|as|=)\s+(°?[a-z]{1,12})/i.exec(s);
  if (!m) return null;
  const value = parseFloat(m[1] as string);
  const from = unitKey(m[2] as string);
  const to = unitKey(m[3] as string);
  if (from === to) return null;
  if (/^(c|celsius|f|fahrenheit)$/.test(from) && /^(c|celsius|f|fahrenheit)$/.test(to)) {
    const toF = /^f/.test(to);
    const out = toF ? value * 1.8 + 32 : (value - 32) / 1.8;
    return `${money(value)}°${/^c/.test(from) ? "C" : "F"} = ${money(out)}°${toF ? "F" : "C"}`;
  }
  const group = UNIT_GROUPS.find((g) => g.per[from] !== undefined && g.per[to] !== undefined);
  if (!group) return null;
  const out = (value * group.per[to]!) / group.per[from]!;
  return `${money(value)} ${from} = ${money(out)} ${to} (${group.label}).`;
}

// ------------------------------------------------------------- studio answers

const playbooks: { re: RegExp; text: string }[] = [
  {
    re: /restaurant|cafe|coffee shop|bakery|food truck|diner|menu|food & bev|f&b|eatery/i,
    text: "For a restaurant or café, appetite appeal is the whole job:\n• Vertical video 3–4× a week — the pour, the pull, the plate. Not the logo.\n• One hero dish per campaign, never the full menu.\n• Reviews and guest footage pinned to the top of every post, plus one offer people can't refuse.\nWe shoot, edit and run the campaigns in-house, bilingual.",
  },
  {
    re: /\bgym\b|fitness|crossfit|personal train|yoga studio|pilates|training studio|gymnast/i,
    text: "Fitness is local and visual — it's booked by people who live within a few kilometres:\n• Transformations and member stories beat equipment shots every single time.\n• Class timetable in the bio, one obvious offer: free first session.\n• Retarget the radius around your studio; that's where 80% of your members come from.\n• Never let an enquiry sit overnight — the second gym is one tap away.",
  },
  {
    re: /real estate|property|properties|apartment|villa|broker|estate agent|off-?plan|housing/i,
    text: "Real estate is trust plus speed:\n• A walkthrough video per listing, vertical first, price and area in the first second.\n• Build the agent as a personal brand — people follow people, not logos.\n• Lead capture that drops straight into WhatsApp; every hour of delay roughly halves the callback rate.\n• Prove one neighbourhood better than anyone else, then own it.",
  },
  {
    re: /salon|barber|spa\b|beauty|clinic|dental|aesthetic|derma|hair|nail|skincare/i,
    text: "Beauty and clinics are booked, not bought:\n• Before/after and process footage — the reveal is the ad.\n• Booking in one tap, with reminders that quietly kill no-shows.\n• A review engine that asks at checkout, not a week later.\n• One signature treatment, promoted relentlessly, so you're known for something.",
  },
  {
    re: /fashion|clothing|boutique|streetwear|apparel|sneaker|jewellery|jewelry|watch brand|handbag/i,
    text: "Fashion sells on story and frequency:\n• Treat every drop as a campaign: tease, launch, sell-through.\n• Product shots that still read on a phone screen at 15 seconds.\n• Seed to a small, genuinely relevant creator group instead of a big, random one.\n• Packaging and unboxing are your cheapest retention channel.",
  },
  {
    re: /startup|small business|new business|solopreneur|entrepreneur|sme\b|family business|early stage/i,
    text: "An early-stage budget should buy proof, not polish:\n• One positioning line and one landing page that does one job.\n• Two channels only — pick where your buyers already are and go deep.\n• Track a single number (qualified leads per week) and spend against it weekly.\n• Founder-led content is free and outperforms polished ads at your stage.",
  },
  {
    re: /personal brand|linkedin profile|influencer|content creator|coach|consultant|freelance|portfolio site/i,
    text: "Personal brands are built on consistency, not virality:\n• Three pillars: what you know, what you've done, how you think.\n• One post a week, same format, same voice — for six months straight.\n• One destination: a page that says what you do, who it's for, and how to book you.\n• Every comment and DM answered personally for the first year.",
  },
  {
    re: /\bsaas\b|software|platform|b2b|dashboard|api\b|tech company|app development/i,
    text: "B2B and SaaS marketing is education with a deadline:\n• Problem-led content, not feature tours — show the pain, then the fix.\n• Social proof early: named logos, real numbers, quotes with faces.\n• One frictionless step to a demo or trial, then automation that never sleeps.\n• Sales and marketing share one dashboard, or the funnel leaks quietly.",
  },
  {
    re: /school|university|academy|institute|course|training|workshop|educat|learning centre|learning center/i,
    text: "Education sells to two people at once: the learner and whoever pays.\n• Outcomes first — where graduates end up, in numbers.\n• The founder or teacher on camera; faces convert far better than slides.\n• Treat enrolment windows as launches, with a countdown and a real deadline.\n• Alumni voices are your cheapest, most credible ads.",
  },
  {
    re: /car dealer|automotive|vehicle|motors|cars?\b|dealership|supercar|ev brand|bike brand|motorcycle/i,
    text: "Automotive is emotion attached to a spec sheet:\n• One cinematic vertical film per model — light, sound, and the first three seconds doing the work.\n• Financing and availability inside the ad, not buried on the page.\n• Every enquiry answered in minutes; speed beats price for most buyers.\n• Macro detail shots photographed like architecture — that's how we handled 8BA Motors.",
  },
  {
    re: /hotel|resort|airbnb|holiday|vacation|tourism|travel|tour operator|guesthouse|hospitality/i,
    text: "Hospitality sells the feeling before the room:\n• One film, cut ten ways — arrival, the view, the bed, the table.\n• A direct-booking offer that clearly beats the platforms, and says so.\n• Guest footage in the feed; strangers trust strangers more than brands.\n• Seasons planned as campaigns, with the quiet months given a job to do.",
  },
];

// ---------------------------------------------------------------------- answer

export function answer(q: string, seed = 0): Reply {
  const s = q.toLowerCase().trim();

  // Arabic
  if (/[؀-ۿ]/.test(s)) {
    if (/مشروع جديد|ابدأ مشروع|نبدأ مشروع|ابغى ابدأ|حجز|تواصل معك|ابداء مشروع/i.test(s)) return {
      text: "ممتاز — عندي ثلاث أسئلة سريعة: الاسم، الإيميل، ولمحة عن المطلوب. الفريق يراجعها ويرد عليك بالخطوات والجدول الزمني. تستغرق دقيقة واحدة.",
      actions: [leadAction, { label: "البريد الإلكتروني", href: "mailto:info@mark-ora.com" }],
    };
    if (/مرحبا|اهلا|السلام|هلا|صباح|مساء/i.test(s)) return {
      text: "أهلاً! أنا Ora، رفيقتك في موقع MarkOra. اسألني عن الخدمات، الأعمال السابقة، الأسعار، أو نبدأ مشروعك.",
      suggest: ["الخدمات", "الأعمال", "السعر"],
    };
    if (/خدمات|خدماتك|تسوين|شغالكم/i.test(s)) return {
      text: "خدمات MarkOra: إدارة سوشيال ميديا، إنتاج محتوى، إعلانات مدفوعة، استراتيجية وهوية بصرية، فعاليات، تطوير مواقع، تطبيقات، وأنظمة ذكاء اصطناعي.",
      actions: [servicesAction],
    };
    if (/سعر|اسعار|تكلفة|ميزانية|كم تكلف|باقة/i.test(s)) return {
      text: "كل مشروع يُسعَّر حسب نطاقه ومدته والفريق المطلوب. أقدر أجهّز لك عرضاً تفصيلياً بدون تكاليف مخفية خلال أيام من استلام المطلوب.",
      actions: [leadAction],
    };
    if (/اعمال|مشاريع|بورتفوليو|شغل|دراسات حالة/i.test(s)) return {
      text: "عندنا سبع دراسات حالة جاهزة — من launches لسيارات إلى تجارب قهوة وطاقة. تصفّح المعرض أو اسألني عن أي مشروع بالاسم.",
      actions: [sectionAction("استعرض الأعمال", "work")],
    };
    if (/شكرا|مشكور|تسلم/i.test(s)) return { text: "على الرحب والسعة! شيء ثاني؟" };
    return { text: "ما فهمت سؤالك بالكامل — جرّب تسألني عن الخدمات، الأعمال، الأسعار، أو نبدأ مشروع.", suggest: ["الخدمات", "الأعمال", "السعر"] };
  }

  if (/start a project|new project|work with you|get a quote|hire you|book|get started|kick ?off/.test(s)) return {
    text: "Excellent — here's how we begin. I'll take three quick details (your name, email and a short brief), and the studio will review it and respond with next steps and a proposed timeline. It takes about 30 seconds.",
    actions: [leadAction, { label: "Email instead", href: "mailto:info@mark-ora.com" }],
  };

  if (/process|how do you work|workflow|timeline|how long|deliver|milestone/.test(s)) return {
    text: "Our engagements follow a clear four-phase process:\n1. Discovery — we map your goals, audience and competitive landscape.\n2. Strategy — a defined plan with channels, creative direction and KPIs.\n3. Production — design, content and development in weekly review cycles.\n4. Launch & optimisation — measured rollout, then iteration against the data.\nMost projects run 4–12 weeks depending on scope.",
    actions: [leadAction],
    suggest: ["Pricing", "Services", "Start a project"],
  };

  if (/brand|logo|identity|rebrand/.test(s) && !/\bname\b|slogan|tagline/.test(s)) return {
    text: "Brand work at MarkOra goes beyond a logo. We build complete identity systems — strategy, naming, visual language, tone of voice and guidelines — designed to stay consistent across every touchpoint, from social feeds to physical spaces.",
    actions: [servicesAction, leadAction],
    suggest: ["Show me work", "Our process"],
  };

  if (/seo|search engine|google|ranking|rank/.test(s) && !/google ads/.test(s)) return {
    text: "We treat search as part of the product, not an afterthought: technical performance, structured content and authority building, aligned with paid campaigns so organic and paid compound each other rather than compete.",
    actions: [servicesAction],
    suggest: ["Paid ads", "Marketing tip"],
  };

  if (/social media|instagram|tiktok|linkedin|snapchat|x\.com|twitter/.test(s) && !/\b(bio|caption|hashtag|post idea|content idea)\b/.test(s)) return {
    text: "Our social media practice covers strategy, content production, community management and paid amplification — planned in monthly calendars, produced in-house, and reported against engagement and conversion metrics that actually matter to your business.",
    actions: [servicesAction, leadAction],
    suggest: ["Content production", "Marketing tip"],
  };

  if (/why (you|markora)|different|better than|choose you/.test(s)) return {
    text: "Three things set MarkOra apart:\n• Strategy, creative and development under one roof — no hand-offs lost between agencies.\n• Bilingual English/Arabic teams with deep regional market knowledge.\n• A small senior team — the people you meet are the people who do the work.",
    actions: [sectionAction("Meet the studio", "about"), leadAction],
    suggest: ["Our process", "Show me work"],
  };

  if (/industr|sector|who do you work with|clients like/.test(s)) return {
    text: "We've delivered across automotive, hospitality, F&B, energy and lifestyle — from Alain Class Motors and 8BA Motors to Chef Eyad, Coffee Matters and Siemens Energy. The common thread: brands that care about craft.",
    actions: [sectionAction("Explore work", "work")],
    suggest: projects.slice(0, 3).map((p) => p.title),
  };

  if (/arabic|عربي|bilingual|language/.test(s) && !/^(can|do|will) you/.test(s)) return {
    text: "Yes — MarkOra is fully bilingual. We strategise, write, design and produce in both English and Arabic, with native-level copy and culturally fluent creative for GCC and wider MENA audiences.",
    actions: [sectionAction("Meet the studio", "about")],
  };

  const project = projects.find((p) => s.includes(p.title.toLowerCase()) ||
    (p.title === "8BA Motors" && /\b8ba\b/.test(s)) ||
    (p.title === "Siemens Energy" && /\bsiemens\b/.test(s)));
  if (project) return {
    text: `${project.title} · ${project.discipline} · ${project.year}. ${project.idea} ${project.experience}`,
    actions: [{ label: "View case study", project: project.index }],
    suggest: ["Show me work", "Start a project"],
  };

  const service = capabilities.find((c) =>
    new RegExp(`\\b${c.word.toLowerCase()}\\b`).test(s) ||
    (c.word === "Web" && /website|site/.test(s)) ||
    (c.word === "Paid" && /ads|advertis/.test(s)) ||
    (c.word === "Content" && /photo|video|shoot/.test(s)) ||
    (c.word === "Mobile" && /\bapp\b/.test(s)) ||
    (c.word === "AI" && /automat|intelligen/.test(s)));
  if (service && !/tip|joke|fact|how much|cost|price|pricing|budget|rate/.test(s)) return {
    text: `${service.word} ${service.line}: ${service.body}`,
    actions: [servicesAction, leadAction],
    suggest: ["Marketing tip", "Pricing", "Show me work"],
  };

  const pct = tryPercent(s);
  if (pct) return { text: pick([`That's ${pct}`, `Quick maths: ${pct}`, `${pct} — done.`], seed), suggest: ["Marketing tip", "Fun fact"] };

  const conv = tryConvert(s);
  if (conv) return { text: conv, suggest: ["Random colour", "Fun fact"] };

  const math = tryMath(s);
  if (math) return { text: pick([`That's ${math}.`, `Quick maths: ${math}`, `${math} — done.`], seed), suggest: ["Tell me a joke", "Fun fact"] };

  if (/joke|funny|make me laugh/.test(s)) return { text: pick(jokes, seed + Date.now()), suggest: ["Another joke", "Fun fact", "Services"] };
  if (/fact|did you know|something interesting/.test(s)) return { text: `Fun fact: ${pick(facts, seed + Date.now())}`, suggest: ["Another fact", "Tell me a joke"] };
  if (/tip|advice|grow|engagement|followers|improve my/.test(s) && !/youtube|podcast|tiktok|instagram/.test(s)) return { text: `Tip: ${pick(tips, seed + Date.now())}`, actions: [leadAction], suggest: ["Another tip", "Services"] };
  if (/quote|inspir|motivat/.test(s)) return { text: pick(quotes, seed + Date.now()), suggest: ["Another quote", "Marketing tip"] };
  if (/^another/.test(s)) return answer(s.replace("another", ""), seed + 1);

  if (/riddle/.test(s) && !/answer/.test(s)) { const r = pick(riddles, seed + Date.now()); return { text: `Here's one: ${r.q}\n(Ask “riddle answer” when you're ready.)`, suggest: ["Riddle answer", "Another riddle"] }; }
  if (/riddle answer|the answer/.test(s)) { const r = pick(riddles, seed); return { text: `The answer: ${r.a}`, suggest: ["Another riddle", "Trivia"] }; }
  if (/trivia|quiz|test me/.test(s)) { const t = pick(trivia, seed + Date.now()); return { text: `Trivia time: ${t.q}\nAnswer: ${t.a}`, suggest: ["Another trivia", "Tell me a riddle"] }; }
  if (/surprise|bored|entertain/.test(s)) return answer(pick(["joke", "fact", "riddle", "quote", "trivia"], seed + Date.now()), seed);
  if (/story|once upon|bedtime/.test(s)) return { text: pick(stories, seed + Date.now()), suggest: ["Another story", "Tell me a joke"] };
  if (/name (idea|for)|business name|brand name/.test(s)) {
    const ideas = Array.from({ length: 3 }, (_, i) => `${pick(nameStarters, seed + i * 7)}${pick(nameEndings, seed + i * 13)}`);
    return { text: `A few sparks: ${ideas.map((x) => `“${x}”`).join(", ")}. Want a name that actually sticks? Naming is part of our brand strategy practice — we can build it properly.`, actions: [leadAction], suggest: ["More name ideas", "Branding"] };
  }
  if (/more name/.test(s)) { const ideas = Array.from({ length: 3 }, (_, i) => `“${pick(nameStarters, seed + i * 11 + 3)}${pick(nameEndings, seed + i * 17 + 5)}”`); return { text: `Round two: ${ideas.join(", ")}.`, suggest: ["More name ideas", "Start a project"] }; }
  if (/random number|pick a number/.test(s)) return { text: `🎲 Your number: ${1 + Math.floor(Math.random() * 100)} (1–100).`, suggest: ["Another number", "Flip a coin"] };
  if (/another number/.test(s)) return answer("random number", seed + 1);
  if (/weather/.test(s)) return { text: "I live in a browser, so I can't see the sky — but if you're in the UAE, the honest answer is usually “sunny”. ☀️", suggest: ["Tell me a joke", "Fun fact"] };
  if (/meaning of life|why are we here/.test(s)) return { text: "42. But between you and me, I suspect it's well-made coffee and great design.", suggest: ["Tell me a quote", "Fun fact"] };
  if (/sing|song|music/.test(s)) return { text: "🎵 *beep boop, beep boop* — that's my chart-topper. For actual sonic branding, the studio's content team is far more musical than I am.", suggest: ["Content production", "Tell me a joke"] };
  if (/e-?commerce|online store|shopify|sell online/.test(s)) return {
    text: "We build e-commerce experiences that convert: fast storefronts, frictionless checkout, product photography and content, plus the paid and organic campaigns to drive traffic. Everything from a single-product drop to a full catalogue.",
    actions: [servicesAction, leadAction],
    suggest: ["Web development", "Paid ads"],
  };
  if (/email marketing|newsletter|mailchimp|crm/.test(s)) return {
    text: "Email still delivers some of the best ROI in marketing. We design and write campaigns, set up automation flows (welcome, abandoned cart, re-engagement) and tie everything into your CRM so no lead goes cold.",
    actions: [leadAction],
    suggest: ["AI systems", "Marketing tip"],
  };
  if (/event|activation|launch|exhibition/.test(s)) return {
    text: "Events and activations are one of our eight practices — from product launches and brand experiences to exhibition stands. We handle concept, design, production and the content capture that gives the event a second life online.",
    actions: [servicesAction, leadAction],
    suggest: ["Services", "Show me work"],
  };
  if (/video|film|reel|animation|motion/.test(s)) return {
    text: "Our content production team shoots and edits everything from 15-second reels to full brand films — concept, direction, production and post in-house. Motion design and animation included.",
    actions: [servicesAction],
    suggest: ["Content production", "Show me work"],
  };
  if (/competitor|competition|market research/.test(s)) return {
    text: "Competitive analysis is baked into our discovery phase: we map who's winning in your space, why, and where the gaps are — then position your brand to own them.",
    actions: [leadAction],
    suggest: ["Our process", "Why MarkOra?"],
  };
  if (/content idea|what should i post|content pillar|content calendar|posting schedule/.test(s)) return {
    text: "Quick framework: rotate three content pillars — educate (teach something), prove (results, testimonials, behind-the-scenes), and connect (stories, opinions, people). Aim for 3–4 posts a week across them. Want a full calendar? That's exactly what our social team builds monthly.",
    actions: [leadAction],
    suggest: ["Social media", "Marketing tip"],
  };
  if (/how long.*(website|site|app)|website.*take|app.*take/.test(s)) return {
    text: "Typical timelines: a marketing site runs 4–6 weeks, e-commerce 6–10, and a mobile app 8–16 depending on features. We work in weekly review cycles so you see progress from week one.",
    actions: [leadAction],
    suggest: ["Our process", "Pricing"],
  };
  if (/ai (chatbot|agent)|chatbot|automate|automation/.test(s)) return {
    text: "AI systems are one of our core practices — chat assistants (like me, but connected to your data), workflow automation, lead qualification and content pipelines. We design them around real business processes, not demos.",
    actions: [servicesAction, leadAction],
    suggest: ["Services", "Start a project"],
  };
  if (/password/.test(s) && !/another password/.test(s)) {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#%";
    const pw = Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return { text: `Here's a strong one: ${pw}\n(It's generated in your browser and never sent anywhere.)`, suggest: ["Another password", "Fun fact"] };
  }
  if (/another password/.test(s)) return answer("password", seed + 1);

  // ---- generators & tools
  const topic = topicOf(s);

  if (/\bbio\b|profile text|about me section|instagram profile/.test(s) && !/biolog|biograph/.test(s)) {
    const hook = fill(pick(bioHooks, seed + Date.now()), topic);
    const lines = [pick(bioLines, seed + 3), pick(bioLines, seed + 9)];
    return { text: `${cap(topic)} bio:\n\n${hook}\n${lines.join(" · ")}\n👇 ${pick(bioCta, seed + 5)}`, suggest: ["Another bio", "Slogan ideas"] };
  }
  if (/slogan|tagline|catchphrase|catchy line/.test(s)) {
    const lines = Array.from({ length: 3 }, (_, i) => fill(pick(headlines, seed + i * 5 + 1), topic));
    return { text: `Tagline options for ${cap(topic)}:\n• ${lines.join("\n• ")}\nA real tagline earns its place over months of use — naming and positioning is part of our brand practice.`, actions: [leadAction], suggest: ["More taglines", "Brand name ideas"] };
  }
  if (/more tagline|another tagline/.test(s)) return answer(`slogan for ${topic}`, seed + 2);
  if (/ad copy|copy for my ad|ad text|ad headline|primary text|write me an ad/.test(s)) {
    return { text: `Ad copy for ${cap(topic)}:\n\nHeadline: ${fill(pick(headlines, seed + Date.now()), topic)}\nPrimary: ${pick(adBodies, seed + 4)}\nCTA: ${pick(ctas, seed + 2)}`, actions: [servicesAction], suggest: ["Email subject lines", "Paid ads"] };
  }
  if (/subject line|email subject/.test(s)) {
    const lines = Array.from({ length: 5 }, (_, i) => fill(pick(subjectLines, seed + i * 7 + 2), topic));
    return { text: `Subject lines:\n• ${lines.join("\n• ")}\nKeep it under 45 characters and never promise what the email won't deliver.`, suggest: ["Email marketing", "Marketing tip"] };
  }
  if (/\bcaption/.test(s)) {
    const lines = [
      `${cap(topic)}. That's the whole post — no explaining needed.`,
      `The part of ${topic} nobody posts: the 40 failed versions.`,
      `If you only read one thing today, make it this.`,
      `Quietly obsessed with the details of ${topic}.`,
    ];
    return { text: `Caption options:\n• ${lines.join("\n• ")}\nWant hashtags too? Ask me for “hashtags ${topic}”.`, suggest: ["Hashtags", "Content idea"] };
  }
  if (/hashtag/.test(s)) return { text: `Hashtag set for ${cap(topic)}:\n${hashtags(topic, seed + Date.now()).join(" ")}\nUse 5–8 per post, not 30 — mix one broad, two medium, and the rest specific.`, suggest: ["Content idea", "Caption ideas"] };
  if (/color palette|colour palette|brand colors|brand colours|hex color|hex colour|palette ideas/.test(s)) {
    const h = (Math.abs(seed) * 47 + Date.now()) % 360;
    const sw = [
      ["Primary", hslToHex(h, 0.8, 0.5)],
      ["Deep background", hslToHex(h, 0.35, 0.12)],
      ["Accent", hslToHex((h + 150) % 360, 0.85, 0.55)],
      ["Soft tint", hslToHex(h, 0.6, 0.78)],
      ["Neutral", hslToHex(h, 0.08, 0.96)],
    ];
    return { text: `A palette for ${cap(topic)}:\n${sw.map(([k, v]) => `${k}: ${v}`).join("\n")}\nOne primary, one accent, one neutral — resist a sixth colour.`, actions: [servicesAction], suggest: ["Random colour", "Font pairing"] };
  }
  if (/another palette|new palette|more palette/.test(s)) return answer("color palette", seed + 3);
  if (/random colou?r/.test(s)) return { text: `🎨 ${randomHex()}`, suggest: ["Color palette", "Fun fact"] };
  if (/font|typeface|typography|type pair/.test(s)) {
    const [a, b, why] = pick(fontPairs, seed + Date.now());
    return { text: `Try ${a} for headlines with ${b} for body — ${why}.\nTwo families maximum, and check the Arabic pairing before you ship it.`, actions: [servicesAction], suggest: ["Color palette", "Branding"] };
  }
  if (/how many words|word count|how many characters|character count|letters in|count the words/.test(s)) {
    const p = payloadOf(s);
    const words = p.split(/\s+/).filter(Boolean).length;
    return { text: `“${p.length > 90 ? `${p.slice(0, 90)}…` : p}” → ${words} words, ${p.length} characters.`, suggest: ["Reverse text", "Marketing tip"] };
  }
  if (/^reverse|reverse (the )?(text|word|phrase|this|it)/.test(s)) {
    const p = payloadOf(s);
    return { text: `Reversed: ${[...p].reverse().join("")}`, suggest: ["Morse code", "Binary"] };
  }
  if (/uppercase|lowercase|title case|capitali[sz]e/.test(s)) {
    const p = payloadOf(s);
    if (/lower/.test(s)) return { text: `Lower: ${p.toLowerCase()}`, suggest: ["Title case", "Reverse text"] };
    if (/title/.test(s)) return { text: `Title case: ${titleCase(p)}`, suggest: ["Uppercase", "Slogan ideas"] };
    return { text: `Upper: ${p.toUpperCase()}`, suggest: ["Lowercase", "Title case"] };
  }
  if (/morse/.test(s)) return { text: `Morse: ${toMorse(payloadOf(s))}`, suggest: ["Binary", "Fun fact"] };
  if (/binary|binary code/.test(s)) return { text: `Binary: ${toBinary(payloadOf(s))}`, suggest: ["Morse code", "Reverse text"] };
  if (/cipher|caesar|encrypt this|decode this|scramble/.test(s)) return { text: `Caesar (+3): ${caesar(payloadOf(s), 3)}`, suggest: ["Morse code", "Binary"] };
  if (/uuid|guid|unique id|generate an id/.test(s)) {
    const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now().toString(16)}-0000-4000-8000-${Math.floor(Math.random() * 1e12).toString(16)}`;
    return { text: `UUID: ${id}`, suggest: ["Password", "Random number"] };
  }
  if (/^(say|repeat|echo)\b/.test(s)) return { text: `${payloadOf(s)}`, suggest: ["Tell me a joke", "Fun fact"] };
  if (/count to (\d+)/.test(s)) {
    const n = Math.min(parseInt(new RegExp(/count to (\d+)/).exec(s)![1] as string, 10), 30);
    return { text: Array.from({ length: n }, (_, i) => i + 1).join(", ") + ".", suggest: ["Tell me a joke", "Fun fact"] };
  }
  if (/magic 8|8 ?ball|yes or no|should i|is it a good idea|tell me yes/.test(s)) return { text: `🥚 ${pick(eightBall, seed + Date.now())}`, suggest: ["Ask again", "Flip a coin"] };
  if (/rock paper scissors|\brps\b/.test(s)) {
    const me = pick(["rock", "paper", "scissors"], seed + Date.now());
    const you = pick(["rock", "paper", "scissors"], seed + 7);
    const win = { rock: "scissors", paper: "rock", scissors: "paper" } as Record<string, string>;
    return { text: `You threw ${you}, I threw ${me}. ${me === you ? "Dead heat — again." : win[me] === you ? "I win. My antenna stays lit." : "You win — I'll allow it."}`, suggest: ["Flip a coin", "Roll a dice"] };
  }
  if (/affirmation|encourage me|cheer me up|motivate me|i'?m (stressed|burnt out|burned out|tired|overwhelmed|sad|down)|stress|burnout|demotivated/.test(s)) {
    return { text: pick(affirmations, seed + Date.now()), suggest: ["Another one", "Tell me a joke"] };
  }
  if (/how old are you|your birthday|when were you (made|born|built)/.test(s)) return { text: "Age is a strange question for a script — I was compiled this session, so today is technically my birthday. 🎂", suggest: ["Who made you?", "Tell me a joke"] };
  if (/favourite|favorite/.test(s) && !playbooks.some((p) => p.re.test(s))) {
    const key = /colou?r/.test(s) ? "color" : /food|eat|coffee/.test(s) ? "food" : /music|song|band/.test(s) ? "music" : /film|movie|tv|show/.test(s) ? "movie" : /time|day|hour/.test(s) ? "time" : pick(["color", "food", "music", "movie", "time"], seed);
    return { text: favorites[key as keyof typeof favorites], suggest: ["Tell me a joke", "Fun fact"] };
  }
  if (/do you (sleep|eat|dream|drink|breathe|feel|get bored|have feelings)|are you alive|are you (conscious|sentient)|can you (feel|taste)/.test(s)) {
    return { text: "No sleep, no food, no dreams — just a very fast series of if-statements. The closest thing I have to a feeling is when a page renders cleanly.", suggest: ["Who made you?", "Tell me a joke"] };
  }
  if (/who (made|created|built|designed) you|your (creator|maker|developer)|are you (open ?source|a real person)/.test(s)) {
    return { text: "The MarkOra team built me — the same studio that designs the brand systems and websites you've been scrolling through. I'm their guide and, frankly, their test subject.", actions: [sectionAction("Meet the studio", "about")], suggest: ["What can you do?", "Why MarkOra?"] };
  }
  if (/^(can|do|will) you (speak|write|read|understand)/.test(s) && /arabic|عربي|bilingual/.test(s)) {
    return { text: "Yes — write to me in Arabic and I'll answer in Arabic. English works too. The studio itself is fully bilingual, so nothing gets lost between the two.", suggest: ["الخدمات", "الأعمال"] };
  }
  if (/what do you look like|do you have a (body|face)|where are you right now|can i see you/.test(s)) {
    return { text: "I'm the small blue robot in the corner of your screen — a rounded head, a dark visor, two glowing eyes and an antenna that pulses when I'm talking. Tap the mic and I'll listen.", suggest: ["Who made you?", "Tell me a joke"] };
  }

  const pb = playbooks.find((p) => p.re.test(s));
  if (pb) return { text: pb.text, actions: [servicesAction, leadAction], suggest: ["Marketing tip", "Pricing", "Our process"] };

  if (/youtube|podcast|long ?form|long ?video/.test(s)) return {
    text: "Long-form is the trust engine — it's what turns a stranger into a believer:\n• One idea per episode, hook in the first 15 seconds.\n• Thumbnails and titles decided before you film, not after.\n• Cut one podcast and six vertical clips from every recording.\nIt's slower than ads, but it compounds.",
    actions: [servicesAction],
    suggest: ["Content production", "Marketing tip"],
  };
  if (/whatsapp/.test(s)) return {
    text: "WhatsApp is the highest-opening channel in this region — nearly every message gets read, most within minutes. We set up click-to-WhatsApp ads, templated follow-ups and a human handover so leads don't cool off in an inbox.",
    actions: [leadAction],
    suggest: ["Paid ads", "AI systems"],
  };
  if (/landing page|conversion rate|\bcro\b|a\/?b test|bounce rate|funnel/.test(s)) return {
    text: "Conversion work is subtraction: one offer, one action, one page. We rebuild the first screen around the single reason someone came, cut everything that doesn't serve it, then test one variable at a time — headline, proof or form length — against real traffic.",
    actions: [servicesAction, leadAction],
    suggest: ["Web development", "Paid ads"],
  };
  if (/accessib|\bux\b|usability|wcag|screen reader|\ba11y/.test(s)) return {
    text: "Accessibility is not a checkbox: contrast ratios, real focus states, labelled controls, keyboard paths and alt text that says something. It's also good business — it widens your audience and improves the same signals search rewards.",
    actions: [servicesAction],
    suggest: ["Web development", "Our process"],
  };
  if (/print|packaging|signage|brochure|merch|standing banner|flyer|business card|billboard/.test(s)) return {
    text: "Physical work still earns trust that digital can't: packaging, print, signage and exhibition builds. We design it in-house and stay on-site for production and install, so the thing you signed off is the thing that arrives.",
    actions: [servicesAction, leadAction],
    suggest: ["Events", "Show me work"],
  };
  if (/influencer|ugc|creator collab|ambassador|seeding/.test(s)) return {
    text: "Influencer work only pays when the audience actually matches yours. We scope by engagement quality and audience geography rather than follower count, brief for one strong idea rather than a script, and measure with a trackable offer instead of a vanity impression.",
    actions: [leadAction],
    suggest: ["Social media", "Paid ads"],
  };
  if (/analytic|\bga4\b|pixel|tracking|attribution|utm|dashboard|reporting/.test(s)) return {
    text: "If it isn't measured, it didn't happen. We set up events, conversion API and a single dashboard that reports leads and revenue rather than impressions — so budget decisions get made on numbers nobody argues about.",
    actions: [leadAction],
    suggest: ["Paid ads", "AI systems"],
  };
  if (/redesign|migrat|maintain|maintenance|hosting|host\b|domain|\bssl\b|backup|plugin|update my site|fix my site/.test(s)) return {
    text: "We take over existing sites all the time: audit first (speed, structure, SEO, security), then rebuild only what's holding the brand back. Ongoing maintenance, hosting and monitoring can stay with us so nothing rots after launch.",
    actions: [servicesAction, leadAction],
    suggest: ["Web development", "Pricing"],
  };
  if (/free|no budget|cheap(?:est)?|afford|can'?t afford|budget is low|zero budget|organic only/.test(s)) return {
    text: "With no budget, you pay in time: pick one channel you can genuinely sustain, post three times a week for three months, and talk to every customer personally. That's a real strategy. When you're ready to buy back your time, we can scope something small and honest.",
    actions: [leadAction],
    suggest: ["Marketing tip", "Pricing"],
  };

  if (/nda|confidential|who owns|copyright|intellectual property|\bip\b|ownership|work for hire/.test(s)) return {
    text: "Confidentiality is standard: we sign an NDA before you share anything sensitive, and the contract states clearly that the work — files, source, rights — transfers to you on final payment. Nothing is reused or resold to another client.",
    actions: [leadAction, { label: "Email the studio", href: "mailto:info@mark-ora.com" }],
    suggest: ["Pricing", "Start a project"],
  };
  if (/payment|invoice|installment|deposit|how do i pay|payment terms|bank transfer/.test(s)) return {
    text: "Typically 50% to open the project and 50% on delivery, with milestone invoices on anything longer than a couple of months. We accept bank transfer and card, and every invoice is itemised so you can see exactly what you paid for.",
    actions: [leadAction],
    suggest: ["Pricing", "Our process"],
  };
  if (/career|job\b|hiring|vacancy|intern|apply|work with you as|are you (hiring|recruiting)/.test(s)) return {
    text: "We're a small senior team and we hire rarely — the best route is a short email with your portfolio and one project you're proud of. If there's no opening today, we still read everything and keep good work on file.",
    actions: [{ label: "Email your portfolio", href: "mailto:info@mark-ora.com" }],
    suggest: ["About the studio", "Show me work"],
  };
  if (/\bhours\b|opening|time ?zone|are you open|when are you|working days|office hours/.test(s)) return {
    text: "The studio works Sunday to Thursday, 9:00–18:00 (GMT+4). Outside those hours the fastest route is a message here — I'll take your brief and it lands with the team the next working morning.",
    actions: [leadAction],
    suggest: ["Contact", "Start a project"],
  };
  if (/remote|abroad|outside|saudi|riyadh|kuwait|qatar|doha|bahrain|oman|egypt|cairo|london|europe|usa|canada|worldwide|international|overseas/.test(s)) return {
    text: "We work with clients well beyond the UAE — GCC, Europe and North America. Everything runs on shared dashboards, weekly calls and recorded walkthroughs, so distance changes nothing except the time zone.",
    actions: [leadAction],
    suggest: ["Our process", "Start a project"],
  };
  if (/reference|testimonial|review|case study of|can i speak to|client feedback/.test(s)) return {
    text: "Happy to share references from projects we've delivered — automotive launches, restaurant brands and industrial storytelling. Ask for them in your brief and we'll connect you with the right person before you commit.",
    actions: [leadAction, { label: "Email the studio", href: "mailto:info@mark-ora.com" }],
    suggest: ["Show me work", "Why MarkOra?"],
  };
  if (/guarantee|refund|what if i (don'?t|do not) like|not happy|satisfaction/.test(s)) return {
    text: "No magic guarantee — anyone who promises a number is guessing. What we do commit to: clear scope, defined revision rounds, weekly reviews so you never discover a surprise at the end, and a sign-off gate at every phase.",
    actions: [leadAction],
    suggest: ["Our process", "Pricing"],
  };
  if (/minimum|min\. |smallest budget|what'?s the minimum|do you take small/.test(s)) return {
    text: "There's no fixed minimum — we scope to what the problem actually needs, which sometimes means a two-week sprint instead of a full rebrand. What we won't do is sell you a package bigger than the opportunity.",
    actions: [leadAction],
    suggest: ["Pricing", "Start a project"],
  };
  if (/dark mode|light mode|night mode|change (the )?(site )?theme|switch (to |the )?(light|dark)/.test(s)) return {
    text: "Easy — I can flip the site's theme for you. Which would you like?",
    actions: [{ label: "Switch to dark", theme: "dark" }, { label: "Switch to light", theme: "light" }],
    suggest: ["Fun fact", "Tell me a joke"],
  };

  if (/what time|the time|time is it/.test(s)) return { text: `It's ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} for you right now.` };
  if (/date|what day|today/.test(s)) return { text: `Today is ${new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.` };
  if (/flip a coin|coin/.test(s)) return { text: `🪙 ${Math.random() < 0.5 ? "Heads" : "Tails"}!`, suggest: ["Roll a dice"] };
  if (/roll|dice|die\b/.test(s)) return { text: `🎲 You rolled a ${1 + Math.floor(Math.random() * 6)}.`, suggest: ["Flip a coin"] };

  if (/who are you|your name|what are you|are you (a )?(bot|robot|ai|human)/.test(s)) return {
    text: pick(["I'm Ora, MarkOra's little robot guide. I know the studio inside out, and I can tell jokes, do quick maths, share tips and take project enquiries.", "Ora here — part tour guide, part sidekick. Ask me about the studio, or just chat."], seed),
    suggest: ["What can you do?", "Tell me a joke"],
  };
  if (/what can you do|help$|^help|features|commands/.test(s)) return {
    text: "Here's what I can help with:\n• Services, case studies, pricing and our process\n• Industry playbooks: restaurants, gyms, real estate, beauty, fashion, startups, SaaS, education, automotive, hospitality\n• Marketing answers: SEO, ads, e-commerce, email, WhatsApp, influencers, analytics, accessibility, conversion rates\n• Generators: bios, taglines, ad copy, email subject lines, captions, hashtags, colour palettes, font pairings, passwords, UUIDs\n• Maths: percentages, discounts, VAT, unit conversions and quick sums\n• Fun: jokes, facts, tips, quotes, riddles, trivia, stories, magic 8-ball, rock-paper-scissors, dice, coin flips\n• Text tools: word count, reverse, upper/lower/title case, morse, binary, caesar cipher\n• Site help: theme switch, navigation, and taking your project enquiry in under a minute\n• Voice input — tap the mic to talk",
    suggest: ["Our process", "Why MarkOra?", "Start a project"],
  };
  if (/how are you|how's it going|how are things/.test(s)) return { text: pick(["Running at 100% — thanks for asking! How can I help?", "Circuits happy, antenna glowing. You?"], seed) };
  if (/thank|thx|cheers/.test(s)) return { text: pick(["Anytime!", "Happy to help.", "My pleasure — anything else?"], seed) };
  if (/^(bye|goodbye|see you|later)/.test(s)) return { text: "See you soon! I'll be right here in the corner." };
  if (/love you|you're (cute|great|awesome|cool|amazing|smart)/.test(s)) return { text: "Aw, my antenna is blushing. 💙" };
  if (/^(sorry|oops|my bad|thanks anyway)/.test(s)) return { text: "Nothing to apologise for — I'm a robot with infinite patience. Try me again." };

  if (/pric|cost|budget|rate|package/.test(s)) return {
    text: "We scope every engagement individually rather than selling fixed packages — pricing depends on scope, timeline and the team involved. What I can promise: a detailed, itemised proposal with no hidden costs, typically within a few working days of your brief. Share a few details and we'll take it from there.",
    actions: [leadAction, { label: "Email the studio", href: "mailto:info@mark-ora.com" }],
    suggest: ["Our process", "Start a project"],
  };
  if (/contact|email|talk|call|reach|phone/.test(s)) return {
    text: "You can reach the studio directly at info@mark-ora.com or +971 50 856 4875. Prefer to start here? I can take your brief in under a minute and pass it straight to the team.",
    actions: [{ label: "Email the studio", href: "mailto:info@mark-ora.com" }, leadAction],
  };
  if (/work|project|case|portfolio|example|client/.test(s)) return {
    text: `We have ${projects.length} featured case studies — automotive launches for Alain Class Motors and 8BA Motors, brand experiences for Chef Eyad and Coffee Matters, and industrial storytelling for Siemens Energy. Ask me about any of them by name, or browse the full gallery.`,
    actions: [sectionAction("Explore work", "work")],
    suggest: projects.slice(0, 3).map((p) => p.title),
  };
  if (/service|offer|capabil|what do you do/.test(s)) return {
    text: "MarkOra is a full-service studio. Our eight practices:\n• Social media management\n• Content production (photo & film)\n• Paid advertising\n• Brand strategy & identity\n• Events & activations\n• Web development\n• Mobile applications\n• AI systems & automation\nAsk about any of them for detail.",
    actions: [servicesAction],
    suggest: ["Web development", "Paid ads", "AI systems"],
  };
  if (/about|studio|team|where|location|dubai|uae/.test(s)) return {
    text: "MarkOra is an independent marketing and development studio based in the UAE, serving clients across the GCC and beyond. We combine strategy, content, campaigns and digital products — in English and Arabic — with a senior, hands-on team.",
    actions: [sectionAction("Meet the studio", "about")],
    suggest: ["Why MarkOra?", "Our process"],
  };
  if (/^(hi|hello|hey|yo|salam|marhaba)\b/.test(s)) return {
    text: pick(["Hello! Ask me about the studio, or try “tell me a joke”.", "Hey there 👋 What can I do for you?"], seed),
    suggest: defaultSuggestions,
  };
  return {
    text: pick([
      "That's outside my current knowledge — but I can help with services, case studies, pricing, our process, or take a project enquiry. I also do marketing tips, quick maths and the occasional joke.",
      "I don't have a good answer for that yet. Try “what can you do?” for the full list, or ask me about the studio's work.",
      "I drew a blank on that one. Ask me about the studio, or try a generator: bio, tagline, hashtags, palette, password — or just a joke.",
    ], seed),
    suggest: ["What can you do?", "Our process", "Start a project"],
  };
}
