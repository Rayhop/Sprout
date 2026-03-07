import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    :root {
      --forest: #030a06;
      --canopy: #0a1a0e;
      --bark: #111f15;
      --moss: #0d2b12;
      --emerald: #10b981;
      --leaf: #34d399;
      --sage: #6ee7b7;
      --gold: #d97706;
      --amber: #f59e0b;
      --cream: #faf7f0;
      --parchment: #e8e0d0;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--forest); }
    .display { font-family: 'Cormorant Garamond', serif; }
    .body-font { font-family: 'DM Sans', sans-serif; }
    @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
    @keyframes sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
    @keyframes shimmer { 0% { opacity:0.3; } 50% { opacity:0.8; } 100% { opacity:0.3; } }
    @keyframes rise { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }
    @keyframes grain {
      0%, 100% { transform: translate(0,0); }
      10% { transform: translate(-1%,-1%); }
      30% { transform: translate(1%,1%); }
      50% { transform: translate(-1%,0.5%); }
      70% { transform: translate(0.5%,-0.5%); }
      90% { transform: translate(-0.5%,1%); }
    }
    .grain::after {
      content: '';
      position: fixed;
      inset: -200%;
      width: 400%;
      height: 400%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
      opacity: 0.04;
      pointer-events: none;
      animation: grain 8s steps(10) infinite;
      z-index: 9999;
    }
    .glow-emerald { box-shadow: 0 0 40px rgba(16,185,129,0.15), 0 0 80px rgba(16,185,129,0.05); }
    .glow-gold { box-shadow: 0 0 40px rgba(217,119,6,0.2), 0 0 80px rgba(217,119,6,0.08); }
    .text-gradient-emerald { background: linear-gradient(135deg, #34d399, #10b981, #6ee7b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .text-gradient-gold { background: linear-gradient(135deg, #f59e0b, #d97706, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .border-glow { border: 1px solid rgba(16,185,129,0.15); }
    .card-bg { background: linear-gradient(135deg, rgba(13,27,18,0.8), rgba(3,10,6,0.6)); backdrop-filter: blur(12px); }
    .section-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent); }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--forest); }
    ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 2px; }
  `}</style>
);

// ─── SVG Tree ─────────────────────────────────────────────────────────────────
type TreeSize = "sm" | "md" | "lg" | "xl";
type TreeTrait = "deep_roots" | "full_bloom" | "golden_canopy" | "grove_maker";
type TreeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type TreeConfig = {
  trunk: string;
  c1: string;
  c2: string;
  glow: string;
  bloom?: boolean;
  large?: boolean;
  golden?: boolean;
  legendary?: boolean;
};

type TreeProps = {
  level?: number;
  animate?: boolean;
  size?: TreeSize;
  traits?: TreeTrait[];
};

const Tree = ({
  level = 1,
  animate = false,
  size = "md",
  traits = [],
}: TreeProps) => {
  const sizes = {
    sm: "h-20 w-16",
    md: "h-32 w-24",
    lg: "h-48 w-36",
    xl: "h-64 w-48",
  } satisfies Record<TreeSize, string>;
  const configs: Record<TreeLevel, TreeConfig> = {
    1: { trunk: "#6b4226", c1: "#16a34a", c2: "#15803d", glow: "#22c55e" },
    2: { trunk: "#7c4d30", c1: "#22c55e", c2: "#16a34a", glow: "#4ade80" },
    3: { trunk: "#8b5e3c", c1: "#34d399", c2: "#10b981", glow: "#6ee7b7" },
    4: {
      trunk: "#92400e",
      c1: "#fbbf24",
      c2: "#f59e0b",
      glow: "#fde68a",
      bloom: true,
    },
    5: { trunk: "#6b3a1f", c1: "#059669", c2: "#047857", glow: "#10b981" },
    6: {
      trunk: "#4a2512",
      c1: "#065f46",
      c2: "#064e3b",
      glow: "#059669",
      large: true,
    },
    7: {
      trunk: "#3b1a08",
      c1: "#d97706",
      c2: "#b45309",
      glow: "#fbbf24",
      golden: true,
    },
    8: {
      trunk: "#1c0a00",
      c1: "#92400e",
      c2: "#78350f",
      glow: "#f59e0b",
      legendary: true,
    },
  };
  const clampedLevel = Math.min(Math.max(level, 1), 8) as TreeLevel;
  const cfg = configs[clampedLevel];
  const hasDeepRoots = traits.includes("deep_roots");
  const hasBloom = traits.includes("full_bloom") || cfg.bloom;
  const hasGolden = traits.includes("golden_canopy") || cfg.golden;
  const hasSaplings = traits.includes("grove_maker");

  return (
    <div
      className={`relative ${sizes[size]} flex items-end justify-center`}
      style={animate ? { animation: "float 4s ease-in-out infinite" } : {}}
    >
      <div
        className="absolute inset-0 rounded-full opacity-25 blur-2xl"
        style={{ background: cfg.glow }}
      />
      <svg
        viewBox="0 0 80 110"
        className="relative z-10 w-full h-full drop-shadow-lg"
      >
        <ellipse cx="40" cy="107" rx="18" ry="3" fill={cfg.c2} opacity="0.25" />
        <rect x="36" y="72" width="8" height="30" rx="3" fill={cfg.trunk} />
        <path
          d="M36 95 Q28 102 20 100"
          stroke={cfg.trunk}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M44 95 Q52 102 60 100"
          stroke={cfg.trunk}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {hasDeepRoots && (
          <>
            <path
              d="M36 92 Q24 102 14 100"
              stroke={cfg.trunk}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M44 92 Q56 102 66 100"
              stroke={cfg.trunk}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
          </>
        )}
        <ellipse cx="40" cy="58" rx="24" ry="22" fill={cfg.c1} opacity="0.85" />
        <ellipse cx="40" cy="45" rx="20" ry="18" fill={cfg.c1} />
        <ellipse cx="40" cy="34" rx="15" ry="14" fill={cfg.c1} opacity="0.95" />
        <ellipse cx="40" cy="24" rx="10" ry="10" fill={cfg.c1} />
        <ellipse cx="40" cy="16" rx="6" ry="6" fill={cfg.c2} />
        {hasGolden && (
          <>
            <ellipse
              cx="40"
              cy="14"
              rx="7"
              ry="6"
              fill="#fbbf24"
              opacity="0.5"
            />
            {[0, 51, 103, 154, 205, 257, 308].map((a, i) => (
              <circle
                key={i}
                cx={40 + 13 * Math.cos((a * Math.PI) / 180)}
                cy={25 + 13 * Math.sin((a * Math.PI) / 180)}
                r="1.8"
                fill="#fbbf24"
                opacity="0.7"
              />
            ))}
          </>
        )}
        {hasBloom &&
          [
            [24, 50],
            [56, 50],
            [18, 61],
            [62, 61],
            [32, 38],
            [49, 36],
            [40, 66],
            [22, 70],
            [58, 70],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="3"
              fill="#fb7185"
              opacity="0.85"
            />
          ))}
        {cfg.legendary && (
          <>
            <ellipse
              cx="40"
              cy="40"
              rx="28"
              ry="26"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.8"
              opacity="0.25"
              strokeDasharray="3 4"
            />
            <ellipse
              cx="40"
              cy="40"
              rx="32"
              ry="30"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.5"
              opacity="0.15"
              strokeDasharray="2 6"
            />
          </>
        )}
        {hasSaplings && (
          <>
            <rect
              x="11"
              y="96"
              width="4"
              height="10"
              rx="1"
              fill={cfg.trunk}
              opacity="0.6"
            />
            <ellipse
              cx="13"
              cy="91"
              rx="5"
              ry="5"
              fill={cfg.c1}
              opacity="0.6"
            />
            <rect
              x="64"
              y="96"
              width="4"
              height="10"
              rx="1"
              fill={cfg.trunk}
              opacity="0.6"
            />
            <ellipse
              cx="66"
              cy="91"
              rx="5"
              ry="5"
              fill={cfg.c1}
              opacity="0.6"
            />
          </>
        )}
      </svg>
    </div>
  );
};

// ─── Particles ────────────────────────────────────────────────────────────────
const Particles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    dur: 6 + Math.random() * 8,
    size: 2 + Math.random() * 3,
    opacity: 0.1 + Math.random() * 0.2,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-400"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -window.innerHeight - 20],
            opacity: [p.opacity, p.opacity * 0.5, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// ─── Nav ──────────────────────────────────────────────────────────────────────

// ─── Hero Section ─────────────────────────────────────────────────────────────
const Hero = () => (
  <section
    className="relative pt-20 min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    id="how-it-works"
  >
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="text-center space-y-6 max-w-3xl relative z-10 mt-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-4 py-2 body-font"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse block" />
        <span className="text-xs uppercase tracking-[0.2em] text-emerald-400/70">
          How Sprout Works
        </span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9 }}
        className="display text-5xl md:text-7xl font-light text-white leading-[1.1] tracking-tight"
      >
        From a seed to
        <br />
        <em className="text-gradient-emerald not-italic">a living legacy</em>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="body-font text-base text-white/40 max-w-lg mx-auto leading-relaxed font-light"
      >
        Your savings become a living tree — private, permanent, and built to be
        passed on to the people you love most.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
      >
        <button className="body-font w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105">
          Start Growing Free
        </button>
        <button className="body-font w-full sm:w-auto border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm px-8 py-3.5 rounded-full transition-all duration-200">
          See a demo →
        </button>
      </motion.div>
    </motion.div>

    {/* Trees row */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="flex items-end justify-center gap-4 md:gap-8 mt-16 relative z-10"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl, i) => (
        <motion.div
          key={lvl}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + i * 0.08 }}
          className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default group"
        >
          <Tree
            level={lvl}
            size={lvl === 4 ? "md" : "sm"}
            animate={lvl === 4}
          />
          <span className="body-font text-[9px] text-white/20 group-hover:text-emerald-500/50 transition-colors hidden md:block">
            Lv.{lvl}
          </span>
        </motion.div>
      ))}
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="body-font text-[10px] uppercase tracking-widest text-white/20">
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="h-6 w-px bg-linear-to-b from-emerald-500/40 to-transparent"
      />
    </motion.div>
  </section>
);

// ─── 3-Step Overview ──────────────────────────────────────────────────────────
const Overview = () => {
  const cards = [
    {
      step: "01",
      icon: "🌱",
      title: "Sign up & save",
      body: "Enter your email, get a magic link, and start depositing. Your tree is born the moment you make your first deposit.",
      color: "emerald",
    },
    {
      step: "02",
      icon: "🌳",
      title: "Watch it evolve",
      body: "As your savings grow, your tree evolves through 8 stages — from a seed to a legendary ancient tree. Each level is permanent.",
      color: "emerald",
    },
    {
      step: "03",
      icon: "✨",
      title: "Pass it on",
      body: "Create a family tree for your child. Save money, add memories, and on the day you choose — everything transfers to them. Forever.",
      color: "gold",
    },
  ];
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl border-glow card-bg p-6 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 display text-4xl font-light text-white/5">
                {c.step}
              </div>
              <span className="text-3xl mb-4 block">{c.icon}</span>
              <h3 className="display text-xl font-medium text-white mb-2">
                {c.title}
              </h3>
              <p className="body-font text-sm text-white/40 leading-relaxed font-light">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Timeline ─────────────────────────────────────────────────────────────────
type TimelineStepProps = {
  step: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
  index: number;
};

const TimelineStep = ({
  step,
  title,
  subtitle,
  children,
  index,
}: TimelineStepProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex justify-start pt-12 md:gap-12 md:pt-24"
    >
      <div className="sticky top-32 z-40 flex max-w-xs flex-col self-start md:w-full md:flex-row lg:max-w-sm">
        <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-[#030a06] text-emerald-400/60 text-base md:left-3">
          {step}
        </div>
        <div className="hidden md:block md:pl-20">
          <p className="body-font text-[10px] uppercase tracking-[0.2em] text-emerald-600/50 mb-1">
            Step {index + 1}
          </p>
          <h3 className="display text-3xl font-light text-emerald-200/50 leading-tight">
            {title}
          </h3>
          <p className="body-font text-xs text-white/25 mt-1 font-light">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="relative w-full pl-20 pr-4 md:pl-4">
        <div className="md:hidden mb-5">
          <p className="body-font text-[10px] uppercase tracking-widest text-emerald-600/50 mb-1">
            Step {index + 1}
          </p>
          <h3 className="display text-2xl font-light text-emerald-200/60">
            {title}
          </h3>
          <p className="body-font text-xs text-white/25 mt-0.5">{subtitle}</p>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

const SignupStep = () => (
  <div className="space-y-4 max-w-md">
    <p className="body-font text-sm text-white/40 leading-relaxed font-light">
      Enter your email, click the magic link, and your first tree is planted. No
      passwords. No wallets. No seed phrases. Just you and your savings.
    </p>
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl border-glow card-bg p-6 space-y-4"
    >
      <div className="flex gap-1.5 mb-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
      </div>
      <div>
        <p className="body-font text-[10px] uppercase tracking-widest text-emerald-500/40 mb-1.5">
          Your email
        </p>
        <div className="flex items-center rounded-xl border border-emerald-500/15 bg-black/30 px-4 py-3 gap-2">
          <span className="body-font text-sm text-white/40">you@email.com</span>
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="ml-auto h-4 w-px bg-emerald-400"
          />
        </div>
      </div>
      <button className="body-font w-full rounded-xl bg-emerald-500/15 border border-emerald-500/25 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25 transition-colors">
        Send Magic Link →
      </button>
      <div className="flex items-center justify-center gap-6">
        {["No password", "No crypto", "Always free"].map((t, i) => (
          <span key={i} className="body-font text-[10px] text-white/20">
            ✓ {t}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);

const GrowthStep = () => {
  const [active, setActive] = useState(5);
  type GrowthLevel = {
    l: TreeLevel;
    n: string;
    s: string;
    traits: TreeTrait[];
  };
  const levels: GrowthLevel[] = [
    { l: 1, n: "Seed", s: "$0", traits: [] },
    { l: 2, n: "Sprout", s: "$50", traits: [] },
    { l: 3, n: "Young Plant", s: "$200", traits: [] },
    { l: 4, n: "Flowering", s: "$500", traits: ["full_bloom"] },
    { l: 5, n: "Small Tree", s: "$1,000", traits: [] },
    { l: 6, n: "Large Tree", s: "$2,500", traits: [] },
    { l: 7, n: "Golden Tree", s: "$5,000", traits: ["golden_canopy"] },
    {
      l: 8,
      n: "Legendary",
      s: "$10,000",
      traits: ["golden_canopy", "full_bloom"],
    },
  ];
  const cur = levels[active - 1];
  return (
    <div className="space-y-4 max-w-lg">
      <p className="body-font text-sm text-white/40 leading-relaxed font-light">
        Every deposit grows your tree. Eight distinct stages, each more majestic
        than the last. Click any level to preview.
      </p>
      <div className="rounded-2xl border-glow card-bg p-5 space-y-5">
        <div className="flex items-end gap-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Tree level={active} traits={cur.traits} animate size="md" />
            </motion.div>
          </AnimatePresence>
          <div className="flex-1 space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="display text-2xl font-medium text-white">
                  {cur.n}
                </p>
                <p className="body-font text-xs text-emerald-500/50 mt-0.5">
                  Starting at {cur.s}
                </p>
                <div className="flex gap-1 mt-3">
                  {levels.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setActive(i + 1)}
                      className={`h-1 flex-1 rounded-full cursor-pointer transition-all duration-300 ${i < active ? "bg-emerald-400" : "bg-white/8"}`}
                    />
                  ))}
                </div>
                <p className="body-font text-[10px] text-white/15 mt-1">
                  Level {active} of 8
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {levels.map(({ l, n, s }) => (
            <button
              key={l}
              onClick={() => setActive(l)}
              className={`rounded-xl border p-2 text-left transition-all duration-200 body-font ${active === l ? "border-emerald-500/35 bg-emerald-500/12" : "border-white/5 hover:border-emerald-500/20"}`}
            >
              <p
                className={`text-[10px] font-medium truncate ${active === l ? "text-emerald-300" : "text-white/40"}`}
              >
                {n}
              </p>
              <p className="text-[9px] text-white/20 mt-0.5">{s}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["Withdraw anytime", "Tree stays at peak", "Progress preserved"].map(
          (t, i) => (
            <span
              key={i}
              className="body-font text-[11px] border border-white/8 text-white/30 rounded-full px-3 py-1"
            >
              ✓ {t}
            </span>
          ),
        )}
      </div>
    </div>
  );
};

const FamilyStep = () => (
  <div className="space-y-4 max-w-md">
    <p className="body-font text-sm text-white/40 leading-relaxed font-light">
      Create a separate tree entirely for your child. Every deposit is locked as
      a gift from the moment you make it. This money is not yours — it never
      was.
    </p>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-emerald-500/15 card-bg p-5 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="body-font text-[10px] uppercase tracking-widest text-emerald-500/40 mb-1">
            Growing for
          </p>
          <p className="display text-xl font-medium text-white">Mia 🌱</p>
        </div>
        <div className="text-right">
          <p className="body-font text-[10px] text-white/20 mb-1">
            Saved so far
          </p>
          <p className="display text-2xl font-medium text-emerald-300">
            $3,240
          </p>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <Tree level={6} size="md" />
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-2.5 py-1">
            <span className="body-font text-[10px] font-medium text-emerald-400">
              Lv.6
            </span>
            <span className="body-font text-[10px] text-emerald-200/60">
              Large Tree
            </span>
          </div>
          <div>
            <div className="flex justify-between body-font text-[10px] text-white/25 mb-1">
              <span>Next level</span>
              <span>$5,000</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "64.8%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="h-full rounded-full bg-linear-to-r from-emerald-700 to-emerald-400"
              />
            </div>
          </div>
          <p className="body-font text-[10px] text-emerald-600/40">
            Inherits June 14, 2031
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 pt-3">
        <p className="body-font text-[10px] uppercase tracking-widest text-white/15 mb-2">
          Locked as her gift
        </p>
        <p className="body-font text-xs text-white/25 font-light italic">
          This money is for Mia, not you. From the moment you deposit, it
          belongs to her.
        </p>
      </div>
    </motion.div>
  </div>
);

const MemoriesStep = () => {
  const memories = [
    {
      e: "🌅",
      n: "The day you were born. I didn't sleep at all and I didn't want to.",
      m: "$500",
      y: "2016",
    },
    {
      e: "🎒",
      n: "First day of school. You held my hand and then let go.",
      m: "$1,000",
      y: "2019",
    },
    {
      e: "🎹",
      n: "You won your recital. I cried in the back row.",
      m: "$1,500",
      y: "2021",
    },
    {
      e: "⚽",
      n: "Your first goal. You ran to me first.",
      m: "$2,000",
      y: "2023",
    },
  ];
  return (
    <div className="space-y-4 max-w-md">
      <p className="body-font text-sm text-white/40 leading-relaxed font-light">
        At every $500 milestone, unlock a memory slot. Add a photo and a note.
        Stored on IPFS — permanent, uncensorable, forever.
      </p>
      <div className="space-y-2">
        {memories.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex gap-3 rounded-xl border border-white/5 bg-white/2 p-3 group hover:border-emerald-500/15 transition-colors"
          >
            <div className="shrink-0 h-11 w-11 rounded-lg bg-emerald-950/60 border border-emerald-500/10 flex items-center justify-center text-xl">
              {m.e}
            </div>
            <div className="flex-1 min-w-0">
              <p className="body-font text-xs text-white/60 leading-relaxed font-light italic">
                "{m.n}"
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="body-font text-[9px] text-emerald-600/40">
                  {m.m} milestone
                </span>
                <span className="h-px w-3 bg-white/10" />
                <span className="body-font text-[9px] text-white/20">
                  {m.y}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 rounded-xl border border-dashed border-emerald-500/15 p-3 cursor-pointer hover:border-emerald-500/30 transition-colors group"
        >
          <div className="h-11 w-11 rounded-lg border border-dashed border-emerald-500/15 flex items-center justify-center text-emerald-500/25 group-hover:text-emerald-400/50 text-xl transition-colors">
            +
          </div>
          <div>
            <p className="body-font text-xs text-white/25 group-hover:text-white/40 transition-colors">
              Unlock at $2,500
            </p>
            <p className="body-font text-[9px] text-emerald-600/30 mt-0.5">
              Stored on IPFS · Permanent
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InheritStep = () => (
  <div className="space-y-4 max-w-md">
    <p className="body-font text-sm text-white/40 leading-relaxed font-light">
      You set an inheritance date. The smart contract auto-triggers it — no
      action needed. Everything transfers: the money, the tree, the traits,
      every memory.
    </p>
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-amber-500/20 bg-linear-to-b from-amber-950/30 to-transparent p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-amber-400"
        />
        <p className="body-font text-[10px] uppercase tracking-[0.2em] text-amber-400/50">
          Inheritance Event · June 14, 2031
        </p>
      </div>
      <div className="flex flex-col items-center py-2 gap-3">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Tree
            level={7}
            traits={["golden_canopy", "full_bloom", "deep_roots"]}
            size="md"
          />
        </motion.div>
        <div className="text-center space-y-1">
          <p className="display text-lg font-light text-white/70">
            You built this for Mia.
          </p>
          <p className="display text-xl font-medium text-amber-300/80 italic">
            Now it's hers.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["$8,240", "Transferred"],
          ["23", "Memories"],
          ["6", "Traits"],
        ].map(([v, l], i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-xl border border-amber-500/10 bg-amber-950/20 px-3 py-2.5"
          >
            <span className="display text-lg font-medium text-amber-300/80">
              {v}
            </span>
            <span className="body-font text-[9px] text-amber-600/50 mt-0.5">
              {l}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
    <div className="rounded-xl border border-white/5 bg-white/2 p-4 flex gap-3">
      <span className="text-lg">📜</span>
      <div>
        <p className="body-font text-xs font-medium text-white/50">
          Legacy Complete Certificate
        </p>
        <p className="body-font text-[11px] text-white/25 mt-0.5 font-light leading-relaxed">
          You receive a permanent keepsake — a framed certificate commemorating
          your role. Your chapter ends here, beautifully.
        </p>
      </div>
    </div>
  </div>
);

const ChildStep = () => (
  <div className="space-y-4 max-w-md">
    <p className="body-font text-sm text-white/40 leading-relaxed font-light">
      After inheritance, the tree is Mia's alone. She sees the traits you
      earned, reads every memory, and builds her own savings on top of your
      foundation. You cannot see any of this.
    </p>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl border-glow card-bg p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="body-font text-[10px] uppercase tracking-widest text-white/20">
            My inherited tree
          </p>
          <p className="display text-lg font-medium text-white mt-0.5">
            Mia's Tree
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-2.5 py-1.5">
          <span className="text-xs">🔒</span>
          <span className="body-font text-[10px] text-emerald-400">
            Only you
          </span>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <Tree
          level={7}
          traits={["golden_canopy", "full_bloom", "deep_roots", "grove_maker"]}
          size="md"
        />
        <div className="flex-1">
          <p className="display text-2xl font-medium text-emerald-300">
            $9,180
          </p>
          <p className="body-font text-[10px] text-white/25 mt-0.5">
            $8,240 inherited + $940 yours
          </p>
        </div>
      </div>
      <div>
        <p className="body-font text-[10px] uppercase tracking-widest text-white/15 mb-2">
          Traits from your parent
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ["🌿", "Deep Roots", "Saved every week for 3 years"],
            ["✨", "Golden Canopy", "Reached Level 7"],
            ["🌸", "Full Bloom", "23 memories left for you"],
            ["🌲", "Steady Growth", "Never missed an auto-save"],
          ].map(([e, t, d], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="rounded-lg border border-white/5 bg-white/2 p-2.5"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{e}</span>
                <span className="body-font text-[10px] font-medium text-emerald-200/70">
                  {t}
                </span>
              </div>
              <p className="body-font text-[9px] text-white/25 leading-relaxed">
                {d}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
    <p className="body-font text-xs text-white/15 italic font-light">
      Your parent cannot see this tree. They never will again. This is yours.
    </p>
  </div>
);

const TimelineSection = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setHeight(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });
  const heightT = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityT = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const steps = [
    {
      icon: "✉️",
      title: "Plant a seed",
      subtitle: "Sign up in seconds",
      C: SignupStep,
    },
    {
      icon: "🌳",
      title: "Watch it grow",
      subtitle: "8 levels of evolution",
      C: GrowthStep,
    },
    {
      icon: "💚",
      title: "Build for your child",
      subtitle: "A gift locked from day one",
      C: FamilyStep,
    },
    {
      icon: "📸",
      title: "Leave memories",
      subtitle: "Stored on IPFS, forever",
      C: MemoriesStep,
    },
    {
      icon: "🎁",
      title: "The handoff",
      subtitle: "Everything transfers",
      C: InheritStep,
    },
    {
      icon: "⭐",
      title: "Their tree now",
      subtitle: "Private, permanent, theirs",
      C: ChildStep,
    },
  ];
  return (
    <section className="py-12 px-6" ref={containerRef}>
      <div ref={ref} className="relative mx-auto max-w-5xl px-4 pb-20 md:px-8">
        {steps.map(({ icon, title, subtitle, C }, i) => (
          <TimelineStep
            key={i}
            step={icon}
            title={title}
            subtitle={subtitle}
            index={i}
          >
            <C />
          </TimelineStep>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-px overflow-hidden bg-linear-to-b from-transparent via-emerald-500/10 to-transparent md:left-8"
        >
          <motion.div
            style={{ height: heightT, opacity: opacityT }}
            className="absolute inset-x-0 top-0 w-px rounded-full bg-linear-to-b from-emerald-400 via-emerald-300 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

// ─── Privacy Section ──────────────────────────────────────────────────────────
const Privacy = () => {
  const cols = [
    {
      title: "Your Personal Tree",
      icon: "🌱",
      who: "Only you",
      always: true,
      points: [
        "Completely private",
        "No one else can see it",
        "Not your parents",
        "Not your children",
        "Not Sprout",
      ],
      color: "emerald",
    },
    {
      title: "Your Family Tree",
      icon: "👨‍👧",
      who: "Only the parent",
      always: false,
      badge: "While building",
      points: [
        "Only you see it while building",
        "Your child never sees it early",
        "No financial surveillance",
        "Stores memories privately",
        "Disappears from your view at inheritance",
      ],
      color: "emerald",
    },
    {
      title: "Child's Inherited Tree",
      icon: "✨",
      who: "Only the child",
      always: false,
      badge: "After inheritance",
      points: [
        "Transfers completely at inheritance",
        "Parent loses all access",
        "Child owns it forever",
        "No parental visibility",
        "Child's privacy is absolute",
      ],
      color: "amber",
    },
  ];
  return (
    <section className="py-24 px-6" id="privacy">
      <div className="section-divider mb-24" />
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-4 py-2">
            <span className="text-sm">🔒</span>
            <span className="body-font text-[11px] uppercase tracking-[0.2em] text-emerald-400/70">
              Privacy Model
            </span>
          </div>
          <h2 className="display text-4xl md:text-5xl font-light text-white">
            No one sees your tree
            <br />
            <em className="text-gradient-emerald">but you</em>
          </h2>
          <p className="body-font text-sm text-white/35 max-w-lg leading-relaxed font-light">
            No public profiles. No financial surveillance. Every tree belongs
            exclusively to its owner — always.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4">
          {cols.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              viewport={{ once: true }}
              className={`rounded-2xl border card-bg p-6 space-y-4 ${c.color === "amber" ? "border-amber-500/15" : "border-glow"}`}
            >
              <span className="text-3xl block">{c.icon}</span>
              <div>
                <h3 className="display text-xl font-medium text-white">
                  {c.title}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 block" />
                  <span className="body-font text-[10px] text-emerald-300/70">
                    {c.who} {c.badge || "— Always"}
                  </span>
                </div>
              </div>
              <ul className="space-y-2">
                {c.points.map((p, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 body-font text-xs text-white/35 font-light"
                  >
                    <span className="text-emerald-500/40 mt-0.5 shrink-0">
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Calculator ───────────────────────────────────────────────────────────────
const Calculator = () => {
  const [monthly, setMonthly] = useState(50);
  const [years, setYears] = useState(10);
  const total = monthly * 12 * years;
  const level =
    total >= 10000
      ? 8
      : total >= 5000
        ? 7
        : total >= 2500
          ? 6
          : total >= 1000
            ? 5
            : total >= 500
              ? 4
              : total >= 200
                ? 3
                : total >= 50
                  ? 2
                  : 1;
  const names = [
    "",
    "Seed",
    "Sprout",
    "Young Plant",
    "Flowering",
    "Small Tree",
    "Large Tree",
    "Golden Tree",
    "Legendary Tree",
  ];
  return (
    <section className="py-24 px-6" id="calculator">
      <div className="section-divider mb-24" />
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-4 py-2">
            <span className="text-sm">🧮</span>
            <span className="body-font text-[11px] uppercase tracking-[0.2em] text-emerald-400/70">
              Savings Calculator
            </span>
          </div>
          <h2 className="display text-4xl md:text-5xl font-light text-white">
            See what you could
            <br />
            <em className="text-gradient-emerald">build for them</em>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border-glow card-bg p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="body-font text-xs text-white/40 uppercase tracking-widest">
                  Monthly deposit
                </label>
                <span className="display text-xl font-medium text-emerald-300">
                  ${monthly}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={monthly}
                onChange={(e) => setMonthly(+e.target.value)}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 ${((monthly - 10) / 490) * 100}%, rgba(255,255,255,0.08) ${((monthly - 10) / 490) * 100}%)`,
                }}
              />
              <div className="flex justify-between body-font text-[10px] text-white/15">
                <span>$10</span>
                <span>$500</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="body-font text-xs text-white/40 uppercase tracking-widest">
                  Years saving
                </label>
                <span className="display text-xl font-medium text-emerald-300">
                  {years} yrs
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={years}
                onChange={(e) => setYears(+e.target.value)}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 ${((years - 1) / 19) * 100}%, rgba(255,255,255,0.08) ${((years - 1) / 19) * 100}%)`,
                }}
              />
              <div className="flex justify-between body-font text-[10px] text-white/15">
                <span>1 yr</span>
                <span>20 yrs</span>
              </div>
            </div>
            <div className="border-t border-white/5 pt-4 space-y-2">
              {[
                ["Total gift", "$" + total.toLocaleString()],
                ["Tree level", "Level " + level + " · " + names[level]],
                [
                  "Memories unlocked",
                  Math.floor(total / 500) + " milestone memories",
                ],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="body-font text-xs text-white/30">{l}</span>
                  <span className="body-font text-xs font-medium text-emerald-300">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border-glow card-bg p-6 flex flex-col items-center justify-center space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={level}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="text-center space-y-3"
              >
                <Tree
                  level={level}
                  animate={level >= 7}
                  traits={
                    level >= 7
                      ? ["golden_canopy"]
                      : level >= 4
                        ? ["full_bloom"]
                        : []
                  }
                  size="lg"
                />
                <div>
                  <p className="display text-2xl font-medium text-white">
                    {names[level]}
                  </p>
                  <p className="body-font text-xs text-white/30 mt-1">
                    Level {level} of 8
                  </p>
                </div>
                <p className="body-font text-sm text-white/50 font-light max-w-48 mx-auto leading-relaxed">
                  Your child inherits{" "}
                  <span className="text-emerald-300 font-medium">
                    ${total.toLocaleString()}
                  </span>{" "}
                  and a {names[level].toLowerCase()} after {years} years.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Traits Showcase ──────────────────────────────────────────────────────────
const Traits = () => {
  const [active, setActive] = useState(0);
  type TraitItem = {
    e: string;
    name: string;
    how: string;
    visual: string;
    tree: TreeTrait[];
    level: TreeLevel;
  };

  const traits: TraitItem[] = [
    {
      e: "🌿",
      name: "Deep Roots",
      how: "Save every week for 1+ year",
      visual: "Thick, visible root system reaching deep into the earth",
      tree: ["deep_roots"],
      level: 5,
    },
    {
      e: "🌸",
      name: "Full Bloom",
      how: "Add 10 or more memories",
      visual: "Soft pink flowers bloom across every branch",
      tree: ["full_bloom"],
      level: 4,
    },
    {
      e: "✨",
      name: "Golden Canopy",
      how: "Reach Level 7 (Golden Tree)",
      visual: "Gold-tipped leaves catch the light and shimmer",
      tree: ["golden_canopy"],
      level: 7,
    },
    {
      e: "🌲",
      name: "Steady Growth",
      how: "Never miss an auto-save",
      visual: "Perfectly symmetrical, balanced shape",
      tree: [],
      level: 6,
    },
    {
      e: "🪵",
      name: "Ancient Bark",
      how: "Save consistently for 5+ years",
      visual: "Weathered, wise-looking trunk with visible age",
      tree: [],
      level: 6,
    },
    {
      e: "🌱",
      name: "Grove Maker",
      how: "Build trees for multiple children",
      visual: "Small saplings grow at the base of the parent tree",
      tree: ["grove_maker"],
      level: 5,
    },
  ];
  const t = traits[active];
  return (
    <section className="py-24 px-6">
      <div className="section-divider mb-24" />
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 space-y-3"
        >
          <h2 className="display text-4xl md:text-5xl font-light text-white">
            Legacy made
            <br />
            <em className="text-gradient-emerald">visible</em>
          </h2>
          <p className="body-font text-sm text-white/35 max-w-lg leading-relaxed font-light">
            How you saved — not just how much — leaves marks on the tree your
            child inherits. Six traits, each earned through consistency and
            care.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            {traits.map((tr, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 body-font ${active === i ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/5 hover:border-emerald-500/15"}`}
              >
                <span className="text-2xl shrink-0">{tr.e}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${active === i ? "text-emerald-200" : "text-white/50"}`}
                  >
                    {tr.name}
                  </p>
                  <p
                    className={`text-xs mt-0.5 truncate ${active === i ? "text-emerald-500/60" : "text-white/20"}`}
                  >
                    {tr.how}
                  </p>
                </div>
                {active === i && (
                  <span className="text-emerald-400 text-lg shrink-0">→</span>
                )}
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border-glow card-bg p-6 flex flex-col items-center justify-center space-y-5"
            >
              <div className="flex items-end gap-8">
                <div className="text-center">
                  <p className="body-font text-[10px] uppercase tracking-widest text-white/20 mb-2">
                    Parent's tree
                  </p>
                  <Tree level={t.level} size="md" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="body-font text-[10px] text-white/20">
                    inherits
                  </div>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-emerald-400/50"
                  >
                    →
                  </motion.div>
                </div>
                <div className="text-center">
                  <p className="body-font text-[10px] uppercase tracking-widest text-white/20 mb-2">
                    Child's tree
                  </p>
                  <Tree level={3} traits={t.tree} size="md" />
                </div>
              </div>
              <div className="text-center space-y-2 border-t border-white/5 pt-4 w-full">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-3 py-1.5">
                  <span className="text-sm">{t.e}</span>
                  <span className="body-font text-xs font-medium text-emerald-200/70">
                    {t.name}
                  </span>
                </div>
                <p className="body-font text-xs text-white/35 font-light max-w-56 mx-auto leading-relaxed">
                  {t.visual}
                </p>
                <p className="body-font text-[11px] text-emerald-600/50 italic">
                  Earned by: {t.how.toLowerCase()}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "Is my money safe?",
      a: "Yes. Your funds are held on-chain via smart contracts on Flow — not in a Sprout bank account. This means Sprout can never access or move your money without your authorization. Your tree, your funds.",
    },
    {
      q: "Can I lose my progress if I withdraw?",
      a: "No. Your tree enters a 'dormant' state when savings drop — it shows visible stress like browning leaves — but your recorded peak level is preserved as a ghost silhouette. When you save again, it recovers. You never lose what you built.",
    },
    {
      q: "What happens to the memories if Sprout shuts down?",
      a: "Every photo and note is stored directly on IPFS and backed up to Filecoin automatically. This means the memories exist independently of Sprout's infrastructure. They are permanent and cannot be deleted — even by us.",
    },
    {
      q: "Can my child see their family tree early?",
      a: "Never. The family tree is completely invisible to your child until the moment of inheritance. Before that date, only you can see it. Sprout enforces this at the smart contract level — not just in the UI.",
    },
    {
      q: "What if I want to change the inheritance date?",
      a: "You can update the inheritance date at any time before it triggers. The 30-day warning window before the date is your final chance to add a last memory. After the date, the transfer is automatic and irreversible.",
    },
    {
      q: "Can the child see how much their parent saved?",
      a: "They can see the total amount transferred, yes — but only after inheritance. During the building period, the child has no visibility at all. After inheritance, the money is theirs and they naturally know what they received.",
    },
    {
      q: "How does signing up work? Do I need crypto?",
      a: "No. You sign up with just your email. We send a magic link — click it and you're in. Behind the scenes, Web3Auth creates an embedded wallet on your behalf. You never need to know it exists.",
    },
  ];
  return (
    <section className="py-24 px-6" id="faq">
      <div className="section-divider mb-24" />
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 space-y-3"
        >
          <h2 className="display text-4xl md:text-5xl font-light text-white">
            Questions
            <br />
            <em className="text-gradient-emerald">answered</em>
          </h2>
        </motion.div>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-xl border border-white/5 hover:border-emerald-500/15 transition-colors overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="body-font w-full flex items-center justify-between p-5 text-left"
              >
                <span
                  className={`text-sm font-medium transition-colors ${open === i ? "text-emerald-200" : "text-white/60"}`}
                >
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-emerald-500/50 shrink-0 ml-4 text-xl leading-none"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="body-font text-sm text-white/35 font-light leading-relaxed px-5 pb-5">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Tech Bar ─────────────────────────────────────────────────────────────────
const TechBar = () => (
  <section className="py-16 px-6">
    <div className="section-divider mb-16" />
    <div className="mx-auto max-w-4xl">
      <p className="body-font text-center text-[10px] uppercase tracking-[0.3em] text-white/15 mb-8">
        Built on
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {[
          ["⛓️", "Flow Blockchain"],
          ["📦", "IPFS Storage"],
          ["🔒", "Web3Auth"],
          ["☁️", "Filecoin Backup"],
          ["⚡", "Sponsored Gas"],
        ].map(([e, t], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 rounded-full border border-white/8 px-4 py-2 body-font"
          >
            <span className="text-base">{e}</span>
            <span className="text-xs text-white/30">{t}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Final CTA ────────────────────────────────────────────────────────────────
const CTA = () => (
  <section className="py-32 px-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
    <div className="section-divider mb-32" />
    <div className="mx-auto max-w-3xl text-center relative z-10 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Tree
          level={8}
          traits={["golden_canopy", "full_bloom", "deep_roots", "grove_maker"]}
          animate
          size="xl"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="display text-4xl md:text-6xl font-light text-white leading-tight">
          What you build today
          <br />
          <em className="text-gradient-gold">outlives you.</em>
        </h2>
        <p className="body-font text-base text-white/35 font-light max-w-md mx-auto leading-relaxed">
          Start with a seed. Build a legacy. Pass on something that can never be
          taken away.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <button className="body-font w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-10 py-4 rounded-full text-sm transition-all duration-200 hover:scale-105 glow-emerald">
          Begin Growing — It's Free
        </button>
      </motion.div>
      <p className="body-font text-xs text-white/15">
        No passwords. No crypto knowledge. Just your email.
      </p>
    </div>
  </section>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function SproutHowItWorks() {
  return (
    <div className="grain bg-[#030a06] min-h-screen body-font">
      <FontLoader />
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #030a06;
          box-shadow: 0 0 8px rgba(16,185,129,0.4);
        }
        input[type='range']::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #030a06;
        }
      `}</style>
      <Particles />
      <main className="relative z-10">
        <Hero />
        <Overview />
        <TimelineSection />
        <Privacy />
        <Calculator />
        <Traits />
        <FAQ />
        <TechBar />
        <CTA />
      </main>
    </div>
  );
}
