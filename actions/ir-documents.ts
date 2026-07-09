'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { DocumentCategory } from '@prisma/client';
import { z } from 'zod';

import { deleteFromCloudinary } from '@/lib/cloudinary';

const IRMessageSchema = z.object({
  type: z.enum(['CEO_MESSAGE', 'CHAIRMAN_MESSAGE']),
  titleVI: z.string().min(1), titleEN: z.string().min(1), titleZH: z.string().min(1),
  contentVI: z.string(), contentEN: z.string(), contentZH: z.string(),
});

const IRDocSchema = z.object({
  nameVI: z.string().min(1), nameEN: z.string().min(1), nameZH: z.string().min(1),
  category: z.nativeEnum(DocumentCategory),
  fileUrl: z.string().min(1), fileName: z.string().min(1),
  fileType: z.string().min(1), fileSize: z.number(), year: z.number(), language: z.string(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function upsertIRMessage(data: unknown) {
  const user = await requireAuth();
  const parsed = IRMessageSchema.parse(data);
  const msg = await prisma.investorMessage.upsert({
    where: { type: parsed.type },
    update: parsed,
    create: parsed,
  });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'InvestorMessage', entityId: msg.id, details: { type: parsed.type } });
  revalidatePath('/admin/shareholder-relations/messages');
  return msg;
}

export async function createIRDocument(data: unknown) {
  const user = await requireAuth();
  const parsed = IRDocSchema.parse(data);
  const doc = await prisma.investorDocument.create({ data: parsed });
  await logAudit({ userId: user.id!, action: 'CREATE', entity: 'InvestorDocument', entityId: doc.id, details: parsed });
  revalidatePath('/admin/shareholder-relations/documents');
  return doc;
}

export async function deleteIRDocument(id: string) {
  const user = await requireAuth();
  const doc = await prisma.investorDocument.findUnique({ where: { id } });
  if (doc) {
    await prisma.investorDocument.delete({ where: { id } });
    try {
      const media = await prisma.mediaFile.findFirst({ where: { fileUrl: doc.fileUrl } });
      if (media) {
        const resourceType = media.fileType.toLowerCase() === 'pdf' ? 'image' : 'raw';
        await deleteFromCloudinary(media.storageName, resourceType);
        await prisma.mediaFile.delete({ where: { id: media.id } });
      }
    } catch (e) {
      console.error('Error removing file from storage:', e);
    }
  }
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'InvestorDocument', entityId: id, details: {} });
  revalidatePath('/admin/shareholder-relations/documents');
}
