"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Clip from "../models/clip.model";
import Community from "../models/community.model";

import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";


interface UpdateUserProps {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
interface FetchUserProps {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUserProps): Promise<void> {
  try {
    console.log("Conntecting to DB from: update User");
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      { upsert: true },
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (err: any) {
    throw new Error("Failed to create/update user: ${err.message}");
  }
}



export async function fetchUser(userId: string) {
  try {
    console.log("Conntecting to DB from: fetch User");
    connectToDB();
    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (err: any) {
    throw new Error(`Failed to fetch user: ${err.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    console.log("Conntecting to DB from: fetchUserPosts");
    connectToDB();

    // Find all clips with the auther of user for given userId
    const clips = await User.findOne({ id: userId })
      .populate({
        path: "clips",
        model: Clip,
        populate: [
          {
            path: "community",
            model: Community,
            select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
          },
          {
            path: "children",
            model: Clip,
            populate: {
              path: "author",
              model: User,
              select: "name image id",
            },
          },
        ],
      })
      .sort({ createdAt: -1 });

    return clips;
  } catch (err: any) {
    throw new Error(`Error while fetching users posts ${err.message}`);
  }
}

export async function fetchUserByUserName(userName:string) {
  try {   
    connectToDB();
    const user = await User.findOne({ username: userName });
    console.log(user);
    return user;

  } catch (err: any) {
    throw new Error(`Error while fetching users posts ${err.message}`);
  } 
}


export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 5,
  sortBy = -1,
}: FetchUserProps) {
  try {
    console.log("Conntecting to DB from: fetchUsers");
    connectToDB();
    console.log(`uri: ${process.env.MONGODB_URI}`);
    const skipAmt = (pageNumber - 1) * pageSize;
    console.log(120);

    const regex = new RegExp(searchString, "i");

    console.log(124);
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    console.log(129);
    if (searchString.trim() !== "") {
      console.log(131);
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }
    console.log(137);

    const sortOptions = { createdAt: sortBy };
    console.log(140);

    const userQuery = User.find(query).skip(skipAmt).limit(pageSize);
    console.log(143);

    // const userCount = await User.countDocuments(query);
    const userCount = 1;
    console.log(147);

    console.log(userQuery)
    const users = await userQuery.exec();
    console.log(150);

    const isNext = userCount > skipAmt + users.length;
    console.log(153);
    return { users, isNext };
  } catch (err: any) {
    throw new Error(`Error Fetching Users ${err.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    console.log("Conntecting to DB from: getActivity");
    connectToDB();

    // Find all threads created by the user
    const userClips = await Clip.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userClips.reduce((acc, userClip) => {
      return acc.concat(userClip.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Clip.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (err: any) {
    console.error("Error fetching replies: ", err);
    throw new Error(`Error fetching Activity ${err.message}`);
  }
}

export async function searchUsers(searchString: string) {
  try {
    connectToDB();
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {};

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const userQuery = User.find(query);

    const users = await userQuery.exec();
    return users;
  } catch (err: any) {
    throw new Error(`SearchUsers: ${err.message}`);
  }
}
export async function getLikedClips(userId: string) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Find the clips that the user has liked
    const likedClips = await Clip.find({ _id: { $in: user.likes } });

    return likedClips;
  } catch (err: any) {
    console.error("Error getting liked clips: ", err);
    throw new Error(`Error getting liked clips ${err.message}`);
  }
}
