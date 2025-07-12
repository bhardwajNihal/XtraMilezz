"use client"

import { BackgroundBeams } from "@/components/ui/background-beams";
import { ArrowRight, FileEdit, LineChart, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import { FeatureCards } from "@/components/feature-cards";
import { Testimonials } from "@/components/TestimonialCarousel";
import FAQs from "@/components/FAQs";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const howItWorks = [
    {
      id: 1,
      title: "Seamless Onboarding",
      description: "Set your industry and role preferences for tailored AI guidance from day one.",
      icon: <UserPlus className="w-8 h-8 text-primary" />,
    },
    {
      id: 2,
      title: "Build Winning Documents",
      description: "Generate ATS-friendly resumes and impactful cover letters aligned with your goals.",
      icon: <FileEdit className="w-8 h-8 text-primary" />,
    },
    {
      id: 3,
      title: "Ace Your Interviews",
      description: "Practice with smart, role-specific mock interviews and get actionable feedback.",
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      id: 4,
      title: "Track Your Growth",
      description: "Stay motivated by tracking your progress with clear, AI-generated performance insights.",
      icon: <LineChart className="w-8 h-8 text-primary" />,
    },
  ];




  return (
    <div>

      <div className="hero flex flex-col space-y-2 items-center justify-center min-h-screen w-full text-center px-10 sm:px-16 lg:px-24">
        <h2 className="text-5xl sm:text-7xl font-semibold text-gray-200 bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 bg-clip-text text-transparent py-4">Move a <b>Mile Extra <br /> </b>on your <b>Career Prep</b> journey.</h2>
        <h3 className="text-xl mb-5 font-semibold text-gray-400 ">With your very own AI Career Coach&apos;s Personalized Guidance. </h3>
        <button
        onClick={() => router.push("/dashboard")}
        className="relative mb-12 inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-medium text-white backdrop-blur-3xl flex gap-2 items-center">
            Get Started <ArrowRight size={"18px"} />
          </span>
        </button>
        <BackgroundBeams />
      </div>

      <div className="relative w-[80%] mx-auto h-80 sm:h-92 -mt-40 sm:-mt-20 rounded-lg overflow-hidden">
        <Image
          src="/heroImage.png" // public folder image
          alt="Hero Banner"
          fill // fills parent container
          className="object-cover object-top"
          priority // preload on page load
        />
        <div className="overlay absolute top-0 left-0 bg-black/30 z-10 h-full w-full"></div>
      </div>


      <div className="features" id="features">
        <h2 className=" mt-32 text-xl sm:text-3xl px-8 font-semibold text-center">Features to Fuel Your Career Breakthrough.</h2>
        <div className="feature">
          <FeatureCards />
        </div>
      </div>


      <div className="extras grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 sm:px-12 lg:px-24 gap-8 bg-black/50 shadow-lg shadow-gray-800 py-16">
        <div className="flex flex-col gap-1 items-center"><span className="text-3xl font-bold">50+</span> <span className="text-gray-400">Industries covered</span></div>
        <div className="flex flex-col gap-1 items-center"><span className="text-3xl font-bold">1000+</span> <span className="text-gray-400">Interview Questions</span></div>
        <div className="flex flex-col gap-1 items-center"><span className="text-3xl font-bold">95%</span> <span className="text-gray-400">Satisfied job seekers.</span></div>
        <div className="flex flex-col gap-1 items-center"><span className="text-3xl font-bold">24/7</span> <span className="text-gray-400">Available AI Guide.</span></div>
      </div>


      <div className="steps" id="functions">
        <h2 className="mt-32 mb-12 text-xl px-8 sm:text-3xl font-semibold text-center">Start your Prep with just <span className="font-black">4</span> simple steps.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 sm:px-12 lg:px-24 gap-4">
          {howItWorks.map(step => <div key={step.id}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 py-12 rounded-3xl overflow-hidden"
          >
            <div className="icon flex -mt-4 mb-2">
              <span className="p-4 border-gray-400 text-gray-300 text-gray-200">{step.icon}</span>
            </div>
            <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20 text-gray-200">
              {step.title}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
              {step.description}
            </p>
            <span className="text-black text-9xl font-black absolute top-0 right-0">{step.id}</span>
          </div>)}
        </div>

      </div>


      <div className="testimonials" id="testimonials">
        <h2 className="mt-32 mb-6 px-8 text-xl sm:text-3xl font-semibold text-center">What our users have to say.</h2>
        <Testimonials />
      </div>

      <div className="faqs" id="faqs">
        <h2 className="mt-32 text-xl sm:text-3xl font-semibold text-center">Frequently Asked Questions</h2>
        <p className="text-gray-400 text-center my-2 mb-8 px-8">Find answers to some common questions asked by our users.</p>
        <FAQs />
      </div>

      <div className="relative final-promt h-96 sm:h-80 lg:h-64 py-4 w-full bg-black my-20">
        <TextHoverEffect text="XtraMilezz" />
        <div className="absolute z-50 pt-12 px-8 sm:px-20 lg:px-32">
          <h2 className="text-4xl mb-2 font-bold text-gray-100">Ready to push through your Limits.</h2>
          <p className="text-gray-400 mb-4">Join thousands of students who aced there 1st offer. Professionals who leveled up and switched.</p>

          <button
          onClick={() => router.push("/dashboard")}
          className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-medium text-white backdrop-blur-3xl flex gap-2 items-center">
            Get Started <ArrowRight size={"18px"} />
          </span>
        </button>
        </div>
      </div>

    </div>
  );
}
