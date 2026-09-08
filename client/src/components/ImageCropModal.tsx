import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, RotateCw, Check, X, Sparkles } from 'lucide-react';
import { Area, getCroppedImg } from '../utils/cropImage.js';

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
  title?: string;
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  cropShape = 'round',
  title = 'फोटो क्रॉप व ऑप्टिमाइझ करा (Crop & Optimize)',
  maxWidth = 600,
  maxHeight = 600,
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropAreaComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        maxWidth,
        maxHeight,
        0.85,
        `optimized-${Date.now()}.webp`
      );
      const previewUrl = URL.createObjectURL(croppedFile);
      onCropComplete(croppedFile, previewUrl);
      onClose();
    } catch (e) {
      console.error('Failed to crop image:', e);
      alert('फोटो क्रॉप करण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full flex flex-col border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Viewport */}
        <div className="relative w-full h-80 bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
          />
        </div>

        {/* Controls */}
        <div className="p-6 space-y-5 bg-white">
          
          {/* Zoom & Rotate Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center space-x-1">
                <ZoomIn className="w-4 h-4 text-orange-600" />
                <span>झूम (Zoom): {zoom.toFixed(1)}x</span>
              </span>
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition text-xs"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-600" />
                <span>फिरवा (Rotate 90°)</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-orange-50 border border-orange-100 rounded-xl p-2.5 text-center">
            ⚡ हा फोटो आपोआप <strong>WebP फॉरमॅट (~40KB)</strong> मध्ये कॉम्प्रेस केला जाईल ज्यामुळे साईट जलद लोड होईल.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
            >
              रद्द करा (Cancel)
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSave}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 transition flex items-center space-x-2 text-xs disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'प्रक्रिया सुरू आहे...' : 'क्रॉप व सेव्ह करा (Apply Crop)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
