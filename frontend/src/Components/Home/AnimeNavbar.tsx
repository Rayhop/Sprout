"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  defaultActive?: string;
}

export function AnimeNavBar({
  items,
  className,
}: NavBarProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab =
    items.find((item) => item.url === location.pathname)?.name ?? items[0].name;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={cn(
        "fixed top-8 left-0 right-0 z-9999 flex justify-center",
        className,
      )}
    >
      <motion.div
        className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-md py-2 px-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          const isHovered = hoveredTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.url);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onMouseEnter={() => setHoveredTab(item.name)}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2",
                "text-emerald-100/60 hover:text-white",
                isActive && "text-emerald-400",
              )}
            >
              {/* The "Photosynthesis" Glow Effect */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/30 -z-10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-emerald-500/5 blur-lg rounded-full animate-pulse" />
                </motion.div>
              )}

              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="hidden sm:inline relative z-10">
                {item.name}
              </span>

              {/* Hover Leaf Popover */}
              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-white/5 rounded-full -z-20"
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </motion.div>
    </nav>
  );
}
