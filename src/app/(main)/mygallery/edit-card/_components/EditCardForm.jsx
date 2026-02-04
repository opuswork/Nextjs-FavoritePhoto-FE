'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Input from '@/components/atoms/Input/Input';
import TextBox from '@/components/atoms/TextBox/TextBox';
import { ButtonPrimary } from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal/Modal';
import { http } from '@/lib/http/client';
import CreateCardDropdown from '@/app/(main)/create-card/_components/CreateCardDropdown';
import FormField from '@/app/(main)/create-card/_components/FormField';

const API_BASE = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE_URL || '') : '';
function resolveImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return '/images/preview.jpg';
  const t = imageUrl.trim();
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  if (API_BASE && t.startsWith('/')) return API_BASE.replace(/\/$/, '') + t;
  return t || '/images/preview.jpg';
}

const GRADE_OPTIONS = [
  { label: 'COMMON', value: 'COMMON' },
  { label: 'RARE', value: 'RARE' },
  { label: 'SUPER RARE', value: 'SUPER RARE' },
  { label: 'LEGENDARY', value: 'LEGENDARY' },
];
const GENRE_OPTIONS = [
  { label: '풍경', value: '풍경' },
  { label: '여행', value: '여행' },
  { label: '인물', value: '인물' },
];
const FIELD_CLASS =
  'w-full h-[60px] rounded-[2px] border border-gray-200 bg-black px-[20px] py-[18px] outline-none text-[16px] text-gray-200 disabled:opacity-60';
const FIELD_ERROR = '!border-red-500';
const onlyDigits = (v) => v.replace(/\D/g, '');
const gradeToBackend = (v) => {
  const map = { COMMON: 'common', RARE: 'rare', 'SUPER RARE': 'epic', LEGENDARY: 'legendary' };
  return map[v] ?? (v && v.toLowerCase());
};

