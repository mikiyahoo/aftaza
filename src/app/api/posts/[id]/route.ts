import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token as any).role !== "admin") {
    return null;
  }
  return token;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = await requireAdmin(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, thumbnailUrl, published } = body;

  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (slug && slug !== existing.slug) {
    const slugOwner = await prisma.post.findUnique({ where: { slug } });
    if (slugOwner && slugOwner.id !== params.id) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  const updated = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: title ?? existing.title,
      slug: slug ?? existing.slug,
      excerpt: excerpt ?? existing.excerpt,
      content: content ?? existing.content,
      thumbnailUrl: thumbnailUrl ?? existing.thumbnailUrl,
      published: typeof published === "boolean" ? published : existing.published,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = await requireAdmin(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.post.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}

