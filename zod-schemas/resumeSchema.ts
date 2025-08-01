
import { z } from "zod";

export const resumeSchema = z.object({
  fullname: z.string().min(1, "Name is required."),
  email: z.email("Invalid email."),
  phone: z.string().min(10, "invalid phone number.").optional(),
  
  linkedin: z.string().min(1, "Having linkedin account is mandatory."),
  github: z.url().optional(),
  twitter: z.string().optional(),

  bio: z.string().optional(),
  skills: z.string().min(1, "Mention 1 skill atleast."),

  experience : z.array(
    z.object({
        role: z.string().min(1, "please specify role."),
        organization: z.string().min(1, "please specify organization."),
        description: z.string().min(1, "please describe about the role briefly."),
        startDate: z.string().min(1, "start date is required."),
        endDate: z.string().or(z.literal("present")),
        currentlyWorking: z.boolean().optional(),
    })
  ),

  projects: z.array(
    z.object({
        title: z.string().min(1, "please specify Project title."),
        description: z.string().min(1, "briefly describe your project atleast. . ."),
        completedOn: z.string().min(1, "please specify issue date.")
    })
  ),

  certifications: z.array(
    z.object({
        title: z.string().min(1, "please specify Certification title."),
        description: z.string().optional(),
        issuedOn: z.string().min(1, "please specify issue date.")
    })
  ),

  achievements: z.array(
    z.object({
        title: z.string().min(1, "please specify achievement title."),
        description: z.string().optional(),
    })
  )

});
