import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container-x">
        <header className="flex items-end justify-between mb-10 border-b border-slate-200 pb-6">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#c8a34d]">
              AFTAZA_Internal
            </p>
            <h1 className="mt-2 text-3xl font-display font-black uppercase tracking-tight">
              Insights Console
            </h1>
            <p className="mt-2 text-xs text-slate-500 max-w-md">
              Manage institutional insights: drafts, published articles, and protocol visibility.
            </p>
          </div>

          <Link href="/admin/new">
            <Button className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] bg-slate-950 text-white hover:bg-[#c8a34d]">
              New Insight
            </Button>
          </Link>
        </header>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Title</span>
            <span className="w-24 text-center">Status</span>
          </div>

          {posts.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-500">
              No posts yet. Use{" "}
              <span className="font-semibold text-slate-800">New Insight</span> to publish your first protocol.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {posts.map((post) => (
                <li key={post.id} className="px-6 py-4 flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{post.title}</p>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                      /insights/{post.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        post.published
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <Link
                      href={`/admin/new?id=${post.id}`}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#c8a34d]"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

