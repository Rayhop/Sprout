import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FractalLifecycleTree from "@/Components/ui/fractal-lifecycle-tree";
import {
  Plus,
  Camera,
  ChevronRight,
  Zap,
  Lock,
  Sparkles,
  TrendingUp,
  CalendarClock,
  Wallet,
  ArrowDownLeft,
  X,
  ImagePlus,
  Heart,
  Gift,
} from "lucide-react";

/* ───────── types ───────── */

interface DashboardState {
  type?: "personal" | "family";
  goalAmount?: number;
  autoSave?: { enabled: boolean; frequency: string; amount: number };
  childName?: string;
  inheritanceDate?: string;
  depositAmount?: number;
}

interface Memory {
  id: number;
  label: string;
  date: string;
}

/* ───────── helpers ───────── */

const LEVELS = [
  { level: 1, name: "Seed", threshold: 0 },
  { level: 2, name: "Sprout", threshold: 50 },
  { level: 3, name: "Young Plant", threshold: 200 },
  { level: 4, name: "Flowering", threshold: 500 },
  { level: 5, name: "Small Tree", threshold: 1000 },
  { level: 6, name: "Large Tree", threshold: 2500 },
  { level: 7, name: "Golden Tree", threshold: 5000 },
  { level: 8, name: "Legendary", threshold: 10000 },
];

function getLevelFromAmount(amount: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (amount >= LEVELS[i].threshold) return LEVELS[i];
  }
  return LEVELS[0];
}

function getNextLevel(current: number) {
  return LEVELS.find((l) => l.level === current + 1) ?? null;
}

const PERSONAL_TRAITS = [
  { emoji: "🌿", name: "Deep Roots", desc: "Save consistently for 1+ year with auto-save", color: "emerald" },
  { emoji: "🪵", name: "Ancient Bark", desc: "Maintain your tree for 5+ years", color: "amber" },
  { emoji: "✨", name: "Golden Canopy", desc: "Reach $5,000 in total savings", color: "yellow" },
  { emoji: "🌸", name: "Full Bloom", desc: "Add 10+ memories to your tree", color: "pink" },
  { emoji: "🌲", name: "Steady Growth", desc: "Never miss a single auto-save", color: "teal" },
  { emoji: "🌱", name: "Grove Maker", desc: "Create 2+ family trees", color: "lime" },
];

const FAMILY_TRAITS = [
  { emoji: "🌿", name: "Deep Roots", desc: "Save every week for 1+ year — your child sees thick visible roots", color: "emerald", hint: "Set auto-save weekly" },
  { emoji: "🪵", name: "Ancient Bark", desc: "Save consistently for 5+ years — your child inherits a weathered, wise trunk", color: "amber", hint: "Keep building for 5 years" },
  { emoji: "✨", name: "Golden Canopy", desc: "Reach Level 7 or higher — gold-tipped leaves greet your child", color: "yellow", hint: "Reach $5,000" },
  { emoji: "🌸", name: "Full Bloom", desc: "Add 10+ memories — flowers bloom across every branch", color: "pink", hint: "Add 10 memories" },
  { emoji: "🌲", name: "Steady Growth", desc: "Never miss an auto-save — a perfectly symmetrical tree awaits", color: "teal", hint: "Never miss auto-save" },
  { emoji: "🌱", name: "Grove Maker", desc: "Build 2+ children's trees — small saplings appear at the base", color: "lime", hint: "Build another family tree" },
];

const traitColor: Record<string, string> = {
  emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
  amber: "border-amber-500/20 bg-amber-500/5 text-amber-300",
  yellow: "border-yellow-500/20 bg-yellow-500/5 text-yellow-300",
  pink: "border-pink-500/20 bg-pink-500/5 text-pink-300",
  teal: "border-teal-500/20 bg-teal-500/5 text-teal-300",
  lime: "border-lime-500/20 bg-lime-500/5 text-lime-300",
};

function getInheritanceCountdown(dateStr: string) {
  const [year, month] = dateStr.split("-").map(Number);
  const target = new Date(year, (month || 1) - 1);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44),
  );
  return { years: Math.max(0, years), months: Math.max(0, months), targetYear: year };
}

/* ───────── shared sub-components ───────── */

