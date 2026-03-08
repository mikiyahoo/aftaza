import { prisma } from "@/lib/prisma";

export type InsightSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  createdAt: Date;
};

export async function getLatestInsights(limit = 5) {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        thumbnailUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    return [] as InsightSummary[];
  }
}
