import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SproutTree = ({
  level = 1,
  traits = [] as string[],
  size = "md" as const,
  glowColor = "#34d399",
}: {
  level?: number;
  traits?: string[];
  size?: "sm" | "md" | "lg" | "xl";
  glowColor?: string;
}) => {
  const sizes = {
    sm: "h-24 w-20",
    md: "h-36 w-28",
    lg: "h-44 w-32",
    xl: "h-56 w-44",
  };
  const palettes = {
    1: {
      trunk: "#92400e",
      c1: "#166534",
      c2: "#15803d",
      c3: "#16a34a",
      tip: "#4ade80",
    },
    2: {
      trunk: "#78350f",
      c1: "#15803d",
      c2: "#16a34a",
      c3: "#22c55e",
      tip: "#86efac",
    },
    3: {
      trunk: "#713f12",
      c1: "#166534",
      c2: "#15803d",
      c3: "#16a34a",
      tip: "#4ade80",
    },
    4: {
      trunk: "#92400e",
      c1: "#b45309",
      c2: "#d97706",
      c3: "#f59e0b",
      tip: "#fcd34d",
    },
    5: {
      trunk: "#6b3a1f",
      c1: "#166534",
      c2: "#15803d",
      c3: "#16a34a",
      tip: "#4ade80",
    },
    6: {
      trunk: "#431407",
      c1: "#14532d",
      c2: "#166534",
      c3: "#15803d",
      tip: "#34d399",
    },
    7: {
      trunk: "#451a03",
      c1: "#92400e",
      c2: "#b45309",
      c3: "#d97706",
      tip: "#fcd34d",
    },
    8: {
      trunk: "#1c0a00",
      c1: "#78350f",
      c2: "#92400e",
      c3: "#b45309",
      tip: "#fbbf24",
    },
  };
  const p = palettes[Math.min(level, 8) as keyof typeof palettes];
  const hasGolden = traits.includes("golden_canopy") || level >= 7;
  const hasBloom = traits.includes("full_bloom");
  const hasRoots = traits.includes("deep_roots");
  const hasGrove = traits.includes("grove_maker");
  const hasBark = traits.includes("ancient_bark");
  const hasSteady = traits.includes("steady_growth");
  return (
    <div className={`relative flex items-end justify-center ${sizes[size]}`}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full opacity-20 blur-2xl"
        style={{ background: glowColor, width: "70%", height: "40%" }}
      />
      <svg
        viewBox="0 0 80 110"
        className="relative z-10 h-full w-full"
        style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" }}
      >
        <ellipse
          cx="40"
          cy="104"
          rx="18"
          ry="3.5"
          fill="#052e16"
          opacity="0.5"
        />
        {hasRoots && (
          <>
            <path
              d="M33 95 Q22 103 13 101"
              stroke={p.trunk}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M47 95 Q58 103 67 101"
              stroke={p.trunk}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          </>
        )}
        <path
          d="M35 96 Q28 101 21 99"
          stroke={p.trunk}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M45 96 Q52 101 59 99"
          stroke={p.trunk}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x="34.5"
          y="68"
          width="11"
          height="30"
          rx="3"
          fill={p.trunk}
          style={{ filter: hasBark ? "brightness(0.75)" : "none" }}
        />
        {hasBark && (
          <>
            <line
              x1="34.5"
              y1="75"
              x2="45.5"
              y2="75"
              stroke="#000"
              strokeWidth="0.5"
              opacity="0.3"
            />
            <line
              x1="34.5"
              y1="83"
              x2="45.5"
              y2="83"
              stroke="#000"
              strokeWidth="0.5"
              opacity="0.3"
            />
            <line
              x1="34.5"
              y1="91"
              x2="45.5"
              y2="91"
              stroke="#000"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </>
        )}
        {hasSteady ? (
          <>
            <ellipse
              cx="40"
              cy="58"
              rx="21"
              ry="18"
              fill={p.c1}
              opacity="0.95"
            />
            <ellipse cx="40" cy="45" rx="17" ry="15" fill={p.c2} />
            <ellipse cx="40" cy="34" rx="13" ry="12" fill={p.c2} />
            <ellipse cx="40" cy="25" rx="9" ry="9" fill={p.c3} />
            <ellipse cx="40" cy="18" rx="5.5" ry="6" fill={p.tip} />
          </>
        ) : (
          <>
            <ellipse
              cx="38"
              cy="59"
              rx="22"
              ry="19"
              fill={p.c1}
              opacity="0.92"
            />
            <ellipse
              cx="41"
              cy="46"
              rx="19"
              ry="17"
              fill={p.c1}
              opacity="0.95"
            />
            <ellipse cx="39" cy="35" rx="16" ry="14" fill={p.c2} />
            <ellipse cx="41" cy="25" rx="12" ry="11" fill={p.c2} />
            <ellipse cx="40" cy="17" rx="8" ry="8" fill={p.c3} />
            <ellipse cx="40" cy="11" rx="5" ry="5.5" fill={p.tip} />
          </>
        )}
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
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
              <circle
                key={i}
                cx={40 + 13 * Math.cos((a * Math.PI) / 180)}
                cy={30 + 13 * Math.sin((a * Math.PI) / 180)}
                r="1.8"
                fill="#fbbf24"
                opacity="0.75"
              />
            ))}
          </>
        )}
        {hasBloom &&
          (
            [
              [26, 50, "#fb7185"] as const,
              [54, 50, "#f9a8d4"] as const,
              [20, 62, "#fb7185"] as const,
              [60, 62, "#fda4af"] as const,
              [34, 38, "#f472b6"] as const,
              [47, 36, "#fb7185"] as const,
            ] as const
          ).map(([cx, cy, fill], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="2.8" fill={fill} opacity="0.9" />
              <circle cx={cx} cy={cy} r="1.2" fill="#fff" opacity="0.7" />
            </g>
          ))}
        {level === 8 && (
          <>
            <ellipse
              cx="40"
              cy="38"
              rx="27"
              ry="26"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.8"
              opacity="0.25"
              strokeDasharray="3 4"
            />
            <ellipse
              cx="40"
              cy="38"
              rx="31"
              ry="30"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.5"
              opacity="0.12"
              strokeDasharray="2 6"
            />
          </>
        )}
        {hasGrove && (
          <>
            <rect
              x="10"
              y="91"
              width="3.5"
              height="10"
              rx="1"
              fill={p.trunk}
              opacity="0.75"
            />
            <ellipse
              cx="11.75"
              cy="87"
              rx="5.5"
              ry="5.5"
              fill={p.c2}
              opacity="0.8"
            />
            <ellipse
              cx="11.75"
              cy="84"
              rx="3.5"
              ry="3.5"
              fill={p.c3}
              opacity="0.8"
            />
            <rect
              x="66.5"
              y="91"
              width="3.5"
              height="10"
              rx="1"
              fill={p.trunk}
              opacity="0.75"
            />
            <ellipse
              cx="68.25"
              cy="87"
              rx="5.5"
              ry="5.5"
              fill={p.c2}
              opacity="0.8"
            />
            <ellipse
              cx="68.25"
              cy="84"
              rx="3.5"
              ry="3.5"
              fill={p.c3}
              opacity="0.8"
            />
          </>
        )}
      </svg>
    </div>
  );
};

