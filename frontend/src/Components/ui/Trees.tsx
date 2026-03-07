// PATH: src/Components/ui/Tree.tsx

interface TreeProps {
  level?: number;
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  traits?: string[];
}

const sizes: Record<string, string> = {
  sm: "h-20 w-16",
  md: "h-32 w-24",
  lg: "h-48 w-36",
  xl: "h-64 w-48",
};

const configs: Record<
  number,
  {
    trunk: string;
    c1: string;
    c2: string;
    glow: string;
    bloom?: boolean;
    golden?: boolean;
    legendary?: boolean;
  }
> = {
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
  6: { trunk: "#4a2512", c1: "#065f46", c2: "#064e3b", glow: "#059669" },
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

export const Tree = ({
  level = 1,
  animate = false,
  size = "md",
  traits = [],
}: TreeProps) => {
  const cfg = configs[Math.min(Math.max(level, 1), 8)];
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
        {/* Ground shadow */}
        <ellipse cx="40" cy="107" rx="18" ry="3" fill={cfg.c2} opacity="0.25" />
        {/* Trunk */}
        <rect x="36" y="72" width="8" height="30" rx="3" fill={cfg.trunk} />
        {/* Base roots */}
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
        {/* Deep roots trait */}
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
        {/* Canopy layers */}
        <ellipse cx="40" cy="58" rx="24" ry="22" fill={cfg.c1} opacity="0.85" />
        <ellipse cx="40" cy="45" rx="20" ry="18" fill={cfg.c1} />
        <ellipse cx="40" cy="34" rx="15" ry="14" fill={cfg.c1} opacity="0.95" />
        <ellipse cx="40" cy="24" rx="10" ry="10" fill={cfg.c1} />
        <ellipse cx="40" cy="16" rx="6" ry="6" fill={cfg.c2} />
        {/* Golden canopy trait */}
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
        {/* Full bloom trait */}
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
        {/* Legendary aura */}
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
        {/* Grove maker trait - saplings */}
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

export default Tree;
