import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/articles/[id] — public (only if published, or admin)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await db.article.findUnique({ where: { id } });
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Non-published articles require auth
    if (article.status !== 'published') {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
    }

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

// PUT /api/articles/[id] — requires auth
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // If slug is being updated, regenerate if empty
    let slug = body.slug;
    if (body.title && !slug) {
      slug = body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const article = await db.article.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(slug !== undefined && { slug }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt || null }),
        ...(body.content !== undefined && { content: body.content || null }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage || null }),
        ...(body.tag !== undefined && { tag: body.tag || null }),
        ...(body.status !== undefined && {
          status: body.status,
          ...(body.status === 'published' && !body.publishedAt && { publishedAt: new Date() }),
        }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle || null }),
        ...(body.seoDescription !== undefined && { seoDescription: body.seoDescription || null }),
        ...(body.seoKeywords !== undefined && { seoKeywords: body.seoKeywords || null }),
        ...(body.focusKeyword !== undefined && { focusKeyword: body.focusKeyword || null }),
        ...(body.correctionNotes !== undefined && { correctionNotes: body.correctionNotes || null }),
      },
    });

    return NextResponse.json(article);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update article';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// DELETE /api/articles/[id] — requires auth
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    await db.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}