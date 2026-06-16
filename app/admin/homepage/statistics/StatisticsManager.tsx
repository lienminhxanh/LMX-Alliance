'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { upsertStatistic, deleteStatistic } from '@/actions/settings';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save } from 'lucide-react';

interface Stat { id?: string; valueVI: string; valueEN: string; valueZH: string; labelVI: string; labelEN: string; labelZH: string; orderIndex: number }

export function StatisticsManager({ initialStats }: { initialStats: any[] }) {
  const [stats, setStats] = useState<Stat[]>(initialStats);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const updateStat = (idx: number, key: string, val: string) => {
    setStats((s) => s.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  };

  const addNew = () => setStats((s) => [...s, { valueVI: '', valueEN: '', valueZH: '', labelVI: '', labelEN: '', labelZH: '', orderIndex: s.length }]);

  const saveStat = async (stat: Stat, idx: number) => {
    setSaving((s) => ({ ...s, [idx]: true }));
    await upsertStatistic(stat);
    router.refresh();
    setSaving((s) => ({ ...s, [idx]: false }));
  };

  const removeStat = async (stat: Stat, idx: number) => {
    if (!confirm('Delete?')) return;
    if (stat.id) await deleteStatistic(stat.id);
    setStats((s) => s.filter((_, i) => i !== idx));
    router.refresh();
  };

  return (
    <div className="max-w-3xl space-y-4">
      {stats.map((stat, idx) => (
        <Card key={idx}>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Input label="Value (VI)" value={stat.valueVI} onChange={(e) => updateStat(idx, 'valueVI', e.target.value)} />
            <Input label="Value (EN)" value={stat.valueEN} onChange={(e) => updateStat(idx, 'valueEN', e.target.value)} />
            <Input label="Value (ZH)" value={stat.valueZH} onChange={(e) => updateStat(idx, 'valueZH', e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Input label="Label (VI)" value={stat.labelVI} onChange={(e) => updateStat(idx, 'labelVI', e.target.value)} />
            <Input label="Label (EN)" value={stat.labelEN} onChange={(e) => updateStat(idx, 'labelEN', e.target.value)} />
            <Input label="Label (ZH)" value={stat.labelZH} onChange={(e) => updateStat(idx, 'labelZH', e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => removeStat(stat, idx)}><Trash2 size={13} className="text-[#DC2626]" /></Button>
            <Button size="sm" loading={saving[idx]} onClick={() => saveStat(stat, idx)}><Save size={13} /> Save</Button>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={addNew}><Plus size={14} /> Add Statistic</Button>
    </div>
  );
}
