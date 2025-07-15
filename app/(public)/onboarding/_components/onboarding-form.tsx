
"use client"
import React, { useEffect, useState } from 'react'
import { onboardingSchema } from '@/zod-schemas/onboardingSchema';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import z from 'zod';
import useFetch from '@/customHooks/useFetch';
import { onboardUser } from '@/actions/onboarding';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface IndustryDataType {
    id: string;
    name: string;
    subIndustries: string[]
}

type onboardingFormType = z.infer<typeof onboardingSchema>

const OnboardingForm = ({ industries }: { industries: IndustryDataType[] }) => {

    const router = useRouter();
    const [selectedIndustry, setSelectedIndustry] = useState<IndustryDataType | undefined>();

    const { register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(onboardingSchema)
    })

    const {
        data : onboardedData,
        loading : onboardLoading,
        fn : onboardUserFn        
    } = useFetch(onboardUser)

    async function submitOnboardingForm(data: onboardingFormType) {
        
        const {industry, ...rest} = data;
        const formattedIndustry = `${industry}-${data.subIndustry.toLowerCase().replace(/ /g, "-")}`;

        onboardUserFn({
            ...rest,
            industry: formattedIndustry
        })
        
    }

    useEffect(()=> {
        if(onboardedData && !onboardLoading){
            toast.success("User Onboarded Successfully!");
            reset();
            setSelectedIndustry(undefined);
            router.push("/dashboard")
        }
    },[onboardedData,onboardLoading,reset,router])

    return (
        <div className='w-full lg:w-1/2 flex justify-center items-center px-8 lg:px-16'>

            <form 
            onSubmit={handleSubmit(submitOnboardingForm)}
            className='w-full space-y-3'>
                <h1 className='text-xl lg:text-3xl font-bold text-center'>Onboarding Form</h1>
                <h2 className='text-gray-300 text-center mb-4 -mt-2'>Fill in the details to let us know you better.</h2>

                <div className="industry">
                    <label htmlFor="industry" className='font-semibold'>Select Industry</label>
                    <Select onValueChange={(value) => {
                        setSelectedIndustry(industries.find((ind) => ind.id === value))
                        setValue("industry", value)
                        setValue("subIndustry", "")     // resetting sub-industry
                    }
                    }>
                        <SelectTrigger id='industry' className='w-full'>
                            <SelectValue placeholder="e.g. Technology..." />
                        </SelectTrigger>
                        <SelectContent>
                            {industries.map(ind => <SelectItem key={ind.id} value={ind.id}>{ind.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors.industry && (
                        <p className="text-sm text-red-500">
                            {errors.industry.message}
                        </p>
                    )}
                </div>

                {selectedIndustry && <div className="sub-industry">
                    <label htmlFor="subindustry" className='font-semibold'>Select a Domain</label>
                    <Select onValueChange={(value) => setValue("subIndustry", value)}>
                        <SelectTrigger id='subindustry' className='w-full'>
                            <SelectValue placeholder="e.g. Data Science & Analytics" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedIndustry.subIndustries.map(subInd => <SelectItem key={subInd} value={subInd}>{subInd}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors.subIndustry && (
                        <p className="text-sm text-red-500">
                            {errors.subIndustry.message}
                        </p>
                    )}
                </div>}

                <div className="experience">
                    <label htmlFor="experience" className='font-semibold'>Years of Experience</label>
                    <Input
                        id='experience'
                        {...register("experience")}
                        className='w-full'
                        placeholder='Enter years of Experience'
                        type='number'
                    />
                    {errors.experience && (
                        <p className="text-sm text-red-500">
                            {errors.experience.message}
                        </p>
                    )}
                </div>

                <div className="skills">
                    <label htmlFor="skills" className='font-semibold'>Add your skills. <span className='text-sm font-normal'> (As comma separated values)</span></label>
                    
                    <Input type="text"
                        {...register("skills")}
                        className='w-full'
                        id='skills'
                        placeholder='e.g. react, python, java,...'
                    />
                    {errors.skills && (
                        <p className="text-sm text-red-500">
                            {errors.skills.message}
                        </p>
                    )}
                </div>

                <div className="bio">
                    <label htmlFor="bio"><span className='font-semibold'>Add a Professional Bio</span> (optional).</label>
                    <Textarea
                        {...register("bio")}
                        className='w-full'
                        id='bio'
                        placeholder='I am a cybersecurity analyst with 3 years of experience.....'
                    />
                    {errors.bio && (
                        <p className="text-sm text-red-500">
                            {errors.bio.message}
                        </p>
                    )}
                </div>
                
                    <button 
                disabled={onboardLoading}
                className='border border-gray-400 hover:bg-black rounded cursor-pointer py-2 w-full sm:w-1/2' type='submit'>{onboardLoading ? "Submitting...":"Submit"}</button>
    
            </form>

        </div>
    )
}

export default OnboardingForm