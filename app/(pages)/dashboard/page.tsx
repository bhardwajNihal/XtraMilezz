"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipLoader } from "react-spinners"
import { getUserOnboardingStatus } from '@/actions/onboarding'
import { getIndustryInsights } from '@/actions/industryInsights'
import { JsonValue } from '@prisma/client/runtime/library'
import { DemandLevel, MarketOutlook } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { BarChart3, BrainCircuit, LineChart, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { FaMoneyBills } from 'react-icons/fa6'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface insightsType {
  id: string;
  industry: string;
  salaryRanges: JsonValue[];
  growthRate: number;
  demandLevel: DemandLevel;
  topSkills: string[];
  marketOutlook: MarketOutlook;
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: Date | number | string;
  nextUpdate: Date;
}

const Dashboard = () => {

  const router = useRouter()
  const { status } = useSession();
  const [insights, setInsights] = useState<insightsType>()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  useEffect(() => {
    async function checkOnboardingStatus() {

      const isOnboarded = await getUserOnboardingStatus();
      console.log("isOnboarded : ", isOnboarded);

      if (!isOnboarded.Onboarded) {
        router.push("/onboarding")
      }
      const insights = await getIndustryInsights();
      setInsights(insights);
    }
    checkOnboardingStatus();
  }, [router])

  useEffect(() => {
    console.log(insights);
  }, [insights])




  if (status === "loading") return <div className='min-h-screen w-full flex justify-center items-center'><ClipLoader size={"30px"} color='white' /></div>

  return (
    <div className='min-h-screen w-full sm:w-[95%] px-4 sm:px-8 lg:px-20 pt-10 mx-auto container'>

      <div className='flex justify-between space-y-2'>
        <h2 className='text-2xl sm:text-4xl text-gray-200 font-black'>Industry Insights.</h2>
        <Badge className='last-updated bg-zinc-900 border border-gray-560 text-white'>last Updated {insights?.lastUpdated && formatDistanceToNow(new Date(insights.lastUpdated!), { addSuffix: true })}</Badge>
      </div>

      <p className='text-gray-300'>Detailed outlook for the industry you are aiming for (updated weekly).</p>


      <div className="stats mt-4">

        <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">

          {/* Market Outlook Card */}
          <div className="relative h-40 bg-gradient-to-br from-gray-800 to-black text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-5 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Market Outlook</h2>
              {insights?.marketOutlook === "POSITIVE"
                ? <TrendingUp className='text-green-400' size={"20px"} />
                : insights?.marketOutlook === "NEGETIVE"
                  ? <TrendingDown className='text-red-400' size={"20px"} />
                  : <LineChart className='text-yellow-400' size={"20px"} />}
            </div>
            <h3 className={`text-4xl font-bold ${insights?.marketOutlook === "POSITIVE" ? 'text-green-300' : insights?.marketOutlook === "NEGETIVE" ? 'text-red-300' : 'text-yellow-300'}`}>
              {insights?.marketOutlook}
            </h3>
            <p className="text-xs text-gray-400 mt-auto">
              Next Update {insights?.nextUpdate && formatDistanceToNow(new Date(insights?.nextUpdate), { addSuffix: true })}
            </p>
            {/* Abstract background element */}
            <div className="absolute bottom-0 right-0 p-2 opacity-10">
              <LineChart size={80} className="text-gray-600" />
            </div>
          </div>


          {/* Industry Growth Rate Card */}
          <div className="relative h-40 bg-gradient-to-br from-gray-800 to-black text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-5 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Industry Growth Rate</h2>
              <BarChart3 className='text-blue-400' size={"20px"} />
            </div>
            <h3 className="text-4xl font-bold text-blue-300">{insights?.growthRate}%</h3>
            <div className="w-full mt-auto">
              <Progress value={insights?.growthRate} className="h-2 bg-gray-700 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-blue-500" />
            </div>
            {/* Abstract background element */}
            <div className="absolute bottom-0 right-0 p-2 opacity-10">
              <BarChart3 size={80} className="text-gray-600" />
            </div>
          </div>

          {/* Market Demand Card */}
          <div className="relative h-40 bg-gradient-to-br from-gray-800 to-black text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-5 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Market Demand</h2>
              <FaMoneyBills className='text-teal-400' size={"20px"} />
            </div>
            <h3 className={`text-4xl font-bold ${insights?.demandLevel === "HIGH" ? 'text-green-300' : insights?.demandLevel === "LOW" ? 'text-red-300' : 'text-yellow-300'}`}>
              {insights?.demandLevel}
            </h3>
            <div className="w-full mt-auto">
              <Progress
                value={0}
                className={`${insights?.demandLevel === "HIGH" ? 'bg-green-500' : insights?.demandLevel === "LOW" ? "bg-red-600" : "bg-yellow-700"}`}
              />
            </div>
            {/* Abstract background element */}
            <div className="absolute bottom-0 right-0 p-2 opacity-10">
              <FaMoneyBills size={80} className="text-gray-600" />
            </div>
          </div>

          {/* Top Skills Card */}
          <div className="relative h-40 bg-gradient-to-br from-gray-800 to-black text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out p-5 flex flex-col overflow-hidden scrollbar-hide">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Top Skills of the Industry</h2>
            <div className="flex flex-wrap gap-2 overflow-y-auto scrollbar-hide">
              {insights?.topSkills.map(skill => (
                <Badge key={skill} className='bg-gray-800 text-gray-200 hover:bg-gray-600 transition-colors duration-200 text-xs px-3 py-1 rounded-lg'>
                  {skill}
                </Badge>
              ))}
            </div>
            {/* Abstract background element */}
            <div className="absolute bottom-0 right-0 p-2 opacity-10">
              <svg className="h-20 w-20 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v6a1 1 0 01-1 1h-3a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V14a1 1 0 00-1-1H3a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1v-.5a1.5 1.5 0 013 0V3.5z" />
              </svg>
            </div>
          </div>

        </div>


        <div className="salary-trend-chart relative sm:h-72 lg:h-[500px] mt-8 p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl shadow-lg border border-gray-700 flex flex-col">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-100 mb-1">
              Role-wise Salary Breakdown <span className="text-sm font-normal text-gray-400">(USD)</span>
            </h2>
            <span className="text-sm text-gray-400">
              Location: {(insights?.salaryRanges?.[0] as { location?: string })?.location}
            </span>
          </div>

          <div className="flex-grow h-64 lg:h-[500px]"> {/* This div ensures the chart takes available space */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={insights?.salaryRanges}
              >
                <XAxis
                  dataKey="role"
                  stroke="#9CA3AF" 
                  tick={{ fill: '#D1D5DB', fontSize: 10 }} 
                  tickLine={false} 
                  axisLine={{ stroke: '#4B5563' }} 
                />
                <YAxis
                  stroke="#9CA3AF" 
                  tick={{ fill: '#D1D5DB', fontSize: 10 }} 
                  tickLine={false} 
                  axisLine={{ stroke: '#4B5563' }} 
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.08)' }} 
                  contentStyle={{
                    backgroundColor: '#1F2937', 
                    border: '1px solid #4B5563', 
                    borderRadius: '6px',
                    color: '#F9FAFB', 
                    fontSize: '12px',
                    padding: '10px'
                  }}
                  labelStyle={{ color: '#D1D5DB', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#F9FAFB' }} 
                />
                <Legend
                  wrapperStyle={{ paddingTop: '15px' }} 
                  iconType="diamond"
                  formatter={(value) => <span className='text-sm' style={{ color: '#D1D5DB' }}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>}
                />
                <Bar dataKey="min" fill="#A855F7" name="Minimum Salary" radius={[4, 4, 0, 0]} /> {/* Purple */}
                <Bar dataKey="median" fill="#3B82F6" name="Median Salary" radius={[4, 4, 0, 0]} /> {/* Blue */}
                <Bar dataKey="max" fill="#10B981" name="Maximum Salary" radius={[4, 4, 0, 0]} /> {/* Green */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="addional-infos w-full grid grid-cols-1 sm:grid-cols-2 my-16 gap-4">

          <div className="key-trends relative p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center mb-3">
              <Sparkles className="text-purple-400 mr-3" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Key Trends</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">Current trends prevailing in your industry of interest.</p>
            <ul className="space-y-2 text-gray-300 text-sm list-disc list-inside">
              {insights?.keyTrends && insights.keyTrends.length > 0 ? (
                insights.keyTrends.map(ele => (
                  <li key={ele} className="flex items-start">
                    <span className="mr-2 text-purple-500">•</span> {ele}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No key trends available at the moment.</li>
              )}
            </ul>
            {/* Abstract background element */}
            <div className="absolute bottom-0 right-0 p-2 opacity-20">
              <Sparkles size={80} className="text-gray-600" />
            </div>
          </div>

          <div className="recommended-skills relative p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center mb-3">
              <BrainCircuit className="text-teal-400 mr-3" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Recommended Skills</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">Master these to stay relevant in today&apos;s market.</p>
            <ul className="space-y-2 text-gray-300 text-sm list-disc list-inside">
              {insights?.topSkills && insights.topSkills.length > 0 ? (
                insights.topSkills.map(skill => (
                  <li key={skill} className="flex items-start">
                    <span className="mr-2 text-teal-500">•</span> {skill}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No recommended skills available at the moment.</li>
              )}
            </ul>
            {/* Abstract background element */}
            <div className="absolute bottom-0 right-0 p-2 opacity-20">
              <BrainCircuit size={80} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard