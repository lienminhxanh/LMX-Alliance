'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { updateContactStatus } from '@/actions/contacts';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { ContactStatus } from '@prisma/client';

const statusOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'RESPONDED', label: 'Responded' },
  { value: 'CLOSED', label: 'Closed' },
];

export function ContactActions({ id, currentStatus, message }: { id: string; currentStatus: ContactStatus; message: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ContactStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const save = async () => {
    setSaving(true);
    await updateContactStatus(id, status);
    router.refresh();
    setSaving(false);
    setOpen(false);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}><Eye size={13} /></Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Contact Message" size="md">
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] bg-[#F5F6F8] p-4" style={{ borderRadius: '2px' }}>{message}</p>
          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as ContactStatus)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={save}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
