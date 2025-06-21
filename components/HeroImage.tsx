'use client';

import { useState } from 'react';
import Image from 'next/image';

const HeroImage = () => {
  const [imageSrc, setImageSrc] = useState('/images/hero-image.svg');

  const handleError = () => {
    setImageSrc('/images/cta.svg');
  };

  return (
    <Image 
      src={imageSrc} 
      alt="Learning with AI" 
      width={400} 
      height={300}
      className="object-contain"
      onError={handleError}
    />
  );
};

export default HeroImage;