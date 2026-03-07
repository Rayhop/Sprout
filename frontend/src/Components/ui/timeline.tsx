"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  // useInView,
  AnimatePresence,
} from "framer-motion";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SeedIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21"
    />
  </svg>
);

const TreeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L21 13.5m-1.5 0l-2.25 9.75H6.75L4.5 13.5m16.5 0h-18"
    />
  </svg>
);

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
    />
  </svg>
);

const GiftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-5 h-5"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    />
  </svg>
);

// ─── Animated Tree SVG ────────────────────────────────────────────────────────
const TreeVisual = ({
  level = 1,
  traits = [],
}: {
  level?: number;
  traits?: ("deep_roots" | "golden_canopy" | "full_bloom" | "grove_maker")[];
}) => {
  const treeColors = {
    1: {
      trunk: "#92400e",
      leaves: "#4ade80",
      glow: "#86efac",
      bloom: false,
      golden: false,
      legendary: false,
    },
    2: {
      trunk: "#78350f",
      leaves: "#22c55e",
      glow: "#4ade80",
      bloom: false,
      golden: false,
      legendary: false,
    },
    3: {
      trunk: "#713f12",
      leaves: "#16a34a",
      glow: "#22c55e",
      bloom: false,
      golden: false,
      legendary: false,
    },
    4: {
      trunk: "#92400e",
      leaves: "#d97706",
      glow: "#fbbf24",
      bloom: true,
      golden: false,
      legendary: false,
    },
    5: {
      trunk: "#6b3a1f",
      leaves: "#15803d",
      glow: "#22c55e",
      bloom: false,
      golden: false,
      legendary: false,
    },
    6: {
      trunk: "#431407",
      leaves: "#166534",
      glow: "#16a34a",
      bloom: false,
      golden: true,
      legendary: false,
    },
    7: {
      trunk: "#451a03",
      leaves: "#ca8a04",
      glow: "#fbbf24",
      bloom: false,
      golden: true,
      legendary: false,
    },
    8: {
      trunk: "#1c0a00",
      leaves: "#b45309",
      glow: "#f59e0b",
      bloom: false,
      golden: false,
      legendary: true,
    },
  };
  const c = treeColors[level as keyof typeof treeColors] || treeColors[1];

  return (
    <div className="relative flex items-end justify-center h-32 w-28">
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{ background: c.glow, transform: "scale(0.8) translateY(10px)" }}
      />
      <svg
        viewBox="0 0 80 100"
        className="relative z-10 h-full w-full drop-shadow-lg"
      >
        {/* Ground */}
        <ellipse cx="40" cy="96" rx="20" ry="4" fill="#166534" opacity="0.3" />
        {/* Trunk */}
        <rect x="35" y="65" width="10" height="28" rx="3" fill={c.trunk} />
        {/* Roots */}
        <path
          d="M35 90 Q28 95 22 93"
          stroke={c.trunk}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M45 90 Q52 95 58 93"
          stroke={c.trunk}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Deep roots trait */}
        {traits.includes("deep_roots") && (
          <>
            <path
              d="M35 88 Q25 97 16 96"
              stroke={c.trunk}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M45 88 Q55 97 64 96"
              stroke={c.trunk}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </>
        )}
        {/* Canopy layers */}
        <ellipse
          cx="40"
          cy="52"
          rx="22"
          ry="20"
          fill={c.leaves}
          opacity="0.9"
        />
        <ellipse cx="40" cy="40" rx="18" ry="16" fill={c.leaves} />
        <ellipse
          cx="40"
          cy="30"
          rx="13"
          ry="12"
          fill={c.leaves}
          opacity="0.95"
        />
        <ellipse cx="40" cy="22" rx="8" ry="8" fill={c.leaves} />
        {/* Golden canopy */}
        {(c.golden || traits.includes("golden_canopy")) && (
          <>
            <ellipse
              cx="40"
              cy="20"
              rx="8"
              ry="7"
              fill="#fbbf24"
              opacity="0.6"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <circle
                key={i}
                cx={40 + 11 * Math.cos((angle * Math.PI) / 180)}
                cy={25 + 11 * Math.sin((angle * Math.PI) / 180)}
                r="1.5"
                fill="#fbbf24"
                opacity="0.8"
              />
            ))}
          </>
        )}
        {/* Bloom trait */}
        {(c.bloom || traits.includes("full_bloom")) && (
          <>
            {[
              [28, 45],
              [52, 45],
              [22, 55],
              [58, 55],
              [35, 35],
              [46, 32],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="#fb7185"
                opacity="0.9"
              />
            ))}
          </>
        )}
        {/* Legendary aura */}
        {c.legendary && (
          <ellipse
            cx="40"
            cy="40"
            rx="26"
            ry="24"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="4 3"
          />
        )}
        {/* Saplings for grove_maker trait */}
        {traits.includes("grove_maker") && (
          <>
            <rect
              x="15"
              y="86"
              width="4"
              height="8"
              rx="1"
              fill={c.trunk}
              opacity="0.7"
            />
            <ellipse
              cx="17"
              cy="82"
              rx="5"
              ry="5"
              fill={c.leaves}
              opacity="0.7"
            />
            <rect
              x="60"
              y="86"
              width="4"
              height="8"
              rx="1"
              fill={c.trunk}
              opacity="0.7"
            />
            <ellipse
              cx="62"
              cy="82"
              rx="5"
              ry="5"
              fill={c.leaves}
              opacity="0.7"
            />
          </>
        )}
      </svg>
    </div>
  );
};

