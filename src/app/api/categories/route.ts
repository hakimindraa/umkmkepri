import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/data';

export async function GET() {
  try {
    const list = await getCategories();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
