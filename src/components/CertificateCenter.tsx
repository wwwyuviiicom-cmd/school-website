import { useMemo, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { AlertCircle, Award, Lock, Printer, Unlock } from 'lucide-react';
import { classOptions, getClassStudents, isAuthenticated } from '@/utils/whatsappAlert';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import PasswordModal from '@/components/PasswordModal';
import CertificateSheet, { type CertificateData } from '@/components/CertificateSheet';

const POSITION_OPTIONS = ['प्रथम स्थान', 'द्वितीय स्थान', 'तृतीय स्थान', 'सराहनीय भागीदारी'];
const REAL_DATA_CLASS = '9th B';

const inputClasses =
  'w-full bg-ink-950 border border-ink-600/40 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-amber-500/50 transition-colors';

function formatToday(): string {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CertificateCenter() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [unlocked, setUnlocked] = useState(isAuthenticated);
  const [needsPassword, setNeedsPassword] = useState(false);

  const [selectedClass, setSelectedClass] = useState(REAL_DATA_CLASS);
  const [studentName, setStudentName] = useState('');
  const [eventName, setEventName] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [printData, setPrintData] = useState<CertificateData | null>(null);

  const realStudents = useMemo(() => getClassStudents(REAL_DATA_CLASS), []);
  const usesStudentList = selectedClass === REAL_DATA_CLASS;

  const printCertificate = (data: CertificateData) => {
    flushSync(() => setPrintData(data));
    window.print();
  };

  const handleFilledPrint = () => {
    setError('');
    if (!studentName.trim()) {
      setError('कृपया छात्र का नाम चुनें या लिखें!');
      return;
    }
    if (!eventName.trim()) {
      setError('कृपया प्रतियोगिता/कार्यक्रम का नाम भरें!');
      return;
    }
    if (!position) {
      setError('कृपया स्थान (Position) चुनें!');
      return;
    }
    printCertificate({
      studentName: studentName.trim(),
      className: selectedClass,
      eventName: eventName.trim(),
      position,
    });
  };

  const handleBlankPrint = () => {
    setError('');
    printCertificate({ studentName: '', className: '', eventName: eventName.trim(), position });
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setStudentName('');
    setError('');
  };

  return (
    <section
      id="certificate-center"
      className="relative py-20 sm:py-28 bg-ink-900 scroll-mt-20 border-t border-ink-600/30"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div ref={ref} className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="reveal inline-block">
            <span className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase mb-2 block">
              Digital Certificate Center • प्रमाण पत्र
            </span>
            <h2 className="font-devanagari font-bold text-2xl sm:text-4xl text-amber-500 mb-3">
              डिजिटल सर्टिफिकेट जनरेटर (Digital Certificate Center)
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              छात्र, कार्यक्रम और स्थान चुनकर प्रमाण पत्र प्रिंट करें या खाली प्रमाण पत्र लें।
            </p>
          </div>
        </div>

        <div className="reveal p-6 sm:p-8 rounded-2xl bg-ink-800 border border-ink-600/40">
          {!unlocked ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-devanagari font-bold text-lg text-white mb-2">यह अनुभाग सुरक्षित है</h3>
              <p className="text-sm text-slate-400 mb-6">प्रमाण पत्र बनाने के लिए पासवर्ड दर्ज करें।</p>
              <button
                onClick={() => setNeedsPassword(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-ink-950 text-sm font-bold hover:bg-amber-400 active:scale-95 transition-all duration-200"
              >
                <Unlock className="w-4 h-4" />
                पासवर्ड डालकर खोलें
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white font-medium mb-2.5">कक्षा चुनें (Select Class)</label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-ink-900 border border-ink-600/50 text-sm text-white outline-none focus:border-amber-500/50 transition-colors cursor-pointer min-w-[120px]"
                >
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">छात्र का नाम (Student Name)</label>
                {usesStudentList ? (
                  <select
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className={`${inputClasses} cursor-pointer`}
                  >
                    <option value="">-- छात्र चुनें --</option>
                    {realStudents.map(({ roll, info }) => (
                      <option key={roll} value={info.name}>
                        रोल {roll}. {info.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="छात्र का नाम लिखें"
                    className={inputClasses}
                  />
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  प्रतियोगिता/कार्यक्रम का नाम (Event Name)
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="जैसे: अंतर-विद्यालय विज्ञान मेला"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">स्थान (Position)</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className={`${inputClasses} cursor-pointer`}
                >
                  <option value="">-- स्थान चुनें --</option>
                  {POSITION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-slideDown">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleFilledPrint}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 text-ink-950 text-sm font-bold hover:bg-amber-400 active:scale-95 transition-all duration-200"
                >
                  <Award className="w-4 h-4" />
                  सर्टिफिकेट तैयार करें और प्रिंट करें
                </button>
                <button
                  onClick={handleBlankPrint}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-ink-700/60 text-slate-200 text-sm font-medium border border-ink-600/40 hover:text-white hover:border-ink-500/60 active:scale-95 transition-all duration-200"
                >
                  <Printer className="w-4 h-4" />
                  खाली सर्टिफिकेट प्रिंट करें (Blank)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {needsPassword && (
        <PasswordModal
          description="डिजिटल सर्टिफिकेट केंद्र खोलने के लिए कृपया पासवर्ड दर्ज करें"
          onClose={() => setNeedsPassword(false)}
          onAuthenticated={() => {
            setNeedsPassword(false);
            setUnlocked(true);
          }}
        />
      )}

      {printData &&
        createPortal(
          <div id="certificate-print">
            <CertificateSheet {...printData} printDate={formatToday()} />
          </div>,
          document.body
        )}
    </section>
  );
}
