import { supabase } from "./supabase";

export type RegistrationRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  reason: string;
  ref: string | null;
};

export type DashboardData = {
  total: number;
  by_ref: Record<string, number>;
  registrations: RegistrationRow[];
};

const STORAGE_KEY = "dashboard_secret";

export function getStoredDashboardSecret(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function storeDashboardSecret(secret: string) {
  sessionStorage.setItem(STORAGE_KEY, secret);
}

export function clearDashboardSecret() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export async function fetchDashboardData(secret: string): Promise<DashboardData> {
  const { data, error } = await supabase.rpc("get_dashboard_data", { p_secret: secret });

  if (error) {
    if (error.message.toLowerCase().includes("invalid dashboard password")) {
      throw new Error("كلمة المرور غير صحيحة.");
    }
    throw new Error("تعذّر تحميل البيانات. تحقق من اتصال Supabase.");
  }

  return data as DashboardData;
}

export function exportRegistrationsCsv(rows: RegistrationRow[]) {
  const headers = ["created_at", "first_name", "last_name", "phone", "email", "reason", "ref"];
  const escape = (value: string | null) => {
    const text = value ?? "";
    return `"${text.replace(/"/g, '""')}"`;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.created_at,
        row.first_name,
        row.last_name,
        row.phone,
        row.email,
        row.reason,
        row.ref ?? "direct",
      ]
        .map(escape)
        .join(","),
    ),
  ];

  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vibe-coding-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
