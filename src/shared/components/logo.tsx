/* eslint-disable @next/next/no-img-element */
import { ServerType } from '@/generated/prisma/enums';
import React from 'react';

interface Props {
  className?: string;
  type: ServerType;
  width: number;
  height: number;
}

export const Logo: React.FC<Props> = ({ width, height, type }) => {
  const src = type === ServerType.AMNEZIA_API ? '/amnezia.svg' : `/wireguard.svg`;
  return (
    <>
      <img src={src} alt='logo' width={width} height={height} />
    </>
  );
};
