import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SEO Analysis Types
export const tagStatusEnum = z.enum(['good', 'warning', 'missing']);

export type TagStatus = z.infer<typeof tagStatusEnum>;

export const tagSchema = z.object({
  name: z.string(),
  value: z.string().optional(),
  status: tagStatusEnum,
  message: z.string().optional(),
  charCount: z.number().optional(),
});

export type Tag = z.infer<typeof tagSchema>;

export const seoAnalysisSchema = z.object({
  url: z.string().url(),
  title: tagSchema,
  description: tagSchema,
  canonical: tagSchema,
  robots: tagSchema,
  viewport: tagSchema,
  ogTags: z.array(tagSchema),
  twitterTags: z.array(tagSchema),
  score: z.number(),
  totalTags: z.number(),
  issuesCount: z.number(),
  ogImage: z.string().optional(),
  twitterImage: z.string().optional(),
  recommendations: z.array(z.object({
    type: z.enum(['warning', 'success']),
    message: z.string()
  })),
  analyzedAt: z.string()
});

export type SeoAnalysisResult = z.infer<typeof seoAnalysisSchema>;