const TRAITS = [
  {
    id: "deep_roots",
    emoji: "🌿",
    name: "Deep Roots",
    color: "emerald",
    parentBehavior: "Saved every week for 1+ year",
    parentStats: [
      "52+ consecutive weeks",
      "Never missed a deposit",
      "Discipline over time",
    ],
    childDesc:
      "Thick, anchoring root system — a symbol of unshakeable foundation.",
    parentLevel: 5,
    childTraits: ["deep_roots"],
    parentLabel: "Consistent weekly savings",
    childLabel: "Deep Roots trait visible",
  },
  {
    id: "ancient_bark",
    emoji: "🪵",
    name: "Ancient Bark",
    color: "amber",
    parentBehavior: "Saved consistently for 5+ years",
    parentStats: [
      "5+ year commitment",
      "Long-term patience",
      "Weathered & wise",
    ],
    childDesc:
      "Textured bark with visible rings — the tree carries marks of years of dedication.",
    parentLevel: 6,
    childTraits: ["ancient_bark"],
    parentLabel: "5 years of consistent saving",
    childLabel: "Ancient Bark trait visible",
  },
  {
    id: "golden_canopy",
    emoji: "✨",
    name: "Golden Canopy",
    color: "yellow",
    parentBehavior: "Reached Level 7 — Golden Tree",
    parentStats: ["$5,000+ saved", "Level 7 achieved", "Exceptional milestone"],
    childDesc:
      "Gold-tipped leaves shimmering across the canopy — evidence of extraordinary heights.",
    parentLevel: 7,
    childTraits: ["golden_canopy"],
    parentLabel: "Golden Tree achieved ($5,000+)",
    childLabel: "Golden Canopy trait visible",
  },
  {
    id: "full_bloom",
    emoji: "🌸",
    name: "Full Bloom",
    color: "pink",
    parentBehavior: "Added 10 or more memories",
    parentStats: [
      "10+ memories added",
      "Photos & notes forever",
      "Love made visible",
    ],
    childDesc:
      "Flowers across every branch — each blossom a memory left behind.",
    parentLevel: 5,
    childTraits: ["full_bloom"],
    parentLabel: "10+ milestone memories added",
    childLabel: "Full Bloom trait visible",
  },
  {
    id: "steady_growth",
    emoji: "🌲",
    name: "Steady Growth",
    color: "teal",
    parentBehavior: "Never missed an auto-save",
    parentStats: [
      "Perfect auto-save record",
      "Zero missed payments",
      "Automated discipline",
    ],
    childDesc:
      "Perfectly symmetrical canopy — every branch in balance, shaped by consistency.",
    parentLevel: 4,
    childTraits: ["steady_growth"],
    parentLabel: "Flawless auto-save streak",
    childLabel: "Steady Growth trait visible",
  },
  {
    id: "grove_maker",
    emoji: "🌱",
    name: "Grove Maker",
    color: "lime",
    parentBehavior: "Built trees for multiple children",
    parentStats: [
      "2+ family trees created",
      "Generosity at scale",
      "A grove in the making",
    ],
    childDesc:
      "Small saplings at the base — a reminder that love was given to more than one.",
    parentLevel: 6,
    childTraits: ["grove_maker"],
    parentLabel: "Family trees for 2+ children",
    childLabel: "Grove Maker trait visible",
  },
];

