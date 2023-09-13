"use client";

import * as z from "zod";
import { CldUploadButton } from 'next-cloudinary';
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useState} from "react";
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
import { Input } from "@/components/ui/input";
import { ClipValidation } from "@/lib/validations/clip";
import { CreateClip} from "@/lib/actions/clip.actions";
import { useOrganization } from "@clerk/nextjs";



interface UploadClipProps { 
    userId: string, 
}


const UploadClip = ({userId}: UploadClipProps) => { 
  const [public_id, setPublic_id] = useState('');
  const [fileName, setFileName] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  
  const form = useForm({
        resolver: zodResolver(ClipValidation),
        defaultValues: { 
            public_id: '',
            caption: '',
            author: userId || "",
        }
    })

    const onSubmit = async (values: z.infer<typeof ClipValidation>) => {
      values.publicId = public_id
   
        try  { 
          await CreateClip({
            public_id: public_id, 
            caption: values.caption, 
            author: userId,
            communityId: organization ? organization.id : null, 
            path: pathname
          })
        }
        catch(err: any ) { 
          throw new Error(`Error; ${err.message}`);
        }
          router.push('/')
    }
      

    return (
      
        <Form {...form}>
          <form
          className='mt-10 flex flex-col justify-start gap-10'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='public_id'
            render={() => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
              </FormLabel>
               <FormControl className='flex-1 text-base-semibold text-gray-200'>
                    {public_id === '' ? 
                    (<CldUploadButton 
                    onUpload={(result: any) => { 
                      console.log(result);
                      const id = result?.info?.public_id;
                      const name= result?.info?.original_filename;
                      id?.length > 0 ? setPublic_id(id) :  console.log(`error ${result.event}`)
                      name ? setFileName(name) : console.log(`No File Name Found`)
                    }}
                    uploadPreset="c2tvnwd4" 
                  > 
                    <div className="flex flex-col p-7 bg-primary-500 text-light-1 h-30 w-100 text-large text-heading3-bold rounded-lg ">Upload</div>
                  </CldUploadButton>)
                  : (<div className="text-large flex align-center w-screen space-between gap-10 p-5 ">
                    Selected video: {fileName}
                    <div className="w-20 h-10 bg-primary-500 rounded-lg  flex">
                      <Button onClick={() => setPublic_id('')}> 
                      Delete
                      </Button>
                    </div>
                  </div>)
                  }
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
          Post Clip
          </Button>
      </form>
    </Form>
  
    )

}

export default UploadClip;