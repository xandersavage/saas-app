import React from 'react';
import CompanionCard from '@/components/CompanionCard';
import CompanionsList from '@/components/CompanionsList';
import CTA from '@/components/CTA';
import { recentSessions } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import HeroImage from '@/components/HeroImage';

const Page = () => {
  return (
    <main>
      {/* Hero Section with App Information */}
      <section className="rounded-4xl border border-black px-7 py-10 flex flex-col md:flex-row items-center gap-8 mb-8 bg-white">
        <div className="flex-1 flex flex-col gap-4">
          <div className="cta-badge self-start">Welcome to Nexus</div>
          <h1 className="text-4xl font-bold">Your AI-Powered Learning Companion</h1>
          <p className="text-lg">
            Nexus helps you learn any subject through interactive conversations with AI companions. 
            Choose from existing companions or create your own personalized learning assistant.
          </p>
          <div className="flex gap-4 mt-2">
            <Link href="/companions/new" className="btn-primary">
              <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
              <span>Create Companion</span>
            </Link>
            <Link href="/subscription" className="border border-black rounded-xl px-4 py-2 flex items-center gap-2">
              <span>View Subscription Plans</span>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <HeroImage />
        </div>
      </section>

      <h2 className='text-2xl font-bold'>Popular Companions</h2>
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

      {/* Features Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Why Choose Nexus?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-4xl border border-black p-6 bg-white">
            <div className="mb-4 bg-[#E5D0FF] rounded-full w-12 h-12 flex items-center justify-center">
              <Image src="/icons/cap.svg" alt="Personalized" width={24} height={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Personalized Learning</h3>
            <p>Create companions tailored to your learning style and subject preferences.</p>
          </div>
          <div className="rounded-4xl border border-black p-6 bg-white">
            <div className="mb-4 bg-[#FFDA6E] rounded-full w-12 h-12 flex items-center justify-center">
              <Image src="/icons/mic-on.svg" alt="Interactive" width={24} height={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Conversations</h3>
            <p>Learn through natural voice conversations that make education fun and engaging.</p>
          </div>
          <div className="rounded-4xl border border-black p-6 bg-white">
            <div className="mb-4 bg-[#BDE7FF] rounded-full w-12 h-12 flex items-center justify-center">
              <Image src="/icons/science.svg" alt="Diverse" width={24} height={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Diverse Subjects</h3>
            <p>Explore multiple subjects including math, science, language, coding, and more.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
