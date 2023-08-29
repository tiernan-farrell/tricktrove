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

interface AddCommentProps { 
    clipId: string,
    commentText: string,
    userId: string,
    path: string,
    videoUrl: string,
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

export async function fetchClipById(id: string) {
    connectToDB();
    
    try { 
        const clip = await Clip.findById(id)
        .populate({
            path: 'author',
            model: User, 
            select: "_id id name image"
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User, 
                    select: "_id id name parentId image"
                }, 
                {
                    path: 'children',
                    model: Clip,
                    select: "_id id name parentId image"
                }
            ]
        }).exec();

        return clip;
    }catch (err: any) { 
        console.log(err);
        throw new Error(`Error fetching thread: ${err.message}`);
    }
}

export async function addCommentToClip(
    {
        clipId,
        commentText,
        userId, 
        path,
        videoUrl
    }: AddCommentProps) { 
        connectToDB();

        try {

            // find original clip by id
            const originalClip = await Clip.findById(clipId);

            if (!originalClip) throw new Error("Clip not found");

            const commentClip = new Clip({
                video: videoUrl,
                caption: commentText,
                author: userId.substring(1, userId.length-1)
            
            })
            const savedCommentClip = await commentClip.save();

            originalClip.children.push(savedCommentClip._id);

            await originalClip.save();

            revalidatePath(path);
        } catch(err: any) { 
            throw new Error(`Error Adding Comment to Clip ${err.message}`);
        }
}