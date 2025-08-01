"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { DbClient } from "@/db/dbClient";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

export async function saveResume(content: string) {
  // type to be later refactored
  try {
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

    const savedResume = await DbClient.resume.upsert({
      where: {
        userId: foundUser.id,
      },
      update: {
        content,
      },
      create: {
        userId: foundUser.id,
        content,
      },
    });

    return savedResume;
  } catch (error) {
    throw error;
  }
}

export async function getResume() {
  try {
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

    const resume = await DbClient.resume.findUnique({
      where: {
        userId: foundUser.id,
      },
    });
    return resume;
  } catch (error) {
    throw error;
  }
}

export async function enhanceWithAI({
  currentContent,
  type,     
}: {
  currentContent: string;
  type: string;             // bio, experience, project, achievement
}) {
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

  const prompt = `
        As an expert resume writer, improve the following ${type} description for a ${foundUser.industry} professional.
        Make it more impactful, quantifiable, and aligned with industry standards.
        Current content: "${currentContent}"

        Requirements:
        1. Use action verbs
        2. Include metrics and results where possible
        3. Highlight relevant technical skills
        4. Keep it concise but detailed
        5. Focus on achievements over responsibilities
        6. Use industry-specific keywords
        
        Strictly format the response as a single paragraph without any additional text or explanations.
        `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    throw error;
  }
}
