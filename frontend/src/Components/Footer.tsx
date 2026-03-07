import { Tree } from "@/Components/ui/Trees";

const Footer = () => (
  <footer className="border-t border-white/5 bg-[#020617] px-6 py-10">
    <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="h-6 w-6">
          <Tree level={3} size="sm" />
        </div>
        <span className="text-lg font-medium text-white/60" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Sprout
        </span>
      </div>
      <p className="text-xs text-white/15 text-center">
        © 2025 Sprout. Your tree is yours. Always.
      </p>
      <div className="flex gap-6">
        {["Privacy", "Terms", "Contact"].map((l) => (
          <a
            key={l}
            href="#"
            className="text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
