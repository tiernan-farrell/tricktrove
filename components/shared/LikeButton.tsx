"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { addLikeToClip, removeLikeFromClip } from "@/lib/actions/clip.actions";
import { usePathname } from "next/navigation";

interface LikeButtonProps
 { 
    userId: string;
    clipId: string;
 }
const LikeButton = ({userId, clipId}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const path = usePathname();

  useEffect(() => {
    console.log(isLiked);
    
  }, [isLiked]);

  const updateLike = async() => { 
    setIsLiked(!isLiked);
    isLiked ? await removeLikeFromClip({userId, clipId, path}) : await addLikeToClip({userId, clipId, path})
  }
  
  return (
    <div className="bg-dark-2 w-12">
      <Button className="bg-dark-2 hover:bg-none" onClick={() => updateLike()}>
        <div className="bg-dark-2 w-6 flex">
          {isLiked ? (
            <Image
              src="/assets/heart-filled.svg"
              alt="heart"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/assets/heart-gray.svg"
              alt="heart"
              width={24}
              height={24}
            />
          )}
        </div>
      </Button>
    </div>
  );
};

export default LikeButton;
