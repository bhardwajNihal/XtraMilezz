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

interface questionType {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string
}

export async function assessQuiz({questions,answers}: {questions:questionType[]|null, answers:string[]}) {
  
  if(questions==null) return;
  
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

  // calculating quizScore
  let quizScore:number = 0;

  questions.map((ques,idx) => {
    if(ques.correctAnswer == answers[idx]) quizScore = quizScore+1;
  })

  const quizResult = questions.map((ques,idx) => {

    return {
      question : ques.question,
      answer : ques.correctAnswer,
      userAnswer : answers[idx],
      isCorrect : ques.correctAnswer == answers[idx],
      explanation : ques.explanation
    }
  })
  
  // improvement tip to be ai generated
  
    // getting all the wrong answers
    const wrongAnswers = quizResult.filter(q => q.isCorrect===false);

    let improvementTip = null;

    if(wrongAnswers.length>0){

      const wrongAnsText = wrongAnswers.map(q => `
        Question: ${q.question}\n Correct Answer: ${q.answer}\n User Answer: ${q.userAnswer}
        `)
        .join("\n\n");    // will join the array texts to a single string, adding newline

    // creating prompt
      const improvementPrompt = `
      The user took a mock technical interview for the domain${foundUser.industry},
      and got the following questions wrong:
      ${wrongAnsText}.

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
    
    // generate tip
    try {
      const tipGenerated = await model.generateContent(improvementPrompt);
      improvementTip = tipGenerated.response.text().trim();

    } catch (error) {
      throw error;
    }
    }

    // finally making entry to db
    try {
      const assessment = await DbClient.assessment.create({
        data: {
          userId : foundUser.id,
          quizScore,
          questions : quizResult,
          category : "technical",
          improvementTip
        }
      })

      return assessment;

    } catch (error) {
      throw error;
    }

}