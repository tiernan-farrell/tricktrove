"use server";
import { connectToDB } from "../mongoose";
import Clip from "../models/clip.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";

interface ClipProps {
  public_id: string;
  caption: string;
  author: string;
  communityId: string | null;
  path: string;
  tags: string[];
}

interface AddCommentProps {
  clipId: string;
  commentText: string;
  userId: string;
  path: string;
  videoUrl?: string;
}

interface AddLikeToClipProps { 
  clipId: string;
  userId: string;
  path: string; 
}

export async function CreateClip({
  public_id,
  caption,
  author,
  communityId,
  path,
  tags,
}: ClipProps) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 },
    );
    
    const likes: Array<typeof User> = [];
    const createdClip = await Clip.create({
      public_id,
      caption,
      author,
      community: communityIdObject,
      createdAt: Date.now(),
      tags,
      likes,
    });

    await User.findByIdAndUpdate(author, {
      $push: { clips: createdClip._id },
    });

    revalidatePath(path);
  } catch (err: any) {
    console.log(err.message);
    throw new Error(`Error Uploading Clip: ${err.message}`);
  }
}

export async function fetchClips(pageNumber = 1, pageSize = 3) {
  try {
    connectToDB();

    const skipAmt = (pageNumber - 1) * pageSize;
    // Fetch Top Level Clips
    const clipsQuery = Clip.find({ parentId: { $in: [null, undefined] } })
      .skip(skipAmt)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "community",
        model: Community,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });
    // const clipsCount = await Clip.countDocuments({ parentId: { $in: [null, undefined]}})
    const clipsCount = 1;

    const clips = await clipsQuery.exec();

    const isNext = clipsCount > skipAmt + clips.length;
    console.log(clips.map((c) => c.author));
    return { clips, isNext };
  } catch (err: any) {
    throw new Error(`FetchClips ${err.message}`);
  }
}

export async function fetchClipById(id: string) {
  try {
    connectToDB();
    const clip = await Clip.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Clip,
            select: "_id id name parentId image",
          },
        ],
      })
      .exec();

    return clip;
  } catch (err: any) {
    console.log(err);
    throw new Error(`Error fetching thread: ${err.message}`);
  }
}

export async function addCommentToClip({
  clipId,
  commentText,
  userId,
  path,
  videoUrl,
}: AddCommentProps) {
  connectToDB();

  try {
    console.log(userId.substring(1, userId.length - 1));
    // find original clip by id
    const originalClip = await Clip.findById(clipId);

    if (!originalClip) throw new Error("Clip not found");

    const commentClip = new Clip({
      public_id: videoUrl,
      caption: commentText,
      author: userId.substring(1, userId.length - 1),
    });
    const savedCommentClip = await commentClip.save();

    originalClip.children.push(savedCommentClip._id);

    await originalClip.save();

    revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Error Adding Comment to Clip ${err.message}`);
  }
}

export async function getClipsByTag(tag: string) {
  try {
    connectToDB();
    const clips = Clip.find({ tags: { $regex: new RegExp(tag.trim(), "i") } }).exec();

    return clips;
  } catch (err: any) {
    throw new Error(`GetClipsByTag: ${err.message}`);
  }
}


export async function addLikeToClip({
  clipId, 
  userId,
  path,
}: AddLikeToClipProps) { 

  try { 
    connectToDB();

    const clip = await Clip.findById(clipId);
    const user = await User.findById(userId);
    if(!clip) throw new Error(`Cannot find clip with id ${clipId}`);
    if(!user) throw new Error(`Cannot find user with id ${userId}`);


    user.likes.push(clip);
    clip.likes.push(user);
    await user.save();
    await clip.save();


  } catch (err: any) { 
    throw new Error(`AddLikeToClip: ${err.message}`);
  }

  

}

export async function removeLikeFromClip({
  clipId, 
  userId,
  path,
}: AddLikeToClipProps) { 

  try { 
    connectToDB();

    const clip = await Clip.findById(clipId);
    const user = await User.findById(userId);
    if(!clip) throw new Error(`Cannot find clip with id ${clipId}`);
    if(!user) throw new Error(`Cannot find user with id ${userId}`);
    
    
    user.likes.pop(clip);
    clip.likes.pop(user);
    await clip.save();
    await user.save();

  } catch (err: any) { 
    throw new Error(`AddLikeToClip: ${err.message}`);
  }
}