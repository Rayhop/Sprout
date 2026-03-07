import { ShieldCheck } from "lucide-react";

const PrivacyFirst = () => {
  return (
    <section id="privacy-first" className="w-full bg-[#020617] px-6 pb-20 scroll-mt-28">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-8 md:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Privacy First</h3>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
            Your family's financial future is encrypted and decentralized. Only
            those you choose can ever see the roots of your legacy.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/10 bg-black/20 p-6">
              <div className="text-2xl font-semibold text-emerald-400">0</div>
              <div className="mt-1 text-xs tracking-widest text-gray-500">
                DATA LEAKS
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/10 bg-black/20 p-6">
              <div className="text-2xl font-semibold text-emerald-400">
                256-bit
              </div>
              <div className="mt-1 text-xs tracking-widest text-gray-500">
                ENCRYPTION
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyFirst;
