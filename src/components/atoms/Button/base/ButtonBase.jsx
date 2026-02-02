'use client';

import Link from 'next/link';

const LINK_PROPS = ['prefetch', 'replace', 'scroll', 'legacyBehavior', 'locale'];

export default function ButtonBase({ children, className = '', disabled = false, href, ...props }) {
  if (href != null && href !== '') {
    const linkProps = {};
    LINK_PROPS.forEach((key) => {
      if (props[key] !== undefined) linkProps[key] = props[key];
    });
    if (props.onClick) linkProps.onClick = props.onClick;
    if (props.style) linkProps.style = props.style;
    return (
      <Link href={href} className={className} {...linkProps}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" {...props} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
