import { useEffect, useRef, useState } from "react";

/**
 * Level thresholds (matches the app's savings system):
 *  1 Seed ($0)      - tiny bare twig, brown
 *  2 Sprout ($50)   - small sapling, hint of green
 *  3 Young Plant ($200) - short tree, green tips
 *  4 Flowering ($500)   - medium tree, pink blooms
 *  5 Small Tree ($1K)   - taller, fuller canopy
 *  6 Large Tree ($2.5K) - thick trunk, dense leaves
 *  7 Golden Tree ($5K)  - gold-tipped canopy, glow
 *  8 Legendary ($10K+)  - massive, golden aura, particles
 */

interface FractalLifecycleTreeProps {
  /** Tree growth level 1-8 */
  level?: number;
  /** Animate the tree growing in from level 0 */
  animateGrowth?: boolean;
  /** Canvas height in px (default 400) */
  height?: number;
  /** Canvas width in px (default 400) */
  width?: number;
  /**
   * Dormant: savings dropped below the current level.
   * Tree shows stress — grey-brown palette, drooping branches,
   * muted leaves, no glow. Ghost silhouette shows the peak level.
   */
  dormant?: boolean;
  /** Peak level to render as ghost silhouette when dormant */
  peakLevel?: number;
  className?: string;
}

// Level configs: [maxDepth, trunkLength%, branchScale, trunkWidth, hasLeaves, hasBloom, hasGold, hasAura]
const LEVEL_CONFIG: Record<
  number,
  {
    depth: number;
    trunkPct: number;
    branchScale: number;
    trunkWidth: number;
    leaves: boolean;
    bloom: boolean;
    gold: boolean;
    aura: boolean;
    leafSize: number;
  }
> = {
  1: { depth: 3, trunkPct: 0.15, branchScale: 0.7, trunkWidth: 2, leaves: false, bloom: false, gold: false, aura: false, leafSize: 0 },
  2: { depth: 4, trunkPct: 0.18, branchScale: 0.72, trunkWidth: 2.5, leaves: true, bloom: false, gold: false, aura: false, leafSize: 1.5 },
  3: { depth: 5, trunkPct: 0.22, branchScale: 0.74, trunkWidth: 3, leaves: true, bloom: false, gold: false, aura: false, leafSize: 2 },
  4: { depth: 6, trunkPct: 0.24, branchScale: 0.75, trunkWidth: 3.5, leaves: true, bloom: true, gold: false, aura: false, leafSize: 2.5 },
  5: { depth: 7, trunkPct: 0.26, branchScale: 0.76, trunkWidth: 4, leaves: true, bloom: true, gold: false, aura: false, leafSize: 3 },
  6: { depth: 8, trunkPct: 0.28, branchScale: 0.77, trunkWidth: 5, leaves: true, bloom: true, gold: false, aura: false, leafSize: 3.5 },
  7: { depth: 9, trunkPct: 0.30, branchScale: 0.78, trunkWidth: 5.5, leaves: true, bloom: true, gold: true, aura: false, leafSize: 4 },
  8: { depth: 10, trunkPct: 0.32, branchScale: 0.79, trunkWidth: 6, leaves: true, bloom: true, gold: true, aura: true, leafSize: 4.5 },
};

