'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewsSchema } from '@/lib/validations';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { createArticle, updateArticle } from '@/actions/news';
import { slugify } from '@/lib/utils';
import type { z } from 'zod';

type FormData = z.infer<typeof NewsSchema>;

const categoryOptions = [
  { value: 'COMPANY_NEWS', label: 'Company News' },
  { value: 'INVESTOR_RELATIONS', label: 'Investor Relations' },
  { value: 'SUSTAINABILITY', label: 'Sustainability' },
  { value: 'RECRUITMENT', label: 'Recruitment' },
];
const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export function NewsForm({ initialData }: { initialData?: Partial<FormData> & { id?: string } }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(NewsSchema) as any,
    defaultValues: {
      titleVI: '', titleEN: '', titleZH: '',
      slugVI: '', slugEN: '', slugZH: '',
      summaryVI: '', summaryEN: '', summaryZH: '',
      contentVI: '', contentEN: '', contentZH: '',
      thumbnail: '', category: 'COMPANY_NEWS', author: '',
      status: 'DRAFT', publishedAt: null, scheduledAt: null,
      ...initialData,
    },
  });

  const titleVI = watch('titleVI');

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      if (initialData?.id) await updateArticle(initialData.id, data);
      else await createArticle(data);
      router.push('/admin/news');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>
          {initialData?.id ? 'Edit Article' : 'New Article'}
        </h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/news')}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Author" {...register('author')} error={errors.author?.message} />
          <Select label="Category" options={categoryOptions} {...register('category')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Status" options={statusOptions} {...register('status')} />
          <Input label="Published At" type="datetime-local" {...register('publishedAt')} />
        </div>
        <Input label="Thumbnail URL" {...register('thumbnail')} />

        {/* Language tabs */}
        <Tabs defaultValue="vi">
          <TabsList>
            <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="zh">中文</TabsTrigger>
          </TabsList>
          {(['vi', 'en', 'zh'] as const).map((lang) => {
            const L = lang.toUpperCase() as 'VI' | 'EN' | 'ZH';
            const titleKey = `title${L}` as const;
            const slugKey = `slug${L}` as const;
            const summaryKey = `summary${L}` as const;
            const contentKey = `content${L}` as const;
            return (
              <TabsContent key={lang} value={lang}>
                <div className="space-y-4">
                  <Input label={`Title (${L})`} {...register(titleKey)} error={(errors as any)[titleKey]?.message} />
                  <div className="flex gap-2">
                    <div className="flex-1"><Input label={`Slug (${L})`} {...register(slugKey)} error={(errors as any)[slugKey]?.message} /></div>
                    <div className="flex items-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => setValue(slugKey, slugify(watch(titleKey)))}>
                        Generate
                      </Button>
                    </div>
                  </div>
                  <Textarea label={`Summary (${L})`} rows={3} {...register(summaryKey)} error={(errors as any)[summaryKey]?.message} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#1F2937]">Content ({L})</label>
                    <RichTextEditor value={watch(contentKey)} onChange={(v) => setValue(contentKey, v)} />
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </form>
  );
}
