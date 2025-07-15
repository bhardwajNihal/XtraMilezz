
import { z } from "zod";

export const onboardingSchema = z.object({
    
    industry : z.string().nonempty("please select an Industry."),
    subIndustry : z.string().nonempty("please select a Domain."),
    bio : z.string().optional(),
    experience : z
    .string()
    .transform(val => parseInt(val,10))
    .pipe(z.number().min(0).max(50)),
    skills : z
    .string()
    .transform(val => val 
        ? val
        .split(",")                 // convert to array, splitting by comma
        .map(skill => skill.trim())     // trim out extra space
        .filter(Boolean)                // filter out empty strings
        : undefined
    )
})