'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { UserSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  if ((session.user as any).role !== 'SUPER_ADMIN') throw new Error('Forbidden');
  return session.user;
}

export async function createUser(data: unknown) {
  const admin = await requireSuperAdmin();
  const parsed = UserSchema.parse(data);
  if (!parsed.password) throw new Error('Password required for new users');
  const hashed = await bcrypt.hash(parsed.password, 12);
  const user = await prisma.user.create({
    data: { email: parsed.email, name: parsed.name, password: hashed, role: parsed.role, isActive: parsed.isActive ?? true },
  });
  await logAudit({ userId: admin.id!, action: 'CREATE', entity: 'User', entityId: user.id, details: { email: user.email, role: user.role } });
  revalidatePath('/admin/users');
  return user;
}

export async function updateUser(id: string, data: unknown) {
  const admin = await requireSuperAdmin();
  const parsed = UserSchema.parse(data);
  const updateData: any = { email: parsed.email, name: parsed.name, role: parsed.role, isActive: parsed.isActive };
  if (parsed.password) updateData.password = await bcrypt.hash(parsed.password, 12);
  const user = await prisma.user.update({ where: { id }, data: updateData });
  await logAudit({ userId: admin.id!, action: 'UPDATE', entity: 'User', entityId: id, details: { email: user.email } });
  revalidatePath('/admin/users');
  return user;
}

export async function deleteUser(id: string) {
  const admin = await requireSuperAdmin();
  const superAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN', isActive: true } });
  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === 'SUPER_ADMIN' && superAdmins <= 1) {
    throw new Error('Cannot delete the last super admin');
  }
  await prisma.user.delete({ where: { id } });
  await logAudit({ userId: admin.id!, action: 'DELETE', entity: 'User', entityId: id, details: {} });
  revalidatePath('/admin/users');
}
