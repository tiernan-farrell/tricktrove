"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { CommentValidation } from "@/lib/validations/clip";
import { addCommentToClip } from "@/lib/actions/clip.actions";

interface CommentProps {
  clipId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ clipId, currentUserImg, currentUserId }: CommentProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      public_id: "",
      comment: "",
      accountId: currentUserId,
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    try {
      await addCommentToClip({
        clipId,
        commentText: values.comment,
        userId: currentUserId,
        path: pathname,
        videoUrl: values.public_id ? values.public_id : "",
      });
    } catch (err: any) {
      throw new Error(`Error ${err.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="public_id"
          render={() => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200"></FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Comment
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-dark-1 outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Comment
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
