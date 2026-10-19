import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { products, categories } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import EditProductForm from './EditProductForm';

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditPageProps) {
  const session = await getSession();
  if (!session || !session.umkmId) {
    redirect('/auth/login');
  }

  const { id } = await params;

  const [productResult, categoryList] = await Promise.all([
    db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.umkmId, session.umkmId)))
      .limit(1),
    db.select().from(categories).orderBy(categories.name),
  ]);

  const product = productResult[0];

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <EditProductForm product={product} categories={categoryList} />
    </div>
  );
}
