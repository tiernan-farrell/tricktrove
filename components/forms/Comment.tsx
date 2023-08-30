"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";

// import { updateUser } from "@/lib/actions/user.actions";
import { CommentValidation } from "@/lib/validations/clip";
import { addCommentToClip } from "@/lib/actions/clip.actions";
// import { CreateClip } from "@/lib/actions/clip.actions";




interface CommentProps { 
    clipId: string; 
    currentUserImg: string; 
    currentUserId: string;
}



const Comment =  ({clipId, currentUserImg, currentUserId}: CommentProps) => { 
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("mediaPost");
    const router = useRouter();
    const pathname  = usePathname();
    
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: { 
            video: '',
            comment: '',
            accountId: currentUserId,
        }
    })


    const handleVideo = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();
    
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setFiles(Array.from(e.target.files));
    
          if (!file.type.includes("video")) return;
    
          fileReader.onload = async (event) => {
            const clipDataUrl = event.target?.result?.toString() || "";
            fieldChange(clipDataUrl);
          };
    
          fileReader.readAsDataURL(file);
        }
    }


    const onSubmit = async(values: z.infer<typeof CommentValidation>) => {
        if (values.video) { 
            const blob = values.video;    
            const vidRes = await startUpload(files);
            
            
            if (vidRes && vidRes[0].fileUrl) { 
                values.video = vidRes[0].fileUrl;
            }
        }
            await addCommentToClip({
                clipId,
                commentText: values.comment, 
                userId: currentUserId,
                path: pathname,
                videoUrl: values.video, 
            })
    }


    return (
        <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="comment-form"
        >
        
        
        <FormField
          control={form.control}
          name='video'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
               <Image
                    src={currentUserImg}
                    alt="Profile Image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='video/*'
                  placeholder='Add video clip'
                  className='account-form_image-input'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleVideo(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        

         <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Comment
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder="Comment..."
                  className="no-focus text-dark-1 outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          Comment
        </Button>
        </form>
      </Form>

    )
}


export default Comment; 