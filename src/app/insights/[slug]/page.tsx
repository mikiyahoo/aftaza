import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface InsightPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) {
    return {};
  }

  const url = new URL(`/insights/${post.slug}`, "https://aftazaplc.com");

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      images: [{ url: post.thumbnailUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnailUrl],
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.thumbnailUrl],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "AFTAZA PLC",
    },
  };

  return (
    <main data-header-text="light" className="bg-white pt-32 pb-20">
      <div className="container-x max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10 hover:text-[#c8a34d] transition-colors"
        >
          ← Back to Insights
        </Link>

        <span className="text-[#c8a34d] font-mono text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
          Aftaza_Insight
        </span>

        <h1 className="text-4xl md:text-5xl font-display font-black uppercase leading-tight mb-6">
          {post.title}
        </h1>

        <div className="mb-8 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-400">
          <span>{post.createdAt.toLocaleDateString()}</span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="mb-10 w-full rounded-lg object-cover border border-slate-100 max-h-80"
        />

        <article className="prose prose-slate max-w-none text-slate-800">
          <p className="whitespace-pre-wrap text-base leading-relaxed">
            {post.content}
          </p>
        </article>

        <section className="mt-16 pt-8 border-t border-slate-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Ready to operationalize this insight?
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/services/buyer-advisory"
              className="btn-primary text-[10px] font-black uppercase tracking-[0.25em]"
            >
              Buyer Advisory →
            </Link>
            <Link
              href="/services/developer-commercialization"
              className="btn-outline text-[10px] font-black uppercase tracking-[0.25em]"
            >
              Developer Commercialization →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

