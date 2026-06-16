'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError('Email hoặc mật khẩu không đúng.');
    else router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1F2937] flex items-center justify-center">
            <span className="text-white text-xs font-bold">LMX</span>
          </div>
          <div>
            <p className="font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>LMX Alliance</p>
            <p className="text-xs text-[#6B7280]">Admin Panel</p>
          </div>
        </div>

        <div className="bg-white border border-[#E8E9ED] p-8" style={{ borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
          <h1 className="text-xl font-semibold text-[#1F2937] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-[#DC2626] text-sm">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>
          <p className="text-xs text-[#6B7280] mt-4">Default: admin@lmxalliance.com / Admin@123456</p>
        </div>
      </div>
    </div>
  );
}