const FractalLifecycleTree: React.FC<FractalLifecycleTreeProps> = ({
  level = 1,
  animateGrowth = true,
  height = 400,
  width = 400,
  dormant = false,
  peakLevel,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentDepth, setCurrentDepth] = useState(animateGrowth ? 0 : LEVEL_CONFIG[level].depth);

  const clampedLevel = Math.max(1, Math.min(8, level)) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  const config = LEVEL_CONFIG[clampedLevel];

  // Animate depth growth
  useEffect(() => {
    if (!animateGrowth) {
      setCurrentDepth(config.depth);
      return;
    }
    setCurrentDepth(0);
    let frame: number;
    let depth = 0;
    const targetDepth = config.depth;
    const growthRate = 0.03;

    const grow = () => {
      depth += growthRate;
      if (depth >= targetDepth) {
        setCurrentDepth(targetDepth);
        return;
      }
      setCurrentDepth(depth);
      frame = requestAnimationFrame(grow);
    };

    // Small delay before growing
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(grow);
    }, 400);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [config.depth, animateGrowth]);

  // Main draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let animFrame: number;
    const time = { now: 0 };

    const trunkColor = (depth: number, maxD: number, stressed = false): string => {
      if (stressed) {
        const t = depth / maxD;
        const r = Math.round(90 + t * 20);
        const g = Math.round(70 + t * 15);
        const b = Math.round(55 + t * 10);
        return `rgba(${r}, ${g}, ${b}, ${0.75 - t * 0.2})`;
      }
      const t = depth / maxD;
      if (config.gold && t > 0.7) {
        return `rgba(212, 175, 55, ${0.9 - t * 0.3})`;
      }
      // Brown → green gradient
      const r = Math.round(139 - t * 80);
      const g = Math.round(92 + t * 130);
      const b = Math.round(77 - t * 40);
      const a = 1 - t * 0.3;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    // Ghost silhouette of a higher level for dormant state
    const drawGhostBranch = (
      ghostCfg: typeof config,
      x: number,
      y: number,
      angle: number,
      length: number,
      depth: number,
    ) => {
      if (depth > ghostCfg.depth) return;
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = Math.max(0.3, (ghostCfg.depth - depth) * (ghostCfg.trunkWidth / ghostCfg.depth));
      ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
      ctx.lineCap = "round";
      ctx.stroke();

      if (depth < ghostCfg.depth) {
        const rf = Math.sin(depth * 2.3 + x * 0.01) * 0.03;
        drawGhostBranch(ghostCfg, endX, endY, angle - 0.4 + rf, length * ghostCfg.branchScale, depth + 1);
        drawGhostBranch(ghostCfg, endX, endY, angle + 0.35 + rf, length * (ghostCfg.branchScale + 0.04), depth + 1);
      }
    };

    const drawBranch = (
      x: number,
      y: number,
      angle: number,
      length: number,
      depth: number,
    ) => {
      if (depth > currentDepth) return;

      // Dormant: heavy droop (positive y bias), slow creak
      const swaySpeed = dormant ? 0.0004 : 0.001;
      const swayAmp = dormant ? 0.025 : 0.015;
      const droopBias = dormant ? 0.06 * depth : 0;
      const sway = Math.sin(time.now * swaySpeed + depth * 0.5) * swayAmp * depth + droopBias;
      const adjustedAngle = angle + sway;

      const endX = x + Math.cos(adjustedAngle) * length;
      const endY = y + Math.sin(adjustedAngle) * length;

      // Draw branch
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = Math.max(0.5, (config.depth - depth) * (config.trunkWidth / config.depth));
      ctx.strokeStyle = trunkColor(depth, config.depth, dormant);
      ctx.lineCap = "round";
      ctx.stroke();

      const isLeafDepth = depth >= config.depth - 2;

      // Leaves — muted and sparse when dormant
      if (config.leaves && isLeafDepth && depth <= currentDepth) {
        const leafAlpha = dormant
          ? 0.12 + Math.sin(time.now * 0.001 + depth) * 0.05
          : 0.4 + Math.sin(time.now * 0.002 + depth) * 0.2;
        // Sparse leaves when dormant
        const showLeaf = !dormant || Math.sin(depth * 7.3 + x * 0.05) > 0.2;
        if (showLeaf) {
          ctx.beginPath();
          ctx.arc(endX, endY, config.leafSize, 0, Math.PI * 2);
          if (dormant) {
            ctx.fillStyle = `rgba(80, 70, 50, ${leafAlpha})`;
          } else if (config.gold) {
            ctx.fillStyle = `rgba(212, 175, 55, ${leafAlpha * 0.7})`;
          } else {
            ctx.fillStyle = `rgba(74, 222, 128, ${leafAlpha})`;
          }
          ctx.fill();
        }
      }

      // Blooms — suppressed when dormant
      if (!dormant && config.bloom && depth === Math.floor(config.depth - 1) && depth <= currentDepth) {
        const bloomChance = Math.sin(depth * 3.7 + x * 0.1) > 0.3;
        if (bloomChance) {
          const bloomAlpha = 0.5 + Math.sin(time.now * 0.003 + x) * 0.3;
          ctx.beginPath();
          ctx.arc(endX, endY, config.leafSize * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(244, 114, 182, ${bloomAlpha})`;
          ctx.fill();
        }
      }

      if (depth < config.depth && depth < currentDepth) {
        const randomFactor = Math.sin(depth * 2.3 + x * 0.01) * 0.03;
        // Left
        drawBranch(
          endX,
          endY,
          adjustedAngle - 0.4 + randomFactor,
          length * config.branchScale,
          depth + 1,
        );
        // Right
        drawBranch(
          endX,
          endY,
          adjustedAngle + 0.35 + randomFactor,
          length * (config.branchScale + 0.04),
          depth + 1,
        );
      }
    };

    // Particle system for aura (level 8)
    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];

    const spawnParticle = () => {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * width * 0.6,
        y: height * 0.3 + Math.random() * height * 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.3 - Math.random() * 0.5,
        life: 0,
        maxLife: 80 + Math.random() * 60,
      });
    };

    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const t = p.life / p.maxLife;
        const alpha = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${alpha * 0.6})`;
        ctx.fill();
      }
    };

    const render = () => {
      time.now = Date.now();

      // Clear
      ctx.clearRect(0, 0, width, height);

      const startX = width / 2;
      const startY = height - 20;

      // Auto-scale trunk so tree fits within canvas.
      // Total vertical reach ≈ startLength × geometric_sum(branchScale, depth).
      // We cap it at 82% of canvas height so nothing clips at the top.
      const geomSum = config.branchScale < 1
        ? (1 - Math.pow(config.branchScale, config.depth)) / (1 - config.branchScale)
        : config.depth;
      const maxStartLength = (height * 0.82) / geomSum;
      const startLength = Math.min(height * config.trunkPct, maxStartLength);

      if (dormant) {
        // Ghost silhouette of peak level behind stressed tree
        const peakCfg = peakLevel != null ? LEVEL_CONFIG[Math.max(1, Math.min(8, peakLevel)) as keyof typeof LEVEL_CONFIG] : null;
        if (peakCfg && peakCfg.depth > config.depth) {
          const peakGeomSum = peakCfg.branchScale < 1
            ? (1 - Math.pow(peakCfg.branchScale, peakCfg.depth)) / (1 - peakCfg.branchScale)
            : peakCfg.depth;
          const peakStartLength = Math.min(height * peakCfg.trunkPct, (height * 0.82) / peakGeomSum);
          drawGhostBranch(peakCfg, startX, startY, -Math.PI / 2, peakStartLength, 0);
        }

        // Subtle brown ambient tint
        const stressAlpha = 0.04 + Math.sin(time.now * 0.0005) * 0.01;
        const grad = ctx.createRadialGradient(width / 2, height * 0.5, 20, width / 2, height * 0.5, width * 0.4);
        grad.addColorStop(0, `rgba(120, 80, 40, ${stressAlpha})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Aura glow behind tree
        if (config.aura && currentDepth > config.depth * 0.5) {
          const auraAlpha = 0.08 + Math.sin(time.now * 0.001) * 0.03;
          const grad = ctx.createRadialGradient(
            width / 2, height * 0.45, 10,
            width / 2, height * 0.45, width * 0.4,
          );
          grad.addColorStop(0, `rgba(212, 175, 55, ${auraAlpha})`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        } else if (config.gold && currentDepth > config.depth * 0.5) {
          const glowAlpha = 0.04 + Math.sin(time.now * 0.001) * 0.02;
          const grad = ctx.createRadialGradient(
            width / 2, height * 0.5, 10,
            width / 2, height * 0.5, width * 0.3,
          );
          grad.addColorStop(0, `rgba(212, 175, 55, ${glowAlpha})`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // Draw tree
      drawBranch(startX, startY, -Math.PI / 2, startLength, 0);

      // Particles for legendary (not when dormant)
      if (config.aura && !dormant) {
        if (Math.random() > 0.85) spawnParticle();
        drawParticles();
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrame);
  }, [currentDepth, config, width, height, dormant, peakLevel]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height }}
    />
  );
};

export default FractalLifecycleTree;
