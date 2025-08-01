import React, { SetStateAction, useEffect } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { resumeType } from './ResumeForm'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'


type experienceFormType = {
    index: number,
    register: UseFormRegister<resumeType>,
    setValue: UseFormSetValue<resumeType>,
    watch: UseFormWatch<resumeType>,
    errors: FieldErrors<resumeType>,
    enhancing: string | null,
    setEnhancing: React.Dispatch<SetStateAction<string | null>>
    handleEnhanceContent: (type: string, content: string) => Promise<string>   
}

const ExperienceForm = ({ index, register, setValue, watch, errors, enhancing, setEnhancing, handleEnhanceContent }: experienceFormType) => {

    const currentlyWorking = watch(`experience.${index}.currentlyWorking`);

    useEffect(() => {
        if (currentlyWorking) {
            setValue(`experience.${index}.endDate`, "present");
        }
    }, [currentlyWorking, index, setValue]);

    return (<div key={index} className="space-y-2 border border-gray-800 p-2 rounded">

        <div className="role space-y-1">
            <Label htmlFor={`experience.${index}.role`}>Role</Label>
            <Input {...register(`experience.${index}.role`)} type='text' placeholder='SWE-1' />
            {errors.experience?.[index]?.role && <p className='text-sm text-red-600'>{errors.experience?.[index].role.message}</p>}

        </div>

        <div className="organization space-y-1">
            <Label htmlFor={`experience.${index}.organization`}>Organization</Label>
            <Input {...register(`experience.${index}.organization`)} type='text' placeholder='google' />
            {errors.experience?.[index]?.organization && <p className='text-sm text-red-600'>{errors.experience?.[index].organization.message}</p>}
        </div>
        <div className="description space-y-1">
            <Label htmlFor={`experience.${index}.description`}>Description</Label>
            <Textarea {...register(`experience.${index}.description`)} placeholder='Briefly describe your role. . .' />
            {errors.experience?.[index]?.description && <p className='text-sm text-red-600'>{errors.experience?.[index].description.message}</p>}
         {/*enhacing content button  */}
            <button 
                type='button'
                onClick={async() => {
                    const content = watch(`experience.${index}.description`);
                    const company = watch(`experience.${index}.organization`);
                    const role = watch(`experience.${index}.role`);
                    if(!content){
                        toast.error("Atleast provide some details to enhance!");
                        return;
                    }
                    setEnhancing(`experience.${index}.description`);
                    const enhancedExpDesc = await handleEnhanceContent(`experience(company: ${company}, role: ${role})`,content)
                    setValue(`experience.${index}.description`, enhancedExpDesc);
                    setEnhancing(null);
                    toast.success("Experience Description enhanced successfully!")
                }}
                disabled={enhancing===`experience.${index}.description`}
                className='flex items-center gap-1 border border-gray-500 hover:bg-gray-900 cursor-pointer p-1 px-2 rounded text-sm'>
                    {enhancing===`experience.${index}.description` ? <ClipLoader size={"16px"} color='white' /> : <Sparkles size={"16px"} color='white' />}<span>{enhancing===`certifications.${index}.description` ? "Enhancing..." : "Enhance with AI"}</span>
                </button>
            
        </div>
        <div className="timeline space-y-2">
            <div className='flex gap-2 sm:gap-6 '>
                <div className='space-y-1 w-1/2 lg:w-fit'>
                    <Label htmlFor={`experience.${index}.startDate`}>Start date</Label>
                    <Input {...register(`experience.${index}.startDate`)} type='month' />
                    {errors.experience?.[index]?.startDate && <p className='text-sm text-red-600'>{errors.experience?.[index].startDate.message}</p>}
                </div>
                {!currentlyWorking && <div className='space-y-1 w-1/2 lg:w-fit'>
                    <Label htmlFor={`experience.${index}.endDate`}>End date</Label>
                    <Input {...register(`experience.${index}.endDate`)} type='month' />
                    {errors.experience?.[index]?.endDate && <p className='text-sm text-red-600'>{errors.experience?.[index].endDate.message}</p>}
                </div>}
            </div>
            <div className='flex items-center gap-1'>
                <Input {...register(`experience.${index}.currentlyWorking`)} type='checkbox' className='h-5 w-5' />
                <Label htmlFor={`experience.${index}.currentlyWorking`}>Currently Working</Label>
            </div>
        </div>
    </div>)
}

export default ExperienceForm