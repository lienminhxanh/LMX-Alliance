'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { createProject, updateProject, deleteProject } from '@/actions/projects';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ProjectStatus } from '@prisma/client';

const statusOptions = [
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ARCHIVED', label: 'Archived' },
];

interface Project { id: string; nameVI: string; nameEN: string; nameZH: string; descVI: string; descEN: string; descZH: string; images: any; status: ProjectStatus; published: boolean; scale: string | null; location: string | null }

export function ProjectActions({ mode, project }: { mode: 'create' | 'edit'; project?: Project }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nameVI: project?.nameVI ?? '', nameEN: project?.nameEN ?? '', nameZH: project?.nameZH ?? '', descVI: project?.descVI ?? '', descEN: project?.descEN ?? '', descZH: project?.descZH ?? '', images: (project?.images as string[]) ?? [], status: project?.status ?? 'ONGOING' as ProjectStatus, published: project?.published ?? false, scale: project?.scale ?? '', location: project?.location ?? '' });
  const router = useRouter();

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (mode === 'create') await createProject(form);
      else await updateProject(project!.id, form);
      router.refresh(); setOpen(false);
    } finally { setSaving(false); }
  };

  return (
    <>
      {mode === 'create' ? (
        <Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> Add Project</Button>
      ) : (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}><Edit2 size={13} /></Button>
          <Button variant="ghost" size="sm" onClick={async () => { if (!confirm('Delete?')) return; await deleteProject(project!.id); router.refresh(); }}><Trash2 size={13} className="text-[#DC2626]" /></Button>
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={mode === 'create' ? 'Add Project' : 'Edit Project'} size="lg">
        <div className="space-y-4">
          <Select label="Status" options={statusOptions} value={form.status} onChange={(e) => set('status', e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-[#1F2937]">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
              className="h-4 w-4 border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
              style={{ borderRadius: 0 }}
            />
            Published (visible on public homepage)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Scale" placeholder="e.g. 50 ha" value={form.scale} onChange={(e) => set('scale', e.target.value)} />
            <Input label="Location" placeholder="e.g. Long An" value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <Tabs defaultValue="vi">
            <TabsList><TabsTrigger value="vi">VI</TabsTrigger><TabsTrigger value="en">EN</TabsTrigger><TabsTrigger value="zh">ZH</TabsTrigger></TabsList>
            {(['vi', 'en', 'zh'] as const).map((lang) => {
              const L = lang.toUpperCase() as 'VI' | 'EN' | 'ZH';
              return (
                <TabsContent key={lang} value={lang}>
                  <div className="space-y-3 pt-2">
                    <Input label={`Name (${L})`} value={(form as any)[`name${L}`]} onChange={(e) => set(`name${L}`, e.target.value)} />
                    <Textarea label={`Description (${L})`} rows={4} value={(form as any)[`desc${L}`]} onChange={(e) => set(`desc${L}`, e.target.value)} />
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
