import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/property';
import DatabaseStatusNotice from '@/components/admin/DatabaseStatusNotice';
import { getDatabaseErrorMessage } from '@/lib/database-error';

export const dynamic = 'force-dynamic';

type RecentPropertyRow = Prisma.PropertyGetPayload<{
  include: {
    images: {
      take: 1;
      orderBy: { position: 'asc' };
    };
  };
}>;

export default async function AdminPropertiesPage() {
  let totalProperties = 0;
  let activeListings = 0;
  let soldProperties = 0;
  let pendingProperties = 0;
  let recentProperties: RecentPropertyRow[] = [];
  let databaseError: string | null = null;

  try {
    [
      totalProperties,
      activeListings,
      soldProperties,
      pendingProperties,
      recentProperties,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({
        where: { status: 'FOR_SALE', published: true },
      }),
      prisma.property.count({
        where: { status: 'SOLD' },
      }),
      prisma.property.count({
        where: { status: 'PENDING' },
      }),
      prisma.property.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          images: {
            orderBy: { position: 'asc' },
            take: 1,
          },
        },
      }),
    ]);
  } catch (error) {
    databaseError = getDatabaseErrorMessage(
      error,
      'Property statistics are unavailable because the database connection failed.'
    );
  }

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container-x">
        <header className="flex items-end justify-between mb-10 border-b border-slate-200 pb-6">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#c8a34d]">
              AFTAZA_Internal
            </p>
            <h1 className="mt-2 text-3xl font-display font-black uppercase tracking-tight">
              Properties Console
            </h1>
            <p className="mt-2 text-xs text-slate-500 max-w-md">
              Manage property listings, track active sales, and monitor property performance.
            </p>
          </div>

          <Link
            href="/admin/properties/add-property"
            className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] bg-slate-950 text-white hover:bg-[#c8a34d] rounded-lg transition-colors"
          >
            Add Property
          </Link>
        </header>

        {databaseError ? (
          <DatabaseStatusNotice
            message={`${databaseError} You can still open the property workflows, but list data and metrics will remain empty until the connection is restored.`}
          />
        ) : null}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Total Properties
            </p>
            <p className="mt-2 text-4xl font-display font-black text-slate-900">
              {totalProperties}
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Active Listings
            </p>
            <p className="mt-2 text-4xl font-display font-black text-emerald-600">
              {activeListings}
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Sold Properties
            </p>
            <p className="mt-2 text-4xl font-display font-black text-slate-600">
              {soldProperties}
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Pending
            </p>
            <p className="mt-2 text-4xl font-display font-black text-amber-500">
              {pendingProperties}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link
            href="/admin/properties/add-property"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#c8a34d] transition-colors group"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 group-hover:text-[#c8a34d] transition-colors">
              Add New Property
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Create a new property listing
            </p>
          </Link>
          
          <Link
            href="/admin/properties/manage-properties"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#c8a34d] transition-colors group"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 group-hover:text-[#c8a34d] transition-colors">
              Manage Properties
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              View, edit, or delete listings
            </p>
          </Link>
          
          <Link
            href="/admin/properties/companies"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#c8a34d] transition-colors group"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 group-hover:text-[#c8a34d] transition-colors">
              Manage Companies
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Add real estate companies
            </p>
          </Link>
        </div>

        {/* Recent Properties Table */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Recently Added Properties
            </h2>
            <Link
              href="/admin/properties/manage-properties"
              className="text-[10px] font-bold uppercase tracking-widest text-[#c8a34d] hover:underline"
            >
              View All
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-500">
              No properties yet. Use{" "}
              <span className="font-semibold text-slate-800">Add Property</span> to create your first listing.
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
                    Status
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
                {recentProperties.map((property) => (
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
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          property.status === 'FOR_SALE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : property.status === 'SOLD'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {property.status === 'FOR_SALE' ? 'For Sale' : property.status === 'SOLD' ? 'Sold' : 'Pending'}
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
                      <Link
                        href={`/admin/properties/add-property?id=${property.id}`}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#c8a34d] mr-4"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
