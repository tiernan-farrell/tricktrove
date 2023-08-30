import Image from "next/image";
import { profileTabs } from "@/constants"

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";

const Page = async () => { 
    
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    // fetch users
    const result = await fetchUsers( { 
        userId: user.id,
        searchString: '', 
        pageNumber: 1, 
        pageSize: 25,
        sortBy: -1
    })
    
    return (
        <section className="relative left-32">
            <h1 className="head-text">Search</h1>
            {/* Search Bar */}

            <div className="mt-14 flex flex-full gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No Users Found</p>
                    )
                    : (
                        <>
                        {result.users.map((user) => (
                            <UserCard
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imgUrl={user.image}
                                bio={user.bio}
                                personType='User'
                            />
                        ))}
                        </>
                    )
                }

            </div>
        </section>
    )
}

export default Page; 