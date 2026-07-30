import { useState, useEffect, useCallback } from "react";
import { accountService } from "../../services/api";
import { toast } from "sonner";

export interface HistoryFilters {
  startDate: string;
  endDate: string;
  month: string;
  accountId: string;
  type: string;
  preset: string;
  programId: string;
}

export interface AccountSummary {
  accountId: number;
  name: string;
  type: string;
  color: string;
  bgColor: string;
  openingBalance: number;
  credits: number;
  debits: number;
  balance: number;
}

export interface HistorySummary {
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  totalOpeningBalance: number;
  totalClosingBalance: number;
  byAccount: AccountSummary[];
}

export interface HistoryTransaction {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  reference?: string;
  document?: any;
  dueDate?: string;
  exchangeType?: string;
  isCompleted?: boolean;
  isReminder?: boolean;
  accountId: string;
  accountName: string;
  accountType: string;
  accountColor: string;
  accountBgColor: string;
  programId?: number | null;
  programName?: string | null;
  createdAt?: string;
}

function getPresetDates(preset: string): { startDate: string; endDate: string } {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  switch (preset) {
    case "today":
      return { startDate: today, endDate: today };
    case "this_week": {
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      return { startDate: monday.toISOString().split("T")[0], endDate: today };
    }
    case "this_month": {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: firstOfMonth.toISOString().split("T")[0], endDate: today };
    }
    case "this_quarter": {
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      return { startDate: quarterStart.toISOString().split("T")[0], endDate: today };
    }
    case "this_year": {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return { startDate: yearStart.toISOString().split("T")[0], endDate: today };
    }
    default:
      return { startDate: "", endDate: "" };
  }
}

export function useHistory() {
  const [filters, setFilters] = useState<HistoryFilters>({
    startDate: "",
    endDate: "",
    month: "",
    accountId: "",
    type: "",
    preset: "all",
    programId: "",
  });

  const [transactions, setTransactions] = useState<HistoryTransaction[]>([]);
  const [summary, setSummary] = useState<HistorySummary>({
    totalCredits: 0,
    totalDebits: 0,
    netBalance: 0,
    totalOpeningBalance: 0,
    totalClosingBalance: 0,
    byAccount: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);

      // Build params from filters
      const params: Record<string, string> = {};

      if (filters.preset && filters.preset !== "all" && filters.preset !== "custom") {
        const { startDate, endDate } = getPresetDates(filters.preset);
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      } else if (filters.month) {
        params.month = filters.month;
      } else {
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
      }

      if (filters.accountId) params.accountId = filters.accountId;
      if (filters.type) params.type = filters.type;
      if (filters.programId) params.programId = filters.programId;

      const data = await accountService.getHistory(params);
      setTransactions(data.transactions || []);
      setSummary(data.summary || {
        totalCredits: 0, totalDebits: 0, netBalance: 0,
        totalOpeningBalance: 0, totalClosingBalance: 0, byAccount: [],
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const updateFilter = (key: keyof HistoryFilters, value: string) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };

      // When a preset is chosen, clear custom date fields
      if (key === "preset" && value !== "custom") {
        next.startDate = "";
        next.endDate = "";
        next.month = "";
      }

      // When month is manually set, switch to custom
      if (key === "month" && value) {
        next.preset = "custom";
        next.startDate = "";
        next.endDate = "";
      }

      // When start/end date is manually set, clear month and switch to custom
      if ((key === "startDate" || key === "endDate") && value) {
        next.preset = "custom";
        next.month = "";
      }

      return next;
    });
  };

  const clearFilters = () => {
    setFilters({ startDate: "", endDate: "", month: "", accountId: "", type: "", preset: "all", programId: "" });
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    transactions,
    summary,
    loading,
  };
}