export default function EditCardForm({ photoCardId, creatorUserId, onSaved, onDeleted, onCancel }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [grade, setGrade] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchCard() {
      if (!photoCardId) return;
      setLoading(true);
      setLoadError(null);
      try {
        const res = await http.get(`/api/photo-cards/${photoCardId}`);
        const d = res.data?.data ?? res.data;
        if (cancelled) return;
        setName(d?.name ?? '');
        setDesc(d?.description ?? '');
        const g = String(d?.grade ?? '').toLowerCase();
        setGrade(g === 'common' ? 'COMMON' : g === 'rare' ? 'RARE' : g === 'epic' ? 'SUPER RARE' : g === 'legendary' ? 'LEGENDARY' : '');
        setGenre(d?.genre ?? '');
        setPrice(String(d?.minPrice ?? 0));
        setTotal(String(d?.totalSupply ?? 1));
        setImageUrl(d?.imageUrl ?? '');
      } catch (err) {
        if (!cancelled) setLoadError(err?.response?.data?.message ?? err?.message ?? '카드 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchCard();
    return () => { cancelled = true; };
  }, [photoCardId]);

  // Preview: new file object URL or existing imageUrl
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  const handlePickFile = (e) => {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) return;
    const okTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!okTypes.includes(picked.type)) return;
    setFile(picked);
  };

  const displayImageSrc = previewUrl ?? resolveImageUrl(imageUrl);

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = '포토카드 이름을 입력해 주세요.';
    else if (name.trim().length > 20) e.name = '포토카드 이름은 20자 이내로 입력해 주세요.';
    if (!grade) e.grade = '등급을 선택해 주세요.';
    if (!genre) e.genre = '장르를 선택해 주세요.';
    const totalNum = Number(total);
    if (!Number.isFinite(totalNum) || totalNum < 1) e.total = '총 발행량은 1 이상이어야 합니다.';
    if (totalNum > 10) e.total = '총 발행량은 10 이하여야 합니다.';
    return e;
  }, [name, grade, genre, total]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || !creatorUserId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      let finalImageUrl = imageUrl.trim();
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload/photo-card', { method: 'POST', body: formData });
        if (!uploadRes.ok) {
          const data = await uploadRes.json().catch(() => ({}));
          throw new Error(data?.error ?? `업로드 실패 (${uploadRes.status})`);
        }
        const { url } = await uploadRes.json();
        if (!url) throw new Error('이미지 URL을 받지 못했습니다.');
        finalImageUrl = url;
      }
      await http.patch(`/api/photo-cards/${photoCardId}`, {
        creatorUserId,
        name: name.trim(),
        description: desc.trim() || null,
        genre: genre.trim(),
        grade: gradeToBackend(grade),
        minPrice: Number(price) || 0,
        totalSupply: Number(total) || 1,
        imageUrl: finalImageUrl || undefined,
      });
      setFile(null);
      onSaved?.();
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? err?.message ?? '수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!creatorUserId) return;
    setDeleting(true);
    try {
      await http.delete(`/api/photo-cards/${photoCardId}`, { data: { creatorUserId } });
      setDeleteConfirmOpen(false);
      onDeleted?.();
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? err?.message ?? '삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="py-8 text-gray-400">불러오는 중…</div>;
  if (loadError) return <div className="py-8 text-red-400">{loadError}</div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-[520px] flex flex-col gap-6 pb-12">
        <FormField label="포토카드 이름">
          <Input
            placeholder="포토카드 이름을 입력해 주세요"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            className={[FIELD_CLASS, errors.name && FIELD_ERROR].filter(Boolean).join(' ')}
          />
          {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
        </FormField>
        <FormField label="등급">
          <CreateCardDropdown
            value={grade}
            options={GRADE_OPTIONS}
            placeholder="등급을 선택해 주세요"
            onChange={setGrade}
            className={errors.grade ? FIELD_ERROR : ''}
          />
          {errors.grade && <p className="mt-2 text-sm text-red-500">{errors.grade}</p>}
        </FormField>
        <FormField label="장르">
          <CreateCardDropdown
            value={genre}
            options={GENRE_OPTIONS}
            placeholder="장르를 선택해 주세요"
            onChange={setGenre}
            className={errors.genre ? FIELD_ERROR : ''}
          />
          {errors.genre && <p className="mt-2 text-sm text-red-500">{errors.genre}</p>}
        </FormField>
        <FormField label="가격">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="가격"
            value={price}
            onChange={(e) => setPrice(onlyDigits(e.target.value))}
            className={FIELD_CLASS}
          />
        </FormField>
        <FormField label="총 발행량">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="총 발행량"
            value={total}
            onChange={(e) => setTotal(onlyDigits(e.target.value))}
            className={[FIELD_CLASS, errors.total && FIELD_ERROR].filter(Boolean).join(' ')}
          />
          {errors.total && <p className="mt-2 text-sm text-red-500">{errors.total}</p>}
        </FormField>
        <FormField label="사진">
          <div className="flex flex-col gap-3">
            <div className="flex w-full items-center gap-3">
              <Input
                type="text"
                placeholder="사진"
                value={file?.name ?? (imageUrl ? '현재 이미지' : '')}
                disabled
                className="flex-1 min-w-0 !h-[48px] rounded-[2px] border border-gray-200 bg-black px-[20px] py-2 text-[14px] text-gray-200"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handlePickFile}
              />
              <ButtonPrimary
                type="button"
                size="s"
                thickness="thin"
                className="!h-[48px] !min-w-0 !w-[100px] !rounded-[2px] !border !border-white !bg-transparent !text-white hover:!bg-white/10"
                onClick={() => fileInputRef.current?.click()}
              >
                사진 바꾸기
              </ButtonPrimary>
            </div>
            <div className="rounded-[2px] border border-gray-200 bg-black overflow-hidden">
              <img
                src={displayImageSrc || '/images/preview.jpg'}
                alt={name || '미리보기'}
                className="h-auto max-h-[280px] w-full object-contain"
              />
            </div>
          </div>
        </FormField>
        <FormField label="포토카드 설명">
          <TextBox
            placeholder="카드 설명을 입력해 주세요"
            value={desc}
            onChange={setDesc}
            wrapperStyle={{ width: '100%' }}
            textareaStyle={{
              minHeight: '120px',
              fontSize: '16px',
              color: '#E5E7EB',
              borderRadius: '2px',
              border: '1px solid #374151',
              backgroundColor: '#000',
              padding: '18px 20px',
              outline: 'none',
              resize: 'none',
            }}
          />
        </FormField>
        {submitError && <p className="text-sm text-red-500">{submitError}</p>}
        <div className="flex flex-col gap-3">
          <ButtonPrimary
            type="submit"
            size="l"
            thickness="thin"
            fullWidth
            disabled={!isValid || submitting}
            className={isValid && !submitting ? '!text-black !bg-main' : '!text-gray-300 !bg-gray-600 cursor-not-allowed'}
          >
            {submitting ? '저장 중…' : '저장하기'}
          </ButtonPrimary>
          <ButtonPrimary
            type="button"
            size="l"
            thickness="thin"
            fullWidth
            onClick={() => setDeleteConfirmOpen(true)}
            className="!border-red-500 !bg-transparent !text-red-500 hover:!bg-red-500/10"
          >
            카드 삭제
          </ButtonPrimary>
          <button
            type="button"
            onClick={onCancel}
            className="py-3 text-gray-400 hover:text-white"
          >
            목록으로
          </button>
        </div>
      </form>

      <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} size="sm">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">카드 삭제</h3>
          <p className="text-sm text-gray-300">이 포토카드를 삭제하면 복구할 수 없습니다. 삭제하시겠습니까?</p>
          <div className="flex gap-2 justify-end">
            <ButtonPrimary type="button" size="s" thickness="thin" onClick={() => setDeleteConfirmOpen(false)}>
              취소
            </ButtonPrimary>
            <ButtonPrimary
              type="button"
              size="s"
              thickness="thin"
              onClick={handleDelete}
              disabled={deleting}
              className="!bg-red-600 hover:!bg-red-700"
            >
              {deleting ? '삭제 중…' : '삭제'}
            </ButtonPrimary>
          </div>
        </div>
      </Modal>
    </>
  );
}
