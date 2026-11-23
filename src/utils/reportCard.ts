declare global {
  interface Window {
    html2canvas?: (element: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

export function renderPosterToPng(element: HTMLElement): Promise<Blob> {
  if (!window.html2canvas) {
    return Promise.reject(new Error('html2canvas not loaded'));
  }
  return window.html2canvas(element, { scale: 2, backgroundColor: null, useCORS: true }).then(
    (canvas) =>
      new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG conversion failed'))), 'image/png');
      })
  );
}

export function canSharePosterFiles(file: File): boolean {
  return typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });
}

export function openWhatsAppText(phone: string, text: string): void {
  window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
}

export function buildReportSummary(name: string, roll: string, className: string, marks: string, status: string): string {
  return `गायत्री विद्या मंदिर (GVM) - प्रगति पत्रक
छात्र का नाम: ${name}
रोल नंबर: ${roll}
कक्षा: ${className}
प्राप्त अंक: ${marks}
शिक्षक की टिप्पणी: ${status}
धन्यवाद।`;
}
