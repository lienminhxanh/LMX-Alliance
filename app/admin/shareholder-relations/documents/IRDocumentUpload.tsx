'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FileField } from '@/components/admin/ImageField';
import { createIRDocument } from '@/actions/ir-documents';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

const categoryOptions = [
  { value: 'ANNUAL_REPORTS', label: 'Báo cáo thường niên' },
  { value: 'FINANCIAL_REPORTS', label: 'Báo cáo tài chính' },
  { value: 'DISCLOSURES', label: 'Công bố thông tin' },
  { value: 'SHAREHOLDER_MEETINGS', label: 'Đại hội cổ đông' },
  { value: 'GOVERNANCE', label: 'Quản trị công ty' },
];

export function IRDocumentUpload() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nameVI: '', nameEN: '', nameZH: '', category: 'ANNUAL_REPORTS', fileUrl: '', fileName: '', fileType: 'pdf', fileSize: 0, year: new Date().getFullYear(), language: 'vi' });
  const router = useRouter();

  const save = async () => {
    setSaving(true);
    try {
      await createIRDocument({ ...form, fileSize: Number(form.fileSize), year: Number(form.year) });
      router.refresh();
      setOpen(false);
    } finally { setSaving(false); }
  };

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}><Upload size={14} /> Thêm tài liệu</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Thêm tài liệu cổ đông" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Input label="Tên (VI)" value={form.nameVI} onChange={(e) => set('nameVI', e.target.value)} />
            <Input label="Tên (EN)" value={form.nameEN} onChange={(e) => set('nameEN', e.target.value)} />
            <Input label="Tên (ZH)" value={form.nameZH} onChange={(e) => set('nameZH', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Danh mục" options={categoryOptions} value={form.category} onChange={(e) => set('category', e.target.value)} />
            <Input label="Năm" type="number" value={form.year} onChange={(e) => set('year', e.target.value)} />
          </div>
          <FileField
            label="Tệp tài liệu (PDF)"
            value={form.fileUrl}
            fileName={form.fileName}
            fileSize={form.fileSize}
            accept="application/pdf"
            onChange={(file) => setForm((f) => ({ ...f, fileUrl: file.url, fileName: file.name, fileType: file.type, fileSize: file.size }))}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            <Button loading={saving} disabled={!form.fileUrl} onClick={save}>Lưu</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