const COLORS = {
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-950/40",
    text: "text-emerald-400",
    chip: "bg-emerald-500/15 border-emerald-500/25",
    dot: "bg-emerald-400",
    glow: "#34d399",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-950/40",
    text: "text-amber-400",
    chip: "bg-amber-500/15 border-amber-500/25",
    dot: "bg-amber-400",
    glow: "#fbbf24",
  },
  yellow: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-950/40",
    text: "text-yellow-400",
    chip: "bg-yellow-500/15 border-yellow-500/25",
    dot: "bg-yellow-400",
    glow: "#fcd34d",
  },
  pink: {
    border: "border-pink-500/30",
    bg: "bg-pink-950/40",
    text: "text-pink-400",
    chip: "bg-pink-500/15 border-pink-500/25",
    dot: "bg-pink-400",
    glow: "#fb7185",
  },
  teal: {
    border: "border-teal-500/30",
    bg: "bg-teal-950/40",
    text: "text-teal-400",
    chip: "bg-teal-500/15 border-teal-500/25",
    dot: "bg-teal-400",
    glow: "#2dd4bf",
  },
  lime: {
    border: "border-lime-500/30",
    bg: "bg-lime-950/40",
    text: "text-lime-400",
    chip: "bg-lime-500/15 border-lime-500/25",
    dot: "bg-lime-400",
    glow: "#a3e635",
  },
};

