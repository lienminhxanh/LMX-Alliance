import { z } from 'zod';

export const SectorSchema = z.object({
  slug: z.string().min(1),
  nameVI: z.string().min(1), nameEN: z.string().min(1), nameZH: z.string().min(1),
  summaryVI: z.string().min(1), summaryEN: z.string().min(1), summaryZH: z.string().min(1),
  contentVI: z.string().default(''), contentEN: z.string().default(''), contentZH: z.string().default(''),
  banner: z.string().default(''), thumbnail: z.string().default(''),
  gallery: z.array(z.string()).default([]),
  seoTitleVI: z.string().default(''), seoDescVI: z.string().default(''),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  orderIndex: z.coerce.number().default(0),
});

export const NewsSchema = z.object({
  titleVI: z.string().min(1), titleEN: z.string().min(1), titleZH: z.string().min(1),
  slugVI: z.string().min(1), slugEN: z.string().min(1), slugZH: z.string().min(1),
  summaryVI: z.string().min(1), summaryEN: z.string().min(1), summaryZH: z.string().min(1),
  contentVI: z.string().default(''), contentEN: z.string().default(''), contentZH: z.string().default(''),
  thumbnail: z.string().default(''),
  category: z.enum(['COMPANY_NEWS', 'INVESTOR_RELATIONS', 'SUSTAINABILITY', 'RECRUITMENT']),
  author: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.string().nullable().optional(),
  scheduledAt: z.string().nullable().optional(),
});

export const JobSchema = z.object({
  titleVI: z.string().min(1), titleEN: z.string().min(1), titleZH: z.string().min(1),
  descVI: z.string().default(''), descEN: z.string().default(''), descZH: z.string().default(''),
  requirements: z.string().default(''), benefits: z.string().default(''),
  location: z.string().min(1), salaryRange: z.string().min(1),
  status: z.enum(['OPEN', 'CLOSED', 'ARCHIVED']).default('OPEN'),
});

export const LeaderSchema = z.object({
  nameVI: z.string().min(1), nameEN: z.string().min(1), nameZH: z.string().min(1),
  positionVI: z.string().min(1), positionEN: z.string().min(1), positionZH: z.string().min(1),
  bioVI: z.string().default(''), bioEN: z.string().default(''), bioZH: z.string().default(''),
  photo: z.string().default(''), orderIndex: z.coerce.number().default(0),
});

export const PartnerSchema = z.object({
  nameVI: z.string().min(1), nameEN: z.string().min(1), nameZH: z.string().min(1),
  descVI: z.string().default(''), descEN: z.string().default(''), descZH: z.string().default(''),
  logo: z.string().default(''), website: z.string().default(''),
  orderIndex: z.coerce.number().default(0),
});

export const ProjectSchema = z.object({
  nameVI: z.string().min(1), nameEN: z.string().min(1), nameZH: z.string().min(1),
  descVI: z.string().default(''), descEN: z.string().default(''), descZH: z.string().default(''),
  images: z.array(z.string()).default([]),
  status: z.enum(['ONGOING', 'COMPLETED', 'ARCHIVED']),
});

export const CompanySettingsSchema = z.object({
  name: z.string().min(1), tagline: z.string().min(1),
  description: z.string().min(1), address: z.string().min(1),
  phone: z.string().min(1), email: z.string().email(),
  website: z.string().default(''), googleMapEmbed: z.string().default(''),
  seoMetaTitle: z.string().default(''), seoMetaDesc: z.string().default(''),
  seoOgImage: z.string().default(''), seoKeywords: z.string().default(''),
  facebookUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  tiktokUrl: z.string().optional().nullable(),
  recruitmentEmail: z.string().email().or(z.literal('')).default(''),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2), email: z.string().email(),
  phone: z.string().min(9), subject: z.string().min(3),
  message: z.string().min(10),
});

export const JobApplicationSchema = z.object({
  jobId: z.string().min(1), name: z.string().min(2),
  email: z.string().email(), phone: z.string().min(9),
  cvUrl: z.string().min(1),
});

export const UserSchema = z.object({
  email: z.string().email(), name: z.string().min(1),
  password: z.string().min(8).optional(),
  role: z.enum(['SUPER_ADMIN', 'CONTENT_MANAGER', 'IR_MANAGER', 'VIEWER']),
  isActive: z.boolean().default(true),
});
