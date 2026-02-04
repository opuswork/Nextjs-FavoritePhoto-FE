// src/app/(main)/create-card/_components/CreateCardForm.jsx
'use client';

import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/components/atoms/Input/Input';
import TextBox from '@/components/atoms/TextBox/TextBox';
import { ButtonPrimary } from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal/Modal';
import { http } from '@/lib/http/client';

import CreateCardDropdown from './CreateCardDropdown';
import FormField from './FormField';

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

const FIELD_TEXT =
  'text-[16px] font-light leading-[1] tracking-[0] text-gray-200 placeholder:text-gray-200';

const FIELD_BOX =
  'w-full h-[60px] rounded-[2px] border border-gray-200 bg-black px-[20px] py-[18px] outline-none disabled:opacity-60';

const FIELD_ERROR = '!border-red-500';
const FIELD_CLASS = `${FIELD_BOX} ${FIELD_TEXT}`;

// Modified: Reduced width (~1/3 of before) and ensured white text
const FILE_BUTTON_CLASS = `
  !h-[48px]
  !min-w-0
  !w-[100px] 
  !shrink-0
  !rounded-[2px]
  !border
  !border-white
  !bg-transparent
  !px-2
  !py-2
  !text-[13px]
  !font-normal
  !leading-[1]
  !text-white
  hover:!text-white
  active:!text-white
  hover:!bg-white/10
  active:!bg-white/10
  !shadow-none
`.trim();

const SUBMIT_BUTTON_CLASS = `
  !h-[60px]
  !rounded-[2px]
  !text-[18px]
  !font-bold
  !leading-[1]
  !tracking-[0]
`.trim();

const onlyDigits = (v) => v.replace(/\D/g, '');

const gradeToBackend = (v) => {
  const map = { COMMON: 'common', RARE: 'rare', 'SUPER RARE': 'epic', LEGENDARY: 'legendary' };
  return map[v] ?? (v && v.toLowerCase());
};

