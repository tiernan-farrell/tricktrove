"use client";

import * as z from "zod";
import Image from "next/image";

import { CldUploadButton } from "next-cloudinary";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
import { CreateClip } from "@/lib/actions/clip.actions";
import { useOrganization } from "@clerk/nextjs";


interface UploadClipProps {
  userId: string;
}

const UploadClip = ({ userId }: UploadClipProps) => {
  const [public_id, setPublic_id] = useState("");
  const [fileName, setFileName] = useState("");
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(ClipValidation),
    defaultValues: {
      public_id: "",
      caption: "",
      author: userId || "",
      tags: selectedTags,
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    // You can implement logic here to filter suggested tags based on user input.
  };

  const handleTagClick = (tag: string) => {
    console.log("hello");
    setSelectedTags([...selectedTags, tag]);
    console.log(selectedTags);
    setInputValue("");
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updatedTags);
  };

  const handleInputBlur = () => {
    // Logic to add a new tag if the user typed a new one.
    if (inputValue.trim() !== "") {
      const newTag: string = inputValue.trim();
      console.log(newTag);
      setSuggestedTags([...suggestedTags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
      console.log(selectedTags);
      setInputValue("");
    }
  };

  const onSubmit = async (values: z.infer<typeof ClipValidation>) => {
    values.publicId = public_id;
    console.log(selectedTags);
    try {
      await CreateClip({
        public_id: public_id,
        caption: values.caption,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
        tags: selectedTags,
      });
    } catch (err: any) {
      throw new Error(`Error; ${err.message}`);
    }
    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="public_id"
          render={() => (
            <FormItem className="flex justify-between">
              <FormLabel className="account-form_image-label"></FormLabel>
              {public_id === "" ? (
                <div className="text-light-2 text-center self-center">
                  Upload a new clip
                </div>
              ) : (
                <div>{public_id}</div>
              )}
              <FormControl className="flex text-base-semibold text-gray-200  ">
                {public_id === "" ? (
                  <CldUploadButton
                    onUpload={(result: any) => {
                      console.log(result);
                      const id = result?.info?.public_id;
                      const name = result?.info?.original_filename;
                      id?.length > 0
                        ? setPublic_id(id)
                        : console.log(`error ${result.event}`);
                      name
                        ? setFileName(name)
                        : console.log(`No File Name Found`);
                    }}
                    uploadPreset="c2tvnwd4">
                    <div className="flex flex-col  p-5 bg-primary-500 text-light-1 text-heading3-bold rounded-lg">
                      Upload
                    </div>
                  </CldUploadButton>
                ) : (
                  <div className="text-large flex align-center w-screen space-between gap-10 p-5 ">
                    Selected video: {fileName}
                    <div className="w-20 h-10 bg-primary-500 rounded-lg  flex">
                      <Button onClick={() => setPublic_id("")}>Delete</Button>
                    </div>
                  </div>
                )}
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Caption
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Tags
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                >
               <Button type="button" onClick={(e) => console.log(e)} >
                  Add Tag
                </Button>
                </Input>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div>
          <div className="tag-input flex flex-row gap-2">
            <input
              type="text"
              className="bg-dark-2 text-light-2 rounded-lg w-full h-12 mb-5"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Add tags..."
            />
            <Button
              type="submit"
              onSubmit={(e) => console.log(e)}
              className="focus:bg-primary-500 hover:bg-primary-500 h-12 rounded-lg bg-dark-2">
              Add
            </Button>
          </div>
          <div className="selected-tags flex gap-5 bg-dark-1  flex-wrap rouned-lg w-fit mb-3">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="flex  items-center gap-3 p-1 rounded-lg  selected-tag bg-primary-500 text-light-1 text-base-bold px-3 ">
                <Image
                  src="/assets/whitetag.svg"
                  alt="tag"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                {tag}
                <Button
                  onClick={() => handleRemoveTag(tag)}
                  className=" text-light-1 bg-primary-500 p-0 ">
                  X
                </Button>
              </div>
            ))}
          </div>

          <div className="tag-suggestions">
            {suggestedTags.map((tag) => (
              <div
                key={tag}
                className="suggested-tag"
                onClick={() => handleTagClick(tag)}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="hover:bg-primary-500 bg-dark-2">
          Post Clip
        </Button>
      </form>
    </Form>
  );
};

export default UploadClip;
