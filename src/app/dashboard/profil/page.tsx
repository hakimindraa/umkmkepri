import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { umkmProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import ProfilForm from './ProfilForm';

export default async function ProfilPage() {
  const session = await getSession();
  if (!session || !session.umkmId) {
    redirect('/auth/login');
  }

  const profileResult = await db
    .select()
    .from(umkmProfiles)
    .where(eq(umkmProfiles.id, session.umkmId))
    .limit(1);

  const profile = profileResult[0];

  return (
    <div className="max-w-3xl">
      <ProfilForm profile={profile} />
    </div>
  );
}
