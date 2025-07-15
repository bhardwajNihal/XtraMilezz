"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { DbClient } from "@/db/dbClient";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface onboardingFormDatatype {
  industry: string;
  bio?: string | undefined;
  skills: string[] | undefined;
  experience: number;
}

export async function onboardUser(data: onboardingFormDatatype) {
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

  try {
    // initiate transaction

    const result = await DbClient.$transaction(
      // - check if the industry insight exists for the given industry

      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

    //if not create new one, ai generated
        if (!industryInsight) {
          // fetching ai insights later
          // const insights = await generateAIInsights(data.industry);

          // creating dummy insight to provide to the db, with default values
          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              salaryRanges: [],
              marketOutlook: "NEUTRAL",
              demandLevel: "MEDIUM",
              keyTrends: [],
              growthRate: 0,
              topSkills: [],
              recommendedSkills: [],
              nextUpdate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            },
          });
        }

  // update user table with complete details
        const updatedUser = await tx.user.update({

            where: {
                id : foundUser.id
            },
            data : {
                industry : data.industry,
                bio : data.bio,
                experience : data.experience,
                skills : data.skills
            }
        })
          return {industryInsight, updatedUser};
      },
      
    );

    revalidatePath("/");
    return result.updatedUser;

  } catch (error) {
    throw error;
  }
}


export async function getUserOnboardingStatus() {
    
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

  try {
    
    const user = await DbClient.user.findUnique({
        where : {
            id : foundUser.id
        },
        select:{
            industry : true,
        }
    })

    return {Onboarded : !!user?.industry}   // converts to boolean value, if industry found in users table means it onboarded 

  } catch (error) {
   throw error; 
  }
    
}