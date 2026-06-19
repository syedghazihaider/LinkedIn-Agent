import React, { useState, useRef, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Maximize2, Move, FileSpreadsheet } from "lucide-react";
import { downloadSvgAsJpg } from "../utils/convert";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // We can pass either a pre-generated SVG string, an image src URL, or direct SVG/HTML element content
  imageSrc?: string;
  svgContent?: string;
  filename?: string;
}

export default function ImageViewerModal({ 
  isOpen, 
  onClose, 
  title, 
  imageSrc, 
  svgContent, 
  filename = "linkedin-agent-visual" 
}: ImageViewerModalProps) {
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Touch gestures for mobile pinch to zoom
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when modal opens or content changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc, svgContent]);

  if (!isOpen) return null;

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Drag to Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch Pan and Pinch actions
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch: Pan starting
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    } else if (e.touches.length === 2) {
      // Double touch: Pinch-to-zoom starting
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && touchStartDist) {
      // Pinch to zoom calculations
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = dist / touchStartDist;
      setZoom(prev => Math.max(0.5, Math.min(prev * diff, 4)));
      setTouchStartDist(dist);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDist(null);
  };

  // Download handle
  const handleDownloadJpg = () => {
    if (imageSrc) {
      // If of standard URL source, convert or load onto canvas
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `${filename}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      };
      img.src = imageSrc;
    } else if (svgContent) {
      // JPG rasterizer for SVG
      downloadSvgAsJpg(svgContent, filename);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/98 backdrop-blur-md text-white font-sans overflow-hidden select-none animate-in fade-in duration-250"
      id="full-screen-image-viewer"
    >
      {/* Top action bar */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <Maximize2 size={16} className="text-blue-400" />
          <h4 className="text-sm font-bold tracking-tight text-white max-w-xs truncate">{title}</h4>
        </div>
        
        {/* Navigation & download menu */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleDownloadJpg}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white hover:scale-103 active:scale-97 font-bold py-1.5 px-3.5 rounded-lg text-xs transition-all cursor-pointer shadow-lg"
          >
            <Download size={13} />
            Download JPG
          </button>
          
          <div className="h-4 w-px bg-white/10" />

          <button 
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 hover:text-white rounded-lg text-white/70 transition-colors cursor-pointer"
            title="Close Full Screen"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          ref={imageRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
          className="max-w-[90%] max-h-[80%] select-none pointer-events-none flex items-center justify-center origin-center shrink-0"
        >
          {svgContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: svgContent }} 
              className="w-full h-full max-w-3xl flex items-center justify-center rounded-xl overflow-hidden [&>svg]:w-full [&>svg]:h-auto [&>svg]:shadow-2xl shadow-indigo-900/10 shrink-0 select-none pointer-events-none"
            />
          ) : imageSrc ? (
            <img 
              src={imageSrc} 
              alt={title} 
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl shrink-0 select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-slate-400 text-xs">No media source provided.</div>
          )}
        </div>

        {/* Small Drag helper text */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[11px] text-slate-400 font-medium select-none pointer-events-none bg-slate-900/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/5">
          <Move size={11} className="text-blue-400" />
          <span>Drag, Pinch, or Zoom to explore details</span>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="p-4 bg-slate-900 border-t border-white/5 flex items-center justify-center gap-4 relative z-10 select-none">
        <button 
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="p-1.8 bg-white/5 hover:bg-white/10 rounded-lg text-white hover:text-blue-400 transition-all cursor-pointer disabled:opacity-40 disabled:hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>

        <span className="text-xs font-mono font-bold w-12 text-center text-slate-300">
          {Math.round(zoom * 100)}%
        </span>

        <button 
          onClick={handleZoomIn}
          disabled={zoom >= 4}
          className="p-1.8 bg-white/5 hover:bg-white/10 rounded-lg text-white hover:text-blue-400 transition-all cursor-pointer disabled:opacity-40"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>

        <div className="h-4 w-px bg-white/10" />

        <button 
          onClick={handleReset}
          className="p-1.8 bg-white/5 hover:bg-white/10 rounded-lg text-white hover:text-blue-400 transition-all cursor-pointer"
          title="Reset Zoom & Pan"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}