const TraitCard = ({
  emoji, name, desc, unlocked, color, index, hint,
}: {
  emoji: string; name: string; desc: string; unlocked: boolean; color: string; index: number; hint?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 * index, duration: 0.4 }}
    className={`relative rounded-xl border p-3 transition-all ${
      unlocked ? traitColor[color] : "border-white/5 bg-white/2"
    }`}
  >
    {!unlocked && <Lock className="absolute top-2 right-2 h-3 w-3 text-white/15" />}
    <div className="flex items-center gap-1.5 mb-1">
      <span className={`text-base ${unlocked ? "" : "grayscale opacity-40"}`}>{emoji}</span>
      <span className={`text-[11px] font-semibold ${unlocked ? "" : "text-white/30"}`}>{name}</span>
    </div>
    <p className={`text-[9px] leading-relaxed ${unlocked ? "text-white/40" : "text-white/20"}`}>{desc}</p>
    {!unlocked && hint && (
      <p className="mt-1 text-[8px] text-white/15 italic">{hint}</p>
    )}
  </motion.div>
);

/* ───────── level-up celebration ───────── */

const LevelUpCelebration = ({
  level, levelName, onDismiss,
}: {
  level: number; levelName: string; onDismiss: () => void;
}) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onDismiss}
    >
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], y: -(100 + Math.random() * 140), x: (Math.random() - 0.5) * 220, scale: [0, 1.3, 0] }}
          transition={{ duration: 1.8 + Math.random(), delay: Math.random() * 0.7, ease: "easeOut" }}
          className="pointer-events-none absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-emerald-400"
          style={{ marginLeft: (Math.random() - 0.5) * 120, marginTop: (Math.random() - 0.5) * 80 }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.1 }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-5 px-8 text-center"
      >
        <FractalLifecycleTree level={level} animateGrowth height={220} width={240} />

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/60 mb-2">
            Your tree just became something new.
          </p>
          <h2 className="text-3xl font-bold text-white">
            Level {level}{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {levelName}
            </span>
          </h2>
          <p className="mt-2 text-sm text-white/35">Your tree just grew a little.</p>
        </div>

        <button
          onClick={onDismiss}
          className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-8 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25 transition-colors"
        >
          Keep growing
        </button>
      </motion.div>
    </motion.div>
  );
};

/* ───────── Add Funds modal ───────── */

