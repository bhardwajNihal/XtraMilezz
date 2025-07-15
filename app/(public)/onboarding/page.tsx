import React from 'react'
import OnboardingForm from './_components/onboarding-form'
import { industries } from '@/lib/industries-data'
import { getUserOnboardingStatus } from '@/actions/onboarding';
import { redirect } from 'next/navigation';
import Image from 'next/image';

const OnboardingPage = async () => {

  const isOnboarded = await getUserOnboardingStatus();

  if (isOnboarded.Onboarded) {
    redirect("/dashboard")
  }

  return (
    <div className='min-h-screen w-full flex'>
    <div className="logo text-2xl font-black absolute top-12 left-8 text-gray-300 z-50 ">XtraMilezz</div>
      <OnboardingForm industries={industries} />

      <div className="relative image w-1/2">
        <Image
          src="/onboardingImage.png" // public folder image
          alt="Hero Banner"
          fill // fills parent container
          className="object-cover object-left"
          priority // preload on page load
        />

        <div className="overlay flex items-center flex justify-center flex-col h-full w-full absolute top-0 left-0 bg-black/50 z-40 backdrop-blur-xs">

          <h2 className='text-7xl space-y-6 font-black bg-gradient-to-br from-gray-600 via-gray-200 to-gray-800 bg-clip-text text-transparent '><p>Dream big.</p><p>Start small.</p><p>Act now.</p></h2>
        </div>
      </div>

    </div>
  )
}

export default OnboardingPage