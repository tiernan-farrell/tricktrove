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
  const start = Date.now();
  // fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
    sortBy: -1,
  });

  const end = Date.now();
  console.log(`Execution time: ${end - start} ms`);

  return (
    <section className="relative px-6 py-7 mt-28">
      <h1 className="head-text">Search</h1>

      <div className="mt-5">
        <Searchbar routeType="search" />
      </div>
    </section>
  );
};

export default Page;
