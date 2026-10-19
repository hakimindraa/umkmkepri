import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phone: string;
  productName: string;
  umkmName: string;
  className?: string;
  label?: string;
}

export default function WhatsAppButton({
  phone,
  productName,
  umkmName,
  className = '',
  label = 'Tanya Penjual via WhatsApp',
}: WhatsAppButtonProps) {
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith('8')) {
    cleanPhone = '628' + cleanPhone.slice(1);
  }

  const message = `Halo ${umkmName}, saya tertarik dan melihat produk "${productName}" di Info UMKM Kepri. Apakah produk ini masih tersedia?`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.99] transition-all ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
}
