import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  intent: z.enum(["homeowner", "architect"]),
});

export const resetSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const architectApplicationSchema = z.object({
  fullName: z.string().min(2),
  professionalName: z.string().min(2),
  email: z.string().email(),
  country: z.string().min(2),
  location: z.string().min(2),
  title: z.string().min(2),
  biography: z.string().min(40, "Tell buyers a little more about your practice."),
  yearsExperience: z.coerce.number().min(0).max(70),
  specializations: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  behance: z.string().optional(),
});

export const reviewSchema = z.object({
  planId: z.string().uuid().or(z.string().min(1)),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().min(4).max(80),
  content: z.string().min(20).max(2000),
});
