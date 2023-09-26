import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

interface TagCardProps {
  tagName: string;
}

const TagCard = ({ tagName }: TagCardProps) => {
  return (
    <Link href={`/search?q=${tagName}`}>
      <Button
        key={tagName}
        className="flex  items-center gap-3 p-1 rounded-lg  selected-tag bg-primary-500  px-3 ">
        <Image
          src="/assets/whitetag.svg"
          alt="tag"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
        <div className="text-light-1 text-base-bold">

        {tagName}
        </div>
      </Button>
    </Link>
  );
};

export default TagCard;
