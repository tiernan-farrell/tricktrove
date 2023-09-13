import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs";


const f = createUploadthing();

const getUser = async () => await currentUser();

export const ourFileRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async (req) => {
      // This code runs on your server before upload
      const user = await getUser();

      // If you throw, the user will not be able to upload
      // if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

    }),
 
  // This route takes an attached image OR video
  messageAttachment: f(["image", "video"])
     .middleware(async (req) => {
      // This code runs on your server before upload
      const user = await getUser();
 
      // If you throw, the user will not be able to upload
      // if (!user) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
 
    }),
 
  // Takes ONE image up to 2MB
  strictImageAttachment: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
     .middleware(async (req) => {
      // This code runs on your server before upload
      const user = await getUser();
 
      // If you throw, the user will not be able to upload
      // if (!user) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
 
    }),

 
  // Takes a 4 2mb images and/or 1 256mb video
  mediaPost: f({
    image: { maxFileSize: "2MB", maxFileCount: 4 },
    video: { maxFileSize: "256MB", maxFileCount: 1 },
  })
     .middleware(async (req) => {
      // This code runs on your server before upload
      const user = await getUser();
 
      // If you throw, the user will not be able to upload
      // if (!user) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log(`File uploaded: ${file}`);
 

    }),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;