
"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { DbClient } from "@/db/dbClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

// getting genai instance
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// setting up model
const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateAiIndustryInsights(industry: string) {
  // defining prompt
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
    `;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    // trim out any quotes, or extra space to get clean response
    const cleanedText = generatedText.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);

  } catch (error) {
    throw error;
  }
}

export async function getIndustryInsights() {
  try {
    // check for valid session
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

    const foundIndustryInsight = await DbClient.industryInsight.findUnique({
      where: {
        industry: foundUser.industry!,
      },
    });

    if (foundIndustryInsight) return foundIndustryInsight;

    // If insights not found
    // create a new one and return
    const industry = foundUser.industry;
    if (!industry) {
      throw new Error("User not onboarded!");
    }

    // if not found create a fresh one and return
    const insights = await generateAiIndustryInsights(industry);

    const createdInsight = await DbClient.industryInsight.create({
      data: {
        industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return createdInsight;
  } catch (error) {
    throw error;
  }
}
