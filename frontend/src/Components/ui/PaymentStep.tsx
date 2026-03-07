import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck, Building2, CreditCard } from "lucide-react";

/* ───────── helpers ───────── */

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function maskCardNumber(num: string) {
  const digits = num.replace(/\s/g, "");
  const groups = [];
  for (let i = 0; i < 4; i++) {
    const chunk = digits.slice(i * 4, i * 4 + 4);
    groups.push(chunk.padEnd(4, "·"));
  }
  return groups;
}

function detectCardType(num: string): "visa" | "mc" | "amex" | null {
  const d = num.replace(/\D/g, "");
  if (d.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mc";
  if (/^3[47]/.test(d)) return "amex";
  return null;
}

/* ───────── card face visual ───────── */

const CardVisual = ({
  number, name, expiry, flipped,
}: {
  number: string; name: string; expiry: string; flipped: boolean;
}) => {
  const groups = maskCardNumber(number);
  const cardType = detectCardType(number);

  return (
    <div className="relative mx-auto mb-8" style={{ width: 320, height: 190, perspective: 1000 }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
        className="relative"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* card gradient bg */}
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-slate-800 via-slate-900 to-emerald-950/80 border border-white/10" />
          {/* shimmer */}
          <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

          <div className="relative flex items-start justify-between">
            {/* chip */}
            <div className="h-8 w-11 rounded-md bg-linear-to-br from-amber-300/80 to-amber-500/60 border border-amber-200/20 grid grid-cols-3 grid-rows-3 gap-px p-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`rounded-sm ${i === 4 ? "bg-amber-200/30" : "bg-amber-400/20"}`} />
              ))}
            </div>
            {/* card network */}
            <div className="text-right">
              {cardType === "visa" && (
                <span className="text-base font-bold italic tracking-tight text-white/80">VISA</span>
              )}
              {cardType === "mc" && (
                <div className="flex gap-[-6px]">
                  <div className="h-6 w-6 rounded-full bg-red-500/80" />
                  <div className="h-6 w-6 rounded-full bg-amber-400/80 -ml-3" />
                </div>
              )}
              {cardType === "amex" && (
                <span className="text-[10px] font-bold tracking-widest text-white/70">AMEX</span>
              )}
              {!cardType && (
                <CreditCard className="h-5 w-5 text-white/25" />
              )}
            </div>
          </div>

          {/* card number */}
          <div className="relative flex gap-4 font-mono text-xl tracking-[0.2em] text-white/90 mt-3">
            {groups.map((g, i) => (
              <span key={i} className={g.includes("·") ? "text-white/30" : ""}>{g}</span>
            ))}
          </div>

          {/* name + expiry */}
          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-0.5">Card holder</p>
              <p className="text-xs font-medium text-white/80 uppercase tracking-wider truncate max-w-[160px]">
                {name || "YOUR NAME"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-0.5">Expires</p>
              <p className="text-xs font-medium text-white/80 font-mono">
                {expiry || "MM/YY"}
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-slate-800 via-slate-900 to-emerald-950/80 border border-white/10 rounded-2xl" />
          {/* magnetic stripe */}
          <div className="absolute top-8 left-0 right-0 h-10 bg-black/70" />
          {/* CVV */}
          <div className="absolute top-24 right-6 left-6">
            <div className="h-8 rounded bg-white/90 flex items-center justify-end px-3">
              <span className="text-sm font-mono text-slate-800 tracking-widest">•••</span>
            </div>
            <p className="mt-1 text-[9px] text-right text-white/30 uppercase tracking-widest">CVV</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ───────── main component ───────── */

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  accentColor?: "emerald" | "amber";
}

