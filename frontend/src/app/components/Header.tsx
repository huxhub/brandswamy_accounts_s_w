import { Menu, ArrowLeftRight, FileDown, Tag } from "lucide-react";
import uxhubLogo from "../../assets/logo.svg";
import type { AppSettings } from "../hooks/useSettings";

export function Header({
  settings,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenExchange,
  onOpenReport,
  onOpenPrograms,
}: {
  settings: AppSettings;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  onOpenExchange: () => void;
  onOpenReport: () => void;
  onOpenPrograms?: () => void;
}) {
  return (
    <header className="bg-primary text-primary-foreground px-4 sm:px-6 py-4 flex flex-wrap sm:flex-nowrap items-center justify-between shadow-lg flex-shrink-0 gap-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="md:hidden p-1.5 -ml-1.5 rounded-md hover:bg-white/15 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={20} />
        </button>

        <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white p-1 rounded-lg shadow-xs flex-shrink-0">
          <img src={uxhubLogo} className="w-full h-full object-contain" alt="UXHUB Logo" />
        </div>

        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-bold tracking-wider text-white leading-none font-sans">
            {settings.companyName}
          </span>
          <span className="text-[9px] sm:text-[10px] text-white/70 mt-0.5 tracking-wider font-semibold">
            {settings.companySubtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        {onOpenPrograms && (
          <button
            onClick={onOpenPrograms}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-[#f56523] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-orange-500/25 active:scale-95"
          >
            <Tag size={16} />
            <span>Programs</span>
          </button>
        )}
        <button
          onClick={onOpenExchange}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-[#f56523] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-orange-500/25 active:scale-95"
        >
          <ArrowLeftRight size={16} />
          <span className="hidden sm:inline">Inter-Company Transfer</span>
          <span className="sm:hidden">Transfer</span>
        </button>
        <button
          onClick={onOpenReport}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-[#f56523] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-orange-500/25 active:scale-95"
        >
          <FileDown size={16} />
          <span className="hidden sm:inline">Monthly Report</span>
          <span className="sm:hidden">Report</span>
        </button>

        <div className="text-right text-sm">
          <div className="text-white/60 text-xs">Today</div>
          <div className="font-mono font-semibold">
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>
    </header>
  );
}
