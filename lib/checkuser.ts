import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { DbClient } from "@/db/dbClient";
import { getServerSession } from "next-auth";

export async function checkUser() {
    
    try {
        const session = await getServerSession(authOptions);
        console.log("session : ",session);
        
        if(!session?.user){
            return null;
        }
    
        const foundUser = await DbClient.user.findUnique({
            where:{
                email : session.user.email!
            }
        })
    
        if(foundUser){
            return foundUser
        }
    
        const newUserEntry = await DbClient.user.create({
            data: {
                name : session.user.name,       // name and image is optional, no need for fallback
                email : session.user.email!,
                imageUrl : session.user.image
            }
        })
    
        return newUserEntry;
        
    } catch (error) {
        if(error instanceof Error) console.error(error.message);
        else console.error("unexpected ERR:", error);
        
        throw error;
    }

}