const PaymentStep = ({ onNext, onBack, accentColor = "emerald" }: PaymentStepProps) => {
  const [tab, setTab] = useState<"card" | "bank">("card");

  // card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cvvFocused, setCvvFocused] = useState(false);

  // bank fields
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");

  const cardReady =
    cardNumber.replace(/\s/g, "").length >= 13 &&
    cardName.trim().length >= 2 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  const bankReady =
    routingNumber.length === 9 && accountNumber.length >= 8;

  const canContinue = tab === "card" ? cardReady : bankReady;

  const accent = accentColor === "amber"
    ? { border: "border-amber-500/20", bg: "bg-amber-500/10", text: "text-amber-300", focus: "focus:border-amber-500/40", btn: "bg-amber-500 hover:bg-amber-400" }
    : { border: "border-emerald-500/20", bg: "bg-emerald-500/10", text: "text-emerald-300", focus: "focus:border-emerald-500/40", btn: "bg-emerald-500 hover:bg-emerald-400" };

  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 w-full max-w-md text-center">

        <h2 className="text-3xl font-bold text-white">Link your account</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-gray-400">
          Connect your card or bank to fund your tree. Secured with 256-bit encryption.
        </p>

        {/* tabs */}
        <div className="mt-8 flex rounded-2xl border border-white/5 bg-white/2 p-1 gap-1">
          {(["card", "bank"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all ${
                tab === t ? `${accent.bg} ${accent.border} border ${accent.text}` : "text-white/30 hover:text-white/50"
              }`}
            >
              {t === "card" ? <CreditCard className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
              {t === "card" ? "Debit / Credit Card" : "Bank Account"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "card" ? (
            <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

              {/* card visual */}
              <div className="mt-6">
                <CardVisual number={cardNumber} name={cardName} expiry={expiry} flipped={cvvFocused} />
              </div>

              {/* form */}
              <div className="space-y-3">
                {/* card number */}
                <div>
                  <label className="block text-left text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                    Card number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className={`w-full rounded-xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none font-mono tracking-wider ${accent.focus} transition-colors`}
                  />
                </div>

                {/* name */}
                <div>
                  <label className="block text-left text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                    Name on card
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className={`w-full rounded-xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none uppercase tracking-wide ${accent.focus} transition-colors`}
                  />
                </div>

                {/* expiry + cvv */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-left text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                      Expiry
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className={`w-full rounded-xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none font-mono ${accent.focus} transition-colors`}
                    />
                  </div>
                  <div>
                    <label className="block text-left text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="•••"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      onFocus={() => setCvvFocused(true)}
                      onBlur={() => setCvvFocused(false)}
                      className={`w-full rounded-xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none font-mono tracking-widest ${accent.focus} transition-colors`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="bank" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
              className="mt-6 space-y-3">

              {/* account type */}
              <div className="grid grid-cols-2 gap-2">
                {(["checking", "savings"] as const).map((t) => (
                  <button key={t} onClick={() => setAccountType(t)}
                    className={`rounded-xl border py-2.5 text-xs font-medium capitalize transition-all ${
                      accountType === t ? `${accent.bg} ${accent.border} border ${accent.text}` : "border-white/5 text-white/30 hover:border-white/10"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>

              {/* routing */}
              <div>
                <label className="block text-left text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                  Routing number
                </label>
                <input type="text" inputMode="numeric" placeholder="9 digits"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  className={`w-full rounded-xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none font-mono ${accent.focus} transition-colors`} />
              </div>

              {/* account */}
              <div>
                <label className="block text-left text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                  Account number
                </label>
                <input type="text" inputMode="numeric" placeholder="Account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 17))}
                  className={`w-full rounded-xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none font-mono ${accent.focus} transition-colors`} />
              </div>

              <div className="rounded-xl border border-white/5 bg-white/2 p-3 text-left">
                <p className="text-[10px] text-white/30">
                  You'll find your routing and account numbers at the bottom of your checks or in your bank's app.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* security badges */}
        <div className="mt-5 flex items-center justify-center gap-4">
          {[
            { icon: Lock, label: "256-bit encryption" },
            { icon: ShieldCheck, label: "Bank-level security" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-white/20">
              <Icon className="h-3 w-3" />
              <span className="text-[10px]">{label}</span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="mt-6 flex gap-3">
          <button onClick={onBack}
            className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/40 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back
          </button>
          <button onClick={onNext} disabled={!canContinue}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${accent.btn}`}>
            Continue
            <ArrowRight className="h-4 w-4 inline ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
