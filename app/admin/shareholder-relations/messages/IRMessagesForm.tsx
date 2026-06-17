'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { upsertIRMessage } from '@/actions/ir-documents';

function MessageEditor({ type, initialData, label }: { type: 'CEO_MESSAGE' | 'CHAIRMAN_MESSAGE'; initialData?: any; label: string }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState({
    type, titleVI: initialData?.titleVI ?? '', titleEN: initialData?.titleEN ?? '', titleZH: initialData?.titleZH ?? '',
    contentVI: initialData?.contentVI ?? '', contentEN: initialData?.contentEN ?? '', contentZH: initialData?.contentZH ?? '',
  });

  const save = async () => {
    setSaving(true);
    await upsertIRMessage(data);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="border border-[#E8E9ED] p-6 mb-6" style={{ borderRadius: '4px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>{label}</h3>
        <Button size="sm" onClick={save} loading={saving}>{saved ? '✓ Saved' : 'Save'}</Button>
      </div>
      <Tabs defaultValue="vi">
        <TabsList>
          <TabsTrigger value="vi">VI</TabsTrigger>
          <TabsTrigger value="en">EN</TabsTrigger>
          <TabsTrigger value="zh">ZH</TabsTrigger>
        </TabsList>
        {(['vi', 'en', 'zh'] as const).map((lang) => {
          const L = lang.toUpperCase() as 'VI' | 'EN' | 'ZH';
          const titleKey = `title${L}` as keyof typeof data;
          const contentKey = `content${L}` as keyof typeof data;
          return (
            <TabsContent key={lang} value={lang}>
              <div className="space-y-4 pt-2">
                <Input label={`Title (${L})`} value={data[titleKey] as string} onChange={(e) => setData((d) => ({ ...d, [titleKey]: e.target.value }))} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#1F2937]">Content ({L})</label>
                  <RichTextEditor value={data[contentKey] as string} onChange={(v) => setData((d) => ({ ...d, [contentKey]: v }))} />
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

export function IRMessagesForm({ ceoMessage, chairmanMessage }: { ceoMessage?: any; chairmanMessage?: any }) {
  return (
    <div className="max-w-3xl">
      <MessageEditor type="CEO_MESSAGE" initialData={ceoMessage} label="CEO Message" />
      <MessageEditor type="CHAIRMAN_MESSAGE" initialData={chairmanMessage} label="Chairman's Message" />
    </div>
  );
}
