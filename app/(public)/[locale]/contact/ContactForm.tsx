'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormSchema } from '@/lib/validations';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import type { z } from 'zod';

type FormData = z.infer<typeof ContactFormSchema>;

export function ContactForm({ locale }: { locale: string }) {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSuccess(true);
      reset();
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-6 text-[#015231]" style={{ fontFamily: 'var(--font-display)' }}>
        {locale === 'vi' ? 'Gửi tin nhắn' : locale === 'en' ? 'Send a Message' : '发送消息'}
      </h2>
      {success ? (
        <div className="flex flex-col items-center justify-center py-16 border border-[#defbbc]" style={{ borderRadius: '4px' }}>
          <CheckCircle size={40} className="text-[#059669] mb-4" />
          <p className="font-semibold text-[#015231] mb-1">
            {locale === 'vi' ? 'Tin nhắn đã được gửi!' : locale === 'en' ? 'Message sent!' : '消息已发送！'}
          </p>
          <p className="text-sm text-[#6B7280]">
            {locale === 'vi' ? 'Chúng tôi sẽ phản hồi sớm nhất có thể.' : locale === 'en' ? 'We will respond as soon as possible.' : '我们将尽快回复。'}
          </p>
          <button onClick={() => setSuccess(false)} className="mt-5 text-sm text-[#015231] underline">
            {locale === 'vi' ? 'Gửi tin nhắn khác' : locale === 'en' ? 'Send another message' : '发送另一条消息'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={locale === 'vi' ? 'Họ và tên' : locale === 'en' ? 'Full Name' : '姓名'}
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={locale === 'vi' ? 'Số điện thoại' : locale === 'en' ? 'Phone' : '电话'}
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label={locale === 'vi' ? 'Tiêu đề' : locale === 'en' ? 'Subject' : '主题'}
              {...register('subject')}
              error={errors.subject?.message}
            />
          </div>
          <Textarea
            label={locale === 'vi' ? 'Nội dung' : locale === 'en' ? 'Message' : '内容'}
            rows={6}
            {...register('message')}
            error={errors.message?.message}
          />
          <Button type="submit" loading={isSubmitting} size="lg" className="w-full sm:w-auto">
            {locale === 'vi' ? 'Gửi tin nhắn' : locale === 'en' ? 'Send Message' : '发送消息'}
          </Button>
        </form>
      )}
    </>
  );
}
