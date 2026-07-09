import { Phone, MessageCircle } from 'lucide-react';

function ZaloIcon() {
  return (
    <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.5px' }}>
      Zalo
    </span>
  );
}

export function FloatingContact({
  phone,
  zaloUrl,
  messengerUrl,
}: {
  phone?: string | null;
  zaloUrl?: string | null;
  messengerUrl?: string | null;
}) {
  const firstPhone = phone?.split('/')[0]?.trim();

  const items = [
    firstPhone && {
      key: 'phone',
      href: `tel:${firstPhone.replace(/[^\d+]/g, '')}`,
      bg: '#297c3e',
      icon: <Phone size={22} color="#fff" fill="#fff" strokeWidth={1.5} />,
      label: 'Gọi điện',
    },
    zaloUrl && {
      key: 'zalo',
      href: zaloUrl,
      bg: '#0068ff',
      icon: <ZaloIcon />,
      label: 'Zalo',
    },
    messengerUrl && {
      key: 'messenger',
      href: messengerUrl,
      bg: 'linear-gradient(135deg,#0074a6,#006aff)',
      icon: <MessageCircle size={22} color="#fff" fill="#fff" strokeWidth={1.5} />,
      label: 'Messenger',
    },
  ].filter(Boolean) as { key: string; href: string; bg: string; icon: React.ReactNode; label: string }[];

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target={item.key === 'phone' ? undefined : '_blank'}
          rel={item.key === 'phone' ? undefined : 'noopener noreferrer'}
          aria-label={item.label}
          title={item.label}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          style={{ background: item.bg, boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
