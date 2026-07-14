'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewsSchema } from '@/lib/validations';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ImageField } from '@/components/admin/ImageField';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { createArticle, updateArticle } from '@/actions/news';
import { slugify } from '@/lib/utils';
import type { z } from 'zod';

type FormData = z.infer<typeof NewsSchema>;

const categoryOptions = [
  { value: 'COMPANY_NEWS', label: 'Tin công ty' },
  { value: 'INVESTOR_RELATIONS', label: 'Quan hệ cổ đông' },
  { value: 'SUSTAINABILITY', label: 'Phát triển bền vững' },
  { value: 'RECRUITMENT', label: 'Tuyển dụng' },
];
const statusOptions = [
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'PUBLISHED', label: 'Đã đăng' },
  { value: 'SCHEDULED', label: 'Lên lịch' },
  { value: 'ARCHIVED', label: 'Lưu trữ' },
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
          {initialData?.id ? 'Sửa bài viết' : 'Bài viết mới'}
        </h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/news')}>Hủy</Button>
          <Button type="submit" loading={saving}>Lưu</Button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6 mx-auto">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Tác giả" {...register('author')} error={errors.author?.message} />
          <Select label="Danh mục" options={categoryOptions} {...register('category')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Trạng thái" options={statusOptions} {...register('status')} />
          <Input label="Ngày đăng" type="datetime-local" {...register('publishedAt')} />
        </div>
        <ImageField label="Ảnh đại diện" value={watch('thumbnail') ?? ''} onChange={(url) => setValue('thumbnail', url)} />

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
                  <Input label={`Tiêu đề (${L})`} {...register(titleKey)} error={(errors as any)[titleKey]?.message} />
                  <div className="flex gap-2">
                    <div className="flex-1"><Input label={`Slug (${L})`} {...register(slugKey)} error={(errors as any)[slugKey]?.message} /></div>
                    <div className="flex items-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => setValue(slugKey, slugify(watch(titleKey)))}>
                        Tạo tự động
                      </Button>
                    </div>
                  </div>
                  <Textarea label={`Tóm tắt (${L})`} rows={3} {...register(summaryKey)} error={(errors as any)[summaryKey]?.message} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#1F2937]">Nội dung ({L})</label>
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
