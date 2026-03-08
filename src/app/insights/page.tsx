import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type InsightsPageProps = {
  searchParams?: { page?: string };
};

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const page = Math.max(1, Number(searchParams?.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.post.count({
      where: { published: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main data-header-text="light" className="bg-white pt-32 pb-20">
      <div className="container-x">
        <header className="mb-12 border-b border-slate-200 pb-10">
          <h1 className="text-5xl font-display font-black uppercase tracking-tight md:text-6xl">
            Insights &amp; Market Frameworks
          </h1>
          <p className="mt-6 max-w-xl text-sm uppercase tracking-[0.22em] text-slate-500">
            Live institutional publications from AFTAZA's database-backed insight system.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">
            No published insights yet. Once posts are published from the admin console, they will appear here.
          </p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/insights/${post.slug}`}
                className="group grid gap-6 rounded-[32px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)]"
              >
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
                    Aftaza Insight
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-slate-950 transition-colors group-hover:text-[#c8a34d]">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-sm leading-8 text-slate-600">{post.excerpt}</p>
                  <div className="mt-6 text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
                    {post.createdAt.toLocaleDateString()}
                  </div>
                </div>

                <div className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-slate-100">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-xs uppercase tracking-[0.24em] text-slate-500">
                      No Thumbnail
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-12 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-3">
              {page > 1 ? (
                <Link
                  href={`/insights?page=${page - 1}`}
                  className="text-[11px] font-black uppercase tracking-[0.28em] transition hover:text-[#c8a34d]"
                >
                  Previous
                </Link>
              ) : null}
              {page < totalPages ? (
                <Link
                  href={`/insights?page=${page + 1}`}
                  className="text-[11px] font-black uppercase tracking-[0.28em] transition hover:text-[#c8a34d]"
                >
                  Next
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