export default function CreateCardForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [creatorUserId, setCreatorUserId] = useState(null);
  const [userChecked, setUserChecked] = useState(false);

  const [fileErrorOpen, setFileErrorOpen] = useState(false);
  const submitErrorRef = useRef(null);

  const [touched, setTouched] = useState({
    name: false,
    grade: false,
    genre: false,
    price: false,
    total: false,
    file: false,
    desc: false,
  });

  const refs = {
    name: useRef(null),
    grade: useRef(null),
    genre: useRef(null),
    price: useRef(null),
    total: useRef(null),
    file: useRef(null),
    desc: useRef(null),
  };

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = '포토카드 이름을 입력해 주세요.';
    else if (name.trim().length > 20) e.name = '포토카드 이름은 20자 이내로 입력해 주세요.';
    if (!grade) e.grade = '등급을 선택해 주세요.';
    if (!genre) e.genre = '장르를 선택해 주세요.';
    if (price === '') e.price = '가격을 입력해 주세요.';
    else if (!/^\d+$/.test(price)) e.price = '가격은 숫자만 입력해 주세요.';
    if (total === '') e.total = '총 발행량을 입력해 주세요.';
    else if (!/^\d+$/.test(total)) e.total = '총 발행량은 숫자만 입력해 주세요.';
    else {
      const n = Number(total);
      if (n < 1 || n > 10) e.total = '총 발행량은 1~10장 이내로만 설정 가능합니다.';
    }
    if (!file) e.file = '이미지를 업로드해 주세요.';
    if (!desc.trim()) e.desc = '포토카드 설명을 입력해 주세요.';
    else if (desc.length > 500) e.desc = '포토카드 설명은 500자 이내로 입력해 주세요.';
    return e;
  }, [name, grade, genre, price, total, file, desc]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const showError = (key) => touched[key] && !!errors[key];

  const scrollToFirstError = useCallback(() => {
    const order = ['name', 'grade', 'genre', 'price', 'total', 'file', 'desc'];
    const first = order.find((k) => errors[k]);
    if (!first) return;
    refs[first]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [errors]);

  useEffect(() => {
    let cancelled = false;
    setUserChecked(false);
    http
      .get('/users/me')
      .then((res) => {
        if (!cancelled) {
          setCreatorUserId(res?.data?.user?.id ?? null);
          setUserChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCreatorUserId(null);
          setUserChecked(true);
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (submitError && submitErrorRef.current) {
      submitErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      grade: true,
      genre: true,
      price: true,
      total: true,
      file: true,
      desc: true,
    });

    if (!isValid) {
      scrollToFirstError();
      return;
    }

    if (!creatorUserId) {
      setSubmitError('로그인이 필요합니다.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload/photo-card', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        throw new Error(data?.error ?? `업로드 실패 (${uploadRes.status})`);
      }

      const { url: imageUrl } = await uploadRes.json();
      if (!imageUrl) throw new Error('이미지 URL을 받지 못했습니다.');

      await http.post('/api/photo-cards', {
        creatorUserId,
        name: name.trim(),
        description: desc.trim() || null,
        genre: genre.trim(),
        grade: gradeToBackend(grade),
        minPrice: Number(price) || 0,
        totalSupply: Number(total) || 1,
        imageUrl,
      });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mygallery-refetch', '1');
        window.dispatchEvent(new CustomEvent('user-points-updated'));
      }
      router.push('/mygallery');
      router.refresh();
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? err?.message ?? '생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const openFilePicker = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handlePickFile = (e) => {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) {
      setTouched((t) => ({ ...t, file: true }));
      return;
    }

    const okTypes = ['image/jpeg', 'image/png'];
    const okExt = /\.(jpe?g|png)$/i.test(picked.name);

    if (!okTypes.includes(picked.type) || !okExt) {
      setFile(null);
      setTouched((t) => ({ ...t, file: true }));
      setFileErrorOpen(true);
      e.target.value = '';
      return;
    }

    setFile(picked);
    setTouched((t) => ({ ...t, file: true }));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-12 max-w-[520px] flex flex-col gap-20 pb-[250px]"
      >
        <div ref={refs.name}>
          <FormField label="포토카드 이름">
            <Input
              placeholder="포토카드 이름을 입력해 주세요"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className={[FIELD_CLASS, showError('name') && FIELD_ERROR].filter(Boolean).join(' ')}
            />
            {showError('name') && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
          </FormField>
        </div>

        <div ref={refs.grade}>
          <FormField label="등급">
            <CreateCardDropdown
              value={grade}
              options={GRADE_OPTIONS}
              placeholder="등급을 선택해 주세요"
              onChange={(v) => {
                setGrade(v);
                setTouched((t) => ({ ...t, grade: true }));
              }}
              onBlur={() => setTouched((t) => ({ ...t, grade: true }))}
              className={showError('grade') ? FIELD_ERROR : ''}
            />
            {showError('grade') && <p className="mt-2 text-sm text-red-500">{errors.grade}</p>}
          </FormField>
        </div>

        <div ref={refs.genre}>
          <FormField label="장르">
            <CreateCardDropdown
              value={genre}
              options={GENRE_OPTIONS}
              placeholder="장르를 선택해 주세요"
              onChange={(v) => {
                setGenre(v);
                setTouched((t) => ({ ...t, genre: true }));
              }}
              onBlur={() => setTouched((t) => ({ ...t, genre: true }))}
              className={showError('genre') ? FIELD_ERROR : ''}
            />
            {showError('genre') && <p className="mt-2 text-sm text-red-500">{errors.genre}</p>}
          </FormField>
        </div>

        <div ref={refs.price}>
          <FormField label="가격">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="가격을 입력해 주세요"
              value={price}
              onChange={(e) => setPrice(onlyDigits(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, price: true }))}
              className={[FIELD_CLASS, showError('price') && FIELD_ERROR].filter(Boolean).join(' ')}
            />
            {showError('price') && <p className="mt-2 text-sm text-red-500">{errors.price}</p>}
          </FormField>
        </div>

        <div ref={refs.total}>
          <FormField label="총 발행량">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="총 발행량을 입력해 주세요"
              value={total}
              onChange={(e) => setTotal(onlyDigits(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, total: true }))}
              className={[FIELD_CLASS, showError('total') && FIELD_ERROR].filter(Boolean).join(' ')}
            />
            {showError('total') && <p className="mt-2 text-sm text-red-500">{errors.total}</p>}
          </FormField>
        </div>

        <div ref={refs.file}>
          <FormField label="사진 업로드">
            <div className="flex items-center gap-3 min-w-0">
              {/* Modified: Increased height to h-[120px] to make it at least twice as big visually */}
              <Input
                type="text"
                placeholder="사진 업로드"
                value={file?.name ?? ''}
                disabled
                className={[
                  `${FIELD_TEXT} !h-[120px] flex-1 min-w-0 rounded-[2px] border border-gray-200 bg-black px-[20px] py-[18px] outline-none opacity-100`, 
                  showError('file') && FIELD_ERROR
                ]
                  .filter(Boolean)
                  .join(' ')}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handlePickFile}
              />

              <ButtonPrimary
                type="button"
                size="s"
                thickness="thin"
                className={FILE_BUTTON_CLASS}
                onClick={openFilePicker}
              >
                파일 선택
              </ButtonPrimary>
            </div>

            {showError('file') && <p className="mt-2 text-sm text-red-500">{errors.file}</p>}
          </FormField>
        </div>

        <div ref={refs.desc}>
          <FormField label="포토카드 설명">
            <TextBox
              placeholder="카드 설명을 입력해 주세요"
              value={desc}
              onChange={setDesc}
              wrapperStyle={{ marginTop: 0 }}
              textareaStyle={{
                minHeight: '160px',
                fontSize: '16px',
                fontWeight: 300,
                lineHeight: '100%',
                letterSpacing: '0px',
                color: '#E5E7EB',
                borderRadius: 0,
                borderColor: showError('desc') ? '#ef4444' : '#E5E7EB',
                borderWidth: '1px',
                borderStyle: 'solid',
                backgroundColor: '#000',
                padding: '18px 20px',
                outline: 'none',
              }}
            />
            <div className="mt-2 flex items-center justify-between">
              {showError('desc') ? (
                <p className="text-sm text-red-500">{errors.desc}</p>
              ) : (
                <span className="text-sm text-gray-400">{desc.length}/500</span>
              )}
            </div>
          </FormField>
        </div>

        {submitError && (
          <p ref={submitErrorRef} className="text-sm text-red-500">
            {submitError}
          </p>
        )}

        {userChecked && !creatorUserId && (
          <p className="text-sm text-amber-400">
            로그인 후 포토카드를 생성할 수 있습니다.
          </p>
        )}

        <div className="pt-2">
          <ButtonPrimary
            type="submit"
            size="l"
            thickness="thin"
            fullWidth
            disabled={!isValid || submitting || !creatorUserId}
            className={
              isValid && !submitting && creatorUserId
                ? '!text-black !bg-main hover:!bg-main'
                : '!text-gray-300 !bg-gray-600 cursor-not-allowed'
            }
          >
            {submitting ? '생성 중…' : '생성하기'}
          </ButtonPrimary>
        </div>
      </form>

      <Modal open={fileErrorOpen} onClose={() => setFileErrorOpen(false)} size="sm">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">업로드 불가</h3>
          <p className="text-sm text-gray-300">JPG 또는 PNG 파일만 업로드할 수 있습니다.</p>
          <div className="flex justify-end">
            <ButtonPrimary
              type="button"
              size="s"
              thickness="thin"
              onClick={() => setFileErrorOpen(false)}
            >
              확인
            </ButtonPrimary>
          </div>
        </div>
      </Modal>
    </>
  );
}