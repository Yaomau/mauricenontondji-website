import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/articles — list all articles (with optional ?status=published for public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};
    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST /api/articles — create a new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Auto-generate slug from title if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const article = await db.article.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content || null,
        coverImage: body.coverImage || null,
        tag: body.tag || null,
        status: body.status || 'draft',
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        seoKeywords: body.seoKeywords || null,
        focusKeyword: body.focusKeyword || null,
        correctionNotes: body.correctionNotes || null,
        publishedAt: body.status === 'published' ? new Date() : null,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create article';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}