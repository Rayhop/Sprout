import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FractalLifecycleTree from "@/Components/ui/fractal-lifecycle-tree";
import PaymentStep from "@/Components/ui/PaymentStep";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Heart,
  CalendarHeart,
  Wallet,
  Sparkles,
} from "lucide-react";

/* ───────── constants ───────── */

const DEPOSIT_PRESETS = [10, 25, 50, 100] as const;

const stepLabels = ["Sign Up", "Payment", "Child", "Date", "Deposit", "Planted"];

const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const traits = [
  { emoji: "🌿", name: "Deep Roots", desc: "Save consistently for 1+ year" },
  { emoji: "🪵", name: "Ancient Bark", desc: "Save for 5+ years" },
  { emoji: "✨", name: "Golden Canopy", desc: "Reach $5,000 total" },
  { emoji: "🌸", name: "Full Bloom", desc: "Add 10+ memories" },
  { emoji: "🌲", name: "Steady Growth", desc: "Never miss an auto-save" },
  { emoji: "🌱", name: "Grove Maker", desc: "Build 2+ family trees" },
];

/* ───────── step indicator ───────── */

const StepIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div className="flex items-center justify-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="relative flex h-8 items-center justify-center">
        {i === current && (
          <motion.div
            layoutId="family-step-pill"
            className="absolute inset-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3"
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          />
        )}
        <span
          className={`relative z-10 px-2.5 text-xs font-medium transition-colors ${
            i === current
              ? "text-emerald-300"
              : i < current
                ? "text-emerald-500/60"
                : "text-white/20"
          }`}
        >
          {i < current ? "✓" : stepLabels[i]}
        </span>
      </div>
    ))}
  </div>
);

/* ───────── step 0: email ───────── */

