import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FractalLifecycleTree from "@/Components/ui/fractal-lifecycle-tree";
import PaymentStep from "@/Components/ui/PaymentStep";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Sprout,
  Sparkles,
  RefreshCw,
  Check,
} from "lucide-react";

/* ───────── constants ───────── */

const DEPOSIT_PRESETS = [10, 25, 50, 100] as const;

const stepLabels = ["Sign Up", "Payment", "First Deposit", "Your Seed", "Auto-Save"];

const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

/* ───────── step indicator ───────── */

const StepIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div className="flex items-center justify-center gap-3">
    {Array.from({ length: total }).map((_, i) => (
      <button key={i} className="relative flex h-8 items-center justify-center">
        {i === current && (
          <motion.div
            layoutId="step-pill"
            className="absolute inset-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4"
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          />
        )}
        <span
          className={`relative z-10 px-3 text-xs font-medium transition-colors ${
            i === current
              ? "text-emerald-300"
              : i < current
                ? "text-emerald-500/60"
                : "text-white/20"
          }`}
        >
          {i < current ? (
            <Check className="h-3.5 w-3.5 inline" />
          ) : (
            stepLabels[i]
          )}
        </span>
      </button>
    ))}
  </div>
);

/* ───────── step 0: email ───────── */

const EmailStep = ({ onNext }: { onNext: () => void }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col items-center">
      {/* background tree */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
        <FractalLifecycleTree
          level={1}
          animateGrowth={false}
          height={400}
          width={400}
        />
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
          Your story starts here
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
          Enter your email. We'll send a magic link — no passwords, no crypto,
          just you.
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
            {["No passwords", "No crypto", "Always free"].map((t) => (
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

/* ───────── step 1: first deposit ───────── */

const DepositStep = ({
  onNext,
  onBack,
}: {
  onNext: (amount: number) => void;
  onBack: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);
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
          <Sprout className="h-7 w-7 text-emerald-400" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white">Plant your first seed</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
          How much would you like to deposit today? This is real money going into your tree.
        </p>

        {/* presets */}
        <div className="mt-8 grid grid-cols-4 gap-3">
          {DEPOSIT_PRESETS.map((amt) => (
            <button
              key={amt}
              onClick={() => { setSelected(amt); setCustom(""); }}
              className={`rounded-2xl border p-4 text-center transition-all duration-200 ${
                selected === amt
                  ? "border-emerald-500/35 bg-emerald-500/10"
                  : "border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/20"
              }`}
            >
              <div className={`text-lg font-bold ${selected === amt ? "text-emerald-300" : "text-white/70"}`}>
                ${amt}
              </div>
            </button>
          ))}
        </div>

        {/* custom */}
        <div className="mt-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
          <label className="block text-left text-[10px] uppercase tracking-widest text-emerald-500/50 mb-2">
            Or enter a custom amount
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-black/30 px-4 py-3">
            <span className="text-sm text-white/40">$</span>
            <input
              type="number"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
              placeholder="0.00"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
            />
          </div>
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
            onClick={() => depositAmount > 0 && onNext(depositAmount)}
            disabled={depositAmount <= 0}
            className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Plant My Seed
            <ArrowRight className="h-4 w-4 inline ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ───────── step 2: celebration ───────── */

const CelebrationStep = ({
  goalAmount,
  onNext,
}: {
  goalAmount: number;
  onNext: () => void;
}) => (
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
    >
      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-3 py-1.5">
        <span className="text-xs font-bold text-emerald-400">Lv.1</span>
        <span className="text-xs text-emerald-200/60">Seed</span>
      </div>

      <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
        Your seed is planted
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
        Every great tree starts exactly like this. Your first step toward
        something extraordinary.
      </p>

      {goalAmount > 0 && (
        <div className="mx-auto mt-6 max-w-xs">
          <div className="flex items-center justify-between text-[10px] text-white/30 mb-1.5">
            <span>Your goal</span>
            <span>${goalAmount.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "3%" }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" as const }}
              className="h-full rounded-full bg-linear-to-r from-emerald-700 to-emerald-400"
            />
          </div>
          <p className="mt-1.5 text-[10px] text-emerald-500/40">
            Next level: Sprout at $50
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        className="mt-8 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
      >
        Continue
        <ArrowRight className="h-4 w-4 inline ml-1.5" />
      </button>
    </motion.div>
  </div>
);

/* ───────── step 3: auto-save ───────── */

const AutoSaveStep = ({
  onBack,
  onFinish,
}: {
  onBack: () => void;
  onFinish: (autoSave: {
    enabled: boolean;
    frequency: string;
    amount: number;
  }) => void;
}) => {
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState<"weekly" | "monthly">("weekly");
  const [amount, setAmount] = useState(25);

  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10"
        >
          <RefreshCw className="h-7 w-7 text-emerald-400" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white">Grow on autopilot</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
          Enable auto-save and your tree grows on its own. Never miss a deposit.
          Earn the <span className="text-emerald-400">Steady Growth</span>{" "}
          trait.
        </p>

        {/* toggle */}
        <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Auto-Save</span>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
                enabled ? "bg-emerald-500" : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{ x: enabled ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
              />
            </button>
          </div>

          <AnimatePresence>
            {enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* frequency */}
                <div className="mt-5 flex gap-2">
                  {(["weekly", "monthly"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`flex-1 rounded-xl border py-2.5 text-xs font-medium capitalize transition-all ${
                        frequency === f
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-white/5 text-white/30 hover:border-emerald-500/15"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* amount */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500/50">
                      Amount
                    </span>
                    <span className="text-sm font-semibold text-emerald-300">
                      ${amount}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 ${((amount - 5) / 195) * 100}%, rgba(255,255,255,0.08) ${((amount - 5) / 195) * 100}%)`,
                    }}
                  />
                </div>

                {/* trait preview */}
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-black/20 p-3">
                  <span className="text-lg">🌲</span>
                  <div>
                    <p className="text-xs font-medium text-emerald-300">
                      Steady Growth
                    </p>
                    <p className="text-[10px] text-white/30">
                      Earned by never missing an auto-save
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => onFinish({ enabled, frequency, amount })}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
          >
            {enabled ? (
              <>
                Enable Auto-Save
                <Sparkles className="h-4 w-4 inline ml-1.5" />
              </>
            ) : (
              "Finish Setup"
            )}
          </button>
          {!enabled && (
            <button
              onClick={onBack}
              className="text-xs text-white/25 hover:text-white/40 transition-colors"
            >
              <ArrowLeft className="h-3 w-3 inline mr-1" />
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ───────── page ───────── */

const OnboardingStart = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);

  return (
    <div className="relative min-h-screen bg-[#020617] flex flex-col">
      {/* ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-150 w-200 -translate-x-1/2 rounded-full bg-emerald-500/4 blur-[120px]" />

      {/* step indicator */}
      <div className="relative z-10 pt-10 pb-4">
        <StepIndicator current={step} total={5} />
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
              <PaymentStep onNext={() => setStep(2)} onBack={() => setStep(0)} />
            )}
            {step === 2 && (
              <DepositStep
                onNext={(amt) => {
                  setDepositAmount(amt);
                  setStep(3);
                }}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <CelebrationStep
                goalAmount={depositAmount}
                onNext={() => setStep(4)}
              />
            )}
            {step === 4 && (
              <AutoSaveStep
                onBack={() => setStep(3)}
                onFinish={(autoSave) =>
                  navigate("/dashboard", {
                    state: { type: "personal", depositAmount, autoSave },
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

export default OnboardingStart;
