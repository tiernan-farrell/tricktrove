"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { ClipValidation } from "@/lib/validations/clip";
import { CreateClip } from "@/lib/actions/clip.actions";
import { getRandomValues } from "crypto";

interface UploadClipProps { 
    userId: string, 
    btnTitle: string
}

const UploadClip = ({userId, btnTitle}: UploadClipProps) => { 
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("videoUploader");
    const router = useRouter();
    const pathname  = usePathname();


    const form = useForm({
        resolver: zodResolver(ClipValidation),
        defaultValues: { 
            video: '',
            caption: '',
            author: userId || "",
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


    const onSubmit = async(values: z.infer<typeof ClipValidation>) => {
        const blob = values.video;
        const vidRes = await startUpload(files);
            

        if (vidRes && vidRes[0].fileUrl) { 
            values.video = vidRes[0].fileUrl;
        }
        await CreateClip({
            video: values.video, 
            caption: values.caption, 
            author: userId,
            communityId: null, 
            path: pathname
        })
        router.push('/')
    }


    return (
        <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-start gap-10"
        >
        
        
        <FormField
          control={form.control}
          name='video'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {/* {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )} */}
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
          name='caption'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Caption
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          {btnTitle}
        </Button>
        </form>
      </Form>
    )
}

export default UploadClip;