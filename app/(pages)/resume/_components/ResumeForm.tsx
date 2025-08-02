import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Sparkles, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { resumeSchema } from '@/zod-schemas/resumeSchema'
import { z } from "zod"
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import ExperienceForm from './ExperienceForm'
import useFetch from '@/customHooks/useFetch'
import { enhanceWithAI, getResume, saveResume } from '@/actions/resume'
import { toast } from 'sonner'
import { BarLoader, ClipLoader } from 'react-spinners'

export type resumeType = z.infer<typeof resumeSchema>

const ResumeForm = () => {

    const [enhancing, setEnhancing] = useState<string | null>(null);
    const [existingResume, setExistingResume] = useState<resumeType | null>(null);
    const [existingResumeLoading, setExistingResumeLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue,
        reset
    } = useForm<resumeType>({
        resolver: zodResolver(resumeSchema),
    })

    // we can use useFieldArray to add/remove entries dynamically for sections with multiple entries
    const { fields: experienceFields, append: addExperience, remove: removeExperience } = useFieldArray({
        control,
        name: "experience"
    })

    const { fields: certificationFields, append: addCertification, remove: removeCertification } = useFieldArray({
        control,
        name: "certifications"
    })

    const { fields: achievenmentsFields, append: addAchievement, remove: removeAchievement } = useFieldArray({
        control,
        name: "achievements"
    })

    const { fields: projectFields, append: addProject, remove: removeProject } = useFieldArray({
        control,
        name: "projects"
    })


    const {
        fn: enhanceContentFn
    } = useFetch(enhanceWithAI)

    async function handleEnhanceContent(type: string, content: string) {

        return await enhanceContentFn({ currentContent: content, type: type });

    }

    // todo
    // to add try catch to each enhance operation

    const {
        data: savedResume,
        loading: savingResume,
        fn: saveResumeFn,
    } = useFetch(saveResume)


    async function handleResumeSubmit(data: resumeType) {
        await saveResumeFn(data);
    }

    useEffect(() => {
        if (savedResume && savingResume) {
            toast.success("resume saved Successfully!")
        }
    }, [savedResume, savingResume])

    // fetching existing resume if any
    useEffect(() => {
        async function fetchExistingResume() {
            try {
                setExistingResumeLoading(true);
                const response = await getResume();
                const parsed = resumeSchema.safeParse(response?.data);
                if (parsed.success) {           // parsing responce json to resume schema safely
                    setExistingResume(parsed.data); // fully typed and safe
                } else {
                    console.error("Resume data is invalid:", parsed.error);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setExistingResumeLoading(false);
            }
        }
        fetchExistingResume()
    }, [])

    useEffect(() => {
        if(existingResume && !existingResumeLoading){
            reset(existingResume);
        }
    },[existingResume, existingResumeLoading, reset])


    return (
        <form
            onSubmit={handleSubmit(handleResumeSubmit)}
            className='border border-gray-700 rounded-lg min-h-fit w-full py-8 px-4 sm:px-8 lg:px-12 space-y-6'>
            
            {existingResumeLoading && <div className='min-w-full h-3'><BarLoader width={"100%"} color='white'/></div>}

            <div className='name space-y-1'>
                <Label htmlFor='fullname' className='font-semibold'>Full Name *</Label>
                <Input {...register("fullname")} id='fullname' type='text' placeholder='John Doe' />
                {errors?.fullname && <p className='text-sm text-red-600'>{errors.fullname?.message}</p>}
            </div>

            <div className="contact-info flex flex-col lg:flex-row gap-4">
                <div className="email w-1/2 space-y-1">
                    <Label htmlFor='email' className='font-semibold'>Email *</Label>
                    <Input {...register("email")} type='email' placeholder='johndoe123@gmail.com' />
                    {errors?.email && <p className='text-sm text-red-600'>{errors.email?.message}</p>}
                </div>
                <div className="contact w-1/2 space-y-1">
                    <Label htmlFor='phone' className='font-semibold'>Phone</Label>
                    <Input {...register("phone")} id='phone' type='text' placeholder='12345 98765' />
                    {errors?.phone && <p className='text-sm text-red-600'>{errors.phone?.message}</p>}
                </div>
            </div>

            <div className="social-handles space-y-3">
                <div className="linkedin space-y-1">
                    <Label htmlFor='linkedin' className='font-semibold'>Linkedin *</Label>
                    <Input {...register("linkedin")} type='text' id='linkedin' placeholder='https://www.linkedin.com/in/your-username' />
                    {errors?.linkedin && <p className='text-sm text-red-600'>{errors.linkedin?.message}</p>}

                </div>
                <div className="github space-y-1">
                    <Label htmlFor='github' className='font-semibold'>Github</Label>
                    <Input {...register("github")} type='text' id='github' placeholder='https://github.com/your-username' />
                    {errors?.github && <p className='text-sm text-red-600'>{errors.github?.message}</p>}
                </div>
                <div className="twitter space-y-1">
                    <Label htmlFor='twitter' className='font-semibold'>Twitter</Label>
                    <Input {...register("twitter")} type='text' id='twitter' placeholder='https://x.com/your-username' />
                    {errors?.twitter && <p className='text-sm text-red-600'>{errors.twitter?.message}</p>}
                </div>
            </div>

            <div className="bio space-y-1">
                <Label htmlFor='bio' className='font-semibold'>Bio *</Label>
                <Textarea {...register("bio")} id='bio' placeholder='Write a professional bio. . .' />
                {errors?.bio && <p className='text-sm text-red-600'>{errors.bio?.message}</p>}
                <button
                    type='button'
                    onClick={async () => {
                        const content = watch("bio");
                        if (!content) {
                            toast.error("Please describe your bio briefly to enhance!");
                            return;
                        }
                        setEnhancing("bio");
                        const enhancedBio = await handleEnhanceContent("bio", content)
                        setValue("bio", enhancedBio);
                        setEnhancing(null);
                        toast.success("Bio enhanced successfully!")
                    }}
                    disabled={enhancing === "bio"}
                    className='flex items-center gap-1 border border-gray-500 hover:bg-gray-900 cursor-pointer p-1 px-2 rounded text-sm'>{enhancing === "bio" ? <ClipLoader size={"16px"} color='white' /> : <Sparkles size={"16px"} color='white' />}<span>{enhancing === "bio" ? "Enhancing..." : "Enhance with AI"}</span></button>
            </div>

            <div className="skills space-y-1">
                <Label htmlFor='skills' className='font-semibold'>Skills *</Label>
                <Input {...register("skills")} id='skills' type='text' placeholder='List all skills (e.g. react, python, django, postgres, etc...)' />
                {errors?.skills && <p className='text-sm text-red-600'>{errors.skills?.message}</p>}
            </div>



            <div className="experience space-y-2">
                <h2 className='text-xl font-bold'>Experience</h2>
                {/* React Hook Form will correctly bind each input field to that exact path in the form state. */}
                {/* Zod will validate each array of objects using its array schema. */}
                {experienceFields.map((_, index) =>
                    <div key={index}>
                        <div className='flex justify-end my-1'>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeExperience(index);
                                }}
                                className='flex items-center gap-1 border border-red-700 rounded text-sm p-1 text-red-700 cursor-pointer hover:bg-gray-900'>
                                <span><X size={"14px"} color='red' /></span>Remove Experience
                            </button>
                        </div>
                        <ExperienceForm
                            index={index}
                            watch={watch}
                            errors={errors}
                            register={register}
                            setValue={setValue}
                            enhancing={enhancing}
                            setEnhancing={setEnhancing}
                            handleEnhanceContent={handleEnhanceContent}
                        />
                    </div>
                )}
                <div className='flex w-full justify-center'>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addExperience({ role: "", organization: "", description: "", startDate: "", endDate: "" })
                        }}
                        className='flex items-center gap-1 border border-gray-500 rounded p-1 cursor-pointer hover:bg-gray-900'>
                        <span><Plus size={"16px"} color='white' /></span>Add Experience
                    </button>
                </div>

            </div>



            <div className="certifications space-y-3">
                <h2 className='text-lg font-bold'>Certifications</h2>

                {certificationFields.map((_, index) => <div key={index}>
                    <div className='flex justify-end my-1'>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                removeCertification(index);
                            }}
                            className='flex items-center gap-1 border border-red-700 rounded text-sm p-1 text-red-700 cursor-pointer hover:bg-gray-900'>
                            <span><X size={"14px"} color='red' /></span>Remove Certification
                        </button>
                    </div>
                    <div className='space-y-2  border border-gray-800 p-2 rounded'>
                        <Label htmlFor={`certifications.${index}.title`}>Title</Label>
                        <Input {...register(`certifications.${index}.title`)} placeholder='e.g. Introduction to Generative AI, from Microsoft. . .' type='text' />
                        {errors.certifications?.[index]?.title && <p className='text-sm text-red-600'>{errors.certifications?.[index].title.message}</p>}

                        <Label htmlFor={`certifications.${index}.description`}>Description</Label>
                        <Textarea {...register(`certifications.${index}.description`)} placeholder='Briefly describe what you learnt...' />
                        {errors.certifications?.[index]?.description && <p className='text-sm text-red-600'>{errors.certifications?.[index].description.message}</p>}

                        <button
                            type='button'
                            onClick={async () => {
                                const content = watch(`certifications.${index}.description`);
                                const title = watch(`certifications.${index}.title`);
                                if (!content) {
                                    toast.error("Atleast provide a brief description about certification, to enhance!");
                                    return;
                                }
                                setEnhancing(`certifications.${index}.description`);
                                const enhancedCertDisc = await handleEnhanceContent(`certification(${title})`, content)
                                setValue(`certifications.${index}.description`, enhancedCertDisc);
                                setEnhancing(null);
                                toast.success("Certificate Description enhanced successfully!")
                            }}
                            disabled={enhancing === `certifications.${index}.description`}
                            className='flex items-center gap-1 border border-gray-500 hover:bg-gray-900 cursor-pointer p-1 px-2 rounded text-sm'>
                            {enhancing === `certifications.${index}.description` ? <ClipLoader size={"16px"} color='white' /> : <Sparkles size={"16px"} color='white' />}<span>{enhancing === `certifications.${index}.description` ? "Enhancing..." : "Enhance with AI"}</span>
                        </button>

                        <Label htmlFor={`certifications.${index}.issuedOn`}>Completed On</Label>
                        <Input {...register(`certifications.${index}.issuedOn`)} type='month' className='w-fit' />
                    </div>
                </div>)}

                <div className='flex justify-center'>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addCertification({ title: "", description: "", issuedOn: "" })
                        }}
                        className='flex items-center gap-1 border border-gray-500 rounded p-1 cursor-pointer hover:bg-gray-900'><span><Plus size={"16px"} color='white' /></span>Add Certifications</button>
                </div>
            </div>


            <div className="projects space-y-3">
                <h2 className='text-lg font-bold'>projects</h2>

                {projectFields.map((_, index) => <div key={index}>
                    <div className='flex justify-end my-1'>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                removeProject(index);
                            }}
                            className='flex items-center gap-1 border border-red-700 rounded text-sm p-1 text-red-700 cursor-pointer hover:bg-gray-900'>
                            <span><X size={"14px"} color='red' /></span>Remove Project
                        </button>
                    </div>
                    <div className='space-y-2  border border-gray-800 p-2 rounded'>
                        <Label htmlFor={`projects.${index}.title`}>Title</Label>
                        <Input {...register(`projects.${index}.title`)} placeholder='Xtramilezz - Full stack AI career coach.' type='text' />
                        {errors.projects?.[index]?.title && <p className='text-sm text-red-600'>{errors.projects?.[index].title.message}</p>}

                        <Label htmlFor={`projects.${index}.description`}>Description</Label>
                        <Textarea {...register(`projects.${index}.description`)} placeholder='Briefly describe your project (stack, features, etc). . .' />
                        {errors.projects?.[index]?.description && <p className='text-sm text-red-600'>{errors.projects?.[index].description.message}</p>}

                        <button
                            type='button'
                            onClick={async () => {
                                const content = watch(`projects.${index}.description`);
                                const title = watch(`projects.${index}.title`);
                                if (!content) {
                                    toast.error("Atleast provide a brief description about project, to enhance!");
                                    return;
                                }
                                setEnhancing(`projects.${index}.description`);
                                const enhancedProjectDisc = await handleEnhanceContent(`project(title-${title})`, content)
                                setValue(`projects.${index}.description`, enhancedProjectDisc);
                                setEnhancing(null);
                                toast.success("Project Description enhanced successfully!")
                            }}
                            disabled={enhancing === `projects.${index}.description`}
                            className='flex items-center gap-1 border border-gray-500 hover:bg-gray-900 cursor-pointer p-1 px-2 rounded text-sm'>
                            {enhancing === `projects.${index}.description` ? <ClipLoader size={"16px"} color='white' /> : <Sparkles size={"16px"} color='white' />}<span>{enhancing === `projects.${index}.description` ? "Enhancing..." : "Enhance with AI"}</span>
                        </button>

                        <Label htmlFor={`projects.${index}.completedOn`}>Completed On</Label>
                        <Input {...register(`projects.${index}.completedOn`)} type='month' className='w-fit' />
                    </div>
                </div>)}
                <div className='flex justify-center'>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addProject({ title: "", description: "", completedOn: "" })
                        }}
                        className='flex items-center gap-1 border border-gray-500 rounded p-1 cursor-pointer hover:bg-gray-900'><span><Plus size={"16px"} color='white' /></span>Add Projects</button>
                </div>
            </div>


            <div className="achievenments space-y-3">
                <h2 className='text-lg font-bold'>Achievenments</h2>

                {achievenmentsFields.map((_, index) => <div key={index}>
                    <div className='flex justify-end my-1'>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                removeAchievement(index);
                            }}
                            className='flex items-center gap-1 border border-red-700 rounded text-sm p-1 text-red-700 cursor-pointer hover:bg-gray-900'>
                            <span><X size={"14px"} color='red' /></span>Remove Achievement
                        </button>
                    </div>
                    <div className='space-y-2  border border-gray-800 p-2 rounded'>
                        <Label htmlFor={`achievements.${index}.title`}>Title</Label>
                        <Input {...register(`achievements.${index}.title`)} type='text' placeholder='e.g. Won a quiz, debate competition, hackathon,etc. . .' />
                        {errors.achievements?.[index]?.title && <p className='text-sm text-red-600'>{errors.achievements?.[index].title.message}</p>}

                        <Label htmlFor='achievenment-description'>Description</Label>
                        <Textarea {...register(`achievements.${index}.description`)} placeholder='Briefly describe your experience, learnings, challenges, etc. . .' />
                        {errors.achievements?.[index]?.description && <p className='text-sm text-red-600'>{errors.achievements?.[index].description.message}</p>}

                        <button
                            type='button'
                            onClick={async () => {
                                const content = watch(`achievements.${index}.description`);
                                const title = watch(`achievements.${index}.title`);
                                if (!content) {
                                    toast.error("Atleast provide a brief description about your Achievement, to enhance!");
                                    return;
                                }
                                setEnhancing(`achievements.${index}.description`);
                                const enhancedProjectDisc = await handleEnhanceContent(`achievement(title-${title})`, content)
                                setValue(`achievements.${index}.description`, enhancedProjectDisc);
                                setEnhancing(null);
                                toast.success("Achievement Description enhanced successfully!")
                            }}
                            disabled={enhancing === `achievements.${index}.description`}
                            className='flex items-center gap-1 border border-gray-500 hover:bg-gray-900 cursor-pointer p-1 px-2 rounded text-sm'>
                            {enhancing === `achievements.${index}.description` ? <ClipLoader size={"16px"} color='white' /> : <Sparkles size={"16px"} color='white' />}<span>{enhancing === `achievements.${index}.description` ? "Enhancing..." : "Enhance with AI"}</span>
                        </button>

                    </div>
                </div>)}

                <div className='flex justify-center'>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addAchievement({ title: "", description: "" })
                        }}
                        className='flex items-center gap-1 border border-gray-500 rounded p-1 cursor-pointer hover:bg-gray-900'><span><Plus size={"16px"} color='white' /></span>Add Achievement</button>
                </div>
            </div>

            <button
                type='submit'
                className='bg-gray-300 text-black font-semibold hover:bg-gray-400 px-8 mt-4 py-3 rounded'>
                {savingResume ? <span><ClipLoader size={"16px"} color="black" /> Saving...</span> : "Save resume"}
            </button>

        </form>
    )
}

export default ResumeForm