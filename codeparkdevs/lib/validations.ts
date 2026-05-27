import { z } from "zod";

// Chat message
export const chatMessageSchema = z.object({
  message: z.string().min(1).max(4000),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// Image generation
export const generateImageSchema = z.object({
  prompt: z.string().min(3).max(1000),
  model: z.enum(["flux-pro", "sdxl", "flux-dev"]).default("flux-pro"),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3"]).default("1:1"),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;

// Text generation
export const generateTextSchema = z.object({
  prompt: z.string().min(3).max(2000),
  type: z.enum(["blog", "caption", "ad_copy", "script", "email"]),
  tone: z
    .enum(["professional", "casual", "funny", "formal"])
    .default("professional"),
});

export type GenerateTextInput = z.infer<typeof generateTextSchema>;

// Agent creation
export const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  persona: z.string().max(500),
  tone: z.enum(["professional", "casual", "friendly", "authoritative"]),
  goals: z.string().max(1000),
  instructions: z.string().max(2000),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;

// Schedule post
export const schedulePostSchema = z.object({
  content: z.string().min(1).max(2200),
  platforms: z
    .array(
      z.enum([
        "instagram",
        "facebook",
        "twitter",
        "linkedin",
        "tiktok",
        "youtube",
        "pinterest",
      ])
    )
    .min(1),
  scheduledAt: z.string().datetime(),
  mediaUrls: z.array(z.string().url()).optional(),
  approved: z.boolean().default(false),
});

export type SchedulePostInput = z.infer<typeof schedulePostSchema>;

// File upload
export const uploadFileSchema = z.object({
  name: z.string(),
  type: z.enum(["image", "video", "document", "brand_asset", "code", "audio"]),
  tags: z.array(z.string()).optional(),
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
