import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const categories = [
  'story',
  'equipment',
  'skills',
  'exploration',
  'mounts',
  'bosses',
  'beginners',
  'news',
] as const;

export type Category = (typeof categories)[number];

const guides = defineCollection({
  loader: glob({ pattern: '**/guides/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(categories),
    tags: z.array(z.string()).default([]),
    difficulty: z
      .enum(['beginner', 'intermediate', 'advanced'])
      .optional(),
    author: z.string().default('Crimson Guide Team'),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    order: z.number().default(0),
    relatedGuides: z.array(z.string()).default([]),
  }),
});

export const collections = { guides };
