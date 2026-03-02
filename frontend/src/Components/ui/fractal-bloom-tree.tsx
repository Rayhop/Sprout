"use client";

import React, { useEffect, useRef } from "react";
import { type Variants } from "framer-motion";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";
import Logo from "../Logo";

const FractalBloomCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight };
    let currentDepth = 0;
    const maxDepth = 10; // Increased depth for more "leaf" detail

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawBranch = (
      x: number,
      y: number,
      angle: number,
      length: number,
      depth: number,
    ) => {
      if (depth > currentDepth) return;

      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      // --- ORGANIC STYLING ---
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);

      // 1. Tapering: Thicker at base, thin at tips
      ctx.lineWidth = Math.max(0.5, (maxDepth - depth) * 0.8);

      // 2. Color Shift: Brown trunk -> Green leaves
      if (depth > 8) {
        ctx.strokeStyle = `rgba(74, 222, 128, ${0.6})`; // Green leaf color
      } else {
        ctx.strokeStyle = `rgba(139, 92, 77, ${1 - depth / (maxDepth + 2)})`; // Woody brown
      }

      ctx.lineCap = "round";
      ctx.stroke();

      // Mouse influence logic
      const distToMouse = Math.hypot(endX - mouse.x, endY - mouse.y);
      const mouseEffect = Math.max(0, 1 - distToMouse / (canvas.height / 1.5));
      const angleOffset = (Math.PI / 12) * mouseEffect;

      // 3. Randomness: Makes it look less like a math equation
      const randomFactor = Math.sin(depth + Date.now() * 0.001) * 0.02;

      if (depth < maxDepth) {
        // Left Branch
        drawBranch(
          endX,
          endY,
          angle - 0.4 - angleOffset + randomFactor,
          length * 0.78, // Slightly different lengths
          depth + 1,
        );
        // Right Branch
        drawBranch(
          endX,
          endY,
          angle + 0.35 + angleOffset + randomFactor,
          length * 0.82,
          depth + 1,
        );
      }
    };

    const animate = () => {
      // Dark slate background with slight trail
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = canvas.width / 2;
      const startY = canvas.height - 50; // Offset from bottom
      const startLength = canvas.height / 4.5;

      // Draw the trunk
      drawBranch(startX, startY, -Math.PI / 2, startLength, 0);

      if (currentDepth < maxDepth) {
        currentDepth += 0.02; // Slower growth for a "stately" feel
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />
  );
};

const FractalBloomHero: React.FC = () => {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 2,
        duration: 0.8,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#020617]">
      <FractalBloomCanvas />

      <div className="absolute top-2 left-2 z-20">
        <Logo />
      </div>

      {/* Vignette for better text readability */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)]"></div>

      <div className="relative z-20 p-6 text-center">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-sm"
        >
          <GitBranch className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-200">
            Private savings, real legacy{" "}
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-5xl font-bold tracking-tighter text-transparent md:text-7xl"
        >
          Sprout{" "}
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mb-10 max-w-2xl text-lg text-gray-400"
        >
          Sprout turns savings into a living tree that grows with every deposit.
          For parents, it becomes something deeper — money, memories, and proof
          of love, passed to your child when the time is right.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="sm:flex items-center gap-5 justify-center"
        >
          <button className=" flex items-center gap-2 rounded-4xl font-extrabold bg-(--growth-green) px-8 py-4 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-(--growth-hover) hover:scale-105">
            Start Growing
            <ArrowRight className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 rounded-4xl px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500 hover:bg-(--growth-hover) hover:scale-105">
            Build a Family Tree
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FractalBloomHero;
