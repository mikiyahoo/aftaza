import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { markdownToHtml } from "@/lib/markdown";

type InsightPageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
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

  const contentHtml = markdownToHtml(post.content);

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
      <div className="container-x max-w-4xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-slate-400 transition hover:text-[#c8a34d]"
        >
          Back to Insights
        </Link>

        <p className="mt-10 text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
          Aftaza Insight
        </p>
        <h1 className="mt-4 font-display text-4xl font-black uppercase leading-tight md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
          {post.createdAt.toLocaleDateString()}
        </p>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[32px] bg-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
          {post.thumbnailUrl ? (
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.24em] text-slate-500">
              No Thumbnail
            </div>
          )}
        </div>

        <article
          className="mt-12 max-w-none text-slate-800 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#c8a34d] [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_li]:my-1 [&_p]:text-base [&_p]:leading-8 [&_pre]:overflow-x-auto [&_pre]:rounded-[24px] [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-slate-100 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <section className="mt-16 flex flex-col gap-4 border-t border-slate-100 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
            Ready to operationalize this insight?
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/services/buyer-advisory"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#c8a34d] px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-950 shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition hover:bg-[#d6b15a]"
            >
              Buyer Advisory
            </Link>
            <Link
              href="/services/developer-commercialization"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-700 transition hover:border-[#c8a34d] hover:text-[#c8a34d]"
            >
              Developer Commercialization
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
