

import Image from "next/image";
import Link from "next/link";
import React from 'react'
import ReactPlayer from 'react-player'



interface ClipCardProps { 
    id: string;
    currentUserId: string; 
    parentId: string | null;
    content: string;
    caption: string;
    author: {
        name: string; 
        image: string; 
        id: string;
    }
    community: { 
        id: string; 
        name: string; 
        image: string; 
    } | null;
    createdAt: string; 
    comments: {
        authors: {
            image: string; 
        }
    }[]
    isComment?: boolean;
}



const ClipCard = ({
    id,
    currentUserId,
    parentId,
    content,
    caption,
    author,
    community,
    createdAt,
    comments,
    isComment, 
    }: ClipCardProps) => {
        const blob = new Blob([content], { type: 'video/quicktime' });
        const videoUrl = URL.createObjectURL(blob);
        return (

            <article className="flex w-full flex-col rounded-xl bg-dark-2 p-7 mt-7">
                <div className="flex items-start justify-between">
                    <div className="flex w-full flex-1 flex-row gap-4">
                        <div className="flex flex-col items-center">
                            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                                <Image 
                                    src={author.image}
                                    alt="Profile Image"
                                    fill
                                    className="cursor-pointer rounded-full"
                                />
                            </Link>
                        <div className="thread-card_bar" /> 
                        </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                        </Link>
                        {/* TODO: Implement video display here */}
                        <video controls autoPlay src={videoUrl}>
                            <source src={videoUrl} type="video/quicktime" />
                            Your browser does not support the video tag.
                        </video>

                        <p className="mt-2 text-small-regular text-light-2">{caption}</p>

                        <div className="mt-5 flex flex-col gap-3">
                            <div className="flex gap-3.5">
                                <Image
                                    src='/assets/heart-gray.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                <Link href={`/clip/${id}`}>
                                <Image
                                    src='/assets/reply.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                </Link>
                                <Image
                                    src='/assets/repost.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                <Image
                                    src='/assets/share.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                            </div>
                        </div>
                        </div>
                            {!isComment && comments.length > 0 && (
                            <div className='ml-1 mt-3 flex items-center gap-2'>
                            {comments.slice(0, 2).map((comment, index) => (
                                <Image
                                key={index}
                                src={author.image}
                                alt={`user_${index}`}
                                width={24}
                                height={24}
                                className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
                                />
                            ))}
                                <Link href={`/clip/${id}`}>
                                <p className='mt-1 text-subtle-medium text-gray-1'>
                                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                                </p>
                                </Link>
                            </div>
                            )}
                    </div>
                    </div>
            </article>
        )
}

export default ClipCard;