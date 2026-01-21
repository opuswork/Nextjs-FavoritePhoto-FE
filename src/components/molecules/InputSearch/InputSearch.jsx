'use client';

import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';

export default function InputSearch({
    placeholder,
    value,
    onChange,
    className,
    onClick,
    error,
    required,
    id,
    disabled,
    icon = <img src="/assets/icons/ic_search.svg" alt="search" width={20} height={20} />
}) {
    return (
        <div className={`flex flex-col ${className ?? ''}`}>
            <div className="relative h-[50px] w-[320px]">
                <Input 
                    type="text" 
                    placeholder={placeholder} 
                    value={value} 
                    onChange={onChange}
                    className="h-full w-full rounded-sm border border-white/40 bg-black px-4 pr-[50px] text-[14px] text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                    required={required}
                    id={id}
                    disabled={disabled}
                />
                <Button 
                    className="absolute right-0 top-0 flex h-full w-[50px] items-center justify-center rounded-r-sm border-l border-white/40 bg-black hover:bg-white/10"
                    onClick={onClick}
                    disabled={disabled}
                >
                    {icon}
                </Button>
            </div>
            {error && <p className="mt-1 text-[12px] text-red-400">{error}</p>}
        </div>
    );
}