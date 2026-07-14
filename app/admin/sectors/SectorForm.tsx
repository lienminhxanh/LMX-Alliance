'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectorSchema } from '@/lib/validations';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageField, ImageGalleryField } from '@/components/admin/ImageField';
import { createSector, updateSector } from '@/actions/sectors';
import { slugify } from '@/lib/utils';
import type { z } from 'zod';

type FormData = z.infer<typeof SectorSchema>;

interface SectorFormProps {
  initialData?: Partial<FormData> & { id?: string };
}

const statusOptions = [
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'PUBLISHED', label: 'Đã đăng' },
  { value: 'ARCHIVED', label: 'Lưu trữ' },
];

export function SectorForm({ initialData }: SectorFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(SectorSchema) as any,
    defaultValues: {
      slug: '', nameVI: '', nameEN: '', nameZH: '',
      summaryVI: '', summaryEN: '', summaryZH: '',
      contentVI: '', contentEN: '', contentZH: '',
      banner: '', thumbnail: '', gallery: [], seoTitleVI: '', seoDescVI: '',
      status: 'DRAFT', orderIndex: 0,
      ...initialData,
    },
  });

  const nameVI = watch('nameVI');
  const contentVI = watch('contentVI');
  const contentEN = watch('contentEN');
  const contentZH = watch('contentZH');

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      if (initialData?.id) await updateSector(initialData.id, data);
      else await createSector(data);
      router.push('/admin/sectors');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>
          {initialData?.id ? 'Sửa lĩnh vực' : 'Lĩnh vực mới'}
        </h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/sectors')}>Hủy</Button>
          <Button type="submit" loading={saving}>Lưu</Button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6 mx-auto">
        {/* Slug */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Slug (URL)"
            {...register('slug')}
            placeholder="tu-dong-tao-tu-ten"
            error={errors.slug?.message}
          />
          <div className="flex items-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setValue('slug', slugify(nameVI))}>
              Tạo từ tên (VI)
            </Button>
          </div>
        </div>

        {/* Language Tabs */}
        <Tabs defaultValue="vi">
          <TabsList>
            <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="zh">中文</TabsTrigger>
          </TabsList>
          {(['vi', 'en', 'zh'] as const).map((lang) => {
            const L = lang.toUpperCase() as 'VI' | 'EN' | 'ZH';
            const contentKey = `content${L}` as const;
            return (
              <TabsContent key={lang} value={lang}>
                <div className="space-y-4">
                  <Input label={`Tên (${L})`} {...register(`name${L}`)} error={errors[`name${L}`]?.message} />
                  <Textarea label={`Tóm tắt (${L})`} rows={3} {...register(`summary${L}`)} error={errors[`summary${L}`]?.message} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#1F2937]">Nội dung ({L})</label>
                    <RichTextEditor
                      value={watch(contentKey)}
                      onChange={(v) => setValue(contentKey, v)}
                    />
                  </div>
                  {lang === 'vi' && (
                    <>
                      <Input label="Tiêu đề SEO (VI)" {...register('seoTitleVI')} />
                      <Textarea label="Mô tả SEO (VI)" rows={2} {...register('seoDescVI')} />
                    </>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Images */}
        <div className="space-y-4 p-4 border border-gray-200" style={{ borderRadius: 4 }}>
          <h3 className="text-sm font-semibold text-[#1F2937]">Hình ảnh</h3>
          <div className="flex flex-wrap gap-8">
            <ImageField label="Banner" value={watch('banner') ?? ''} onChange={(url) => setValue('banner', url)} />
            <ImageField label="Ảnh thu nhỏ" value={watch('thumbnail') ?? ''} onChange={(url) => setValue('thumbnail', url)} />
          </div>
          <ImageGalleryField label="Thư viện ảnh" value={watch('gallery') ?? []} onChange={(urls) => setValue('gallery', urls)} />
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          <Select label="Trạng thái" options={statusOptions} {...register('status')} />
          <Input label="Thứ tự hiển thị" type="number" {...register('orderIndex')} />
        </div>
      </div>
    </form>
  );
}