const AddFundsModal = ({
  onClose,
  onDeposit,
  accentClass,
}: {
  onClose: () => void;
  onDeposit: (n: number) => void;
  accentClass: string;
}) => {
  const [custom, setCustom] = useState("");
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-3xl border-t border-white/5 bg-[#020617] p-6 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border"
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-white">Add Funds</h3>
          <button onClick={onClose} className="text-white/20 hover:text-white/50"><X className="h-4 w-4" /></button>
        </div>
        <p className="text-sm text-white/35 mb-5">Your story starts here.</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[10, 25, 50, 100].map((amt) => (
            <button key={amt} onClick={() => onDeposit(amt)}
              className={`rounded-xl border py-3 text-sm font-semibold transition-all ${accentClass}`}>
              ${amt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-black/30 px-4 py-3 mb-4">
          <span className="text-sm text-white/30">$</span>
          <input type="number" placeholder="Custom amount" value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" />
        </div>
        <button onClick={() => { if (Number(custom) > 0) onDeposit(Number(custom)); }}
          disabled={!custom || Number(custom) <= 0}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          Plant Funds
        </button>
      </motion.div>
    </>
  );
};

/* ═══════════════════════════════════════════════════
   PERSONAL DASHBOARD
═══════════════════════════════════════════════════ */

const PersonalDashboard = ({
  balance, setBalance, peakBalance, setPeakBalance, autoSave, goalAmount,
}: {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  peakBalance: number;
  setPeakBalance: React.Dispatch<React.SetStateAction<number>>;
  autoSave: { enabled: boolean; frequency: string; amount: number };
  goalAmount: number;
}) => {
  const navigate = useNavigate();
  const currentLvl = getLevelFromAmount(balance);
  const peakLvl = getLevelFromAmount(peakBalance);
  const nextLvl = getNextLevel(currentLvl.level);
  const toNextLevel = nextLvl ? nextLvl.threshold - balance : 0;
  const levelProgress = nextLvl
    ? ((balance - currentLvl.threshold) / (nextLvl.threshold - currentLvl.threshold)) * 100
    : 100;
  const realIsDormant = peakLvl.level > currentLvl.level;
  const prevLevelRef = useRef(currentLvl.level);

  const unlockedTraits: string[] = [];
  if (autoSave.enabled) unlockedTraits.push("Steady Growth");
  if (balance >= 5000) unlockedTraits.push("Golden Canopy");

  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [levelUpCelebration, setLevelUpCelebration] = useState<{ level: number; name: string } | null>(null);
  const [customWithdraw, setCustomWithdraw] = useState("");

  const applyDeposit = (amount: number) => {
    if (amount <= 0) return;
    setBalance((prev) => {
      const next = prev + amount;
      setPeakBalance((p) => Math.max(p, next));
      const newLvl = getLevelFromAmount(next);
      if (newLvl.level > prevLevelRef.current) {
        prevLevelRef.current = newLvl.level;
        setTimeout(() => setLevelUpCelebration({ level: newLvl.level, name: newLvl.name }), 300);
      }
      return next;
    });
    setAddFundsOpen(false);
  };

  const applyWithdrawal = (amount: number) => {
    if (amount <= 0) return;
    setBalance((prev) => Math.max(0, prev - amount));
    setWithdrawOpen(false);
    setCustomWithdraw("");
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20">
      {/* ambient */}
      <div className={`pointer-events-none fixed top-0 left-1/2 h-125 w-175 -translate-x-1/2 rounded-full blur-[140px] transition-colors duration-1000 ${realIsDormant ? "bg-amber-900/8" : "bg-emerald-500/4"}`} />

      <AnimatePresence>
        {levelUpCelebration && (
          <LevelUpCelebration level={levelUpCelebration.level} levelName={levelUpCelebration.name}
            onDismiss={() => setLevelUpCelebration(null)} />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

        {/* ── header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-500/40 mb-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {realIsDormant ? (
                <>Your tree is <span className="bg-linear-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">recovering</span></>
              ) : (
                <>Your grove is <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">growing</span></>
              )}
            </h1>
            {realIsDormant && (
              <p className="mt-1 text-xs text-amber-400/50">
                This tree reached {peakLvl.name}. It's recovering.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-2 rounded-full border px-4 py-1.5 ${realIsDormant ? "border-amber-500/20 bg-amber-500/10" : "border-emerald-500/20 bg-emerald-500/10"}`}>
              <span className={`text-xs font-bold ${realIsDormant ? "text-amber-400" : "text-emerald-400"}`}>Lv.{currentLvl.level}</span>
              <span className="text-xs text-white/30">—</span>
              <span className="text-xs text-white/50">{currentLvl.name}</span>
              {realIsDormant && <span className="text-[9px] uppercase tracking-widest text-amber-400/50 ml-1">dormant</span>}
            </div>
            {autoSave.enabled && (
              <div className="flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1.5">
                <Zap className="h-3 w-3 text-teal-400" />
                <span className="text-xs text-teal-300">Auto-Save On</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── grid ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* left: tree */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`relative overflow-hidden rounded-3xl border flex flex-col items-center justify-center py-8 ${realIsDormant ? "border-amber-500/10 bg-linear-to-b from-amber-950/20 to-[#020617]" : "border-emerald-500/10 bg-linear-to-b from-emerald-950/20 to-[#020617]"}`}
            style={{ minHeight: 540 }}>
            <div className={`pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${realIsDormant ? "bg-amber-800/6" : "bg-emerald-500/6"}`} />

            {realIsDormant && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Dormant — add funds to revive
              </motion.div>
            )}

            <FractalLifecycleTree level={currentLvl.level} animateGrowth={!realIsDormant}
              dormant={realIsDormant} peakLevel={realIsDormant ? peakLvl.level : undefined}
              height={420} width={460} />

            <div className="mt-2 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/8 bg-black/40 px-4 py-1.5 backdrop-blur-sm">
                <span className="text-xs font-bold text-emerald-400">Lv.{currentLvl.level}</span>
                <span className="text-xs text-white/35">{currentLvl.name}</span>
                {currentLvl.level < 8 && (
                  <><span className="h-3 w-px bg-white/10" />
                  <span className="text-[10px] text-white/20">${toNextLevel.toLocaleString()} to {nextLvl?.name}</span></>
                )}
              </div>
              <div className="flex items-center gap-1">
                {LEVELS.map((l) => (
                  <div key={l.level} title={`${l.name} — $${l.threshold.toLocaleString()}`}
                    className={`h-1.5 w-5 rounded-full transition-all ${l.level <= currentLvl.level ? "bg-emerald-400" : "bg-white/8"}`} />
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setAddFundsOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add Funds
              </button>
              <button onClick={() => setWithdrawOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-white/30 hover:text-white/50 transition-colors">
                <ArrowDownLeft className="h-3 w-3" /> Withdraw
              </button>
              <button onClick={() => navigate("/how-it-works")}
                className="flex items-center gap-1.5 rounded-full border border-white/8 px-4 py-2 text-xs text-white/20 hover:text-white/40 transition-colors">
                How it works <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          {/* right: stats */}
          <div className="flex flex-col gap-4">

            {/* savings card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/60">Savings Overview</span>
              </div>

              <div className="text-3xl font-bold text-white">
                ${balance.toLocaleString()}
                <span className="ml-2 text-base font-normal text-white/20">saved</span>
              </div>
              {goalAmount > 0 && (
                <p className="mt-1 text-xs text-white/25">Goal: ${goalAmount.toLocaleString()}</p>
              )}

              {nextLvl && (
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-white/20 mb-1.5">
                    <span>Progress to {nextLvl.name}</span>
                    <span>${balance} / ${nextLvl.threshold.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(levelProgress, 2)}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-linear-to-r from-emerald-700 to-emerald-400" />
                  </div>
                  <p className="mt-1.5 text-[10px] text-emerald-500/35">${toNextLevel.toLocaleString()} more to reach Level {nextLvl.level}</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-emerald-500/10 bg-black/20 p-3">
                  <Wallet className="h-3.5 w-3.5 text-emerald-400/60 mb-1.5" />
                  <div className="text-xs text-white/30 mb-0.5">Balance</div>
                  <div className="text-lg font-bold text-white">${balance.toLocaleString()}</div>
                </div>
                <div className="rounded-2xl border border-emerald-500/10 bg-black/20 p-3">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400/60 mb-1.5" />
                  <div className="text-xs text-white/30 mb-0.5">Level</div>
                  <div className="text-lg font-bold text-white">{currentLvl.level}<span className="text-xs text-white/25">/8</span></div>
                  <div className="text-[10px] text-white/25">{currentLvl.name}</div>
                </div>
              </div>
            </motion.div>

            {/* auto-save */}
            {autoSave.enabled && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28, duration: 0.5 }}
                className="rounded-3xl border border-teal-500/15 bg-teal-500/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-teal-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-400/60">Auto-Save</span>
                  </div>
                  <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[9px] font-medium text-teal-300">Active</span>
                </div>
                <div className="mt-3 text-xl font-bold text-white">
                  ${autoSave.amount}
                  <span className="ml-1.5 text-sm font-normal text-white/30 capitalize">/ {autoSave.frequency}</span>
                </div>
                <p className="mt-1 text-xs text-teal-300/40">
                  Your tree grows every {autoSave.frequency === "weekly" ? "week" : "month"}. Keep it up to earn the Steady Growth trait.
                </p>
              </motion.div>
            )}

            {/* traits */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/60">Traits</span>
                <span className="ml-auto text-[10px] text-white/15">{unlockedTraits.length}/{PERSONAL_TRAITS.length} earned</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PERSONAL_TRAITS.map((t, i) => (
                  <TraitCard key={t.name} {...t} unlocked={unlockedTraits.includes(t.name)} index={i} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* level journey */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-6 rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/60 mb-5">Your Journey — 8 Levels</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {LEVELS.map((l) => {
              const isCurrent = l.level === currentLvl.level;
              const isPast = l.level < currentLvl.level;
              return (
                <div key={l.level}
                  className={`rounded-2xl border p-3 text-center transition-all ${isCurrent ? "border-emerald-500/35 bg-emerald-500/10" : isPast ? "border-emerald-500/15 bg-emerald-500/5" : "border-white/5"}`}>
                  <div className={`text-xs font-bold mb-0.5 ${isCurrent ? "text-emerald-300" : isPast ? "text-emerald-500/50" : "text-white/15"}`}>Lv.{l.level}</div>
                  <div className={`text-[9px] truncate ${isCurrent ? "text-white/60" : "text-white/15"}`}>{l.name}</div>
                  <div className={`text-[8px] mt-0.5 ${isCurrent ? "text-emerald-500/50" : "text-white/8"}`}>${l.threshold.toLocaleString()}</div>
                  {isCurrent && (
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="mt-1.5 mx-auto h-1 w-1 rounded-full bg-emerald-400" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* modals */}
      <AnimatePresence>
        {addFundsOpen && (
          <AddFundsModal onClose={() => setAddFundsOpen(false)} onDeposit={applyDeposit}
            accentClass="border-emerald-500/10 bg-emerald-500/5 text-emerald-300 hover:border-emerald-500/25 hover:bg-emerald-500/10" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {withdrawOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setWithdrawOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-3xl border-t border-amber-500/10 bg-[#020617] p-6 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-white">Withdraw</h3>
                <button onClick={() => setWithdrawOpen(false)} className="text-white/20 hover:text-white/50"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-sm text-amber-400/50 mb-1">Your tree may enter dormancy if balance drops below a level threshold.</p>
              <p className="text-xs text-white/15 mb-5">Balance: ${balance.toLocaleString()}</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[10, 25, 50, 100].map((amt) => (
                  <button key={amt} disabled={amt > balance} onClick={() => applyWithdrawal(amt)}
                    className="rounded-xl border border-amber-500/10 bg-amber-500/5 py-3 text-sm font-semibold text-amber-300 hover:bg-amber-500/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed">${amt}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/10 bg-black/30 px-4 py-3 mb-4">
                <span className="text-sm text-white/30">$</span>
                <input type="number" placeholder="Custom amount" value={customWithdraw}
                  onChange={(e) => setCustomWithdraw(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" />
              </div>
              <button onClick={() => applyWithdrawal(Number(customWithdraw))}
                disabled={!customWithdraw || Number(customWithdraw) <= 0 || Number(customWithdraw) > balance}
                className="w-full rounded-xl border border-amber-500/20 bg-amber-500/10 py-3 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                Withdraw Funds
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   FAMILY DASHBOARD
═══════════════════════════════════════════════════ */

const FamilyDashboard = ({
  balance, setBalance, peakBalance, setPeakBalance,
  childName, inheritanceDate, autoSave,
}: {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  peakBalance: number;
  setPeakBalance: React.Dispatch<React.SetStateAction<number>>;
  childName: string;
  inheritanceDate: string;
  autoSave: { enabled: boolean; frequency: string; amount: number };
}) => {
  const navigate = useNavigate();
  const currentLvl = getLevelFromAmount(balance);
  const nextLvl = getNextLevel(currentLvl.level);
  const toNextLevel = nextLvl ? nextLvl.threshold - balance : 0;
  const levelProgress = nextLvl
    ? ((balance - currentLvl.threshold) / (nextLvl.threshold - currentLvl.threshold)) * 100
    : 100;
  const countdown = inheritanceDate ? getInheritanceCountdown(inheritanceDate) : null;
  const memorySlots = Math.floor(balance / 500);
  const prevLevelRef = useRef(currentLvl.level);

  const unlockedTraits: string[] = [];
  if (autoSave.enabled) unlockedTraits.push("Steady Growth");
  if (balance >= 5000) unlockedTraits.push("Golden Canopy");

  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [levelUpCelebration, setLevelUpCelebration] = useState<{ level: number; name: string } | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [memoryLabel, setMemoryLabel] = useState("");

  const applyDeposit = (amount: number) => {
    if (amount <= 0) return;
    setBalance((prev) => {
      const next = prev + amount;
      setPeakBalance((p) => Math.max(p, next));
      const newLvl = getLevelFromAmount(next);
      if (newLvl.level > prevLevelRef.current) {
        prevLevelRef.current = newLvl.level;
        setTimeout(() => setLevelUpCelebration({ level: newLvl.level, name: newLvl.name }), 300);
      }
      return next;
    });
    setAddFundsOpen(false);
  };

  const addMemory = () => {
    if (!memoryLabel.trim()) return;
    setMemories((prev) => [
      ...prev,
      { id: Date.now(), label: memoryLabel.trim(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
    ]);
    setMemoryLabel("");
    setMemoryOpen(false);
  };

  const name = childName || "your child";

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20">
      {/* warm amber ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 h-125 w-175 -translate-x-1/2 rounded-full bg-amber-600/5 blur-[140px]" />
      <div className="pointer-events-none fixed top-50 left-1/4 h-75 w-75 rounded-full bg-rose-500/3 blur-[100px]" />

      <AnimatePresence>
        {levelUpCelebration && (
          <LevelUpCelebration level={levelUpCelebration.level} levelName={levelUpCelebration.name}
            onDismiss={() => setLevelUpCelebration(null)} />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

        {/* ── header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-amber-500/40 mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Growing something for{" "}
            <span className="bg-linear-to-r from-amber-400 to-rose-300 bg-clip-text text-transparent">
              {name}
            </span>
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-400/40">
            <Heart className="h-3 w-3" />
            This money is for {name}, not you.
          </p>
        </motion.div>

        {/* ── inheritance countdown banner ── */}
        {countdown && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-6 rounded-2xl border border-amber-500/15 bg-linear-to-r from-amber-500/8 to-rose-500/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                <Gift className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-amber-500/50 mb-0.5">Inheritance</p>
                <p className="text-sm font-semibold text-white">
                  {name.charAt(0).toUpperCase() + name.slice(1)} receives this tree in{" "}
                  <span className="text-amber-300">{countdown.years} years, {countdown.months} months</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-300">{countdown.years}</div>
                <div className="text-[9px] uppercase tracking-widest text-amber-500/40">years</div>
              </div>
              <div className="text-white/15 text-lg">·</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-300">{countdown.months}</div>
                <div className="text-[9px] uppercase tracking-widest text-amber-500/40">months</div>
              </div>
              <div className="text-white/15 text-lg">·</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white/40">{countdown.targetYear}</div>
                <div className="text-[9px] uppercase tracking-widest text-white/15">year</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── main grid ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* left: tree */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-amber-500/10 bg-linear-to-b from-amber-950/15 to-[#020617] flex flex-col items-center justify-center py-8"
            style={{ minHeight: 540 }}>
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-amber-500/5" />

            {/* child label */}
            <div className="mb-3 flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-500/8 px-4 py-1.5">
              <Heart className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-300/70">{name}'s tree</span>
            </div>

            <FractalLifecycleTree level={currentLvl.level} animateGrowth height={420} width={460} />

            <div className="mt-2 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/8 bg-black/40 px-4 py-1.5 backdrop-blur-sm">
                <span className="text-xs font-bold text-amber-400">Lv.{currentLvl.level}</span>
                <span className="text-xs text-white/35">{currentLvl.name}</span>
                {currentLvl.level < 8 && (
                  <><span className="h-3 w-px bg-white/10" />
                  <span className="text-[10px] text-white/20">${toNextLevel.toLocaleString()} to {nextLvl?.name}</span></>
                )}
              </div>
              <div className="flex items-center gap-1">
                {LEVELS.map((l) => (
                  <div key={l.level} title={`${l.name} — $${l.threshold.toLocaleString()}`}
                    className={`h-1.5 w-5 rounded-full transition-all ${l.level <= currentLvl.level ? "bg-amber-400" : "bg-white/8"}`} />
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={() => setAddFundsOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add Funds
              </button>
              {memorySlots > memories.length && (
                <button onClick={() => setMemoryOpen(true)}
                  className="flex items-center gap-1.5 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-xs font-medium text-pink-300 hover:bg-pink-500/20 transition-colors">
                  <Camera className="h-3.5 w-3.5" /> Add Memory
                </button>
              )}
              <button onClick={() => navigate("/how-it-works")}
                className="flex items-center gap-1.5 rounded-full border border-white/8 px-4 py-2 text-xs text-white/20 hover:text-white/40 transition-colors">
                How it works <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>

          {/* right */}
          <div className="flex flex-col gap-4">

            {/* savings card (amber) */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="rounded-3xl border border-amber-500/10 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/60">Growing for {name}</span>
              </div>
              <div className="text-3xl font-bold text-white">
                ${balance.toLocaleString()}
                <span className="ml-2 text-base font-normal text-white/20">planted</span>
              </div>
              {nextLvl && (
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-white/20 mb-1.5">
                    <span>Progress to {nextLvl.name}</span>
                    <span>${balance} / ${nextLvl.threshold.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(levelProgress, 2)}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-linear-to-r from-amber-700 to-amber-400" />
                  </div>
                  <p className="mt-1.5 text-[10px] text-amber-500/35">${toNextLevel.toLocaleString()} more to reach Level {nextLvl.level}</p>
                </div>
              )}

              {/* next memory milestone */}
              {balance < (memorySlots + 1) * 500 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-pink-500/10 bg-pink-500/5 px-3 py-2.5">
                  <ImagePlus className="h-3.5 w-3.5 text-pink-400/60 shrink-0" />
                  <p className="text-[10px] text-pink-300/50">
                    ${((memorySlots + 1) * 500 - balance).toLocaleString()} more to unlock memory slot {memorySlots + 1}
                  </p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-amber-500/10 bg-black/20 p-3">
                  <Wallet className="h-3.5 w-3.5 text-amber-400/60 mb-1.5" />
                  <div className="text-xs text-white/30 mb-0.5">Total planted</div>
                  <div className="text-lg font-bold text-white">${balance.toLocaleString()}</div>
                </div>
                <div className="rounded-2xl border border-amber-500/10 bg-black/20 p-3">
                  <CalendarClock className="h-3.5 w-3.5 text-amber-400/60 mb-1.5" />
                  <div className="text-xs text-white/30 mb-0.5">Inherits</div>
                  <div className="text-lg font-bold text-white">{countdown?.targetYear ?? "—"}</div>
                </div>
              </div>
            </motion.div>

            {/* memories panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="rounded-3xl border border-pink-500/10 bg-pink-500/5 p-5">
              <div className="flex items-center gap-2 mb-1">
                <ImagePlus className="h-4 w-4 text-pink-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-pink-400/60">Memories</span>
                <span className="ml-auto text-[10px] text-white/15">{memories.length}/{memorySlots} used</span>
              </div>
              <p className="text-[10px] text-white/20 mb-4">
                Every $500 saved unlocks a memory slot. Memories transfer to {name} at inheritance — stored permanently, forever.
              </p>

              {memorySlots === 0 ? (
                <div className="rounded-xl border border-dashed border-pink-500/10 p-4 text-center">
                  <p className="text-[11px] text-white/20">
                    Save ${500 - balance} more to unlock your first memory slot
                  </p>
                  <div className="mt-2 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(balance / 500) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-pink-500/40" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from({ length: memorySlots }).map((_, i) => {
                    const mem = memories[i];
                    return (
                      <div key={i} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${mem ? "border-pink-500/20 bg-pink-500/8" : "border-white/5 bg-white/2"}`}>
                        <div className={`h-6 w-6 shrink-0 flex items-center justify-center rounded-lg text-xs ${mem ? "bg-pink-500/20 text-pink-300" : "bg-white/5 text-white/20"}`}>
                          {mem ? "✓" : (i + 1)}
                        </div>
                        {mem ? (
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-pink-200 truncate">{mem.label}</p>
                            <p className="text-[9px] text-pink-500/40">{mem.date}</p>
                          </div>
                        ) : (
                          <button onClick={() => setMemoryOpen(true)} className="flex-1 text-left text-[11px] text-white/20 hover:text-white/35 transition-colors">
                            Add a memory...
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* auto-save */}
            {autoSave.enabled && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="rounded-3xl border border-teal-500/15 bg-teal-500/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-teal-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-400/60">Auto-Save</span>
                  </div>
                  <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[9px] font-medium text-teal-300">Active</span>
                </div>
                <div className="mt-3 text-xl font-bold text-white">
                  ${autoSave.amount}<span className="ml-1.5 text-sm font-normal text-white/30 capitalize">/ {autoSave.frequency}</span>
                </div>
                <p className="mt-1 text-xs text-teal-300/40">
                  {name}'s tree grows automatically. Never miss one to earn the Steady Growth trait.
                </p>
              </motion.div>
            )}

            {/* traits — what your child will inherit */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/60">Traits {name} will inherit</span>
                <span className="ml-auto text-[10px] text-white/15">{unlockedTraits.length}/{FAMILY_TRAITS.length}</span>
              </div>
              <p className="text-[10px] text-white/20 mb-4">
                {name} will see your story in their tree — without ever seeing a dollar amount.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FAMILY_TRAITS.map((t, i) => (
                  <TraitCard key={t.name} {...t} unlocked={unlockedTraits.includes(t.name)} index={i} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* level journey */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 rounded-3xl border border-amber-500/10 bg-amber-500/5 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/60 mb-1">
            {name}'s Journey — 8 Levels
          </p>
          <p className="text-[10px] text-white/20 mb-5">Each level is unlocked by how much you plant for them.</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {LEVELS.map((l) => {
              const isCurrent = l.level === currentLvl.level;
              const isPast = l.level < currentLvl.level;
              return (
                <div key={l.level}
                  className={`rounded-2xl border p-3 text-center transition-all ${isCurrent ? "border-amber-500/30 bg-amber-500/8" : isPast ? "border-amber-500/12 bg-amber-500/4" : "border-white/4"}`}>
                  <div className={`text-xs font-bold mb-0.5 ${isCurrent ? "text-amber-300" : isPast ? "text-amber-500/45" : "text-white/12"}`}>Lv.{l.level}</div>
                  <div className={`text-[9px] truncate ${isCurrent ? "text-white/55" : "text-white/12"}`}>{l.name}</div>
                  <div className={`text-[8px] mt-0.5 ${isCurrent ? "text-amber-500/45" : "text-white/8"}`}>${l.threshold.toLocaleString()}</div>
                  {isCurrent && (
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="mt-1.5 mx-auto h-1 w-1 rounded-full bg-amber-400" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* modals */}
      <AnimatePresence>
        {addFundsOpen && (
          <AddFundsModal onClose={() => setAddFundsOpen(false)} onDeposit={applyDeposit}
            accentClass="border-amber-500/10 bg-amber-500/5 text-amber-300 hover:border-amber-500/25 hover:bg-amber-500/10" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {memoryOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMemoryOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-3xl border-t border-pink-500/10 bg-[#020617] p-6 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-white">Add a Memory</h3>
                <button onClick={() => setMemoryOpen(false)} className="text-white/20 hover:text-white/50"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-sm text-pink-400/40 mb-5">
                Attach a moment to {name}'s tree. It lives here forever — stored permanently, forever.
              </p>
              <input type="text" placeholder="e.g. First steps, Birthday 2024…" value={memoryLabel}
                onChange={(e) => setMemoryLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMemory()}
                className="w-full rounded-xl border border-pink-500/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-pink-500/30 mb-4" />
              <button onClick={addMemory} disabled={!memoryLabel.trim()}
                className="w-full rounded-xl bg-pink-500 py-3 text-sm font-semibold text-white hover:bg-pink-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                Plant this memory
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   ROOT COMPONENT — routes to correct dashboard
═══════════════════════════════════════════════════ */

const Dashboard = () => {
  const { state } = useLocation() as { state: DashboardState | null };

  const type = state?.type ?? "personal";
  const autoSave = state?.autoSave ?? { enabled: false, frequency: "weekly", amount: 25 };
  const initialDeposit = state?.depositAmount ?? 0;

  const [balance, setBalance] = useState(initialDeposit);
  const [peakBalance, setPeakBalance] = useState(initialDeposit);

  if (type === "family") {
    return (
      <FamilyDashboard
        balance={balance}
        setBalance={setBalance}
        peakBalance={peakBalance}
        setPeakBalance={setPeakBalance}
        childName={state?.childName ?? ""}
        inheritanceDate={state?.inheritanceDate ?? ""}
        autoSave={autoSave}
      />
    );
  }

  return (
    <PersonalDashboard
      balance={balance}
      setBalance={setBalance}
      peakBalance={peakBalance}
      setPeakBalance={setPeakBalance}
      autoSave={autoSave}
      goalAmount={state?.goalAmount ?? 0}
    />
  );
};

export default Dashboard;
