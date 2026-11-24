import { useState, useMemo, useEffect } from 'react';
import { AlertCircle, BookOpen, CheckCircle2, ClipboardList, Send } from 'lucide-react';
import {
  classOptions,
  getClassStudents,
  isAuthenticated,
  isClass1To10,
  juniorSubjects,
  sendDiaryToWhatsApp,
} from '@/utils/whatsappAlert';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import PasswordModal from '@/components/PasswordModal';
import StudentSelector from '@/components/StudentSelector';

const textareaClasses =
  'w-full bg-ink-950 border border-ink-600/40 text-white text-sm rounded-lg px-4 py-3 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-y min-h-[100px] placeholder-slate-500';

const INITIAL_CLASS = 'Class 9 B';

const allRollsOf = (className: string): string[] =>
  getClassStudents(className).map((s) => s.roll);

export default function DailyDiaryCenter() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [selectedClass, setSelectedClass] = useState(INITIAL_CLASS);
  const [selectedSubject, setSelectedSubject] = useState(juniorSubjects[0]);
  const [selectedRolls, setSelectedRolls] = useState<string[]>(() => allRollsOf(INITIAL_CLASS));
  const [classwork, setClasswork] = useState('');
  const [homework, setHomework] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const onUpdate = () => setRefreshTick((t) => t + 1);
    window.addEventListener('gvm-students-updated', onUpdate);
    return () => window.removeEventListener('gvm-students-updated', onUpdate);
  }, []);

  const students = useMemo(
    () => getClassStudents(selectedClass),
    [selectedClass, refreshTick]
  );

  const showSubjectPicker = isClass1To10(selectedClass);

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setSelectedRolls(allRollsOf(className));
    setError('');
  };

  const doSend = () => {
    sendDiaryToWhatsApp(
      selectedClass,
      selectedRolls,
      classwork.trim(),
      homework.trim(),
      showSubjectPicker ? selectedSubject : undefined
    );
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setClasswork('');
      setHomework('');
      setSelectedRolls(allRollsOf(selectedClass));
    }, 3500);
  };

  const handleSendClick = () => {
    setError('');
    if (!classwork.trim()) {
      setError('कृपया आज कक्षा में पढ़ाया गया विषय लिखें!');
      return;
    }
    if (!homework.trim()) {
      setError('कृपया आज का गृहकार्य लिखें!');
      return;
    }
    if (selectedRolls.length === 0) {
      setError('कृपया कम से कम एक छात्र चुनें!');
      return;
    }
    if (isAuthenticated()) {
      doSend();
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    doSend();
  };

  const sendLabel =
    selectedRolls.length === students.length
      ? `पूरी क्लास को आज की डायरी भेजें (${selectedRolls.length})`
      : `चुने गए ${selectedRolls.length} छात्रों को डायरी भेजें`;

  return (
    <section
      id="daily-diary"
      className="relative py-20 sm:py-28 bg-ink-850 scroll-mt-20 border-t border-ink-600/30"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

      <div ref={ref} className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="reveal inline-block">
            <span className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase mb-2 block">
              Daily Diary & HW Center • दैनिक डायरी
            </span>
            <h2 className="font-devanagari font-bold text-2xl sm:text-4xl text-amber-500 mb-3">
              दैनिक डायरी और गृहकार्य
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              आज की पढ़ाई और गृहकार्य लिखें, छात्र चुनें, फिर पूरी क्लास के माता-पिता को WhatsApp पर भेजें।
            </p>
          </div>
        </div>

        <div className="reveal p-6 sm:p-8 rounded-2xl bg-ink-800 border border-ink-600/40">
          {sent ? (
            <div className="flex flex-col items-center justify-center text-center py-14 animate-scaleIn">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-devanagari font-bold text-lg text-white mb-2">
                डायरी भेजी गई!
              </h3>
              <p className="text-sm text-slate-400">
                {selectedRolls.length} छात्रों के माता-पिता को WhatsApp संदेश नए टैब में खुल रहे हैं।
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white font-medium mb-2.5">
                    कक्षा चुनें (Select Class)
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-ink-900 border border-ink-600/50 text-sm text-white outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
                  >
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {showSubjectPicker && (
                  <div>
                    <label className="block text-sm text-white font-medium mb-2.5">
                      विषय चुनें (Select Subject)
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-ink-900 border border-ink-600/50 text-sm text-white outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
                    >
                      {juniorSubjects.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-white font-medium mb-2.5">
                  1. आज कक्षा में क्या पढ़ाया (Classwork Description)
                </label>
                <textarea
                  value={classwork}
                  onChange={(e) => setClasswork(e.target.value)}
                  placeholder="जैसे: पाठ 3 का सार एवं प्रश्नोत्तर समझाया"
                  className={textareaClasses}
                />
              </div>

              <div>
                <label className="block text-sm text-white font-medium mb-2.5">
                  2. आज का गृहकार्य (Homework Assignment)
                </label>
                <textarea
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  placeholder="जैसे: अभ्यास प्रश्न 1 से 10 कॉपी में लिखकर लाएं"
                  className={textareaClasses}
                />
              </div>

              {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 rounded-xl bg-ink-900/40 border border-ink-600/30">
                  <ClipboardList className="w-10 h-10 text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400">
                    इस कक्षा का छात्र डेटा अभी उपलब्ध नहीं है। नीचे एडमिन पैनल से छात्र जोड़ें।
                  </p>
                </div>
              ) : (
                <StudentSelector
                  students={students}
                  selectedRolls={selectedRolls}
                  onChange={setSelectedRolls}
                />
              )}

              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-slideDown">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleSendClick}
                disabled={students.length === 0 || selectedRolls.length === 0}
                className="w-full py-3.5 rounded-lg bg-green-600 text-white font-bold text-base hover:bg-green-500 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ boxShadow: '0 4px 12px rgba(35, 197, 94, 0.3)' }}
              >
                <Send className="w-4 h-4" />
                {sendLabel}
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <BookOpen className="w-3.5 h-3.5" />
                <span>संदेश हर चुने हुए छात्र के माता-पिता के WhatsApp पर खुलेगा।</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal
          description="डायरी भेजने के लिए कृपया पासवर्ड दर्ज करें"
          onClose={() => setShowPasswordModal(false)}
                    onAuthenticated={handlePasswordSuccess}
        />
      )}
    </section>
  );
}

