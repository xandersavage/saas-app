import CompanionForm from '@/components/CompanionForm';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { newCompanionPermissions } from '@/lib/actions/companions.actions';
import Image from 'next/image';
import Link from 'next/link';

const NewCompanion = async () => {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const canCreateCompanions = await newCompanionPermissions();

  return (
    <main className={`min-lg:w-1/3 min-md:w-2/3 items-center justify-center`}>
      {canCreateCompanions ? (
        <article className={`w-full gap-4 flex flex-col`}>
          <h1>Companion Builder</h1>
          <CompanionForm />
        </article>
      ) : (
        <article className={`companion-limit`}>
          <Image
            src={`/images/limit.svg`}
            width={360}
            height={230}
            alt={`Companion limit`}
          />
          <div className={`cta-badge`}>
            Upgrade your plan to create more companions.
          </div>
          <h1>You&#39;ve Reached Your Limit</h1>
          <p>
            You&#39;ve reached your companion limit. Upgrade to create more
            companions and premium features
          </p>
          <Link
            href={`/subscription`}
            className={`btn-primary w-full justify-center`}
          >
            Upgrade My Plan
          </Link>
        </article>
      )}
    </main>
  );
};

export default NewCompanion;
