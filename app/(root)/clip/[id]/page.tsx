import ClipCard from "@/components/cards/ClipCard";
import Comment from "@/components/forms/Comment";
import { fetchClipById } from "@/lib/actions/clip.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const clip = await fetchClipById(params.id);
  userInfo._id = userInfo._id.toString();
  return (
    <section className="relative">
      <div>
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
      </div>

      <div className="mt-10">
        {clip.children.map((c: any) => (
          <ClipCard
            key={c._id}
            id={c._id}
            currentUserId={user?.id || ""}
            parentId={c.parentId}
            public_id={c.public_id}
            caption={c.caption}
            author={c.author}
            community={c.community}
            createdAt={c.createdAt}
            comments={c.children}
            isComment
          />
        ))}
      </div>
      <div className="mt-7">
        <Comment
          clipId={clip.id}
          currentUserImg={user.imageUrl}
          currentUserId={userInfo._id}
        />
      </div>
    </section>
  );
};
export default Page;
