import * as z from 'zod';


export const ClipValidation = z.object({
    publicId: z.string().url().optional(), 
    caption: z.string().max(500),
    author: z.string(),
    tags: z.string().array().optional()
})


export const CommentValidation = z.object({
    public_id: z.string().url().optional(), 
    comment: z.string().max(500),
    accountId: z.string(),
})