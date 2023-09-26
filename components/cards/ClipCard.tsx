import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import VideoAutoPlay from "../shared/VideoAutoPlay";
import VideoPlayer from "../shared/VideoPlayer";
import TagCard from "../shared/TagCard";
import LikeButton from "../shared/LikeButton";

interface ClipCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  public_id: string;
  caption: string;
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
  comments: {
    authors: {
      image: string;
    };
  }[];
  isComment?: boolean;
  tags: string[];
}

3;
const ClipCard = ({
  id,
  currentUserId,
  parentId,
  public_id,
  caption,
  author,
  community,
  createdAt,
  comments,
  isComment,
  tags,
}: ClipCardProps) => {
  // console.log(`Community: ${community}`);

  const dateString = JSON.stringify(createdAt);
  const inputDate = new Date(dateString?.substring(1, dateString.length - 1));

  const date = inputDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZoneName: "short",
  });

  return (
    <>
      <article className="flex w-full flex-col rounded-xl bg-dark-2 lg:p-10 md:p-6 sm:p-2 gap-10">
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-1 flex-row gap-4">
            <div className="flex flex-col items-center">
              <Link
                href={`/profile/${author.id}`}
                className="relative h-11 w-11">
                <Image
                  src={author.image}
                  alt="Profile Image"
                  fill
                  className="cursor-pointer rounded-full"
                />
              </Link>
            </div>
            <div className="thread-card_bar" />
            <div className="flex w-full flex-col">
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-light-1">
                  {author.name}
                </h4>
              </Link>
         
              <div className="flex w-300 h-300">
                <VideoPlayer id={public_id} />
                {/* <video  controls  playsInline  loop preload="auto" src={`${process.env.AWS_CLOUDFRONT_DOMANIN_NAME}busStationNoseslide.mp4`}/> */}
              </div>
              <VideoAutoPlay />
              {/* <ReactPlayer url={content}/> */}
              <p className="mt-2 text-small-regular text-light-2">{date}</p>

              {/* TODO: Display Video Tags Here  */}
              <div className="flex gap-2 flex-wrap">
                {tags?.map((tag) => <TagCard key={tag} tagName={tag} />)}
              </div>
                   <div>
                <p className="mt-2 text-small-regular text-light-2">
                  {caption}
                </p>
              </div>


              {!isComment && community && (
                <Link
                  href={`/communities/${community.id}`}
                  className="mt-5 flex items-center">
                  <p className="text-subtle-medium text-gray-1">
                    {date}
                    {community && ` - ${community.name} Community`}
                  </p>
                  <Image
                    src={community.image}
                    alt={community.name}
                    width={14}
                    height={14}
                    className="ml-1 rounded-full object-cover"
                  />
                </Link>
              )}

              <div className="mt-5 flex flex-col gap-3">
                <div className="flex items-center gap-3.5">
                <LikeButton clipId={id} userId={currentUserId} />
                  <Link href={`/clip/${id}`}>
                    <Image
                      src="/assets/reply.svg"
                      alt="heart"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                  <Image
                    src="/assets/repost.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <Image
                    src="/assets/share.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </div>
              </div>
            </div>
            {!isComment && comments.length > 0 && (
              <div className="ml-1 mt-3 flex items-center gap-2">
                {comments.slice(0, 2).map((comment, index) => (
                  <Image
                    key={index}
                    src={author.image}
                    alt={`user_${index}`}
                    width={24}
                    height={24}
                    className={`${
                      index !== 0 && "-ml-5"
                    } rounded-full object-cover`}
                  />
                ))}
                <Link href={`/clip/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default ClipCard;
