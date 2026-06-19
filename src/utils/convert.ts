/**
 * Converts an SVG XML string into a standard JPEG/JPG file and initiates a client download
 * @param svgString Raw SVG markup
 * @param filename Target download filename
 */
export const downloadSvgAsJpg = (svgString: string, filename: string) => {
  try {
    const isSvgInjected = svgString.includes("<svg") || svgString.includes("<SVG");
    if (!isSvgInjected) {
      console.error("Invalid SVG source passed to JPEG converter.");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";

    // Encode SVG to base64 safely supporting Unicode characters
    const encodedSvg = btoa(unescape(encodeURIComponent(svgString.trim())));
    const dataUrl = `data:image/svg+xml;base64,${encodedSvg}`;

    img.onload = () => {
      try {
        // Create an offscreen high-res Canvas
        const canvas = document.createElement("canvas");
        
        // Define clean standard sizes for social visual media sharing (1200x800)
        canvas.width = 1200;
        canvas.height = 800;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("Failed to acquire Canvas 2D rendering handle.");
          return;
        }

        // Fill background with a solid deep color (slate-950 equivalent (#090d16) / white) 
        // to prevent transparent gaps in final JPG (since JPG doesn't support transparency)
        ctx.fillStyle = "#0c1017";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the vector image scaled to size
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Export canvas to target compressed JPG format
        const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.95);

        // Trigger local file download
        const a = document.createElement("a");
        a.href = jpgDataUrl;
        a.download = filename.endsWith(".jpg") ? filename : `${filename}.jpg`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup resources
        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);
      } catch (canvasErr) {
        console.error("Failed to render canvas rasterization:", canvasErr);
        // Fallback to direct SVG file download if canvas writing fails (fallback)
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const fallbackUrl = URL.createObjectURL(svgBlob);
        const fbLink = document.createElement("a");
        fbLink.href = fallbackUrl;
        fbLink.download = `${filename}.svg`;
        document.body.appendChild(fbLink);
        fbLink.click();
        document.body.removeChild(fbLink);
      }
    };

    img.onerror = (err) => {
      console.error("Error loading SVG string as image source:", err);
    };

    img.src = dataUrl;
  } catch (err) {
    console.error("Unexpected error in PWA download converter:", err);
  }
};
