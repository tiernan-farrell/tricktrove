"use server"
import { connectToDB } from "../mongoose";
import Clip from "../models/clip.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";


interface ClipProps { 
    video: string, 
    caption: string,
    author: string,
    communityId: string | null,
    path: string,
}


export async function CreateClip({video, caption, author, communityId, path}: ClipProps) {
    connectToDB();

    const createdClip = await Clip.create({
        video, 
        caption, 
        author, 
        community: null,
    });

    await User.findByIdAndUpdate(author, {
        $push: { clips: createdClip._id }
    })
    
    revalidatePath(path);
}

export async function fetchClips(pageNumber = 1, pageSize = 20) { 
    connectToDB();

    const skipAmt = (pageNumber-1)  * pageSize;
    // Fetch Top Level Clips 
    const clipsQuery = Clip.find({parentId:  { $in: [null, undefined]}})
    .sort({createdAt: 'desc'})
    .skip(skipAmt)
    .limit(pageSize)
    .populate({ path: 'author', model: User})
    .populate({
        path: 'children',
        populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
    })    

    const clipsCount = await Clip.countDocuments({ parentId: { $in: [null, undefined]}})

    const clips = await clipsQuery.exec();

    const isNext = clipsCount > skipAmt+ clips.length;

    return { clips, isNext }
}