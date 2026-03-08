"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { PropertyType, PropertyStatus, PropertyFormData, Company, generateSlug } from '@/types/property';

async function fetchProperty(id: string) {
  const res = await fetch(`/api/properties/${id}`);
  if (!res.ok) return null;
  return res.json();
}

async function fetchCompanies() {
  const res = await fetch('/api/companies');
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || 'Failed to load companies');
  }
  return res.json();
}

export default function AddPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(!!editId);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState<PropertyFormData>({
    title: '',
    slug: '',
    type: 'HOUSE',
    status: 'FOR_SALE',
    price: 0,
    location: '',
    bedrooms: undefined,
    bathrooms: undefined,
    parking: undefined,
    landSize: undefined,
    description: '',
    published: true,
    companyId: undefined,
  });

  // Fetch companies on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load companies');
      }
    })();
  }, []);

  // Fetch property if editing
  useEffect(() => {
    if (!editId) return;
    (async () => {
      const data = await fetchProperty(editId);
      if (!data) {
        setError('Unable to load property');
      } else {
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          type: data.type ?? 'HOUSE',
          status: data.status ?? 'FOR_SALE',
          price: data.price ?? 0,
          location: data.location ?? '',
          bedrooms: data.bedrooms ?? undefined,
          bathrooms: data.bathrooms ?? undefined,
          parking: data.parking ?? undefined,
          landSize: data.landSize ?? undefined,
          description: data.description ?? '',
          published: data.published ?? true,
          companyId: data.companyId ?? undefined,
        });
      }
      setInitializing(false);
    })();
  }, [editId]);

  const canSubmit =
    !loading &&
    form.title.trim().length > 0 &&
    form.price > 0 &&
    form.location.trim().length > 0;

  const effectiveSlug = useMemo(() => {
    if (form.slug) return form.slug;
    return generateSlug(form.title);
  }, [form.slug, form.title]);

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    setError(null);

    try {
      let thumbnailUrl = '';
      // Handle image upload if file selected
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: uploadData,
        });
        if (!uploadRes.ok) {
          const uploadJson = await uploadRes.json().catch(() => ({}));
          throw new Error(uploadJson.error || 'Image upload failed');
        }
        const json = await uploadRes.json();
        thumbnailUrl = json.url;
      }

      const payload = {
        title: form.title,
        slug: effectiveSlug,
        type: form.type,
        status: form.status,
        price: form.price,
        location: form.location,
        bedrooms: form.bedrooms || null,
        bathrooms: form.bathrooms || null,
        parking: form.parking || null,
        landSize: form.landSize || null,
        description: form.description || null,
        published: publish,
        companyId: form.companyId || null,
      };

      const method = editId ? 'PATCH' : 'POST';
      const url = editId ? `/api/properties/${editId}` : '/api/properties';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Save failed');
      }

      const property = await res.json();

      // If we have an image, add it to the property
      if (thumbnailUrl && property.id) {
        await fetch(`/api/properties/${property.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: thumbnailUrl }),
        });
      }

      router.push('/admin/properties');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PropertyFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (initializing) {
    return (
      <main data-header-text="light" className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading property...
        </div>
      </main>
    );
  }

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container-x max-w-5xl">
        <header className="mb-10">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#c8a34d]">
            {editId ? 'Edit Property' : 'New Property'}
          </p>
          <h1 className="mt-2 text-3xl font-display font-black uppercase tracking-tight">
            {editId ? 'Update Property Listing' : 'Create Property Listing'}
          </h1>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Form Section */}
          <section className="space-y-6 bg-white p-8 border border-slate-200 shadow-sm">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Property Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full border-b-2 border-slate-100 py-2 focus:border-[#c8a34d] outline-none text-slate-900 placeholder:text-slate-400 text-xl font-display uppercase font-bold transition-colors"
                placeholder="Modern Villa in Bole"
              />
            </div>

            {/* Slug */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Slug
                </label>
                <input
                  type="text"
                  value={effectiveSlug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="w-full bg-slate-50 p-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                  placeholder="auto-generated-slug"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Publish Status
                </label>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleChange('published', false)}
                    className={`px-3 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                      !form.published
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('published', true)}
                    className={`px-3 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                      form.published
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>
            </div>

            {/* Type & Status */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Property Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value as PropertyType)}
                  className="w-full bg-slate-50 p-3 text-sm text-slate-900 outline-none border border-transparent focus:border-[#c8a34d]/30"
                >
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="LAND">Land</option>
                  <option value="VILLA">Villa</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value as PropertyStatus)}
                  className="w-full bg-slate-50 p-3 text-sm text-slate-900 outline-none border border-transparent focus:border-[#c8a34d]/30"
                >
                  <option value="FOR_SALE">For Sale</option>
                  <option value="SOLD">Sold</option>
                  <option value="RENTED">Rented</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            {/* Price & Location */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Price (ETB) *
                </label>
                <input
                  type="number"
                  value={form.price || ''}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                  placeholder="5000000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Location *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                  placeholder="Bole, Addis Ababa"
                />
              </div>
            </div>

            {/* Specs */}
            <div className="grid gap-6 sm:grid-cols-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={form.bedrooms || ''}
                  onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || undefined)}
                  className="w-full bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                  placeholder="4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={form.bathrooms || ''}
                  onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || undefined)}
                  className="w-full bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                  placeholder="3"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Parking
                </label>
                <input
                  type="number"
                  value={form.parking || ''}
                  onChange={(e) => handleChange('parking', parseInt(e.target.value) || undefined)}
                  className="w-full bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                  placeholder="2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Land Size (m²)
                </label>
                <input
                  type="number"
                  value={form.landSize || ''}
                  onChange={(e) => handleChange('landSize', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                  placeholder="500"
                />
              </div>
            </div>

            {/* Company (Internal Use Only) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Real Estate Company (Internal Use)
              </label>
              <select
                value={form.companyId || ''}
                onChange={(e) => handleChange('companyId', e.target.value || undefined)}
                className="w-full bg-slate-50 p-3 text-sm text-slate-900 outline-none border border-transparent focus:border-[#c8a34d]/30"
              >
                <option value="">No Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                This field is for internal admin use only. Company names are not visible to public users.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Description
              </label>
              <textarea
                rows={6}
                value={form.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                placeholder="Property description..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Property Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const next = e.target.files?.[0] ?? null;
                  setFile(next);
                }}
                className="block w-full text-xs text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:tracking-[0.2em] file:text-white hover:file:bg-[#c8a34d]"
              />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={!canSubmit}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] bg-slate-900 text-white hover:bg-slate-800"
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={!canSubmit}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] bg-[#c8a34d] text-slate-950 hover:bg-[#e4c56a]"
              >
                {loading ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </section>

          {/* Preview Section */}
          <section className="space-y-4 sticky top-24 h-fit">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Live Preview</span>
            </div>
            <div className="bg-white border border-slate-200 p-6 shadow-lg space-y-4">
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#c8a34d]">Property Listing</p>
              <h2 className="text-xl font-display font-black uppercase tracking-tight">
                {form.title || 'Untitled Property'}
              </h2>
              <p className="text-xs text-slate-500">{form.location || 'Location pending'}</p>
              <p className="text-lg font-bold text-[#c8a34d]">
                {form.price ? `ETB ${form.price.toLocaleString()}` : 'Price pending'}
              </p>
              <div className="flex gap-4 text-[10px] text-slate-500 uppercase tracking-wider">
                {form.bedrooms && <span>{form.bedrooms} Beds</span>}
                {form.bathrooms && <span>{form.bathrooms} Baths</span>}
                {form.parking && <span>{form.parking} Parking</span>}
              </div>
              <span
                className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                  form.status === 'FOR_SALE'
                    ? 'bg-emerald-50 text-emerald-700'
                    : form.status === 'SOLD'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {form.status === 'FOR_SALE' ? 'For Sale' : form.status === 'SOLD' ? 'Sold' : form.status === 'PENDING' ? 'Pending' : 'Rented'}
              </span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
