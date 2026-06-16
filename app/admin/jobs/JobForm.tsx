'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobSchema } from '@/lib/validations';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { createJob, updateJob } from '@/actions/jobs';
import type { z } from 'zod';

type FormData = z.infer<typeof JobSchema>;

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export function JobForm({ initialData }: { initialData?: Partial<FormData> & { id?: string } }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(JobSchema) as any,
    defaultValues: {
      titleVI: '', titleEN: '', titleZH: '',
      descVI: '', descEN: '', descZH: '',
      requirements: '', benefits: '',
      location: '', salaryRange: '', status: 'OPEN',
      ...initialData,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      if (initialData?.id) await updateJob(initialData.id, data);
      else await createJob(data);
      router.push('/admin/jobs');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>
          {initialData?.id ? 'Edit Job' : 'New Job'}
        </h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/jobs')}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Input label="Location" {...register('location')} error={errors.location?.message} />
          <Input label="Salary Range" {...register('salaryRange')} error={errors.salaryRange?.message} />
          <Select label="Status" options={statusOptions} {...register('status')} />
        </div>

        <Tabs defaultValue="vi">
          <TabsList>
            <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="zh">中文</TabsTrigger>
          </TabsList>
          {(['vi', 'en', 'zh'] as const).map((lang) => {
            const L = lang.toUpperCase() as 'VI' | 'EN' | 'ZH';
            const titleKey = `title${L}` as const;
            const descKey = `desc${L}` as const;
            return (
              <TabsContent key={lang} value={lang}>
                <div className="space-y-4">
                  <Input label={`Title (${L})`} {...register(titleKey)} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#1F2937]">Description ({L})</label>
                    <RichTextEditor value={watch(descKey)} onChange={(v) => setValue(descKey, v)} />
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1F2937]">Requirements</label>
          <RichTextEditor value={watch('requirements')} onChange={(v) => setValue('requirements', v)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1F2937]">Benefits</label>
          <RichTextEditor value={watch('benefits')} onChange={(v) => setValue('benefits', v)} />
        </div>
      </div>
    </form>
  );
}
