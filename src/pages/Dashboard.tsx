import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  clearDashboardSecret,
  exportRegistrationsCsv,
  fetchDashboardData,
  getStoredDashboardSecret,
  storeDashboardSecret,
  type DashboardData,
  type RegistrationRow,
} from "@/lib/dashboard";

const REF_LABELS: Record<string, string> = {
  samad: "Abdessamad",
  mehdi: "Mehdi",
  direct: "Direct",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ar-DZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="border-2 border-line bg-paper p-6">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">{label}</p>
      <p className={`mt-3 text-4xl font-light tracking-tight ${accent ?? "text-ink"}`}>{value}</p>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: (secret: string) => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetchDashboardData(secret);
      storeDashboardSecret(secret);
      onSuccess(secret);
    } catch (err) {
      clearDashboardSecret();
      setError(err instanceof Error ? err.message : "حدث خطأ ما.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <div className="w-full border-2 border-line bg-paper p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-ink-muted">Vibe Coding Live</p>
        <h1 className="mt-4 text-3xl font-light tracking-tight text-ink">لوحة التسجيلات</h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-ink-soft">
          أدخل كلمة مرور لوحة التحكم لعرض التسجيلات وإحصائيات الروابط.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-ink-soft">كلمة المرور</span>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              autoFocus
              className="mt-2 block w-full border-2 border-line bg-paper-soft px-4 py-3.5 text-base font-light text-ink focus:border-pluss-blue focus:bg-paper focus:outline-none"
            />
          </label>

          {error && (
            <p className="rounded border border-live/40 bg-live/5 px-4 py-3 text-sm font-light text-ink">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pluss-blue px-7 py-4 text-sm font-medium text-paper transition-colors hover:bg-nld-yellow hover:text-ink disabled:opacity-50"
          >
            {loading ? "جارٍ التحقق…" : "دخول"}
          </button>
        </form>

        <Link to="/" className="mt-6 inline-block text-sm text-ink-muted transition-colors hover:text-ink">
          ← العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

function RegistrationsTable({ rows }: { rows: RegistrationRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="border-2 border-dashed border-line px-6 py-16 text-center text-sm text-ink-muted">
        لا توجد تسجيلات بعد.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-line">
      <table className="min-w-full text-sm">
        <thead className="bg-paper-soft text-left">
          <tr>
            <th className="px-4 py-3 font-medium text-ink-muted">التاريخ</th>
            <th className="px-4 py-3 font-medium text-ink-muted">الاسم</th>
            <th className="px-4 py-3 font-medium text-ink-muted">الهاتف</th>
            <th className="px-4 py-3 font-medium text-ink-muted">البريد</th>
            <th className="px-4 py-3 font-medium text-ink-muted">السبب</th>
            <th className="px-4 py-3 font-medium text-ink-muted">المصدر</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line">
              <td className="whitespace-nowrap px-4 py-3 text-ink-soft" dir="ltr">
                {formatDate(row.created_at)}
              </td>
              <td className="px-4 py-3 text-ink">
                {row.first_name} {row.last_name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-soft" dir="ltr">
                {row.phone}
              </td>
              <td className="px-4 py-3 text-ink-soft" dir="ltr">
                {row.email}
              </td>
              <td className="max-w-xs px-4 py-3 text-ink-soft">{row.reason}</td>
              <td className="px-4 py-3">
                <RefBadge refKey={row.ref ?? "direct"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RefBadge({ refKey }: { refKey: string }) {
  const styles: Record<string, string> = {
    samad: "bg-nld-yellow/30 text-ink",
    mehdi: "bg-pluss-blue/15 text-pluss-blue",
    direct: "bg-paper-soft text-ink-muted",
  };

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-[11px] font-medium uppercase tracking-wider ${styles[refKey] ?? styles.direct}`}
      dir="ltr"
    >
      {REF_LABELS[refKey] ?? refKey}
    </span>
  );
}

export default function Dashboard() {
  const [secret, setSecret] = useState<string | null>(() => getStoredDashboardSecret());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [refFilter, setRefFilter] = useState<string>("all");

  const loadData = useCallback(async (currentSecret: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardData(currentSecret);
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.message.includes("كلمة المرور")) {
        clearDashboardSecret();
        setSecret(null);
      }
      setError(err instanceof Error ? err.message : "حدث خطأ ما.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (secret) loadData(secret);
  }, [secret, loadData]);

  const filteredRows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.registrations.filter((row) => {
      const matchesRef =
        refFilter === "all" || (row.ref ?? "direct") === refFilter;
      if (!matchesRef) return false;
      if (!q) return true;
      const haystack = [
        row.first_name,
        row.last_name,
        row.phone,
        row.email,
        row.reason,
        row.ref ?? "direct",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, query, refFilter]);

  function handleLogout() {
    clearDashboardSecret();
    setSecret(null);
    setData(null);
  }

  if (!secret) {
    return (
      <main className="min-h-screen bg-paper text-ink" dir="rtl">
        <LoginForm onSuccess={setSecret} />
      </main>
    );
  }

  const byRef = data?.by_ref ?? {};
  const samadCount = byRef.samad ?? 0;
  const mehdiCount = byRef.mehdi ?? 0;
  const directCount = byRef.direct ?? 0;

  return (
    <main className="min-h-screen bg-paper text-ink" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-ink-muted">Vibe Coding Live</p>
            <h1 className="mt-3 text-3xl font-light tracking-tight text-ink sm:text-4xl">لوحة التسجيلات</h1>
            <p className="mt-2 text-sm font-light text-ink-soft">
              إجمالي التسجيلات ومصادر الروابط (Abdessamad / Mehdi / Direct)
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => secret && loadData(secret)}
              disabled={loading}
              className="border-2 border-line bg-paper px-4 py-2.5 text-sm transition-colors hover:border-ink disabled:opacity-50"
            >
              {loading ? "جارٍ التحديث…" : "تحديث"}
            </button>
            <button
              type="button"
              onClick={() => data && exportRegistrationsCsv(filteredRows)}
              disabled={!data || filteredRows.length === 0}
              className="border-2 border-line bg-paper px-4 py-2.5 text-sm transition-colors hover:border-ink disabled:opacity-50"
            >
              تصدير CSV
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-ink px-4 py-2.5 text-sm text-paper transition-opacity hover:opacity-80"
            >
              خروج
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded border border-live/40 bg-live/5 px-4 py-3 text-sm font-light text-ink">
            {error}
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="إجمالي التسجيلات" value={data?.total ?? 0} />
          <StatCard label="Abdessamad" value={samadCount} accent="text-ink" />
          <StatCard label="Mehdi" value={mehdiCount} accent="text-pluss-blue" />
          <StatCard label="Direct" value={directCount} accent="text-ink-muted" />
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث بالاسم، البريد، الهاتف…"
            className="w-full border-2 border-line bg-paper-soft px-4 py-3 text-sm font-light text-ink focus:border-pluss-blue focus:bg-paper focus:outline-none sm:max-w-md"
          />
          <select
            value={refFilter}
            onChange={(e) => setRefFilter(e.target.value)}
            className="w-full border-2 border-line bg-paper-soft px-4 py-3 text-sm font-light text-ink focus:border-pluss-blue focus:bg-paper focus:outline-none sm:w-auto"
            dir="ltr"
          >
            <option value="all">All sources</option>
            <option value="samad">Abdessamad</option>
            <option value="mehdi">Mehdi</option>
            <option value="direct">Direct</option>
          </select>
        </div>

        <div className="mt-6">
          {loading && !data ? (
            <div className="border-2 border-line px-6 py-16 text-center text-sm text-ink-muted">
              جارٍ تحميل البيانات…
            </div>
          ) : (
            <RegistrationsTable rows={filteredRows} />
          )}
        </div>

        <p className="mt-8 text-center text-xs text-ink-muted">
          <Link to="/" className="transition-colors hover:text-ink">
            العودة للصفحة الرئيسية
          </Link>
        </p>
      </div>
    </main>
  );
}
