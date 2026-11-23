interface ReportCardPosterProps {
  name: string;
  roll: string;
  className: string;
  marks: string;
  status: string;
}

const GOLD = '#d4af37';
const GOLD_LIGHT = '#f6e7a1';

export default function ReportCardPoster({ name, roll, className, marks, status }: ReportCardPosterProps) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const fieldBox = {
    background: 'rgba(255, 255, 255, 0.06)',
    border: `1px solid rgba(212, 175, 55, 0.45)`,
    borderRadius: '16px',
    padding: '20px 24px',
  } as const;

  const fieldLabel = {
    color: GOLD_LIGHT,
    fontSize: '15px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  } as const;

  const fieldValue = {
    color: '#ffffff',
    fontSize: '30px',
    fontWeight: 700,
    lineHeight: 1.3,
  } as const;

  return (
    <div
      className="font-devanagari"
      style={{
        width: '720px',
        height: '960px',
        boxSizing: 'border-box',
        padding: '18px',
        background: GOLD,
        borderRadius: '28px',
      }}
    >
      <div
        style={{
          height: '100%',
          boxSizing: 'border-box',
          border: `2px solid ${GOLD_LIGHT}`,
          borderRadius: '20px',
          background: 'linear-gradient(160deg, #0b1f3a 0%, #14365f 55%, #0a1a33 100%)',
          padding: '48px 52px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ color: GOLD_LIGHT, fontSize: '18px', letterSpacing: '0.2em', marginBottom: '12px' }}>
            DIGITAL REPORT CARD
          </p>
          <h1 style={{ color: GOLD, fontSize: '40px', fontWeight: 800, lineHeight: 1.25, margin: 0 }}>
            गायत्री विद्या मंदिर (GVM) - प्रगति पत्रक
          </h1>
          <div
            style={{
              margin: '20px auto 0',
              width: '160px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />
        </div>

        <div style={{ display: 'grid', gap: '20px', flex: 1 }}>
          <div style={fieldBox}>
            <p style={fieldLabel}>छात्र का नाम (Student Name)</p>
            <p style={fieldValue}>{name}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={fieldBox}>
              <p style={fieldLabel}>रोल नंबर (Roll No.)</p>
              <p style={fieldValue}>{roll}</p>
            </div>
            <div style={fieldBox}>
              <p style={fieldLabel}>कक्षा (Class)</p>
              <p style={fieldValue}>{className}</p>
            </div>
          </div>

          <div style={fieldBox}>
            <p style={fieldLabel}>प्राप्त अंक (Marks Obtained)</p>
            <p style={{ ...fieldValue, color: GOLD, fontSize: '56px' }}>{marks}</p>
          </div>

          <div style={fieldBox}>
            <p style={fieldLabel}>शिक्षक की टिप्पणी / स्थिति (Teacher's Remarks)</p>
            <p style={{ ...fieldValue, fontSize: '28px' }}>{status}</p>
          </div>
        </div>

        <div
          style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: `1px solid rgba(212, 175, 55, 0.45)`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: GOLD_LIGHT,
            fontSize: '16px',
          }}
        >
          <span>दिनांक: {today}</span>
          <span style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', width: '200px', borderTop: `1px solid ${GOLD_LIGHT}`, marginBottom: '6px' }} />
            कक्षा शिक्षक / प्रधानाचार्य
          </span>
        </div>
      </div>
    </div>
  );
}
