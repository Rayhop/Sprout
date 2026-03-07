import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Server,
  Fingerprint,
  KeyRound,
  UserCheck,
  TreePine,
  ChevronDown,
} from "lucide-react";

/* ───────── data ───────── */

const stats = [
  { value: "0", label: "DATA LEAKS", sub: "Since launch" },
  { value: "256-bit", label: "ENCRYPTION", sub: "AES-256-GCM" },
  { value: "100%", label: "YOUR DATA", sub: "You own it all" },
  { value: "Zero", label: "THIRD PARTIES", sub: "No data sold" },
];

const pillars = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    desc: "Every piece of data — savings, family trees, traits — is encrypted before it ever leaves your device. Not even we can read it.",
    color: "emerald",
  },
  {
    icon: Server,
    title: "Decentralized Storage",
    desc: "Your data isn't locked in a single server. It's distributed across a resilient network so no single point of failure can compromise your legacy.",
    color: "teal",
  },
  {
    icon: Fingerprint,
    title: "Biometric Access",
    desc: "Unlock your family vault with your fingerprint or face — no passwords to forget, no credentials to steal.",
    color: "cyan",
  },
  {
    icon: EyeOff,
    title: "Zero-Knowledge Architecture",
    desc: "We verify your identity without ever seeing your data. Our servers prove you're you — and learn nothing else.",
    color: "emerald",
  },
  {
    icon: KeyRound,
    title: "Family-Controlled Keys",
    desc: "Encryption keys live on your devices and are shared only with family members you invite. Revoke access anytime, instantly.",
    color: "teal",
  },
  {
    icon: UserCheck,
    title: "Transparent Permissions",
    desc: "See exactly who can view each branch of your family tree. Granular controls let you share savings milestones without exposing balances.",
    color: "cyan",
  },
];

const faqs = [
  {
    q: "Can Sprout employees see my savings data?",
    a: "No. Your data is encrypted on your device before it reaches our servers. We use a zero-knowledge architecture — we can verify your identity without ever accessing your information.",
  },
  {
    q: "What happens to my data if Sprout shuts down?",
    a: "You always have the option to export a full encrypted backup of your data. Your encryption keys belong to you, so your data remains accessible regardless of our service status.",
  },
  {
    q: "How does family sharing work without compromising privacy?",
    a: "When you invite a family member, a secure key exchange happens between your devices. They receive a derived key that lets them see only what you've explicitly shared — nothing more.",
  },
  {
    q: "Is my children's data protected differently?",
    a: "Children's accounts have additional safeguards. Their data is doubly encrypted and access is strictly limited to verified parent or guardian accounts. No data from minors is ever used for analytics.",
  },
  {
    q: "Do you use my data for advertising or analytics?",
    a: "Never. We don't sell, share, or analyze your personal data for any purpose beyond providing the Sprout service to you. Our business model is built on trust, not data exploitation.",
  },
];

/* ───────── sub-components ───────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeInOut" as const,
    },
  }),
};

const StatCard = ({
  value,
  label,
  sub,
  index,
}: {
  value: string;
  label: string;
  sub: string;
  index: number;
}) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    className="group relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-6 transition-colors hover:border-emerald-500/25"
  >
    {/* glow */}
    <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
    <div className="relative">
      <div className="text-3xl font-bold text-emerald-400">{value}</div>
      <div className="mt-1 text-xs font-medium tracking-widest text-gray-500 uppercase">
        {label}
      </div>
      <div className="mt-2 text-xs text-gray-600">{sub}</div>
    </div>
  </motion.div>
);

const PillarCard = ({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: typeof Lock;
  title: string;
  desc: string;
  index: number;
}) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="group relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-linear-to-br from-emerald-500/5 to-transparent p-8 transition-all hover:border-emerald-500/20 hover:shadow-[0_0_40px_rgba(16,185,129,0.06)]"
  >
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/15">
      <Icon className="h-6 w-6 text-emerald-400" />
    </div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-gray-400">{desc}</p>
  </motion.div>
);

const FaqItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="border-b border-emerald-500/10 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-medium text-white sm:text-base">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-emerald-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-gray-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ───────── page ───────── */

const PrivacyFirstPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-24">
      {/* ── hero ── */}
      <section className="relative overflow-hidden px-6">
        {/* ambient glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium tracking-wide text-emerald-300">
              Privacy First
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            Your roots are{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              sacred
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
          >
            Sprout is built on a simple principle — your family's financial
            journey belongs to you and no one else. Every byte is encrypted,
            every connection verified, every permission transparent.
          </motion.p>
        </div>
      </section>

      {/* ── stats ── */}
      <section className="mx-auto mt-20 max-w-5xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>
      </section>

      {/* ── shield visual ── */}
      <section className="relative mx-auto mt-28 max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-linear-to-br from-emerald-950/40 via-[#020617] to-[#020617] p-10 md:p-16"
        >
          {/* decorative shield */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex h-48 w-48 items-center justify-center">
              {/* rings */}
              <div className="absolute h-48 w-48 rounded-full border border-emerald-500/10 animate-[spin_30s_linear_infinite]" />
              <div className="absolute h-36 w-36 rounded-full border border-emerald-500/15 animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute h-24 w-24 rounded-full border border-emerald-500/20 animate-[spin_15s_linear_infinite]" />
              <ShieldCheck className="h-10 w-10 text-emerald-500/30" />
            </div>
          </div>

          <div className="relative z-10 grid gap-12 md:grid-cols-2 md:items-center">
            {/* left */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                  How It Works
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Your data never leaves your hands
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                When you save, set goals, or grow your family tree, everything
                is encrypted on your device first. Our servers only see
                ciphertext — meaningless without your keys.
              </p>
            </div>

            {/* right — encryption flow */}
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "You enter data",
                  text: "Savings, goals, and family info stay on your device.",
                },
                {
                  step: "2",
                  title: "Encrypted locally",
                  text: "AES-256-GCM encryption locks everything before transit.",
                },
                {
                  step: "3",
                  title: "Stored securely",
                  text: "Ciphertext is distributed — no single server holds it all.",
                },
                {
                  step: "4",
                  title: "Decrypted by you",
                  text: "Only your device keys can unlock and display your data.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                    {item.step}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">{item.text}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── six pillars ── */}
      <section className="mx-auto mt-28 max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2">
            <TreePine className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Our Pillars
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Six layers of protection
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
            Every feature in Sprout is designed with privacy at its core. Here's
            how we keep your family's legacy safe.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <PillarCard key={p.title} {...p} index={i} />
          ))}
        </div>
      </section>

      {/* ── commitment banner ── */}
      <section className="mx-auto mt-28 max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-10 text-center md:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
          <div className="relative">
            <Lock className="mx-auto mb-6 h-10 w-10 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Our commitment to you
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
              We will never sell your data. We will never show you ads. We will
              never share your information with third parties. Your family's
              financial story is yours — and it always will be.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {[
                "No Ads",
                "No Trackers",
                "No Data Sales",
                "Open Audit Logs",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto mt-28 max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Everything you want to know about how we protect your data.
          </p>
        </motion.div>

        <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 px-6 sm:px-8">
          {faqs.map((faq, i) => (
            <FaqItem key={i} {...faq} index={i} />
          ))}
        </div>
      </section>

      {/* ── footer CTA ── */}
      <section className="mx-auto mt-28 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ShieldCheck className="mx-auto mb-4 h-8 w-8 text-emerald-500/40" />
          <p className="text-sm text-gray-500">
            Privacy isn't a feature — it's the foundation everything in Sprout
            grows from.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default PrivacyFirstPage;
