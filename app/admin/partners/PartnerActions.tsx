'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ImageField } from '@/components/admin/ImageField';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { createPartner, updatePartner, deletePartner } from '@/actions/partners';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Partner { id: string; nameVI: string; nameEN: string; nameZH: string; descVI: string; descEN: string; descZH: string; logo: string; website: string; orderIndex: number }

export function PartnerActions({ mode, partner }: { mode: 'create' | 'edit'; partner?: Partner }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nameVI: partner?.nameVI ?? '', nameEN: partner?.nameEN ?? '', nameZH: partner?.nameZH ?? '', descVI: partner?.descVI ?? '', descEN: partner?.descEN ?? '', descZH: partner?.descZH ?? '', logo: partner?.logo ?? '', website: partner?.website ?? '', orderIndex: partner?.orderIndex ?? 0 });
  const router = useRouter();

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (mode === 'create') await createPartner(form);
      else await updatePartner(partner!.id, form);
      router.refresh(); setOpen(false);
    } finally { setSaving(false); }
  };

  return (
    <>
      {mode === 'create' ? (
        <Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> Add Partner</Button>
      ) : (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}><Edit2 size={13} /></Button>
          <Button variant="ghost" size="sm" onClick={async () => { if (!confirm('Delete?')) return; await deletePartner(partner!.id); router.refresh(); }}><Trash2 size={13} className="text-[#DC2626]" /></Button>
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={mode === 'create' ? 'Add Partner' : 'Edit Partner'} size="lg">
        <div className="space-y-4">
          <ImageField label="Logo" value={form.logo} onChange={(url) => set('logo', url)} />
          <Input label="Website" value={form.website} onChange={(e) => set('website', e.target.value)} />
          <Tabs defaultValue="vi">
            <TabsList><TabsTrigger value="vi">VI</TabsTrigger><TabsTrigger value="en">EN</TabsTrigger><TabsTrigger value="zh">ZH</TabsTrigger></TabsList>
            {(['vi', 'en', 'zh'] as const).map((lang) => {
              const L = lang.toUpperCase() as 'VI' | 'EN' | 'ZH';
              return (
                <TabsContent key={lang} value={lang}>
                  <div className="space-y-3 pt-2">
                    <Input label={`Name (${L})`} value={(form as any)[`name${L}`]} onChange={(e) => set(`name${L}`, e.target.value)} />
                    <Input label={`Description (${L})`} value={(form as any)[`desc${L}`]} onChange={(e) => set(`desc${L}`, e.target.value)} />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={save}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
