const GOLD = '#b8860b';
const GOLD_LIGHT = '#d4af37';
const INK = '#1f2937';
const PAPER = '#fbf7ec';
const BLANK = '_______________';

export interface CertificateData {
  studentName: string;
  className: string;
  eventName: string;
  position: string;
}

interface CertificateSheetProps extends CertificateData {
  printDate: string;
}

function Filled({ value, minWidth }: { value: string; minWidth: string }) {
  if (value) {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '0 10px',
          fontWeight: 700,
          color: INK,
          borderBottom: `1.5px solid ${GOLD}`,
        }}
      >
        {value}
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-block', minWidth, textAlign: 'center', color: INK, letterSpacing: '0.1em' }}>
      {BLANK}
    </span>
  );
}

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const top = position.startsWith('t');
  const left = position.endsWith('l');
  return (
    <span
      style={{
        position: 'absolute',
        width: '18mm',
        height: '18mm',
        top: top ? '6mm' : undefined,
        bottom: top ? undefined : '6mm',
        left: left ? '6mm' : undefined,
        right: left ? undefined : '6mm',
        borderTop: top ? `2px solid ${GOLD}` : undefined,
        borderBottom: top ? undefined : `2px solid ${GOLD}`,
        borderLeft: left ? `2px solid ${GOLD}` : undefined,
        borderRight: left ? undefined : `2px solid ${GOLD}`,
      }}
    />
  );
}

export default function CertificateSheet({ studentName, className, eventName, position, printDate }: CertificateSheetProps) {
  return (
    <div
      className="certificate-sheet"
      style={{
        width: '297mm',
        height: '210mm',
        boxSizing: 'border-box',
        padding: '8mm',
        background: '#ffffff',
        fontFamily: "'Noto Serif Devanagari', 'Noto Sans Devanagari', serif",
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          border: `1px solid ${GOLD}`,
          outline: `4px double ${GOLD_LIGHT}`,
          outlineOffset: '-10px',
          background: `radial-gradient(ellipse at center, #fffdf6 0%, ${PAPER} 100%)`,
          padding: '20mm 28mm',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          color: INK,
        }}
      >
        <Corner position="tl" />
        <Corner position="tr" />
        <Corner position="bl" />
        <Corner position="br" />

        <p style={{ margin: 0, fontSize: '15pt', fontWeight: 700, color: GOLD }}>गायत्री विद्या मंदिर (GVM)</p>
        <p style={{ margin: '2mm 0 0', fontSize: '10pt', letterSpacing: '0.2em', color: '#6b7280' }}>
          उच्चतर माध्यमिक विद्यालय
        </p>

        <h1 style={{ margin: '7mm 0 0', fontSize: '40pt', fontWeight: 800, color: GOLD, lineHeight: 1.2 }}>
          प्रमाण पत्र
        </h1>
        <p style={{ margin: '1mm 0 0', fontSize: '10pt', letterSpacing: '0.35em', color: '#6b7280' }}>
          CERTIFICATE OF ACHIEVEMENT
        </p>

        <div style={{ margin: '6mm 0 5mm', width: '120mm', height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

        <p style={{ margin: 0, fontSize: '14pt' }}>यह प्रमाणित किया जाता है कि</p>
        <p style={{ margin: '5mm 0 0', fontSize: '28pt', lineHeight: 1.4 }}>
          <Filled value={studentName} minWidth="120mm" />
        </p>
        <p style={{ margin: '5mm 0 0', fontSize: '14pt', lineHeight: 1.8, maxWidth: '200mm' }}>
          कक्षा <Filled value={className} minWidth="30mm" /> के विद्यार्थी ने{' '}
          <Filled value={eventName} minWidth="70mm" /> में{' '}
          <Filled value={position} minWidth="50mm" /> प्राप्त करके विद्यालय का गौरव बढ़ाया है।
        </p>

        <div style={{ flex: 1 }} />

        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11pt' }}>
          <span style={{ textAlign: 'center', width: '60mm' }}>
            <span style={{ display: 'block', borderTop: `1px solid ${INK}`, marginBottom: '2mm' }} />
            कक्षा शिक्षक
          </span>
          <span style={{ textAlign: 'center' }}>दिनांक: {printDate}</span>
          <span style={{ textAlign: 'center', width: '60mm' }}>
            <span style={{ display: 'block', borderTop: `1px solid ${INK}`, marginBottom: '2mm' }} />
            प्रधानाचार्य
          </span>
        </div>
      </div>
    </div>
  );
}
