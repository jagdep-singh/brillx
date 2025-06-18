import Image from "next/image";
import { getCompanion } from "@/lib/actions/companion.action";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CompanionComponent from "@/components/CompanionComponent";

interface CompanionSessionPageProps{
    params: Promise<{id: string}>
}


const ComapnionSession = async ({params}: CompanionSessionPageProps) => {

    const {id} = await params;
    const companion = await getCompanion(id);
    const user = await currentUser()

    const {name, subject, title, topic, duration} = companion;

    if(!user) redirect('/sign-in');
    if(!name) redirect('/companions');


    return (
        
            
            <CompanionComponent 
                {...companion}

                companionId = {id}
                userName = {user.firstName!}
                userImage={user.imageUrl!}
            />
        
        
    )
}

export default ComapnionSession
