"use client";

import { useCallback, useEffect, useState } from "react";
import DatabaseStatusNotice from "@/components/admin/DatabaseStatusNotice";

type CompanyRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  _count?: {
    properties: number;
  };
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/companies");
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch companies");
      }

      setCompanies(Array.isArray(json) ? json : []);
    } catch (err) {
      setCompanies([]);
      setError(err instanceof Error ? err.message : "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  const handleCreate = useCallback(async () => {
    const name = window.prompt("Enter company name:");
    if (!name) {
      return;
    }

    const phone = window.prompt("Enter phone (optional):") || undefined;
    const email = window.prompt("Enter email (optional):") || undefined;

    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      window.alert(json.error || "Failed to create company");
      return;
    }

    await loadCompanies();
  }, [loadCompanies]);

  const handleEdit = useCallback(
    async (company: CompanyRow) => {
      const name = window.prompt("Edit company name:", company.name);
      if (name === null) {
        return;
      }

      const phone = window.prompt("Edit phone:", company.phone || "") || undefined;
      const email = window.prompt("Edit email:", company.email || "") || undefined;

      const res = await fetch(`/api/companies/${company.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        window.alert(json.error || "Failed to update company");
        return;
      }

      await loadCompanies();
    },
    [loadCompanies]
  );

  const handleDelete = useCallback(
    async (company: CompanyRow) => {
      if (!window.confirm(`Are you sure you want to delete "${company.name}"?`)) {
        return;
      }

      const res = await fetch(`/api/companies/${company.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        window.alert(json.error || "Failed to delete company");
        return;
      }

      await loadCompanies();
    },
    [loadCompanies]
  );

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container-x">
        <header className="mb-10">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#c8a34d]">
            AFTAZA_Internal
          </p>
          <h1 className="mt-2 text-3xl font-display font-black uppercase tracking-tight">
            Real Estate Companies
          </h1>
          <p className="mt-2 max-w-md text-xs text-slate-500">
            Manage real estate companies for internal property filtering. Company names are not visible to public users.
          </p>
        </header>

        {error ? (
          <DatabaseStatusNotice
            message={`${error} Company data could not be loaded from the API, which usually means the database connection failed upstream.`}
          />
        ) : null}

        <div className="mb-8">
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="rounded-lg bg-slate-950 px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#c8a34d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Company
          </button>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-6 py-10 text-sm text-slate-500">Loading companies...</div>
          ) : companies.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-500">
              No companies yet. Click "Add Company" to create your first entry.
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Properties
                  </th>
                  <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((company) => (
                  <tr key={company.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">{company.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{company.phone || "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{company.email || "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">
                        {company._count?.properties ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => void handleEdit(company)}
                          className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#c8a34d]"
                        >
                          Edit
                        </button>
                        {(company._count?.properties ?? 0) === 0 ? (
                          <button
                            type="button"
                            onClick={() => void handleDelete(company)}
                            className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-800">
            Important Information
          </h3>
          <ul className="space-y-1 text-xs text-amber-700">
            <li>- Companies are for internal admin use only</li>
            <li>- Company names are not displayed on public property pages</li>
            <li>- Use companies to filter and organize properties by real estate company</li>
            <li>- You cannot delete a company that has associated properties</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
