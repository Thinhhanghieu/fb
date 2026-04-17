'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from 'lucide-react';
import { AppButton } from '@/components/shared/AppButton';
import { cn } from '@/lib/utils';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

export function Lightbox({ isOpen, onClose, images, initialIndex }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handlePrevious, handleNext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white z-10">
        <div className="text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
        <div className="flex items-center gap-2">
          <AppButton
            variant="icon"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={isZoomed ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            onClick={() => setIsZoomed(!isZoomed)}
          />
          <AppButton
            variant="icon"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={<Download size={20} />}
            onClick={() => {
              const link = document.createElement('a');
              link.href = images[currentIndex];
              link.download = `image-${currentIndex}.jpg`;
              link.click();
            }}
          />
          <AppButton
            variant="icon"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={<X size={24} />}
            onClick={onClose}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4 md:p-8">
        <button
          onClick={handlePrevious}
          className="absolute left-4 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hidden md:block"
        >
          <ChevronLeft size={32} />
        </button>

        <div 
          className={cn(
            "relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out",
            isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in scale-100"
          )}
          onClick={() => !isZoomed && setIsZoomed(true)}
        >
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hidden md:block"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Footer / Thumbnails (Optional) */}
      <div className="p-4 flex justify-center gap-2 overflow-x-auto no-scrollbar pb-8">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-12 h-12 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all",
              currentIndex === idx ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-100"
            )}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
