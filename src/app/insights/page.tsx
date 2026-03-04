import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

interface InsightsPageProps {
  searchParams?: { page?: string };
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const page = Number(searchParams?.page ?? "1") || 1;
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
        <header className="border-b border-slate-900 pb-10 mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter">
            Insights &amp;{" "}
            <span className="text-[#c8a34d]">Market Frameworks</span>
          </h1>
          <p className="mt-6 text-slate-500 font-mono text-xs uppercase tracking-widest max-w-xl">
            Live institutional publications from AFTAZA — database-backed insights that govern
            how we de-risk transactions and structure commercialization systems.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">
            No published insights yet. Once posts are published from the admin console, they will appear here.
          </p>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/insights/${post.slug}`}
                className="group block border-b border-slate-100 pb-10"
              >
                <article className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start">
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#c8a34d] mb-3">
                      Aftaza_Insight
                    </p>
                    <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight group-hover:underline decoration-[#c8a34d] decoration-2 underline-offset-8">
                      {post.title}
                    </h2>
                    <p className="mt-4 text-slate-500 text-sm md:text-base leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Read Insight</span>
                      <div className="h-px w-8 bg-slate-900 group-hover:w-16 transition-all" />
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-52 md:h-64 rounded-lg object-cover border border-slate-100 shadow-sm"
                  />
                </article>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-3">
              {page > 1 && (
                <Link
                  href={`/insights?page=${page - 1}`}
                  className="text-[10px] font-black uppercase tracking-widest hover:text-[#c8a34d]"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/insights?page=${page + 1}`}
                  className="text-[10px] font-black uppercase tracking-widest hover:text-[#c8a34d]"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

