/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrainCircuit, BriefcaseBusiness, ChartNoAxesCombined, FileUser, MailOpen, Puzzle } from "lucide-react";
import React from "react";
import { useId } from "react";

export function FeatureCards() {
  return (
    <div className="py-12 mb-24 px-8 sm:px-16 lg:px-28">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
        {grid.map((feature) => (
          <div
            key={feature.id}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden"
          >
            <Grid size={20} />
            <div className="icon flex justify-center -mt-4 mb-2">
              <span className="border-r rounded-full p-4 border-gray-400 text-gray-300">{feature.icon}</span>
            </div>
            <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
              {feature.title}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const grid = [
  {
    id:1,
    icon : <BrainCircuit/>,
    title: "Tailored Career Guidance.",
    description:
      "Get mentored by AI throughout your career prep journey till you get that breakthrough offer.",
  },
  {
    id:2,
    icon: <ChartNoAxesCombined/>,
    title: "Latest Industry Insights.",
    description:
      "Stay updated of the latest trends in the domains of your interests. As awareness empowers, sets you apart.",
  },
  {
    id:3,
    icon : <BriefcaseBusiness/>,
    title: "Personalized Interview Prep.",
    description:
      "Prepare for your next interview, with personalized feedback by your AI mentor. Track your strengths and areas of improvements. Sharpen you bows and arrows. Kill it the next time.",
  },
  {
    id:4,
    icon: <FileUser/>,
    title: "Create Resume that stands out.",
    description:
      "Create ATS friendly resumes that sets you apart, gives you an edge over others in the screening round.",
  },
  {
    id:5,
    icon: <MailOpen/>,
    title: "Generate Impactful Cover Letters.",
    description:
      "Impress recruiters from the first interaction. Instantly generate personalized, compelling cover letters for every role seamlessly, showcasing what you are capable of.",
  },
  {
    id:6,
    icon: <Puzzle/>,
    title: "Take Skill-Focused Quizzes.",
    description:
      "Take quick, curated quizzes to test your awareness about you domain, tools, trends, and technologies of interest.",
  },

];

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key= {Math.random()}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
