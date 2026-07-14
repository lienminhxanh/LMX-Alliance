'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanySettingsSchema } from '@/lib/validations';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageField } from '@/components/admin/ImageField';
import { upsertCompanySettings } from '@/actions/settings';
import type { z } from 'zod';

type FormData = z.infer<typeof CompanySettingsSchema>;

export function CompanySettingsForm({ initialData }: { initialData?: Partial<FormData> }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(CompanySettingsSchema) as any,
    defaultValues: {
      name: '', tagline: '', description: '', address: '',
      phone: '', email: '', website: '', googleMapEmbed: '',
      seoMetaTitle: '', seoMetaDesc: '', seoOgImage: '', seoKeywords: '',
      facebookUrl: '', linkedinUrl: '', youtubeUrl: '', tiktokUrl: '',
      zaloUrl: '', messengerUrl: '',
      recruitmentEmail: '',
      aboutIntroVI: '', aboutIntroEN: '', aboutIntroZH: '',
      aboutLetterTitleVI: '', aboutLetterTitleEN: '', aboutLetterTitleZH: '',
      aboutLetterVI: '', aboutLetterEN: '', aboutLetterZH: '',
      aboutLetterSignerVI: '', aboutLetterSignerEN: '', aboutLetterSignerZH: '',
      ...initialData,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    await upsertCompanySettings(data);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">Thông tin cơ bản</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tên công ty" {...register('name')} error={errors.name?.message} />
            <Input label="Khẩu hiệu" {...register('tagline')} />
          </div>
          <Textarea label="Mô tả" rows={4} {...register('description')} />
          <Input label="Địa chỉ" {...register('address')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Điện thoại" {...register('phone')} />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Website" {...register('website')} />
            <Input label="Email tuyển dụng" type="email" placeholder="tuyendung@lmxalliance.com" {...register('recruitmentEmail')} />
          </div>
          <Textarea label="Nhúng Google Maps (iframe src)" rows={2} {...register('googleMapEmbed')} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">SEO</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tiêu đề Meta" {...register('seoMetaTitle')} />
            <Input label="Từ khóa" {...register('seoKeywords')} />
          </div>
          <Textarea label="Mô tả Meta" rows={3} {...register('seoMetaDesc')} />
          <ImageField label="Ảnh OG (chia sẻ mạng xã hội)" value={watch('seoOgImage') ?? ''} onChange={(url) => setValue('seoOgImage', url)} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">Liên kết mạng xã hội</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Facebook URL" {...register('facebookUrl')} />
          <Input label="LinkedIn URL" {...register('linkedinUrl')} />
          <Input label="YouTube URL" {...register('youtubeUrl')} />
          <Input label="TikTok URL" {...register('tiktokUrl')} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">Liên hệ nhanh (nút nổi)</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Zalo URL" placeholder="https://zalo.me/0931824025" {...register('zaloUrl')} />
            <Input label="Messenger URL" placeholder="https://m.me/lienminhxanh" {...register('messengerUrl')} />
          </div>
          <p className="text-xs text-[#6B7280]">Số điện thoại lấy từ trường Điện thoại ở trên. Để trống nếu không muốn hiển thị nút tương ứng.</p>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">Nội dung trang Giới thiệu</h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-[#1F2937] mb-2">Phần 1 — Giới thiệu công ty (Intro)</p>
            <div className="space-y-3">
              <Textarea label="Giới thiệu (VI)" rows={5} {...register('aboutIntroVI')} />
              <Textarea label="Giới thiệu (EN)" rows={5} {...register('aboutIntroEN')} />
              <Textarea label="Giới thiệu (ZH)" rows={5} {...register('aboutIntroZH')} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1F2937] mb-2">Phần 2 — Thư ngỏ (Open Letter)</p>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <Input label="Tiêu đề thư (VI)" {...register('aboutLetterTitleVI')} />
                <Input label="Tiêu đề thư (EN)" {...register('aboutLetterTitleEN')} />
                <Input label="Tiêu đề thư (ZH)" {...register('aboutLetterTitleZH')} />
              </div>
              <Textarea label="Nội dung thư (VI)" rows={4} {...register('aboutLetterVI')} />
              <Textarea label="Nội dung thư (EN)" rows={4} {...register('aboutLetterEN')} />
              <Textarea label="Nội dung thư (ZH)" rows={4} {...register('aboutLetterZH')} />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Người ký (VI)" {...register('aboutLetterSignerVI')} />
                <Input label="Người ký (EN)" {...register('aboutLetterSignerEN')} />
                <Input label="Người ký (ZH)" {...register('aboutLetterSignerZH')} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Button type="submit" loading={saving}>{saved ? '✓ Đã lưu' : 'Lưu cài đặt'}</Button>
    </form>
  );
}
