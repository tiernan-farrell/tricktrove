import { fetchUserPosts } from "@/lib/actions/user.actions";
import User from "@/lib/models/user.model";
import { secureHeapUsed } from "crypto";
import { redirect } from "next/navigation";
import ClipCard from "../cards/ClipCard";


export interface Result {
    name: string;
    image: string;
    id: string;
    clips: {
      _id: string;
      video: string;
      parentId: string | null;
      author: {
        name: string;
        image: string;
        id: string;
      };
      community: {
        id: string;
        name: string;
        image: string;
      } | null;
      createdAt: string;
      children: {
        author: {
          image: string;
        };
      }[];
    }[];
  }
  


interface ClipsTabProps { 
    currentUserId: string,
    accountId: string,
    accountType: string
}


const ClipsTab = async({
    currentUserId, 
    accountId, 
    accountType
}: ClipsTabProps) => { 
    
    let res = await fetchUserPosts(accountId);
    console.log(res)
    if (!res) {
        redirect("/");
    }
    return (
        <section className="mt-9 flex flex-col gap-10">
            {res.clips.map((clip: any) => (
                <ClipCard
                    key={clip._id}
                    id={clip._id}
                    currentUserId={currentUserId}
                    parentId={clip.parentId}
                    content={clip.content}
                    caption={clip.caption}
                    author={
                        accountType === 'User'
                        ? { name: res.name, image: res.image, id: res.id }
                        : { name: clip.author.name, image: clip.author.image, id: clip.author.id 
                        }
                    }
                    community={clip.community}
                    createdAt={clip.createdAt}
                    comments={clip.children}
                />
            ))}

        </section>
    )
}

export default ClipsTab;