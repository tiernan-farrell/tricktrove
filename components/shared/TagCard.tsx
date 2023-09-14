import React from 'react'
import Image from 'next/image';

interface TagCardProps { 
    tagName:string;
}

const TagCard = ({tagName}: TagCardProps) => {
  return (
              <div
                key={tagName}
                className="flex  items-center gap-3 p-1 rounded-lg  selected-tag bg-primary-500 text-light-1 text-base-bold px-3 ">
                <Image
                  src="/assets/whitetag.svg"
                  alt="tag"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                {tagName}
              </div>
  )
}

export default TagCard