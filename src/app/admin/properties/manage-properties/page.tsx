import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PropertyType, PropertyStatus, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, formatPrice } from '@/types/property';
import DatabaseStatusNotice from '@/components/admin/DatabaseStatusNotice';
import { getDatabaseErrorMessage } from '@/lib/database-error';

export const dynamic = 'force-dynamic';

type ManagePropertyRow = Prisma.PropertyGetPayload<{
  include: {
    company: true;
    images: {
      take: 1;
      orderBy: { position: 'asc' };
    };
  };
}>;

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    type?: PropertyType; 
    status?: PropertyStatus;
    companyId?: string;
    search?: string;
  }>;
}

export default async function ManagePropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  
  if (params.type) {
    where.type = params.type;
  }
  if (params.status) {
    where.status = params.status;
  }
  if (params.companyId) {
    where.companyId = params.companyId;
  }
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { location: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  let properties: ManagePropertyRow[] = [];
  let total = 0;
  let companies: Awaited<ReturnType<typeof prisma.company.findMany>> = [];
  let databaseError: string | null = null;

  try {
    [properties, total, companies] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          company: true,
          images: {
            orderBy: { position: 'asc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
      prisma.company.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);
  } catch (error) {
    databaseError = getDatabaseErrorMessage(
      error,
      'The manage properties view could not load live inventory from the database.'
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container-x">
        <header className="mb-10">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#c8a34d]">
            AFTAZA_Internal
          </p>
          <h1 className="mt-2 text-3xl font-display font-black uppercase tracking-tight">
            Manage Properties
          </h1>
          <p className="mt-2 text-xs text-slate-500 max-w-md">
            View, edit, or delete property listings. Use filters to find specific properties.
          </p>
        </header>

        {databaseError ? (
          <DatabaseStatusNotice
            message={`${databaseError} Filters are still visible, but results and company options are empty until connectivity is restored.`}
          />
        ) : null}

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8">
          <form className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                defaultValue={params.search || ''}
                placeholder="Search by title or location..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#c8a34d] transition-colors"
              />
            </div>

            {/* Type Filter */}
            <div className="w-40">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Type
              </label>
              <select
                name="type"
                title="Filter by property type"
                defaultValue={params.type || ''}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#c8a34d] transition-colors"
              >
                <option value="">All Types</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="LAND">Land</option>
                <option value="VILLA">Villa</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-40">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Status
              </label>
              <select
                name="status"
                title="Filter by status"
                defaultValue={params.status || ''}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#c8a34d] transition-colors"
              >
                <option value="">All Status</option>
                <option value="FOR_SALE">For Sale</option>
                <option value="SOLD">Sold</option>
                <option value="PENDING">Pending</option>
                <option value="RENTED">Rented</option>
              </select>
            </div>

            {/* Company Filter */}
            <div className="w-48">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Company
              </label>
              <select
                name="companyId"
                title="Filter by company"
                defaultValue={params.companyId || ''}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#c8a34d] transition-colors"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#c8a34d] transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Results Count */}
        <p className="text-xs text-slate-500 mb-6">
          Showing {properties.length} of {total} properties
        </p>

        {/* Properties Table */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {properties.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-500">
              No properties found matching your criteria.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {property.images[0] && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                            <img
                              src={property.images[0].url}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{property.title}</p>
                          <p className="text-[11px] text-slate-500">{property.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(property.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600">
                        {PROPERTY_TYPE_LABELS[property.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          property.status === 'FOR_SALE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : property.status === 'SOLD'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : property.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {PROPERTY_STATUS_LABELS[property.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">
                        {property.company?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">
                        {new Date(property.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/properties/add-property?id=${property.id}`}
                          className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#c8a34d]"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/properties/${property.slug}`}
                          target="_blank"
                          className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#c8a34d]"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <a
                href={`/admin/properties/manage-properties?page=${page - 1}${params.type ? `&type=${params.type}` : ''}${params.status ? `&status=${params.status}` : ''}${params.companyId ? `&companyId=${params.companyId}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:border-[#c8a34d] transition-colors"
              >
                Previous
              </a>
            )}
            
            <span className="px-4 py-2 text-xs font-bold text-slate-500">
              Page {page} of {totalPages}
            </span>

            {page < totalPages && (
              <a
                href={`/admin/properties/manage-properties?page=${page + 1}${params.type ? `&type=${params.type}` : ''}${params.status ? `&status=${params.status}` : ''}${params.companyId ? `&companyId=${params.companyId}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:border-[#c8a34d] transition-colors"
              >
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
