import React from 'react';
import CompanionCard from '@/components/CompanionCard';
import CompanionsList from '@/components/CompanionsList';
import CTA from '@/components/CTA';
import { recentSessions } from '@/constants';

const Page = () => {
  return (
    <main>
      <h1 className='text-2xl'>Popular Companions</h1>
      <section className={`home-section`}>
        <CompanionCard
          id={`123`}
          name={`Neura the Brainy Explorer`}
          topic={`Neural Networking`}
          subject={`science`}
          duration={45}
          color={`#ffda6e`}
        />
        <CompanionCard
          id={`456`}
          name={`Neura the Brainy Explorer`}
          topic={`Neural Networking`}
          subject={`science`}
          duration={45}
          color={`#abb6ea`}
        />
        <CompanionCard
          id={`789`}
          name={`Neura the Brainy Explorer`}
          topic={`Neural Networking`}
          subject={`science`}
          duration={45}
          color={`#ee2d11`}
        />
      </section>

      <section className={`home-section`}>
        <CompanionsList
          title={`Recently completed sessions`}
          companions={recentSessions}
          classNames={`w-2/3 max-lg:w-full`}
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
