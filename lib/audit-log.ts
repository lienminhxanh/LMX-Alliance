'use server';
import { prisma } from '@/lib/prisma';

interface AuditLogParams {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(params: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details as import('@prisma/client').Prisma.InputJsonValue,
        ipAddress: params.ipAddress ?? 'unknown',
        userAgent: params.userAgent ?? 'unknown',
      },
    });
  } catch {
    // Audit log failures should not break the main operation
    console.error('Audit log failed');
  }
}
