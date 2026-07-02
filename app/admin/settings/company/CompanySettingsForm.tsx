'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanySettingsSchema } from '@/lib/validations';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { upsertCompanySettings } from '@/actions/settings';
import type { z } from 'zod';

type FormData = z.infer<typeof CompanySettingsSchema>;

export function CompanySettingsForm({ initialData }: { initialData?: Partial<FormData> }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(CompanySettingsSchema) as any,
    defaultValues: {
      name: '', tagline: '', description: '', address: '',
      phone: '', email: '', website: '', googleMapEmbed: '',
      seoMetaTitle: '', seoMetaDesc: '', seoOgImage: '', seoKeywords: '',
      facebookUrl: '', linkedinUrl: '', youtubeUrl: '', tiktokUrl: '',
      zaloUrl: '', messengerUrl: '',
      recruitmentEmail: '',
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">Basic Info</h3>
        <div className="space-y-4">
          <Input label="Company Name" {...register('name')} error={errors.name?.message} />
          <Input label="Tagline" {...register('tagline')} />
          <Textarea label="Description" rows={4} {...register('description')} />
          <Input label="Address" {...register('address')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" {...register('phone')} />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          </div>
          <Input label="Website" {...register('website')} />
          <Input label="Recruitment Email" type="email" placeholder="tuyendung@lmxalliance.com" {...register('recruitmentEmail')} />
          <Textarea label="Google Maps Embed (iframe src)" rows={2} {...register('googleMapEmbed')} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">SEO</h3>
        <div className="space-y-4">
          <Input label="Meta Title" {...register('seoMetaTitle')} />
          <Textarea label="Meta Description" rows={3} {...register('seoMetaDesc')} />
          <Input label="OG Image URL" {...register('seoOgImage')} />
          <Input label="Keywords" {...register('seoKeywords')} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">Social Links</h3>
        <div className="space-y-4">
          <Input label="Facebook URL" {...register('facebookUrl')} />
          <Input label="LinkedIn URL" {...register('linkedinUrl')} />
          <Input label="YouTube URL" {...register('youtubeUrl')} />
          <Input label="TikTok URL" {...register('tiktokUrl')} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-[#1F2937] mb-4">Quick Contact (floating buttons)</h3>
        <div className="space-y-4">
          <Input label="Zalo URL" placeholder="https://zalo.me/0931824025" {...register('zaloUrl')} />
          <Input label="Messenger URL" placeholder="https://m.me/lienminhxanh" {...register('messengerUrl')} />
          <p className="text-xs text-[#6B7280]">Số điện thoại lấy từ trường Phone ở trên. Để trống nếu không muốn hiển thị nút tương ứng.</p>
        </div>
      </Card>

      <Button type="submit" loading={saving}>{saved ? '✓ Saved' : 'Save Settings'}</Button>
    </form>
  );
}