// ─── Level Badge ──────────────────────────────────────────────────────────────
const LevelBadge = ({
  level,
  name,
  savings,
}: {
  level: number;
  name: string;
  savings: string;
}) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-3 py-1.5">
    <span className="text-xs font-bold text-emerald-400">Lv.{level}</span>
    <span className="text-xs text-emerald-200/80">{name}</span>
    <span className="text-[10px] text-emerald-500/60">{savings}</span>
  </div>
);

// ─── Trait Chip ───────────────────────────────────────────────────────────────
const TraitChip = ({
  emoji,
  label,
  desc,
  delay = 0,
}: {
  emoji: string;
  label: string;
  desc: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    viewport={{ once: true }}
    className="group relative flex items-start gap-2.5 rounded-xl border border-emerald-500/10 bg-emerald-950/30 p-3 backdrop-blur-sm hover:border-emerald-500/30 transition-colors duration-300"
  >
    <span className="text-lg leading-none mt-0.5">{emoji}</span>
    <div>
      <p className="text-xs font-semibold text-emerald-200">{label}</p>
      <p className="text-[10px] text-emerald-500/70 mt-0.5 leading-relaxed">
        {desc}
      </p>
    </div>
  </motion.div>
);

// ─── Memory Card ──────────────────────────────────────────────────────────────
const MemoryCard = ({
  photo,
  note,
  milestone,
  delay = 0,
}: {
  photo: string;
  note: string;
  milestone: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex gap-3 rounded-xl border border-white/5 bg-white/3 p-3 backdrop-blur-sm"
  >
    <div className="shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-linear-to-br from-emerald-900/60 to-emerald-700/20 flex items-center justify-center border border-emerald-500/10">
      <span className="text-xl">{photo}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-white/80 leading-relaxed italic">"{note}"</p>
      <p className="text-[10px] text-emerald-500/50 mt-1">
        Added at {milestone}
      </p>
    </div>
  </motion.div>
);

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-col items-center rounded-xl border border-emerald-500/10 bg-emerald-950/40 px-4 py-3">
    <span className="text-lg font-bold text-emerald-300 tabular-nums">
      {value}
    </span>
    <span className="text-[10px] text-emerald-600 mt-0.5 text-center leading-tight">
      {label}
    </span>
  </div>
);

// ─── Content blocks ───────────────────────────────────────────────────────────
const Step1Content = () => (
  <div className="space-y-5">
    <p className="text-sm text-white/50 leading-relaxed max-w-md">
      Enter your email, click a magic link, and you're growing. No passwords, no
      wallets, no seed phrases — just you and your tree.
    </p>

    {/* Email mockup */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="max-w-sm rounded-2xl border border-white/8 bg-linear-to-b from-white/5 to-transparent p-5 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        <div className="ml-2 h-4 flex-1 rounded bg-white/5" />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-emerald-500/50 mb-1">
            Your email
          </p>
          <div className="flex items-center rounded-lg border border-emerald-500/20 bg-black/30 px-3 py-2 gap-2">
            <span className="text-xs text-white/60">you@email.com</span>
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
        <button className="w-full rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/30 transition-colors">
          Send Magic Link →
        </button>
        <p className="text-center text-[10px] text-white/20">
          No password. No crypto knowledge required.
        </p>
      </div>
    </motion.div>

    <div className="flex gap-3 flex-wrap">
      {[
        { icon: "⚡", text: "Instant access" },
        { icon: "🔒", text: "No passwords" },
        { icon: "🌱", text: "Free to start" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-1.5 text-xs text-white/40 rounded-full border border-white/5 px-3 py-1"
        >
          <span>{item.icon}</span> {item.text}
        </motion.div>
      ))}
    </div>
  </div>
);

const Step2Content = () => {
  const levels = [
    { level: 1, name: "Seed", savings: "$0" },
    { level: 2, name: "Sprout", savings: "$50" },
    { level: 3, name: "Young Plant", savings: "$200" },
    { level: 4, name: "Flowering", savings: "$500" },
    { level: 5, name: "Small Tree", savings: "$1,000" },
    { level: 6, name: "Large Tree", savings: "$2,500" },
    { level: 7, name: "Golden Tree", savings: "$5,000" },
    { level: 8, name: "Legendary", savings: "$10,000" },
  ];

  const [active, setActive] = useState(3);

  return (
    <div className="space-y-5">
      <p className="text-sm text-white/50 leading-relaxed max-w-md">
        Every dollar you save grows your tree. Eight distinct stages, each more
        majestic than the last. Your tree is a living record of your financial
        journey.
      </p>

      {/* Tree preview */}
      <div className="flex gap-4 items-end">
        <motion.div
          key={active}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <TreeVisual
            level={active}
            traits={
              active >= 7
                ? ["golden_canopy"]
                : active >= 4
                  ? ["full_bloom"]
                  : []
            }
          />
        </motion.div>
        <div className="flex-1 space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="space-y-1"
            >
              <p className="text-sm font-semibold text-emerald-200">
                {levels[active - 1].name}
              </p>
              <p className="text-xs text-emerald-500/60">
                Starting at {levels[active - 1].savings}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 cursor-pointer ${
                      i < active ? "bg-emerald-400" : "bg-emerald-900/50"
                    }`}
                    onClick={() => setActive(i + 1)}
                  />
                ))}
              </div>
              <p className="text-[10px] text-white/20">
                Level {active} of 8 — click to explore
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Level grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {levels.map(({ level, name, savings }) => (
          <motion.button
            key={level}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(level)}
            className={`rounded-lg border p-2 text-left transition-all duration-200 ${
              active === level
                ? "border-emerald-500/40 bg-emerald-500/15"
                : "border-white/5 bg-white/3 hover:border-emerald-500/20"
            }`}
          >
            <p
              className={`text-[10px] font-semibold truncate ${active === level ? "text-emerald-300" : "text-white/50"}`}
            >
              {name}
            </p>
            <p className="text-[9px] text-white/20 mt-0.5">{savings}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const Step3Content = () => (
  <div className="space-y-5">
    <p className="text-sm text-white/50 leading-relaxed max-w-md">
      Create a family tree for your child. Every deposit is a gift — locked for
      them from the moment you make it. You're not saving for yourself. You're
      building their future.
    </p>

    {/* Family tree card */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="max-w-sm rounded-2xl border border-emerald-500/15 bg-linear-to-b from-emerald-950/60 to-transparent p-5 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-emerald-500/40 mb-1">
            Growing for
          </p>
          <p className="text-base font-semibold text-white">Mia 🌱</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-emerald-500/40 mb-1">Total saved</p>
          <p className="text-lg font-bold text-emerald-300 tabular-nums">
            $3,240
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <TreeVisual level={6} />
        <div className="flex-1 space-y-2">
          <LevelBadge level={6} name="Large Tree" savings="$2,500+" />
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white/30">
              <span>Next level</span>
              <span>$5,000</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "64.8%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="h-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-400"
              />
            </div>
          </div>
          <p className="text-[10px] text-emerald-500/50">
            Inherits in 4 yrs, 2 mo
          </p>
        </div>
      </div>

      {/* Memories */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-white/20">
          Recent memories
        </p>
        <MemoryCard
          photo="🎒"
          note="First day of school. She was so brave."
          milestone="$500"
          delay={0.1}
        />
        <MemoryCard
          photo="🎹"
          note="Won her first piano recital today."
          milestone="$1,000"
          delay={0.2}
        />
      </div>
    </motion.div>

    <div className="grid grid-cols-3 gap-2 max-w-sm">
      <StatPill value="23" label="Memories added" />
      <StatPill value="8 yrs" label="Building for" />
      <StatPill value="$500" label="Next memory milestone" />
    </div>
  </div>
);

const Step4Content = () => (
  <div className="space-y-5">
    <p className="text-sm text-white/50 leading-relaxed max-w-md">
      At each $500 milestone, add a photo and a note. These memories travel with
      the tree forever — stored on IPFS, permanent and uncensorable. Your child
      will read them one day.
    </p>

    <div className="max-w-sm space-y-3">
      {[
        {
          photo: "🌅",
          note: "The day you were born. I didn't sleep at all but I didn't want to.",
          milestone: "$500",
          year: "2016",
        },
        {
          photo: "🎒",
          note: "First day of school. You held my hand and then let go.",
          milestone: "$1,000",
          year: "2019",
        },
        {
          photo: "🎹",
          note: "You won your recital. I cried in the back row.",
          milestone: "$1,500",
          year: "2021",
        },
        {
          photo: "⚽",
          note: "Your first goal. You ran to me first.",
          milestone: "$2,000",
          year: "2023",
        },
      ].map((m, i) => (
        <MemoryCard key={i} {...m} delay={i * 0.1} />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 rounded-xl border border-dashed border-emerald-500/20 p-3 cursor-pointer hover:border-emerald-500/40 transition-colors group"
      >
        <div className="h-12 w-12 rounded-lg border border-dashed border-emerald-500/20 bg-emerald-950/30 flex items-center justify-center text-emerald-500/40 group-hover:text-emerald-400 transition-colors text-xl">
          +
        </div>
        <div>
          <p className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
            Add a memory at $2,500
          </p>
          <p className="text-[10px] text-emerald-600/50">
            Stored on IPFS forever
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

const Step5Content = () => (
  <div className="space-y-5">
    <p className="text-sm text-white/50 leading-relaxed max-w-md">
      On the inheritance date you set, the tree transfers — automatically. No
      action needed. Mia receives everything: the money, the tree at its full
      level, every memory, and traits that tell your story.
    </p>

    {/* Inheritance moment */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-sm rounded-2xl border border-amber-500/20 bg-linear-to-b from-amber-950/40 to-transparent p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
        <p className="text-[10px] uppercase tracking-widest text-amber-400/60">
          Inheritance event
        </p>
      </div>

      <div className="text-center space-y-2 py-2">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <TreeVisual
            level={7}
            traits={["golden_canopy", "full_bloom", "deep_roots"]}
          />
        </motion.div>
        <p className="text-sm font-semibold text-white/80">
          You built this for Mia.
        </p>
        <p className="text-sm text-amber-300/80 font-medium">Now it's hers.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatPill value="$8,240" label="Transferred" />
        <StatPill value="23" label="Memories" />
        <StatPill value="6 traits" label="Inherited" />
      </div>
    </motion.div>

    {/* Legacy Certificate teaser */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      className="max-w-sm rounded-xl border border-amber-500/10 bg-amber-950/10 p-4 space-y-2"
    >
      <div className="flex items-center gap-2">
        <StarIcon />
        <p className="text-xs font-semibold text-amber-200/70">
          Legacy Complete Certificate
        </p>
      </div>
      <p className="text-[11px] text-white/30 leading-relaxed">
        You receive a permanent keepsake — a beautifully designed certificate
        commemorating your role. The gift is complete. Your chapter ends here,
        beautifully.
      </p>
    </motion.div>
  </div>
);

const Step6Content = () => (
  <div className="space-y-5">
    <p className="text-sm text-white/50 leading-relaxed max-w-md">
      After inheritance, the tree is Mia's alone. Forever. She sees the traits
      you earned, reads every memory you left, and builds her own savings on top
      of your foundation.
    </p>

    {/* Child view */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="max-w-sm rounded-2xl border border-emerald-500/15 bg-linear-to-b from-emerald-950/60 to-transparent p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-emerald-500/40">
            My inherited tree
          </p>
          <p className="text-sm font-semibold text-white mt-0.5">Mia's Tree</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-2.5 py-1">
          <ShieldIcon />
          <span className="text-[10px] text-emerald-400">Only you</span>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <TreeVisual
          level={7}
          traits={["golden_canopy", "full_bloom", "deep_roots", "grove_maker"]}
        />
        <div className="flex-1">
          <p className="text-xl font-bold text-emerald-300 tabular-nums">
            $9,180
          </p>
          <p className="text-[10px] text-white/30 mt-0.5">
            $8,240 inherited + $940 yours
          </p>
          <LevelBadge level={7} name="Golden Tree" savings="$5,000+" />
        </div>
      </div>

      {/* Trait legend */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-white/20">
          Your parent's traits
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          <TraitChip
            emoji="🌿"
            label="Deep Roots"
            desc="Saved every week for 3 years"
            delay={0}
          />
          <TraitChip
            emoji="✨"
            label="Golden Canopy"
            desc="Reached Level 7"
            delay={0.05}
          />
          <TraitChip
            emoji="🌸"
            label="Full Bloom"
            desc="23 memories were left for you"
            delay={0.1}
          />
          <TraitChip
            emoji="🌲"
            label="Steady Growth"
            desc="Never missed an auto-save"
            delay={0.15}
          />
        </div>
      </div>
    </motion.div>

    <p className="text-xs text-white/20 max-w-md">
      Your parent cannot see this tree. They never will again. This is yours.
    </p>
  </div>
);

// ─── Timeline Data ────────────────────────────────────────────────────────────
const timelineData = [
  {
    icon: <SeedIcon />,
    title: "Plant a seed",
    subtitle: "Sign up in seconds",
    content: <Step1Content />,
  },
  {
    icon: <TreeIcon />,
    title: "Watch it grow",
    subtitle: "8 levels of evolution",
    content: <Step2Content />,
  },
  {
    icon: <HeartIcon />,
    title: "Build for your child",
    subtitle: "A gift locked from day one",
    content: <Step3Content />,
  },
  {
    icon: "📸",
    title: "Leave memories",
    subtitle: "Stored on IPFS, forever",
    content: <Step4Content />,
  },
  {
    icon: <GiftIcon />,
    title: "The handoff",
    subtitle: "Everything transfers",
    content: <Step5Content />,
  },
  {
    icon: <StarIcon />,
    title: "Their tree now",
    subtitle: "Private, permanent, theirs",
    content: <Step6Content />,
  },
];

// ─── Main Timeline ────────────────────────────────────────────────────────────
export const Timeline = ({ data }: { data?: typeof timelineData }) => {
  const items = data || timelineData;
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
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

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-[#020617] font-sans md:px-10" ref={containerRef}>
      {/* Header */}
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-emerald-400/70">
              How it works
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl max-w-xl leading-tight">
            From a seed to a{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-200">
              living legacy
            </span>
          </h2>
          <p className="max-w-lg text-sm text-white/40 leading-relaxed md:text-base">
            Your savings become a living tree — private, permanent, and built to
            be passed on to the people you love most.
          </p>
        </motion.div>
      </div>

      {/* Steps */}
      <div ref={ref} className="relative mx-auto max-w-5xl px-4 pb-20 md:px-8">
        {items.map((item, index) => {
          return (
            <div
              key={index}
              className="flex justify-start pt-10 md:gap-10 md:pt-28"
            >
              {/* Left sticky label */}
              <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
                {/* Node */}
                <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/25 bg-[#020617] text-emerald-400/70 md:left-3">
                  {typeof item.icon === "string" ? (
                    <span className="text-base">{item.icon}</span>
                  ) : (
                    item.icon
                  )}
                </div>
                <div className="hidden md:block md:pl-20">
                  <h3 className="text-3xl font-semibold text-emerald-200/60 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-emerald-600/50 mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Right content */}
              <div className="relative w-full pl-20 pr-4 md:pl-4">
                <div className="md:hidden mb-4">
                  <h3 className="text-2xl font-semibold text-emerald-200/70">
                    {item.title}
                  </h3>
                  <p className="text-xs text-emerald-600/50 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                {item.content}
              </div>
            </div>
          );
        })}

        {/* Animated line */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-0.5 overflow-hidden bg-linear-to-b from-transparent via-emerald-500/15 to-transparent md:left-8"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-0.5 rounded-full bg-linear-to-b from-emerald-500 via-emerald-300 to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
