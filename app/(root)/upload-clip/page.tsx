import UploadClip from "@/components/forms/UploadClip";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');
    userInfo._id = userInfo._id.toString();
    return (
        <>
            <h1 className="head-text p-7">Upload Clip</h1>

            <div className="px-24">

                <UploadClip userId={userInfo._id} />
            </div>

        </>
    )
}


export default Page; 