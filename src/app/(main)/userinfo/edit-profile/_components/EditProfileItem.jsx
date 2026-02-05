'use client';

import Image from '@/components/atoms/Image/Image';

export default function EditProfileItem({ row, onEdit, onDelete, isDeleting }) {
  return (
    <div className="rounded-[2px] border border-gray-200 bg-black overflow-hidden flex flex-col">
      <div className="aspect-square w-full relative">
        <Image
          src={row?.image_url}
          alt={row?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-white font-medium truncate" title={row?.name}>{row?.name}</p>
      </div>
    </div>
  );
}
