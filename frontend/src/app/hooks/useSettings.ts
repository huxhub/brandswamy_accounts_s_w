import { useState, useEffect } from "react";
import uxhubLogo from "../../assets/logo.svg";

export interface AppSettings {
  companyName: string;
  companySubtitle: string;
  logoUrl: string;
  themeColor: string;
}

const DEFAULTS: AppSettings = {
  companyName: "UXHUB",
  companySubtitle: "Accounts Manager",
  logoUrl: uxhubLogo,
  themeColor: "#111827",
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("brandswamy_settings") || localStorage.getItem("chisel_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If themeColor was the old red #c21818, update to UX HUB black
        if (parsed.themeColor === "#c21818") {
          parsed.themeColor = "#111827";
        }
        return { ...DEFAULTS, ...parsed, logoUrl: uxhubLogo };
      } catch {
        return DEFAULTS;
      }
    }
    return DEFAULTS;
  });
  const [tempSettings, setTempSettings] = useState<AppSettings>({ ...settings });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", settings.themeColor || "#111827");
    root.style.setProperty("--accent", "#f56523");
  }, [settings.themeColor]);

  return {
    settings,
    setSettings,
    tempSettings,
    setTempSettings,
    showSettings,
    setShowSettings,
  };
}
