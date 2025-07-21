"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { DbClient } from "@/db/dbClient";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateQuiz() {
    
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

    const prompt = `Generate 10 relevant technical interview questions
                    for a professional either working in or aspiring to work in
                    ${foundUser.industry} industry.

                    ${foundUser.skills.length 
                    ? `With experience in the given skills : ${foundUser.skills.join(", ")}`
                    : ""
                    }. 
                    Make sure 1st four questions to be easy ones, next four questions to be of medium difficulty,
                    and last two questions to be hard.

                    Each question should be multiple choice with 4 options.
                    Return the response in this exact JSON format only, no additional text:
                    {
                    "questions": [
                        {
                        "question": "string",
                        "options": ["string", "string", "string", "string"],
                        "correctAnswer": "string",
                        "explanation": "string"
                        }
                    ]
                    }`
    
    try {
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();        // removing extra quotes and spaces
    
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;

  } catch (error) {
    throw error;
  }

}