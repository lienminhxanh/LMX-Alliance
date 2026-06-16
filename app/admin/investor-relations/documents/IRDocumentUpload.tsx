'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createIRDocument } from '@/actions/ir-documents';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

const categoryOptions = [
  { value: 'ANNUAL_REPORTS', label: 'Annual Reports' },
  { value: 'FINANCIAL_REPORTS', label: 'Financial Reports' },
  { value: 'DISCLOSURES', label: 'Disclosures' },
  { value: 'SHAREHOLDER_MEETINGS', label: 'Shareholder Meetings' },
  { value: 'GOVERNANCE', label: 'Corporate Governance' },
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
      <Button size="sm" onClick={() => setOpen(true)}><Upload size={14} /> Add Document</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add IR Document" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Input label="Name (VI)" value={form.nameVI} onChange={(e) => set('nameVI', e.target.value)} />
            <Input label="Name (EN)" value={form.nameEN} onChange={(e) => set('nameEN', e.target.value)} />
            <Input label="Name (ZH)" value={form.nameZH} onChange={(e) => set('nameZH', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" options={categoryOptions} value={form.category} onChange={(e) => set('category', e.target.value)} />
            <Input label="Year" type="number" value={form.year} onChange={(e) => set('year', e.target.value)} />
          </div>
          <Input label="File URL" value={form.fileUrl} onChange={(e) => set('fileUrl', e.target.value)} placeholder="https://..." />
          <div className="grid grid-cols-3 gap-3">
            <Input label="File Name" value={form.fileName} onChange={(e) => set('fileName', e.target.value)} />
            <Input label="File Type" value={form.fileType} onChange={(e) => set('fileType', e.target.value)} placeholder="pdf" />
            <Input label="File Size (bytes)" type="number" value={form.fileSize} onChange={(e) => set('fileSize', e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={save}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
