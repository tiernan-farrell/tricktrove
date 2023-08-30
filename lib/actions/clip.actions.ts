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
    try { 

        connectToDB();
        
        const createdClip = await Clip.create({
            video, 
            caption, 
            author, 
            community: null,
            createdAt: Date.now()
        });
        
        await User.findByIdAndUpdate(author, {
            $push: { clips: createdClip._id }
        })
        
        revalidatePath(path);
    } catch(err: any) { 
        console.log(err.message);
        throw new Error(`Error Uploading Clip: ${err.message}`);
    }
}

export async function fetchClips(pageNumber = 1, pageSize = 20) { 

    try { 

        connectToDB();

        const skipAmt = (pageNumber-1)  * pageSize;
        // Fetch Top Level Clips 
        const clipsQuery = Clip.find({parentId:  { $in: [null, undefined]}})
        .sort({createdAt: -1})
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
        console.log(`Created at: ${clips[0].createdAt}`)
        
        const isNext = clipsCount > skipAmt+ clips.length;
        
        return { clips, isNext }
    } catch(err: any) { 
        throw new Error(`FetchClips ${err.message}`);
    }
}

export async function fetchClipById(id: string) {
    
    try { 
        connectToDB();
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
                author: userId
            
            })
            const savedCommentClip = await commentClip.save();

            originalClip.children.push(savedCommentClip._id);

            await originalClip.save();

            revalidatePath(path);
        } catch(err: any) { 
            throw new Error(`Error Adding Comment to Clip ${err.message}`);
        }
}