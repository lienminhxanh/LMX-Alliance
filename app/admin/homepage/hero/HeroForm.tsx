'use client';
import { useState } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageField } from '@/components/admin/ImageField';
import { upsertHomePage } from '@/actions/settings';

export function HeroForm({ initialData }: { initialData?: any }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    heroTitleVI: initialData?.heroTitleVI ?? '', heroTitleEN: initialData?.heroTitleEN ?? '', heroTitleZH: initialData?.heroTitleZH ?? '',
    heroDescVI: initialData?.heroDescVI ?? '', heroDescEN: initialData?.heroDescEN ?? '', heroDescZH: initialData?.heroDescZH ?? '',
    heroCTA: initialData?.heroCTA ?? 'Khám phá thêm', heroImage: initialData?.heroImage ?? '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    await upsertHomePage(form);
    setSaved(true); setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6 mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <Textarea label="Tiêu đề banner (VI)" rows={2} value={form.heroTitleVI} onChange={(e) => set('heroTitleVI', e.target.value)} />
        <Textarea label="Tiêu đề banner (EN)" rows={2} value={form.heroTitleEN} onChange={(e) => set('heroTitleEN', e.target.value)} />
        <Textarea label="Tiêu đề banner (ZH)" rows={2} value={form.heroTitleZH} onChange={(e) => set('heroTitleZH', e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Textarea label="Mô tả banner (VI)" rows={3} value={form.heroDescVI} onChange={(e) => set('heroDescVI', e.target.value)} />
        <Textarea label="Mô tả banner (EN)" rows={3} value={form.heroDescEN} onChange={(e) => set('heroDescEN', e.target.value)} />
        <Textarea label="Mô tả banner (ZH)" rows={3} value={form.heroDescZH} onChange={(e) => set('heroDescZH', e.target.value)} />
      </div>
      <Input label="Nội dung nút CTA" value={form.heroCTA} onChange={(e) => set('heroCTA', e.target.value)} />
      <ImageField label="Ảnh banner" value={form.heroImage} onChange={(url) => set('heroImage', url)} />
      <Button onClick={save} loading={saving}>{saved ? '✓ Đã lưu' : 'Lưu banner'}</Button>
    </div>
  );
}
