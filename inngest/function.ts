import { inngest } from "./client";
import { DbClient } from "@/db/dbClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

// setup gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateWeeklyInsights = inngest.createFunction(
  {
    id: "xtramilezz-weekly-industry-insights",
    name: "xtramilezz-weekly-industry-insights",
  },
  {
    cron: "0 0 * * 0", // cron will run, every sunday, 00:00
  },

  // define recurring functions to be run weekly

  async ({ step }) => {
    // fetch all industries from the db
    const industries = await step.run("fetch-industries", async () => {
      return await DbClient.industryInsight.findMany({
        select: {
          industry: true, // select only the industry field, to be used in the prompt
        },
      });
    });

    //once industries are fetched from db
    // loop through it
    // generate ai insights from it
    // update db
    for (const { industry } of industries) {
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

      // A special helper provided by Inngest for running LLMs (like OpenAI aor Gemini) in a safe, observable, retryable way.
      const res = await step.ai.wrap(
        "gemini", // string identifier — the name of the AI provider we are using
        // A function that runs the actual Gemini call using the prompt (p).
        async (p) => {
          return await model.generateContent(p);
        },
        prompt //actual prompt that gets passed into the function as p
      );

      // now extract the text from the res
      // extracting parts
      const parts = res?.response?.candidates?.[0]?.content?.parts;

      // extracting text from the parts array
      // directly : const text = res?.response?.candidates?.[0]?.content?.parts[0].text --> was throwing err
      // typescript wasn't sure if the part will necessarily have a text part
      // so, typesafe manner to extract text
      const textPart = parts?.find(
        (part): part is { text: string } =>
          typeof part === "object" && "text" in part
      );

      const text = textPart?.text;
      if (!text) {
        throw new Error("gemini didn't return a valid text part!");
      }

      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      // converting string to valid json
      const finalInsight = JSON.parse(cleanedText);

                // console.log("-----------gemini response----------",cleanedText);
                
                // await step.run("log-gemini-output", async () => {
                //   console.log("Gemini response for:", industry);
                //   console.log(text);
                // });

      // got the insights
      // finally update the db
      await step.run(`update ${industry} insights`, async () => {
        await DbClient.industryInsight.update({
          where: {
            industry,
          },
          data: {
            ...finalInsight,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        });
      });
    }
  }
);
