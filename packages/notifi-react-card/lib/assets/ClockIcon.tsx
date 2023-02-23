import React from 'react';

export type Props = React.SVGProps<SVGSVGElement>;

export const ClockIcon: React.FC<Props> = (props: Props) => {
  return (
    <svg
      {...props}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="6" fill="currentCoor" />
      <path d="M6 2V6.5L8.5 9" stroke="transparent" stroke-width="1.5" />
    </svg>
  );
};
