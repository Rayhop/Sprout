// PATH: src/Components/Home/HowItWorks.tsx
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Tree } from "@/Components/ui/Trees";

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
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="flex gap-3 rounded-xl border border-white/5 bg-white/2 p-3 hover:border-emerald-500/15 transition-colors"
  >
    <div className="shrink-0 h-11 w-11 rounded-lg bg-emerald-950/60 border border-emerald-500/10 flex items-center justify-center text-xl">
      {photo}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-white/60 leading-relaxed font-light italic">
        "{note}"
      </p>
      <p className="text-[9px] text-emerald-600/40 mt-1">
        {milestone} milestone · Stored on IPFS
      </p>
    </div>
  </motion.div>
);

const SignupContent = () => (
  <div className="space-y-4 max-w-md">
    <p className="text-sm text-white/40 leading-relaxed font-light">
      Enter your email, click the magic link, and your first tree is planted. No
      passwords. No wallets. No seed phrases.
    </p>
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-emerald-500/15 bg-linear-to-b from-[#0d1b0e]/80 to-transparent backdrop-blur-sm p-6 space-y-4"
    >
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-emerald-500/40 mb-1.5">
          Your email
        </p>
        <div className="flex items-center rounded-xl border border-emerald-500/15 bg-black/30 px-4 py-3 gap-2">
          <span className="text-sm text-white/40">you@email.com</span>
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="ml-auto h-4 w-px bg-emerald-400"
          />
        </div>
      </div>
      <button className="w-full rounded-xl bg-emerald-500/15 border border-emerald-500/25 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25 transition-colors">
        Send Magic Link →
      </button>
      <div className="flex items-center justify-center gap-6">
        {["No password", "No crypto", "Always free"].map((t, i) => (
          <span key={i} className="text-[10px] text-white/20">
            ✓ {t}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);

const GrowthContent = () => {
  const [active, setActive] = useState(5);
  const levels = [
    { l: 1, n: "Seed", s: "$0", traits: [] as string[] },
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
      <p className="text-sm text-white/40 leading-relaxed font-light">
        Every deposit grows your tree. Eight distinct stages, each more majestic
        than the last. Click any level to preview.
      </p>
      <div className="rounded-2xl border border-emerald-500/15 bg-linear-to-b from-[#0d1b0e]/80 to-transparent backdrop-blur-sm p-5 space-y-5">
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
                <p className="text-2xl font-medium text-white">{cur.n}</p>
                <p className="text-xs text-emerald-500/50 mt-0.5">
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
                <p className="text-[10px] text-white/15 mt-1">
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
              className={`rounded-xl border p-2 text-left transition-all duration-200 ${active === l ? "border-emerald-500/35 bg-emerald-500/10" : "border-white/5 hover:border-emerald-500/20"}`}
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
    </div>
  );
};

const FamilyContent = () => (
  <div className="space-y-4 max-w-md">
    <p className="text-sm text-white/40 leading-relaxed font-light">
      Create a separate tree entirely for your child. Every deposit is locked as
      a gift from the moment you make it — this money was never yours.
    </p>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-emerald-500/15 bg-linear-to-b from-[#0d1b0e]/80 to-transparent backdrop-blur-sm p-5 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-emerald-500/40 mb-1">
            Growing for
          </p>
          <p className="text-xl font-medium text-white">Mia 🌱</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/20 mb-1">Saved so far</p>
          <p className="text-2xl font-medium text-emerald-300">$3,240</p>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <Tree level={6} size="md" />
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-2.5 py-1">
            <span className="text-[10px] font-medium text-emerald-400">
              Lv.6
            </span>
            <span className="text-[10px] text-emerald-200/60">Large Tree</span>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-white/25 mb-1">
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
          <p className="text-[10px] text-emerald-600/40">
            Inherits June 14, 2031
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 pt-3">
        <p className="text-xs text-white/25 font-light italic">
          This money is for Mia, not you. From the moment you deposit, it
          belongs to her.
        </p>
      </div>
    </motion.div>
  </div>
);

const MemoriesContent = () => (
  <div className="space-y-4 max-w-md">
    <p className="text-sm text-white/40 leading-relaxed font-light">
      At every $500 milestone, unlock a memory slot. Upload a photo and a note.
      Stored on IPFS — permanent, uncensorable, forever.
    </p>
    <div className="space-y-2">
      {[
        {
          photo: "🌅",
          note: "The day you were born. I didn't sleep at all and I didn't want to.",
          milestone: "$500",
        },
        {
          photo: "🎒",
          note: "First day of school. You held my hand and then let go.",
          milestone: "$1,000",
        },
        {
          photo: "🎹",
          note: "You won your recital. I cried in the back row.",
          milestone: "$1,500",
        },
        {
          photo: "⚽",
          note: "Your first goal. You ran to me first.",
          milestone: "$2,000",
        },
      ].map((m, i) => (
        <MemoryCard key={i} {...m} delay={i * 0.1} />
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
          <p className="text-xs text-white/25 group-hover:text-white/40 transition-colors">
            Unlock at $2,500
          </p>
          <p className="text-[9px] text-emerald-600/30 mt-0.5">
            Stored on IPFS · Permanent
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

const InheritContent = () => (
  <div className="space-y-4 max-w-md">
    <p className="text-sm text-white/40 leading-relaxed font-light">
      You set an inheritance date. The smart contract auto-triggers it.
      Everything transfers: the money, the tree, the traits, every memory.
    </p>
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-amber-500/20 bg-linear-to-b from-amber-950/30 to-transparent backdrop-blur-sm p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-amber-400"
        />
        <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400/50">
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
        <div className="text-center">
          <p className="text-lg font-light text-white/70">
            You built this for Mia.
          </p>
          <p className="text-xl font-medium text-amber-300/80 italic">
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
            <span className="text-lg font-medium text-amber-300/80">{v}</span>
            <span className="text-[9px] text-amber-600/50 mt-0.5">{l}</span>
          </div>
        ))}
      </div>
    </motion.div>
    <div className="rounded-xl border border-white/5 bg-white/2 p-4 flex gap-3">
      <span className="text-lg shrink-0">📜</span>
      <div>
        <p className="text-xs font-medium text-white/50">
          Legacy Complete Certificate
        </p>
        <p className="text-[11px] text-white/25 mt-0.5 font-light leading-relaxed">
          You receive a permanent keepsake commemorating your role. Your chapter
          ends here, beautifully.
        </p>
      </div>
    </div>
  </div>
);

const ChildContent = () => (
  <div className="space-y-4 max-w-md">
    <p className="text-sm text-white/40 leading-relaxed font-light">
      After inheritance, the tree is Mia's alone. She sees the traits you
      earned, reads every memory, and builds on your foundation. You cannot see
      any of this.
    </p>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-emerald-500/15 bg-linear-to-b from-[#0d1b0e]/80 to-transparent backdrop-blur-sm p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/20">
            My inherited tree
          </p>
          <p className="text-lg font-medium text-white mt-0.5">Mia's Tree</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-2.5 py-1.5">
          <span className="text-xs">🔒</span>
          <span className="text-[10px] text-emerald-400">Only you</span>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <Tree
          level={7}
          traits={["golden_canopy", "full_bloom", "deep_roots", "grove_maker"]}
          size="md"
        />
        <div className="flex-1">
          <p className="text-2xl font-medium text-emerald-300">$9,180</p>
          <p className="text-[10px] text-white/25 mt-0.5">
            $8,240 inherited + $940 yours
          </p>
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/15 mb-2">
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
                <span className="text-[10px] font-medium text-emerald-200/70">
                  {t}
                </span>
              </div>
              <p className="text-[9px] text-white/25 leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
    <p className="text-xs text-white/15 italic font-light">
      Your parent cannot see this tree. They never will again. This is yours.
    </p>
  </div>
);

const TimelineStep = ({
  icon,
  title,
  subtitle,
  index,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  index: number;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
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
        <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-[#030a06] text-base md:left-3">
          {icon}
        </div>
        <div className="hidden md:block md:pl-20">
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600/50 mb-1">
            Step {index + 1}
          </p>
          <h3 className="text-3xl font-light text-emerald-200/50 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-white/25 mt-1 font-light">{subtitle}</p>
        </div>
      </div>
      <div className="relative w-full pl-20 pr-4 md:pl-4">
        <div className="md:hidden mb-5">
          <p className="text-[10px] uppercase tracking-widest text-emerald-600/50 mb-1">
            Step {index + 1}
          </p>
          <h3 className="text-2xl font-light text-emerald-200/60">{title}</h3>
          <p className="text-xs text-white/25 mt-0.5">{subtitle}</p>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

const steps = [
  {
    icon: "✉️",
    title: "Plant a seed",
    subtitle: "Sign up in seconds",
    Content: SignupContent,
  },
  {
    icon: "🌳",
    title: "Watch it grow",
    subtitle: "8 levels of evolution",
    Content: GrowthContent,
  },
  {
    icon: "💚",
    title: "Build for your child",
    subtitle: "A gift locked from day one",
    Content: FamilyContent,
  },
  {
    icon: "📸",
    title: "Leave memories",
    subtitle: "Stored on IPFS, forever",
    Content: MemoriesContent,
  },
  {
    icon: "🎁",
    title: "The handoff",
    subtitle: "Everything transfers",
    Content: InheritContent,
  },
  {
    icon: "⭐",
    title: "Their tree now",
    subtitle: "Private, permanent, theirs",
    Content: ChildContent,
  },
];

const HowItWorks = () => {
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
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <section className="py-12 px-6" ref={containerRef}>
      <div ref={ref} className="relative mx-auto max-w-5xl px-4 pb-20 md:px-8">
        {steps.map(({ icon, title, subtitle, Content }, i) => (
          <TimelineStep
            key={i}
            icon={icon}
            title={title}
            subtitle={subtitle}
            index={i}
          >
            <Content />
          </TimelineStep>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-px overflow-hidden bg-linear-to-b from-transparent via-emerald-500/10 to-transparent md:left-8"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-px rounded-full bg-linear-to-b from-emerald-400 via-emerald-300 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
