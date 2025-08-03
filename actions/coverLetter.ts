"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { DbClient } from "@/db/dbClient";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


export async function generateCoverLetter({role, organization}: {role:string, organization:string}) {

    const session = await getServerSession(authOptions);
      if (!session?.user) {
        throw new Error("Request unauthorized!");
      }
    
      // check if user exists
      const foundUser = await DbClient.user.findUnique({
        where: {
          email: session.user.email!,
        },
      });
    
      if (!foundUser) {
        throw new Error("User not found!");
      }

    
      // fetching user's resume
      const res = await DbClient.resume.findUnique({
        where: {userId : foundUser.id}
      })
      const resume = res?.content;

      // in case, resume not created, then fall back to skills
      const skills = foundUser.skills;


    const prompt = `generate a catchy, empressive, precise, to the point cover letter, that lets the applicant stand out. Get HR's attention.
                    role: ${role}
                    company: ${organization}
                    ${resume ? `resume in markdown format: ${resume}` : skills ? `skills: ${skills}` : ""}.

                    Note: Only return the cover letter content, no extra lines, or explanation.
`

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim(); // removing extra quotes and spaces
  
        return cleanedText;
      } catch (error) {
        throw error;
      }

}