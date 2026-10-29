'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  Check,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Loader2,
  Info,
} from 'lucide-react';

export interface CropTargetSpec {
  title: string;
  role: string;
  targetWidth: number;
  targetHeight: number;
  aspectRatioLabel: string;
}

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  spec: CropTargetSpec;
  onCropComplete: (croppedBlob: Blob, filename: string) => Promise<void>;
}

export function ImageCropperModal({
  isOpen,
  onClose,
  imageFile,
  spec,
  onCropComplete,
}: ImageCropperModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropMode, setCropMode] = useState<'smart' | 'fill' | 'fit'>('smart');
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load image when file changes
  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setImageSrc(url);

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      imageRef.current = img;
      setNaturalWidth(img.naturalWidth);
      setNaturalHeight(img.naturalHeight);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setCropMode('smart');
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  // Target aspect ratio
  const targetAspect = spec.targetWidth / spec.targetHeight;

  // Calculate preview dimensions that fit comfortably within 420w x 270h
  const getPreviewDims = useCallback(() => {
    const maxW = 420;
    const maxH = 270;
    let w = maxW;
    let h = Math.round(w / targetAspect);
    if (h > maxH) {
      h = maxH;
      w = Math.round(h * targetAspect);
    }
    return { previewWidth: Math.max(160, w), previewHeight: Math.max(120, h) };
  }, [targetAspect]);

  // Redraw preview canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { previewWidth, previewHeight } = getPreviewDims();

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    // Clear background with soft warm paper tone
    ctx.fillStyle = '#FBF3EA';
    ctx.fillRect(0, 0, previewWidth, previewHeight);

    ctx.save();

    // Center origin
    ctx.translate(previewWidth / 2 + pan.x, previewHeight / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate smart scale to cover the canvas
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawW: number;
    let drawH: number;

    if (cropMode === 'fit') {
      if (imgAspect > targetAspect) {
        drawW = previewWidth;
        drawH = previewWidth / imgAspect;
      } else {
        drawH = previewHeight;
        drawW = previewHeight * imgAspect;
      }
    } else {
      // Smart fill / cover
      if (imgAspect > targetAspect) {
        drawH = previewHeight;
        drawW = previewHeight * imgAspect;
      } else {
        drawW = previewWidth;
        drawH = previewWidth / imgAspect;
      }
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [pan, rotation, zoom, targetAspect, cropMode, getPreviewDims]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Mouse / Touch Dragging for Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Generate Final High-DPI Output
  const handleApplyCrop = async () => {
    const img = imageRef.current;
    if (!img) return;

    setIsProcessing(true);

    try {
      // Create high-res offscreen canvas with target resolution
      const outCanvas = document.createElement('canvas');
      outCanvas.width = spec.targetWidth;
      outCanvas.height = spec.targetHeight;
      const ctx = outCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background fill
      ctx.fillStyle = '#FBF3EA';
      ctx.fillRect(0, 0, spec.targetWidth, spec.targetHeight);

      ctx.save();

      // Scale pan and zoom to target resolution
      const { previewWidth } = getPreviewDims();
      const scaleFactor = spec.targetWidth / previewWidth;
      ctx.translate(
        spec.targetWidth / 2 + pan.x * scaleFactor,
        spec.targetHeight / 2 + pan.y * scaleFactor
      );
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW: number;
      let drawH: number;

      if (cropMode === 'fit') {
        if (imgAspect > targetAspect) {
          drawW = spec.targetWidth;
          drawH = spec.targetWidth / imgAspect;
        } else {
          drawH = spec.targetHeight;
          drawW = spec.targetHeight * imgAspect;
        }
      } else {
        if (imgAspect > targetAspect) {
          drawH = spec.targetHeight;
          drawW = spec.targetHeight * imgAspect;
        } else {
          drawW = spec.targetWidth;
          drawH = spec.targetWidth / imgAspect;
        }
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Export as high-quality WebP blob (or JPEG fallback)
      const blob = await new Promise<Blob | null>((resolve) => {
        outCanvas.toBlob(resolve, 'image/webp', 0.92);
      });

      if (!blob) throw new Error('Failed to export cropped image');

      const cleanName = imageFile?.name
        ? imageFile.name.replace(/\.[^/.]+$/, '') + '-cropped.webp'
        : 'cropped-image.webp';

      await onCropComplete(blob, cleanName);
      onClose();
    } catch (err) {
      console.error('Crop failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageFile) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-3 sm:p-5 flex items-center justify-center animate-fade-in">
      <div
        className="bg-paper-cream dark:bg-night-surface rounded-2xl sm:rounded-3xl border border-paper-border dark:border-night-border max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header */}
        <div className="flex-shrink-0 px-5 sm:px-6 py-3.5 border-b border-paper-border/70 dark:border-night-border flex items-center justify-between bg-paper-warm/50 dark:bg-night-card">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-muted text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-brown-deep dark:text-night-text leading-tight">
                Intelligent Auto-Crop & Resolution
              </h3>
              <p className="text-xs text-brown-muted dark:text-night-muted line-clamp-1">
                {spec.title} ({spec.role})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brown-muted hover:text-brown-deep dark:hover:text-night-text hover:bg-paper-blush/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pinned Resolution Recommendation Badge */}
        <div className="flex-shrink-0 px-5 sm:px-6 py-2.5 bg-amber-50/90 dark:bg-amber-950/40 border-b border-amber-200/70 text-xs text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Target Resolution:</strong> {spec.targetWidth} × {spec.targetHeight} px ({spec.aspectRatioLabel})
            </span>
          </div>
          {naturalWidth > 0 && (
            <span className="font-mono text-[11px] text-brown-muted">
              Uploaded: {naturalWidth} × {naturalHeight} px
            </span>
          )}
        </div>

        {/* Scrollable Center Body: Canvas + Adjustments */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Interactive Canvas Area */}
          <div className="p-4 sm:p-5 flex flex-col items-center justify-center bg-paper/50 dark:bg-black/20 select-none">
            <div
              className="relative rounded-xl overflow-hidden border-2 border-dashed border-rose-muted/60 shadow-md cursor-grab active:cursor-grabbing inline-block"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas ref={canvasRef} className="block shadow-inner" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/65 text-white text-[10px] pointer-events-none backdrop-blur-xs">
                Drag to pan · Slider to zoom
              </div>
            </div>

            <p className="font-handwriting text-xs sm:text-sm text-brown-muted mt-2.5">
              Auto-centered to match the exact {spec.aspectRatioLabel} layout ♡
            </p>
          </div>

          {/* Controls Toolbar */}
          <div className="p-4 sm:p-5 border-t border-paper-border/60 bg-paper-warm/30 dark:bg-night-card space-y-3.5 text-xs">
            {/* Mode presets */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-brown-deep dark:text-night-text">Crop Style:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCropMode('smart');
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    cropMode === 'smart'
                      ? 'bg-rose-muted text-white shadow-sm'
                      : 'bg-paper-cream dark:bg-night-surface text-brown-muted hover:text-brown-deep border border-paper-border/60'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Smart Auto-Crop</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCropMode('fit');
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    cropMode === 'fit'
                      ? 'bg-rose-muted text-white shadow-sm'
                      : 'bg-paper-cream dark:bg-night-surface text-brown-muted hover:text-brown-deep border border-paper-border/60'
                  }`}
                >
                  Fit Inside
                </button>
              </div>
            </div>

            {/* Zoom and Rotate controls */}
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-2">
                <ZoomOut className="w-3.5 h-3.5 text-brown-muted" />
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-rose-muted cursor-pointer"
                />
                <ZoomIn className="w-3.5 h-3.5 text-brown-muted" />
                <span className="font-mono text-[11px] w-9 text-right text-brown-muted">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-lg border border-paper-border bg-paper-cream hover:bg-paper-blush/50 text-brown-deep transition-colors flex items-center gap-1"
                title="Rotate 90° clockwise"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono">90°</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pinned Footer Actions (Guaranteed visible at bottom) */}
        <div className="flex-shrink-0 px-5 sm:px-6 py-3.5 border-t border-paper-border/70 flex items-center justify-between gap-3 bg-paper-cream dark:bg-night-surface sticky bottom-0 z-20 shadow-md">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-paper-border text-xs font-semibold text-brown-deep dark:text-night-text hover:bg-paper-warm transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-brown-deep dark:bg-rose-muted hover:bg-rose-deep text-paper-warm dark:text-night-bg text-xs font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Cropping & Updating...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Apply Crop & Update Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
