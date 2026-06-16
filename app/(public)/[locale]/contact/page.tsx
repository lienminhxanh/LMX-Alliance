'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormSchema } from '@/lib/validations';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import type { z } from 'zod';

type FormData = z.infer<typeof ContactFormSchema>;

const contactInfo = [
  { icon: MapPin, label: { vi: 'Địa chỉ', en: 'Address', zh: '地址' }, value: 'Số 104 Đường Lò Lu, Phường Long Phước, TP. HCM' },
  { icon: Phone, label: { vi: 'Điện thoại', en: 'Phone', zh: '电话' }, value: '0931.824.025 / 0937.798.377' },
  { icon: Mail, label: { vi: 'Email', en: 'Email', zh: '邮箱' }, value: 'Ops@lmxalliance.com' },
  { icon: Clock, label: { vi: 'Giờ làm việc', en: 'Hours', zh: '营业时间' }, value: 'T2–T7: 7:00 – 17:00' },
];

export default function ContactPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? 'vi';
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
    if (res.ok) { setSuccess(true); reset(); }
  };

  const L = locale as 'vi' | 'en' | 'zh';

  return (
    <>
      <section className="bg-[#064e3b] text-white py-20">
        <div className="container-max">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            {locale === 'vi' ? 'Chúng tôi luôn sẵn sàng lắng nghe' : locale === 'en' ? 'We are always ready to listen' : '我们随时准备倾听'}
          </p>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)' }}>
            {locale === 'vi' ? 'Liên hệ' : locale === 'en' ? 'Contact' : '联系我们'}
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-6 text-[#064e3b]" style={{ fontFamily: 'var(--font-display)' }}>
              {locale === 'vi' ? 'Gửi tin nhắn' : locale === 'en' ? 'Send a Message' : '发送消息'}
            </h2>
            {success ? (
              <div className="flex flex-col items-center justify-center py-16 border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
                <CheckCircle size={40} className="text-[#059669] mb-4" />
                <p className="font-semibold text-[#064e3b] mb-1">
                  {locale === 'vi' ? 'Tin nhắn đã được gửi!' : locale === 'en' ? 'Message sent!' : '消息已发送！'}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {locale === 'vi' ? 'Chúng tôi sẽ phản hồi sớm nhất có thể.' : locale === 'en' ? 'We will respond as soon as possible.' : '我们将尽快回复。'}
                </p>
                <button onClick={() => setSuccess(false)} className="mt-5 text-sm text-[#064e3b] underline">
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
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="bg-[#F5F6F8] p-8 h-full" style={{ borderRadius: '4px' }}>
              <h3 className="font-semibold text-[#064e3b] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {locale === 'vi' ? 'Thông tin liên hệ' : locale === 'en' ? 'Contact Information' : '联系方式'}
              </h3>
              <ul className="space-y-5">
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <li key={value} className="flex gap-3">
                    <div className="w-8 h-8 bg-[#064e3b] flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-0.5">{label[L]}</p>
                      <p className="text-sm text-[#064e3b]">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
