'use client';

import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMyGallery, apiGradeToDisplay } from '../_components/MyGalleryShell';
import { http } from '@/lib/http/client';
import EditCardForm from './_components/EditCardForm';

const API_BASE = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE_URL || '') : '';
function resolveImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return '/assets/products/photo-card.svg';
  const t = imageUrl.trim();
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  if (API_BASE && t.startsWith('/')) return API_BASE.replace(/\/$/, '') + t;
  return t || '/assets/products/photo-card.svg';
}

/** Row from GET /users/me/cards (has creator_user_id). Only show rows where user created the card. */
function CreatedCardItem({ row, onEdit, onDelete, isDeleting }) {
  const grade = apiGradeToDisplay(row?.grade);
  const imageSrc = resolveImageUrl(row?.image_url);
  const name = row?.name ?? row?.description ?? '-';
  const genre = row?.genre ?? '풍경';

  return (
    <div className="rounded-[2px] border border-gray-200 bg-black overflow-hidden flex flex-col">
      <div className="aspect-square w-full relative">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-white font-medium truncate" title={name}>{name}</p>
        <p className="text-gray-400 text-sm">{genre} · {grade}</p>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => onEdit(row)}
            disabled={isDeleting}
            className="flex-1 py-2 rounded-[2px] border border-white bg-transparent text-white text-sm font-medium hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            disabled={isDeleting}
            className="flex-1 py-2 rounded-[2px] border border-red-500 bg-transparent text-red-500 text-sm font-medium hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? '삭제 중…' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditCardPage() {
  const router = useRouter();
  const { user, cards: rawCards, loading: contextLoading, refetchCards } = useMyGallery();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  /** Only cards the current user created (uploaded), not purchased */
  const createdCards = useMemo(() => {
    if (!user?.id || !Array.isArray(rawCards)) return [];
    const uid = Number(user.id);
    return rawCards.filter((row) => Number(row?.creator_user_id) === uid);
  }, [user?.id, rawCards]);

  const [editingPhotoCardId, setEditingPhotoCardId] = useState(null);
  const editingCard = useMemo(
    () => createdCards.find((c) => Number(c?.photo_card_id) === Number(editingPhotoCardId)) ?? null,
    [createdCards, editingPhotoCardId],
  );

  const handleEdit = useCallback((row) => {
    setEditingPhotoCardId(row?.photo_card_id ?? null);
  }, []);

  const handleDelete = useCallback(
    async (row) => {
      const id = row?.photo_card_id;
      const creatorUserId = user?.id;
      if (!id || !creatorUserId) return;
      if (!window.confirm('이 포토카드를 삭제하면 복구할 수 없습니다. 삭제하시겠습니까?')) return;
      setDeletingId(id);
      setDeleteError(null);
      try {
        await http.delete(`/api/photo-cards/${id}`, { data: { creatorUserId } });
        await refetchCards();
        if (Number(editingPhotoCardId) === Number(id)) setEditingPhotoCardId(null);
      } catch (err) {
        setDeleteError(err?.response?.data?.message ?? err?.message ?? '삭제에 실패했습니다.');
      } finally {
        setDeletingId(null);
      }
    },
    [user?.id, refetchCards, editingPhotoCardId],
  );

  const handleSaved = useCallback(() => {
    refetchCards();
    setEditingPhotoCardId(null);
  }, [refetchCards]);

  const handleDeleted = useCallback(() => {
    refetchCards();
    setEditingPhotoCardId(null);
  }, [refetchCards]);

  const handleCancelEdit = useCallback(() => {
    setEditingPhotoCardId(null);
  }, []);

  if (contextLoading) {
    return (
      <div className="py-8 text-white/60">
        <p>내가 올린 포토카드를 불러오는 중…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 text-amber-400">
        <p>로그인 후 수정/삭제할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <section>
      <h1 className="text-2xl md:text-3xl font-bold text-white">포토카드 수정 / 삭제</h1>
      <p className="mt-2 text-white/70 text-sm md:text-base">
        내가 올린 포토카드만 표시됩니다. 판매 전에 정보를 수정하거나 삭제할 수 있습니다.
      </p>
      <div className="mt-4 h-px w-full bg-white/20" />

      {editingPhotoCardId ? (
        <div className="mt-6">
          <EditCardForm
            photoCardId={editingPhotoCardId}
            creatorUserId={user.id}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <>
          {deleteError && (
            <p className="mt-4 text-sm text-red-500">{deleteError}</p>
          )}
          {createdCards.length === 0 ? (
            <div className="mt-8 py-12 text-center text-white/60 rounded-[2px] border border-gray-200/50 bg-black/50">
              <p>내가 올린 포토카드가 없습니다.</p>
              <button
                type="button"
                onClick={() => router.push('/mygallery/create')}
                className="mt-4 text-main hover:underline"
              >
                포토카드 생성하기
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {createdCards.map((row) => (
                <CreatedCardItem
                  key={row?.user_card_id ?? row?.photo_card_id ?? row?.name}
                  row={row}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === row?.photo_card_id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
