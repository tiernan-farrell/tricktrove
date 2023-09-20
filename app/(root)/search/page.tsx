
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/SearchBar";


const Page = async () => {
  const user = await currentUser();
  if (!user) return null;


  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
    sortBy: -1,
  });

  return (
    <section className="relative px-6">
      <h1 className="head-text">Search</h1>

      <div className="mt-5">
        <Searchbar routeType="search" />
      </div>
    </section>
  );
};

export default Page;