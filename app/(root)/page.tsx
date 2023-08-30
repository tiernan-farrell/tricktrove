import ClipCard from "@/components/cards/ClipCard";
import { fetchClips } from "@/lib/actions/clip.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  const result = await fetchClips(1, 30);


  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  
  return (
    <>

      <section className="mt-9 flex flex-col gap-10">
        {result.clips.length === 0 ? (
          <p className="no-result">No Clips Found</p>
        ) : (
          <>
            {result.clips.map((clip) => (
              <ClipCard
                key={clip._id}
                id={clip._id}
                currentUserId={user?.id || ""}
                parentId={clip.parentId}
                content={clip.video}
                caption={clip.caption}
                author={clip.author}
                community={clip.community}
                createdAt={clip.createdAt}
                comments={clip.children}
              />
            ))}
          </>
        )}

      </section>
    </>
    
  )
}
