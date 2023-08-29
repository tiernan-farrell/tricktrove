import UploadClip from "@/components/forms/UploadClip";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    // if(!userInfo?.onbarded) redirect('/onboarding');

    return (
        <>

            <div className="px-24">
                <UploadClip userId={userInfo._id} btnTitle="Upload Clip" />
            </div>

        </>
    )
}


export default Page; 