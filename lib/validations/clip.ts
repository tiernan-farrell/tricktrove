import * as z from 'zod';


export const ClipValidation = z.object({
    video: z.string().url().nonempty(), 
    caption: z.string().max(500),
    author: z.string(),
})


export const CommentValidation = z.object({
    videoClip: z.string().url().nonempty(), 
    comment: z.string().max(500),
    accountId: z.string(),
})