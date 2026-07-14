'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createUser, updateUser, deleteUser } from '@/actions/users';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { UserRole } from '@prisma/client';

const roleOptions = [
  { value: 'SUPER_ADMIN', label: 'Quản trị viên' },
  { value: 'CONTENT_MANAGER', label: 'Quản lý nội dung' },
  { value: 'IR_MANAGER', label: 'Quản lý QHCĐ' },
  { value: 'VIEWER', label: 'Chỉ xem' },
];

interface UserActionsProps {
  mode: 'create' | 'edit';
  user?: { id: string; email: string; name: string; role: UserRole; isActive: boolean };
}

export function UserActions({ mode, user }: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: user?.email ?? '', name: user?.name ?? '', role: user?.role ?? 'VIEWER', password: '', isActive: user?.isActive ?? true });
  const router = useRouter();

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (mode === 'create') await createUser({ ...form, isActive: true });
      else await updateUser(user!.id, { ...form, password: form.password || undefined });
      router.refresh();
      setOpen(false);
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    setDeleting(true);
    try {
      await deleteUser(user!.id);
      router.refresh();
    }
    catch (e: any) { alert(e.message); }
    finally { setDeleting(false); }
  };

  return (
    <>
      {mode === 'create' ? (
        <Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> Người dùng mới</Button>
      ) : (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}><Edit2 size={13} /></Button>
          <Button variant="ghost" size="sm" loading={deleting} onClick={handleDelete}><Trash2 size={13} className="text-[#DC2626]" /></Button>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={mode === 'create' ? 'Người dùng mới' : 'Sửa người dùng'}>
        <div className="space-y-4">
          <Input label="Họ tên" value={form.name} onChange={(e) => set('name', e.target.value)} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          <Input label={mode === 'create' ? 'Mật khẩu' : 'Mật khẩu mới (để trống nếu giữ nguyên)'} type="password" value={form.password} onChange={(e) => set('password', e.target.value)} />
          <Select label="Vai trò" options={roleOptions} value={form.role} onChange={(e) => set('role', e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            <Button loading={saving} onClick={save}>Lưu</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
