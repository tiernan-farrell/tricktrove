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