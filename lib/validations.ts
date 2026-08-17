import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid 10-digit mobile number").max(15),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  education: z.string().min(2, "Please select or specify your highest qualification"),
  college: z.string().optional(),
  gradYear: z.string().optional(),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  city: z.string().min(2, "Please enter your current city"),
  careerGoal: z.string().min(5, "Please briefly describe your target job or career goal"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number").max(15),
  education: z.string().min(1, "Please select your education background"),
  currentStatus: z.string().min(1, "Please select your current status"),
  interestedCourse: z.string().default("Data Analytics Career Program"),
  message: z.string().optional(),
  source: z.string().default("WEBSITE_HERO"),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const projectSubmissionSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  githubUrl: z.string().url("Please provide a valid GitHub repository URL"),
  liveDemoUrl: z.string().url("Please provide a valid live demo or dashboard URL").optional().or(z.literal("")),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional(),
});

export type ProjectSubmissionInput = z.infer<typeof projectSubmissionSchema>;

export const projectReviewSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  score: z.number().min(0).max(100, "Score must be between 0 and 100"),
  feedback: z.string().min(5, "Please provide constructive feedback"),
  status: z.enum(["REVIEWED", "REJECTED", "SUBMITTED"]),
});

export type ProjectReviewInput = z.infer<typeof projectReviewSchema>;

export const assignmentSubmissionSchema = z.object({
  assignmentId: z.string().min(1, "Assignment ID is required"),
  submissionContent: z.string().min(10, "Submission content or solution explanation is required"),
  fileUrl: z.string().url("Please provide a valid file link").optional().or(z.literal("")),
});

export type AssignmentSubmissionInput = z.infer<typeof assignmentSubmissionSchema>;

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  education: z.string().optional(),
  college: z.string().optional(),
  gradYear: z.string().optional(),
  experience: z.string().optional(),
  city: z.string().optional(),
  careerGoal: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
