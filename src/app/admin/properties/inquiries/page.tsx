// src/app/admin/properties/inquiries/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Search,
  Loader2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Building,
} from "lucide-react";
import PropertyImage from "@/components/properties/PropertyImage";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  propertyId: string | null;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    slug: string;
    images?: { imageUrl: string; isPrimary: boolean }[];
  } | null;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (data.inquiries) {
        setInquiries(data.inquiries);
      } else if (Array.isArray(data)) {
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInquiries(inquiries.filter((i) => i.id !== id));
      } else {
        alert("Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      alert("Failed to delete inquiry");
    }
  };

  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.property?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Property Inquiries</h1>
          <p className="mt-1 text-slate-500">
            View leads and contact requests from potential clients.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            title="Search inquiries"
            placeholder="Search by name, email, or property..."
            className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-semibold">Lead Info</th>
                <th className="px-6 py-3 font-semibold">Contact</th>
                <th className="px-6 py-3 font-semibold">Property Interest</th>
                <th className="px-6 py-3 font-semibold">Message</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                          <User size={20} className="text-slate-400" />
                        </div>
                        <div className="font-medium text-slate-900">{inquiry.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={14} className="text-slate-400" />
                          <a href={`mailto:${inquiry.email}`} className="hover:text-brand-gold">
                            {inquiry.email}
                          </a>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={14} className="text-slate-400" />
                            <a href={`tel:${inquiry.phone}`} className="hover:text-brand-gold">
                              {inquiry.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.property ? (
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 overflow-hidden rounded-md bg-slate-100">
                            {inquiry.property.images && inquiry.property.images[0] ? (
                              <PropertyImage
                                src={inquiry.property.images[0].imageUrl}
                                alt={inquiry.property.title}
                                fallbackLabel={inquiry.property.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <Building size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 line-clamp-1">
                              {inquiry.property.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {inquiry.property.slug}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">General Inquiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-slate-600">
                        <MessageSquare size={14} className="mt-1 text-slate-400" />
                        <div className="max-w-xs truncate" title={inquiry.message || ""}>
                          {inquiry.message || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="rounded-md p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
