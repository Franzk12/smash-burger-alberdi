import { SVGProps } from "react";

export function BurgerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 28h48c0-12-10-18-24-18S8 16 8 28z"
        fill="currentColor"
        opacity="0.8"
      />
      <rect x="6" y="30" width="52" height="6" rx="2" fill="currentColor" opacity="0.6" />
      <path
        d="M8 38c2 2 4 3 8 3s6-1 8-3c2 2 4 3 8 3s6-1 8-3c2 2 4 3 8 3s6-1 8-3v4c0 3-2 6-6 6H14c-4 0-6-3-6-6v-4z"
        fill="currentColor"
        opacity="0.9"
      />
      <rect x="10" y="46" width="44" height="8" rx="4" fill="currentColor" />
    </svg>
  );
}

export function FriesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="18" y="8" width="6" height="32" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="26" y="4" width="6" height="36" rx="2" fill="currentColor" />
      <rect x="34" y="10" width="6" height="30" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="42" y="6" width="6" height="34" rx="2" fill="currentColor" opacity="0.7" />
      <path
        d="M12 38h40l-4 22H16l-4-22z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

export function OnionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="32" cy="32" r="24" fill="currentColor" opacity="0.3" />
      <circle cx="32" cy="32" r="18" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="32" r="12" fill="currentColor" opacity="0.7" />
      <circle cx="32" cy="32" r="6" fill="currentColor" />
    </svg>
  );
}

export function LettuceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 32c4-8 12-12 24-12s20 4 24 12c-2 4-6 8-12 10-4-4-8-6-12-6s-8 2-12 6c-6-2-10-6-12-10z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M12 36c6 4 12 6 20 6s14-2 20-6c-2 6-8 12-20 12s-18-6-20-12z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

export function CheeseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 24l24-16 24 16v24l-24 8-24-8V24z"
        fill="currentColor"
        opacity="0.8"
      />
      <circle cx="20" cy="32" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="36" cy="28" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="44" cy="38" r="5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
