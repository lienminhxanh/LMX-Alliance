'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobApplicationSchema } from '@/lib/validations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { z } from 'zod';

type FormData = z.infer<typeof JobApplicationSchema>;

export default function JobDetailPage() {
  const params = useParams<{ locale: string; id: string }>();
  const { locale, id } = params;
  const [job, setJob] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const L = locale?.toUpperCase() ?? 'VI';

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: { jobId: id },
  });

  useEffect(() => {
    fetch(`/api/jobs/${id}`).then(r => r.json()).then(setJob);
  }, [id]);

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/job-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) setSuccess(true);
  };

  if (!job) return <div className="section-padding container-max text-[#6B7280] text-sm">Loading...</div>;

  const title = job[`title${L}`];
  const desc = job[`desc${L}`];
  const requirements = job.requirements;
  const benefits = job.benefits;

  return (
    <>
      <section className="bg-[#064e3b] text-white py-16">
        <div className="container-max">
          <Link href={`/${locale}/careers`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
            <ArrowLeft size={14} /> {locale === 'vi' ? 'Quay lại tuyển dụng' : locale === 'en' ? 'Back to Careers' : '返回招聘'}
          </Link>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)' }}>{title}</h1>
          <div className="flex gap-4 mt-3 text-sm text-gray-400">
            <span>{job.location}</span>
            <span>·</span>
            <span>{job.salaryRange}</span>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {locale === 'vi' ? 'Mô tả công việc' : locale === 'en' ? 'Job Description' : '职位描述'}
              </h2>
              <div className="prose text-[#6B7280]" dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {locale === 'vi' ? 'Yêu cầu' : locale === 'en' ? 'Requirements' : '要求'}
              </h2>
              <div className="prose text-[#6B7280]" dangerouslySetInnerHTML={{ __html: requirements }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {locale === 'vi' ? 'Quyền lợi' : locale === 'en' ? 'Benefits' : '待遇'}
              </h2>
              <div className="prose text-[#6B7280]" dangerouslySetInnerHTML={{ __html: benefits }} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border border-[#E8E9ED] p-6 sticky top-20" style={{ borderRadius: '4px' }}>
              <h3 className="font-semibold text-[#064e3b] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                {locale === 'vi' ? 'Nộp hồ sơ ứng tuyển' : locale === 'en' ? 'Submit Application' : '提交申请'}
              </h3>
              {success ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-green-50 flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#059669] text-xl">✓</span>
                  </div>
                  <p className="text-sm text-[#059669] font-medium">
                    {locale === 'vi' ? 'Hồ sơ đã được gửi!' : locale === 'en' ? 'Application submitted!' : '申请已提交！'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <input type="hidden" {...register('jobId')} />
                  <Input label={locale === 'vi' ? 'Họ và tên' : locale === 'en' ? 'Full Name' : '姓名'} {...register('name')} error={errors.name?.message} />
                  <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                  <Input label={locale === 'vi' ? 'Điện thoại' : locale === 'en' ? 'Phone' : '电话'} {...register('phone')} error={errors.phone?.message} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#064e3b]">CV</label>
                    <input type="hidden" {...register('cvUrl')} />
                    <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#E8E9ED] cursor-pointer hover:border-[#064e3b] transition-colors text-sm text-[#6B7280]">
                      <Upload size={14} />
                      {cvFile ? cvFile.name : (locale === 'vi' ? 'Chọn file CV' : locale === 'en' ? 'Choose CV file' : '选择简历文件')}
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { setCvFile(file); setValue('cvUrl', file.name); }
                      }} />
                    </label>
                    {errors.cvUrl && <span className="text-xs text-[#DC2626]">{errors.cvUrl.message}</span>}
                  </div>
                  <Button type="submit" loading={isSubmitting} className="w-full">
                    {locale === 'vi' ? 'Nộp hồ sơ' : locale === 'en' ? 'Submit' : '提交'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