const LEVEL_NAMES = [
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
const LEVEL_T = [0, 50, 200, 500, 1000, 2500, 5000, 10000, Infinity];
const getLevel = (amt: number) => {
  for (let i = 7; i >= 0; i--) if (amt >= LEVEL_T[i]) return i + 1;
  return 1;
};
const getTraits = (monthly: number, years: number, auto: boolean) => {
  const total = monthly * 12 * years;
  const t = [];
  if (years >= 1 && auto) t.push("deep_roots");
  if (years >= 5) t.push("ancient_bark");
  if (total >= 5000) t.push("golden_canopy");
  if (auto) t.push("steady_growth");
  return t;
};

const Slider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  fmt,
  accent = "#34d399",
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  fmt?: (value: number) => string;
  accent?: string;
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <p className="text-xs uppercase tracking-widest text-white/30">
          {label}
        </p>
        <p className="text-sm font-bold text-white tabular-nums">
          {fmt ? fmt(value) : value}
        </p>
      </div>
      <div className="relative h-2 rounded-full bg-white/8">
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right,#166534,${accent})`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 10 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            borderColor: accent,
            background: "#0a1628",
            boxShadow: `0 0 10px ${accent}55`,
          }}
        />
      </div>
    </div>
  );
};

const TraitShowcase = () => {
  const [active, setActive] = useState(0);
  const t = TRAITS[active];
  const c = COLORS[t.color as keyof typeof COLORS];
  return (
    <div className="bg-[#020617] py-16 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-3 py-1.5 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-emerald-400/70">
              Trait Inheritance
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2 leading-tight">
            Your discipline becomes{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-200">
              their story
            </span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg">
            Six traits earned by how you save — not just how much. Each one
            lives on your child's tree forever.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Selector */}
          <div className="lg:col-span-4 space-y-2">
            {TRAITS.map((tr, i) => {
              const tc = COLORS[tr.color as keyof typeof COLORS];
              const isA = active === i;
              return (
                <button
                  key={tr.id}
                  onClick={() => setActive(i)}
                  className={`w-full text-left rounded-2xl border p-3.5 transition-all duration-200 ${isA ? `${tc.border} ${tc.bg}` : "border-white/5 bg-white/2 hover:border-white/10"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${tc.border} ${isA ? tc.bg : "bg-black/20"} shrink-0`}
                    >
                      <span className="text-lg">{tr.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${isA ? tc.text : "text-white/50"}`}
                      >
                        {tr.name}
                      </p>
                      <p className="text-xs text-white/25 truncate mt-0.5">
                        {tr.parentBehavior}
                      </p>
                    </div>
                    {isA && (
                      <div
                        className={`h-2 w-2 rounded-full shrink-0 ${tc.dot} animate-pulse`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Compare */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`flex items-center gap-3 mb-4 rounded-2xl border ${c.border} ${c.bg} p-4`}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className={`text-base font-semibold ${c.text}`}>
                      {t.name}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {t.childDesc}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Parent */}
                  <div className="rounded-2xl border border-white/6 bg-linear-to-b from-[#0c1a10] to-[#020617] p-4 flex flex-col items-center">
                    <div className="w-full mb-3">
                      <p className="text-xs uppercase tracking-widest text-white/25 mb-0.5">
                        Parent's tree
                      </p>
                      <p className="text-xs text-white/20">{t.parentLabel}</p>
                    </div>
                    <SproutTree
                      level={t.parentLevel}
                      traits={[]}
                      size="lg"
                      glowColor="#34d399"
                    />
                    <div className="mt-4 w-full space-y-1.5">
                      {t.parentStats.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-white/15 shrink-0" />
                          <p className="text-xs text-white/30">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Child */}
                  <div
                    className={`rounded-2xl border ${c.border} p-4 flex flex-col items-center relative overflow-hidden`}
                    style={{
                      background: `linear-gradient(to bottom, #0a1628, #020617)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at 50% 80%,${c.glow}18,transparent 65%)`,
                      }}
                    />
                    <div className="w-full mb-3 relative z-10">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${c.dot} animate-pulse`}
                        />
                        <p
                          className={`text-xs uppercase tracking-widest ${c.text} opacity-70`}
                        >
                          Child's tree
                        </p>
                      </div>
                      <p className={`text-xs ${c.text} opacity-60`}>
                        {t.childLabel}
                      </p>
                    </div>
                    <div className="relative z-10">
                      <SproutTree
                        level={t.parentLevel}
                        traits={t.childTraits}
                        size="lg"
                        glowColor={c.glow}
                      />
                    </div>
                    <div
                      className={`mt-4 w-full rounded-xl border ${c.border} bg-black/20 px-3 py-2 relative z-10`}
                    >
                      <p className={`text-xs font-semibold ${c.text} mb-0.5`}>
                        {t.emoji} {t.name}
                      </p>
                      <p className="text-xs text-white/30 leading-relaxed">
                        {t.childDesc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/8" />
                  <div
                    className={`flex items-center gap-2 rounded-full border ${c.border} ${c.bg} px-4 py-1.5`}
                  >
                    <span className="text-xs text-white/30">
                      saving behavior
                    </span>
                    <span className={`text-xs font-semibold ${c.text}`}>
                      → visible trait forever
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/8" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-6 gap-2">
          {TRAITS.map((tr, i) => {
            const tc = COLORS[tr.color as keyof typeof COLORS];
            return (
              <button
                key={tr.id}
                onClick={() => setActive(i)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-all duration-200 ${active === i ? `${tc.border} ${tc.bg}` : "border-white/5 bg-white/2 hover:border-white/10"}`}
              >
                <span className="text-xl">{tr.emoji}</span>
                <p
                  className={`text-xs font-semibold text-center leading-tight ${active === i ? tc.text : "text-white/25"}`}
                >
                  {tr.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SavingsCalculator = () => {
  const [monthly, setMonthly] = useState(100);
  const [years, setYears] = useState(10);
  const [autoSave, setAutoSave] = useState(true);

  const total = monthly * 12 * years;
  const level = getLevel(total);
  const traits = getTraits(monthly, years, autoSave);
  const nextT = LEVEL_T[level] !== Infinity ? LEVEL_T[level] : null;
  const toNext = nextT ? nextT - total : 0;
  const pct = nextT ? Math.min(100, (total / nextT) * 100) : 100;
  const memCount = Math.floor(total / 500);
  const milestones = Array.from(
    { length: Math.min(memCount, 5) },
    (_, i) => (i + 1) * 500,
  );

  return (
    <div className="bg-[#020617] py-16 px-4 md:px-8 relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(52,211,153,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.5) 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-3 py-1.5 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-emerald-400/70">
              Savings Calculator
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2 leading-tight">
            See what you'll{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-200">
              leave behind
            </span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg">
            Move the sliders. Watch the tree grow. This is exactly what your
            child inherits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Controls */}
          <div className="space-y-6 rounded-2xl border border-white/6 bg-white/2 p-6">
            <Slider
              min={10}
              max={500}
              step={10}
              value={monthly}
              onChange={setMonthly}
              label="Monthly savings"
              fmt={(v) => `$${v}`}
            />
            <Slider
              min={1}
              max={20}
              value={years}
              onChange={setYears}
              label="Years building"
              fmt={(v) => `${v} yr${v === 1 ? "" : "s"}`}
            />

            <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/3 p-4">
              <div>
                <p className="text-sm font-medium text-white/60">
                  Auto-save enabled
                </p>
                <p className="text-xs text-white/20 mt-0.5">
                  Unlocks Deep Roots + Steady Growth
                </p>
              </div>
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`relative h-6 w-11 rounded-full border transition-all duration-300 ${autoSave ? "bg-emerald-500/40 border-emerald-500/40" : "bg-white/8 border-white/10"}`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 ${autoSave ? "left-5 bg-emerald-400" : "left-0.5 bg-white/30"}`}
                />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { v: `$${total.toLocaleString()}`, l: "Total saved" },
                { v: `${memCount}`, l: "Memory slots" },
                { v: `${traits.length}/6`, l: "Traits earned" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-xl border border-emerald-500/10 bg-emerald-950/30 px-3 py-3"
                >
                  <motion.p
                    key={s.v}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base font-bold text-emerald-300 tabular-nums"
                  >
                    {s.v}
                  </motion.p>
                  <p className="text-xs text-emerald-600/50 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-white/20">
                Traits your child inherits
              </p>
              <div className="flex flex-wrap gap-2">
                {TRAITS.map((tr) => {
                  const earned = traits.includes(tr.id);
                  const tc = COLORS[tr.color as keyof typeof COLORS];
                  return (
                    <motion.div
                      key={tr.id}
                      animate={{
                        opacity: earned ? 1 : 0.2,
                        scale: earned ? 1 : 0.95,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${earned ? `${tc.chip} ${tc.text}` : "border-white/5 bg-white/2 text-white/20"}`}
                    >
                      <span>{tr.emoji}</span>
                      {tr.name}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tree card */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${level}-${traits.join("")}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, type: "spring", stiffness: 180 }}
                className="rounded-2xl border border-emerald-500/15 overflow-hidden"
                style={{
                  background: "linear-gradient(to bottom,#071410,#020617)",
                }}
              >
                <div
                  className="relative flex flex-col items-center justify-end px-8 pt-10 pb-6"
                  style={{ minHeight: 240 }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 90%,rgba(52,211,153,0.09),transparent 65%)",
                    }}
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/60 px-3 py-1.5">
                    <span className="text-xs font-bold text-emerald-400">
                      Lv.{level}
                    </span>
                    <span className="text-xs text-emerald-200/50">
                      {LEVEL_NAMES[level]}
                    </span>
                  </div>
                  {traits.length > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full border border-white/8 bg-white/5 px-2.5 py-1">
                      {traits.slice(0, 3).map((tid) => {
                        const tr = TRAITS.find((t) => t.id === tid);
                        return tr ? (
                          <span key={tid} className="text-sm">
                            {tr.emoji}
                          </span>
                        ) : null;
                      })}
                      {traits.length > 3 && (
                        <span className="text-xs text-white/30">
                          +{traits.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <motion.div
                    className="relative z-10"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <SproutTree
                      level={level}
                      traits={traits}
                      size="xl"
                      glowColor="#34d399"
                    />
                  </motion.div>
                </div>
                <div className="border-t border-white/6 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/20">
                        Your child inherits
                      </p>
                      <motion.p
                        key={total}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white tabular-nums mt-1"
                      >
                        ${total.toLocaleString()}
                      </motion.p>
                      <p className="text-xs text-white/25 mt-1">
                        ${monthly}/mo × {years} yr{years !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {level < 8 ? (
                      <div className="text-right">
                        <p className="text-xs text-white/20">Next level</p>
                        <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                          +${toNext.toLocaleString()}
                        </p>
                        <p className="text-xs text-white/20">
                          to {LEVEL_NAMES[level + 1]}
                        </p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-xs text-emerald-400 mb-1">
                          Max level
                        </p>
                        <span className="text-2xl">🏆</span>
                      </div>
                    )}
                  </div>
                  {level < 8 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-white/15">
                        <span>{LEVEL_NAMES[level]}</span>
                        <span>{LEVEL_NAMES[level + 1]}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/6 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-linear-to-r from-emerald-700 to-emerald-400"
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}
                  {milestones.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-white/15">
                        Memory milestones
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {milestones.map((m) => (
                          <span
                            key={m}
                            className="rounded-full border border-emerald-500/15 bg-emerald-950/40 px-2 py-0.5 text-xs text-emerald-400/60"
                          >
                            📷 ${m.toLocaleString()}
                          </span>
                        ))}
                        {memCount > 5 && (
                          <span className="text-xs text-white/15 py-0.5">
                            +{memCount - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <button className="w-full rounded-xl bg-emerald-500/15 border border-emerald-500/25 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 active:scale-[0.98] transition-all duration-200">
                    Start growing today →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState("traits");
  return (
    <div className="bg-[#020617] min-h-screen font-sans">
      <div className="sticky top-0 z-50 flex justify-center py-4 bg-[#020617]/90 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-1 rounded-full border border-white/8 bg-white/3 p-1">
          {[
            ["traits", "🌿 Trait Showcase"],
            ["calc", "🌱 Calculator"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${tab === id ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "text-white/40 hover:text-white/60"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {tab === "traits" ? (
          <motion.div
            key="traits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TraitShowcase />
          </motion.div>
        ) : (
          <motion.div
            key="calc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SavingsCalculator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
