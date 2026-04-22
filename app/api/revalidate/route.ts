import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tags: string[] = Array.isArray(body.tags)
      ? body.tags
      : body.tag
      ? [body.tag]
      : [];

    if (tags.length === 0) {
      return NextResponse.json({ error: 'Missing tag(s)' }, { status: 400 });
    }

    // Guard with optional token in production; in dev this can be omitted.
    const expectedToken = process.env.REVALIDATE_TOKEN;
    if (expectedToken) {
      const token = req.headers.get('x-revalidate-token');
      if (token !== expectedToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    for (const tag of tags) {
      revalidateTag(tag);
    }

    return NextResponse.json({ success: true, tags });
  } catch (error) {
    console.error('Revalidate route error:', error);
    return NextResponse.json({ error: 'Failed to revalidate tags' }, { status: 500 });
  }
}
