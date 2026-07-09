'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { deleteIRDocument } from '@/actions/ir-documents';
import { useRouter } from 'next/navigation';

export function DeleteDocumentButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    setLoading(true);
    try {
      await deleteIRDocument(id);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" loading={loading} onClick={handleDelete}>
      <Trash2 size={13} className="text-[#DC2626]" />
    </Button>
  );
}