const EmailStep = ({ onNext }: { onNext: () => void }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col items-center">
      {/* background trees */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] flex gap-4">
        <FractalLifecycleTree level={5} animateGrowth={false} height={350} width={250} />
        <FractalLifecycleTree level={1} animateGrowth={false} height={200} width={150} />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10"
        >
          <Mail className="h-7 w-7 text-emerald-400" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to grow something
          <br />
          <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            for someone you love?
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
          Create a legacy savings tree for your child. Enter your email to get
          started.
        </p>

        <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-6 backdrop-blur-sm">
          <label className="block text-left text-[10px] uppercase tracking-widest text-emerald-500/50 mb-2">
            Your email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-black/30 px-4 py-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
            />
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="h-4 w-px bg-emerald-400"
            />
          </div>
          <button
            onClick={onNext}
            className="mt-4 w-full rounded-xl bg-emerald-500/15 border border-emerald-500/25 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25 transition-colors"
          >
            Send Magic Link
          </button>
          <div className="mt-3 flex items-center justify-center gap-6">
            {["Instant access", "No passwords", "Free forever"].map((t) => (
              <span key={t} className="text-[10px] text-white/25">
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────── step 1: child's name ───────── */

const ChildNameStep = ({
  childName,
  setChildName,
  onNext,
  onBack,
}: {
  childName: string;
  setChildName: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) => (
  <div className="flex flex-col items-center">
    {/* background tree */}
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
      <FractalLifecycleTree level={2} animateGrowth={false} height={400} width={400} />
    </div>

    <div className="relative z-10 w-full max-w-md text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10"
      >
        <Heart className="h-7 w-7 text-emerald-400" />
      </motion.div>

      <h2 className="text-3xl font-bold text-white">Who is this tree for?</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
        This savings tree will grow for them. Once planted, this money belongs
        to your child.
      </p>

      <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-6 backdrop-blur-sm">
        <label className="block text-left text-[10px] uppercase tracking-widest text-emerald-500/50 mb-2">
          Child's name
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-black/30 px-4 py-3 focus-within:border-emerald-500/40 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all">
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Your child's name"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
            autoFocus
          />
          <span className="text-lg">🌱</span>
        </div>

        <AnimatePresence>
          {childName.trim() && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 text-sm text-amber-300/70 italic"
            >
              This money is for {childName}, not you.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 inline mr-1" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!childName.trim()}
          className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ArrowRight className="h-4 w-4 inline ml-1" />
        </button>
      </div>
    </div>
  </div>
);

/* ───────── step 2: inheritance date ───────── */

const InheritanceDateStep = ({
  childName,
  onNext,
  onBack,
}: {
  childName: string;
  onNext: (date: string) => void;
  onBack: () => void;
}) => {
  const [mode, setMode] = useState<"18" | "21" | "custom">("18");
  const [customYear, setCustomYear] = useState(new Date().getFullYear() + 18);
  const [customMonth, setCustomMonth] = useState(6);

  const currentYear = new Date().getFullYear();
  const targetYear =
    mode === "18"
      ? currentYear + 18
      : mode === "21"
        ? currentYear + 21
        : customYear;
  const targetMonth = mode === "custom" ? customMonth : 1;

  const now = new Date();
  const target = new Date(targetYear, targetMonth - 1);
  const diffMs = target.getTime() - now.getTime();
  const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  const diffMonths = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44),
  );

  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10"
        >
          <CalendarHeart className="h-7 w-7 text-emerald-400" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white">
          When should {childName} receive this?
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
          On this date, everything transfers — the money, the tree, every
          memory.
        </p>

        {/* quick select */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {(["18", "21", "custom"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-2xl border p-4 transition-all duration-200 ${
                mode === m
                  ? "border-emerald-500/35 bg-emerald-500/10"
                  : "border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/20"
              }`}
            >
              <div
                className={`text-lg font-bold ${
                  mode === m ? "text-emerald-300" : "text-white/60"
                }`}
              >
                {m === "custom" ? "Pick" : `${m}th`}
              </div>
              <div className="mt-0.5 text-[10px] text-white/30">
                {m === "custom" ? "Custom date" : "Birthday"}
              </div>
            </button>
          ))}
        </div>

        {/* custom date picker */}
        <AnimatePresence>
          {mode === "custom" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                  <label className="block text-[10px] uppercase tracking-widest text-emerald-500/50 mb-2 text-left">
                    Month
                  </label>
                  <select
                    value={customMonth}
                    onChange={(e) => setCustomMonth(Number(e.target.value))}
                    className="w-full bg-black/30 border border-emerald-500/15 rounded-xl px-3 py-2.5 text-sm text-white appearance-none cursor-pointer outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                  <label className="block text-[10px] uppercase tracking-widest text-emerald-500/50 mb-2 text-left">
                    Year
                  </label>
                  <select
                    value={customYear}
                    onChange={(e) => setCustomYear(Number(e.target.value))}
                    className="w-full bg-black/30 border border-emerald-500/15 rounded-xl px-3 py-2.5 text-sm text-white appearance-none cursor-pointer outline-none"
                  >
                    {Array.from({ length: 30 }, (_, i) => (
                      <option key={i} value={currentYear + 1 + i}>
                        {currentYear + 1 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* countdown */}
        <motion.div
          key={`${targetYear}-${targetMonth}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4"
        >
          <p className="text-sm text-amber-300/70">
            That's{" "}
            <span className="font-bold text-amber-300">
              {diffYears} years
              {diffMonths > 0 && ` and ${diffMonths} months`}
            </span>{" "}
            from now
          </p>
          <p className="mt-1 text-[10px] text-amber-500/40">
            {childName} receives this tree in {targetYear}
          </p>
        </motion.div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back
          </button>
          <button
            onClick={() => onNext(`${targetYear}-${targetMonth}`)}
            className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
          >
            Next
            <ArrowRight className="h-4 w-4 inline ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ───────── step 3: first deposit ───────── */

const DepositStep = ({
  childName,
  onNext,
  onBack,
}: {
  childName: string;
  onNext: (amount: number) => void;
  onBack: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(25);
  const [custom, setCustom] = useState("");

  const depositAmount = selected ?? (custom ? parseInt(custom) : 0);

  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10"
        >
          <Wallet className="h-7 w-7 text-emerald-400" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white">
          Plant the first seed for {childName}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
          Every great tree starts with a single deposit. How much do you want to
          plant?
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {DEPOSIT_PRESETS.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSelected(amt);
                setCustom("");
              }}
              className={`rounded-2xl border p-4 text-center transition-all duration-200 ${
                selected === amt
                  ? "border-emerald-500/35 bg-emerald-500/10"
                  : "border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/20"
              }`}
            >
              <div
                className={`text-xl font-bold ${
                  selected === amt ? "text-emerald-300" : "text-white/70"
                }`}
              >
                ${amt}
              </div>
            </button>
          ))}
        </div>

        {/* custom */}
        <div className="mt-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
          <label className="block text-left text-[10px] uppercase tracking-widest text-emerald-500/50 mb-2">
            Custom amount
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-black/30 px-4 py-3">
            <span className="text-sm text-white/40">$</span>
            <input
              type="number"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setSelected(null);
              }}
              placeholder="Enter amount"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
            />
          </div>
        </div>

        {/* milestone progress */}
        {depositAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4"
          >
            <div className="flex items-center justify-between text-[10px] text-white/30 mb-1.5">
              <span>First memory milestone</span>
              <span>${depositAmount} / $500</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((depositAmount / 500) * 100, 100)}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" as const }}
                className="h-full rounded-full bg-linear-to-r from-emerald-700 to-emerald-400"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-emerald-500/40">
              At $500, you can add your first memory for {childName}
            </p>
          </motion.div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back
          </button>
          <button
            onClick={() => onNext(depositAmount)}
            disabled={!depositAmount}
            className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Plant {childName}'s Tree
            <Sparkles className="h-4 w-4 inline ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ───────── step 4: celebration ───────── */

const CelebrationStep = ({
  childName,
  inheritanceDate,
  onFinish,
}: {
  childName: string;
  depositAmount: number;
  inheritanceDate: string;
  onFinish: () => void;
}) => {
  const [year] = inheritanceDate.split("-");

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 14,
          delay: 0.2,
        }}
      >
        <FractalLifecycleTree level={1} animateGrowth height={280} width={320} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-3 py-1.5">
          <span className="text-xs font-bold text-emerald-400">Lv.1</span>
          <span className="text-xs text-emerald-200/60">Seed</span>
        </div>

        <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
          {childName}'s tree is planted
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
          You just started something that will outlast everything else.
        </p>

        {/* inheritance countdown */}
        <div className="mt-6 rounded-2xl border border-amber-500/15 bg-amber-500/5 px-5 py-3 inline-flex items-center gap-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-amber-400"
          />
          <span className="text-xs text-amber-300/70">
            {childName} receives this tree in {year}
          </span>
        </div>

        {/* earnable traits */}
        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-3">
            Traits you can earn for {childName}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {traits.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-white/5 bg-white/2 p-3 opacity-50"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm">{t.emoji}</span>
                  <span className="text-[10px] font-medium text-white/40">
                    {t.name}
                  </span>
                </div>
                <p className="text-[9px] text-white/20">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onFinish}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
          >
            Go to my grove
            <ArrowRight className="h-4 w-4 inline ml-1.5" />
          </button>
          <button
            onClick={onFinish}
            className="text-xs text-white/25 hover:text-white/40 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ───────── page ───────── */

const OnboardingFamily = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [childName, setChildName] = useState("");
  const [inheritanceDate, setInheritanceDate] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);

  return (
    <div className="relative min-h-screen bg-[#020617] flex flex-col">
      {/* ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-150 w-200 -translate-x-1/2 rounded-full bg-emerald-500/4 blur-[120px]" />

      {/* step indicator */}
      <div className="relative z-10 pt-10 pb-4">
        <StepIndicator current={step} total={6} />
      </div>

      {/* step content */}
      <div className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" as const }}
            className="w-full"
          >
            {step === 0 && <EmailStep onNext={() => setStep(1)} />}
            {step === 1 && (
              <PaymentStep onNext={() => setStep(2)} onBack={() => setStep(0)} accentColor="amber" />
            )}
            {step === 2 && (
              <ChildNameStep
                childName={childName}
                setChildName={setChildName}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <InheritanceDateStep
                childName={childName}
                onNext={(date) => {
                  setInheritanceDate(date);
                  setStep(4);
                }}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <DepositStep
                childName={childName}
                onNext={(amt) => {
                  setDepositAmount(amt);
                  setStep(5);
                }}
                onBack={() => setStep(3)}
              />
            )}
            {step === 5 && (
              <CelebrationStep
                childName={childName}
                depositAmount={depositAmount}
                inheritanceDate={inheritanceDate}
                onFinish={() =>
                  navigate("/dashboard", {
                    state: {
                      type: "family",
                      childName,
                      inheritanceDate,
                      depositAmount,
                    },
                  })
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingFamily;
