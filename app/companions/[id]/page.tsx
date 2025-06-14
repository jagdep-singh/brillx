import Image from "next/image";
import { getCompanion } from "@/lib/actions/companion.action";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface CompanionSessionPageProps{
    params: Promise<{id: string}>
}


const ComapnionSession = async ({params}: CompanionSessionPageProps) => {

    const {id} = await params;
    const {name, subject, title, topic, duration} = await getCompanion(id);
    const user = await currentUser()

    if(!user) redirect('/sign-in');
    if(!name) redirect('/companions');


    return (
        <main>
            <article className="flex rounded-border justify-between p-6 max-md:flex-col">
                <div className="flex items-center gap-2">
                    <div className="size-[72] flex items-center justify-center rounded-lg maax-md:hidden" style={{backgroundColor:getSubjectColor(subject)}}>
                        <Image src={`/icon/${subject}.svg`} alt={subject} width={35} height={35}></Image>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-2xl">
                                {name}
                            </p>
                            <div className="subject-badge max-sm:hidden">
                                {subject}
                            </div>
                        </div>
                        <p className="text-lg">{topic}</p>
                    </div>
                </div>
                <div className="items-start text-2xl max-md:hidden">
                </div>
            </article>
        </main>
        
    )
}

export default ComapnionSession
