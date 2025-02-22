import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    lastMod: z.date().optional(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    comments: z.boolean().default(true),
    draft: z.boolean().default(false),
    sticky: z.number().default(0),
  }),
})

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    link: z.string().url(),
  }),
})

const specCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    comments: z.boolean().default(true),
  }),
})

const friendsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    avatar: z.string(),
    link: z.string().url(),
  }),
})

const bookCollection = defineCollection({
  type: 'content',
  schema: z.object({
    author: z.string(),
    cover: z.string(),
    progress: z.string(),
    totalReadDay: z.number(),
    readingTime: z.string(),
    readingDate: z.date(),
    isbn: z.number().nullable(), // 可能为空或undefined
    lastReadDate: z.date(),
  }),
})

const galleryCollection = defineCollection({
  type: 'content',
})

export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
  spec: specCollection,
  friends: friendsCollection,
  books: bookCollection,
  gallery: galleryCollection,
}
