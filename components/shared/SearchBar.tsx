"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Children, FormEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchType } from "@/lib/types/types";
import { searchUsers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";

interface Props {
  routeType: string;
}


function Searchbar({ routeType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSearchType, setSelectedSearchType] = useState<SearchType>('Users');
  const [results, setResults] = useState<any>([]);
  const searchOptions: SearchType[] = ['Users', 'Communities', 'Trick Tags'];

  const handleButtonClick = (option: SearchType) => {
    setSelectedSearchType(option);
    // Perform any other actions you need when a button is clicked
  };


  const handleSearch = async() => { 
    // switch (selectedSearchType) { 
    //   case 'Users':
    //     await fetchUsers()
    //     break;

    //   case 'Communities': 

    //     break;

    //   case 'Trick Tags': 

    //     break;
    // }

    const res = await searchUsers(search);
    setResults(res);
    console.log(res)
    console.log(`search: ${search}`)
    console.log(`search type: ${selectedSearchType}`)
  }


  
  return (
    <>
    <div className="flex gap-2 pb-2">
      {searchOptions.map((option) => (
        <Button key={option} onClick={() => handleButtonClick(option)}
        className={`${
          selectedSearchType === option ? 'active-search-button' : 'search-button'
        } `} >
            {option}
        </Button>
      ))}

    </div>
      <div className="searchbar">
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain"
        />
        <Input
          id="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${selectedSearchType}`}
          className="no-focus searchbar_input"
        />
        <Button onClick={handleSearch} >Search</Button>
      </div>
      <div className="flex mt-10 gap-3 flex-wrap" >
            {results.length > 0 ?
            (
              results.map((user: any) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                bio={user.bio}
                personType="User"
              />
            ))) : 
            (<div className="text-light-1">No users found</div>)}
      </div>


    </>
  );
}

export default Searchbar;
