'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageField } from '@/components/admin/ImageField';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { createLeader, updateLeader, deleteLeader } from '@/actions/leadership';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Leader { id: string; nameVI: string; nameEN: string; nameZH: string; positionVI: string; positionEN: string; positionZH: string; bioVI: string; bioEN: string; bioZH: string; photo: string; orderIndex: number }

export function LeadershipActions({ mode, leader }: { mode: 'create' | 'edit'; leader?: Leader }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ nameVI: leader?.nameVI ?? '', nameEN: leader?.nameEN ?? '', nameZH: leader?.nameZH ?? '', positionVI: leader?.positionVI ?? '', positionEN: leader?.positionEN ?? '', positionZH: leader?.positionZH ?? '', bioVI: leader?.bioVI ?? '', bioEN: leader?.bioEN ?? '', bioZH: leader?.bioZH ?? '', photo: leader?.photo ?? '', orderIndex: leader?.orderIndex ?? 0 });
  const router = useRouter();

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (mode === 'create') await createLeader(form);
      else await updateLeader(leader!.id, form);
      router.refresh(); setOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa lãnh đạo này?')) return;
    setDeleting(true);
    try {
      await deleteLeader(leader!.id);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Xóa thất bại. Có thể đang liên kết với dữ liệu khác.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {mode === 'create' ? (
        <Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> Thêm lãnh đạo</Button>
      ) : (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}><Edit2 size={13} /></Button>
          <Button variant="ghost" size="sm" loading={deleting} onClick={handleDelete}><Trash2 size={13} className="text-[#DC2626]" /></Button>
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={mode === 'create' ? 'Thêm lãnh đạo' : 'Sửa lãnh đạo'} size="lg">
        <div className="space-y-4">
          <ImageField label="Ảnh đại diện" value={form.photo} onChange={(url) => set('photo', url)} />
          <Input label="Thứ tự hiển thị" type="number" value={form.orderIndex} onChange={(e) => set('orderIndex', parseInt(e.target.value))} />
          <Tabs defaultValue="vi">
            <TabsList><TabsTrigger value="vi">VI</TabsTrigger><TabsTrigger value="en">EN</TabsTrigger><TabsTrigger value="zh">ZH</TabsTrigger></TabsList>
            {(['vi', 'en', 'zh'] as const).map((lang) => {
              const L = lang.toUpperCase() as 'VI' | 'EN' | 'ZH';
              return (
                <TabsContent key={lang} value={lang}>
                  <div className="space-y-3 pt-2">
                    <Input label={`Họ tên (${L})`} value={(form as any)[`name${L}`]} onChange={(e) => set(`name${L}`, e.target.value)} />
                    <Input label={`Chức vụ (${L})`} value={(form as any)[`position${L}`]} onChange={(e) => set(`position${L}`, e.target.value)} />
                    <Textarea label={`Tiểu sử (${L})`} rows={4} value={(form as any)[`bio${L}`]} onChange={(e) => set(`bio${L}`, e.target.value)} />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            <Button loading={saving} onClick={save}>Lưu</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
