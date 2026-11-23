import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Share2 } from 'lucide-react';
import ReportCardPoster from '@/components/ReportCardPoster';
import {
  buildReportSummary,
  canSharePosterFiles,
  openWhatsAppText,
  renderPosterToPng,
} from '@/utils/reportCard';

export interface ReportCardItem {
  roll: string;
  name: string;
  phone: string;
  marks: string;
  status: string;
}

interface ReportCardShareListProps {
  items: ReportCardItem[];
  className: string;
  onBack: () => void;
}

type ImageState = { kind: 'pending' } | { kind: 'ready'; blob: Blob } | { kind: 'error' };
type ShareState = 'idle' | 'shared' | 'fallback';

export default function ReportCardShareList({ items, className, onBack }: ReportCardShareListProps) {
  const posterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [images, setImages] = useState<Record<string, ImageState>>({});
  const [shareStates, setShareStates] = useState<Record<string, ShareState>>({});

  useEffect(() => {
    let cancelled = false;
    setImages(Object.fromEntries(items.map((item) => [item.roll, { kind: 'pending' } as ImageState])));

    (async () => {
      for (const item of items) {
        const element = posterRefs.current[item.roll];
        if (!element) continue;
        let next: ImageState;
        try {
          next = { kind: 'ready', blob: await renderPosterToPng(element) };
        } catch {
          next = { kind: 'error' };
        }
        if (cancelled) return;
        setImages((prev) => ({ ...prev, [item.roll]: next }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const handleShare = async (item: ReportCardItem) => {
    const image = images[item.roll];
    const summary = buildReportSummary(item.name, item.roll, className, item.marks, item.status);
    if (image?.kind !== 'ready') return;

    const file = new File([image.blob], `pragati-patrak-${item.roll}.png`, { type: 'image/png' });
    if (!canSharePosterFiles(file)) {
      openWhatsAppText(item.phone, summary);
      setShareStates((prev) => ({ ...prev, [item.roll]: 'fallback' }));
      return;
    }

    try {
      await navigator.share({ files: [file], title: 'प्रगति पत्रक', text: summary });
      setShareStates((prev) => ({ ...prev, [item.roll]: 'shared' }));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      openWhatsAppText(item.phone, summary);
      setShareStates((prev) => ({ ...prev, [item.roll]: 'fallback' }));
    }
  };

  const readyCount = items.filter((item) => images[item.roll]?.kind === 'ready').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-devanagari font-bold text-lg text-white">प्रगति पत्रक तैयार</h3>
          <p className="text-xs text-slate-400 mt-1">
            {readyCount} / {items.length} पत्रक तैयार हैं। हर छात्र के लिए शेयर बटन दबाएँ।
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-ink-700/60 text-slate-300 border border-ink-600/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          वापस जाएँ
        </button>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const image = images[item.roll] ?? { kind: 'pending' };
          const shareState = shareStates[item.roll] ?? 'idle';
          return (
            <div
              key={item.roll}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-ink-900/60 border border-ink-600/30"
            >
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  रोल {item.roll}. {item.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {image.kind === 'pending' && 'पत्रक बन रहा है...'}
                  {image.kind === 'error' && 'पत्रक बनाने में समस्या हुई।'}
                  {image.kind === 'ready' && shareState === 'idle' && 'पत्रक तैयार है'}
                  {shareState === 'shared' && 'शेयर किया गया'}
                  {shareState === 'fallback' && 'WhatsApp पर सारांश खोला गया'}
                </p>
              </div>
              <button
                onClick={() => handleShare(item)}
                disabled={image.kind !== 'ready'}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {image.kind === 'pending' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {image.kind === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
                {image.kind === 'ready' && shareState === 'shared' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {image.kind === 'ready' && shareState !== 'shared' && <Share2 className="w-3.5 h-3.5" />}
                शेयर करें
              </button>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        style={{ position: 'fixed', left: '-10000px', top: 0, pointerEvents: 'none' }}
      >
        {items.map((item) => (
          <div
            key={item.roll}
            ref={(el) => {
              posterRefs.current[item.roll] = el;
            }}
          >
            <ReportCardPoster
              name={item.name}
              roll={item.roll}
              className={className}
              marks={item.marks}
              status={item.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
