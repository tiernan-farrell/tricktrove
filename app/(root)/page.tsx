import ClipCard from "@/components/cards/ClipCard";
import { fetchClips } from "@/lib/actions/clip.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserButton, currentUser, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const result = await fetchClips(1, 30);

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <section className="mt-9 flex flex-col gap-10 px-5">
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
                public_id={clip.public_id}
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
  );
}
