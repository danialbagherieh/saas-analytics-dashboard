// src/pages/Dashboard/useDashboard.ts
import { useState, useEffect } from "react";
import type { CustomerData } from "../../components/Dashboard/DataGridDemo/DataGridDemo.tsx";
import type { WeeklySellItem } from "../../components/Dashboard/PieChartWithCenterLabel.tsx";
import {
  dataset as weatherDataset,
  type WeatherRecord,
} from "../../components/Dashboard/weather.ts";

// 👇 Default data (constants)
export const defaultCardData = {
  revenue: 42580,
  revenueGrowth: "+12.4%",
  users: 8930,
  usersGrowth: "+4.7%",
  uptime: "99.98%",
  uptimeStatus: "Stable",
  taskCompletion: 72,
};

export const defaultTableRows: CustomerData[] = [
  {
    name: "Acme Corp",
    plan: "Pro",
    activeUsers: 1200,
    revenue: 50000,
    conversion: 30,
  },
  {
    name: "Beta LLC",
    plan: "Basic",
    activeUsers: 300,
    revenue: 8000,
    conversion: 7.5,
  },
  {
    name: "Gamma Inc",
    plan: "Enterprise",
    activeUsers: 5000,
    revenue: 250000,
    conversion: 125,
  },
  {
    name: "Delta Co",
    plan: "Pro",
    activeUsers: 800,
    revenue: 32000,
    conversion: 20,
  },
  {
    name: "Epsilon Ltd",
    plan: "Basic",
    activeUsers: 150,
    revenue: 5000,
    conversion: 3.75,
  },
  {
    name: "Zeta Tech",
    plan: "Enterprise",
    activeUsers: 4200,
    revenue: 200000,
    conversion: 105,
  },
  {
    name: "Eta Solutions",
    plan: "Pro",
    activeUsers: 600,
    revenue: 24000,
    conversion: 15,
  },
  {
    name: "Theta Labs",
    plan: "Basic",
    activeUsers: 220,
    revenue: 7000,
    conversion: 5.5,
  },
  {
    name: "Iota Systems",
    plan: "Pro",
    activeUsers: 950,
    revenue: 38000,
    conversion: 23.75,
  },
  {
    name: "Kappa Networks",
    plan: "Enterprise",
    activeUsers: 3500,
    revenue: 180000,
    conversion: 87.5,
  },
];

export const defaultWeeklySales: WeeklySellItem[] = [
  { product: "Social", mon: 5, tue: 7, wed: 6, color: "green" },
  { product: "Search Engines", mon: 10, tue: 8, wed: 9, color: "#1976d2" },
  { product: "Direct", mon: 15, tue: 12, wed: 14, color: "#ffb300" },
  { product: "Other", mon: 20, tue: 18, wed: 19, color: "#d32f2f" },
];

// 👇 Custom hook – all state & logic
export function useDashboard() {
  const [cardData, setCardData] = useState(defaultCardData);
  const [tableRows, setTableRows] = useState<CustomerData[]>(defaultTableRows);
  const [weatherData, setWeatherData] =
    useState<WeatherRecord[]>(weatherDataset);
  const [weeklySales, setWeeklySales] =
    useState<WeeklySellItem[]>(defaultWeeklySales);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");

  // 👇 Load data on mount
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCardData(defaultCardData);
      setTableRows(defaultTableRows);
      setWeatherData(weatherDataset);
      setWeeklySales(defaultWeeklySales);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 👇 Lock page-level horizontal scroll
  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "";
    };
  }, []);

  // 👇 Refresh handlers
  const refreshRevenue = () => {
    const newRevenue = Math.round(
      defaultCardData.revenue * (0.95 + Math.random() * 0.1),
    );
    const newGrowth = `+${(Math.random() * 15 + 5).toFixed(1)}%`;
    setCardData((prev) => ({
      ...prev,
      revenue: newRevenue,
      revenueGrowth: newGrowth,
    }));
  };

  const refreshUsers = () => {
    const newUsers = Math.round(
      defaultCardData.users * (0.97 + Math.random() * 0.06),
    );
    const newGrowth = `+${(Math.random() * 10 + 2).toFixed(1)}%`;
    setCardData((prev) => ({
      ...prev,
      users: newUsers,
      usersGrowth: newGrowth,
    }));
  };

  const refreshUptime = () => {
    const newUptime = (99.9 + Math.random() * 0.09).toFixed(2) + "%";
    const newStatus = Math.random() > 0.2 ? "Stable" : "Degraded";
    setCardData((prev) => ({
      ...prev,
      uptime: newUptime,
      uptimeStatus: newStatus,
    }));
  };

  const refreshTaskCompletion = () => {
    const newCompletion = Math.round(60 + Math.random() * 35);
    setCardData((prev) => ({ ...prev, taskCompletion: newCompletion }));
  };

  // 👇 View details
  const viewDetails = (title: string, details: string) => {
    setDialogTitle(title);
    setDialogContent(details);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  // 👇 Export to CSV
  const exportData = (type: string) => {
    let csvContent = "";
    let filename = "";

    switch (type) {
      case "revenue":
        csvContent = `Metric,Value\nRevenue,${cardData.revenue}\nGrowth,${cardData.revenueGrowth}\nDate,${new Date().toLocaleDateString()}`;
        filename = "revenue_data.csv";
        break;
      case "users":
        csvContent = `Metric,Value\nActive Users,${cardData.users}\nGrowth,${cardData.usersGrowth}\nDate,${new Date().toLocaleDateString()}`;
        filename = "users_data.csv";
        break;
      case "uptime":
        csvContent = `Metric,Value\nUptime,${cardData.uptime}\nStatus,${cardData.uptimeStatus}\nDate,${new Date().toLocaleDateString()}`;
        filename = "uptime_data.csv";
        break;
      case "completion":
        csvContent = `Metric,Value\nTask Completion,${cardData.taskCompletion}%\nDate,${new Date().toLocaleDateString()}`;
        filename = "task_completion_data.csv";
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    // State
    cardData,
    tableRows,
    weatherData,
    weeklySales,
    loading,
    dialogOpen,
    dialogTitle,
    dialogContent,

    // Handlers
    refreshRevenue,
    refreshUsers,
    refreshUptime,
    refreshTaskCompletion,
    viewDetails,
    closeDialog,
    exportData,
  };
}
