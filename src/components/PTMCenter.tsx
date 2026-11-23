import { useState, useMemo } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
  User,
  UserRound,
  Layers,
} from 'lucide-react';
import {
  ptmStatusOptions,
  classOptions,
  getClassStudents,
  getStudentInfo,
  sendSinglePtmToWhatsApp,
  sendPtmToWhatsApp,
  isAuthenticated,
} from '@/utils/whatsappAlert';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import PasswordModal from '@/components/PasswordModal';
import StudentSelector from '@/components/StudentSelector';
import ReportCardShareList, { type ReportCardItem } from '@/components/ReportCardShareList';

interface PtmEntry {
  marks: string;
  status: string;
}

type Mode = 'individual' | 'bulk';
type PendingAction = { type: 'single'; roll: string } | { type: 'all' } | { type: 'bulk' };

const EMPTY_ENTRY: PtmEntry = { marks: '', status: '' };

export default function PTMCenter() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [mode, setMode] = useState<Mode>('individual');
  const [selectedClass, setSelectedClass] = useState('11th Chemistry');
  const [entries, setEntries] = useState<Record<string, PtmEntry>>({});
  const [error, setError] = useState('');
  const [sentRoll, setSentRoll] = useState<string | null>(null);
  const [sentAll, setSentAll] = useState(false);

  const [bulkMarks, setBulkMarks] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [selectedRolls, setSelectedRolls] = useState<string[]>([]);
  const [reportBatch, setReportBatch] = useState<ReportCardItem[] | null>(null);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const students = useMemo(() => getClassStudents(selectedClass), [selectedClass]);
  const maleStudents = students.filter((s) => s.info.gender === 'male');
  const femaleStudents = students.filter((s) => s.info.gender === 'female');

  const getEntry = (roll: string): PtmEntry => entries[roll] ?? EMPTY_ENTRY;

  const updateEntry = (roll: string, field: keyof PtmEntry, value: string) => {
    setEntries((prev) => ({
      ...prev,
      [roll]: { ...getEntry(roll), [field]: value },
    }));
  };

  const filledEntries = useMemo(
    () =>
      students
        .filter((s) => {
          const e = entries[s.roll] ?? EMPTY_ENTRY;
          return e.marks.trim() !== '' && e.status !== '';
        })
        .map((s) => ({
          roll: s.roll,
          marks: entries[s.roll].marks,
          status: entries[s.roll].status,
        })),
    [entries, students]
  );

  const validateSingle = (roll: string): string | null => {
    const entry = getEntry(roll);
    if (!entry.marks.trim()) {
      return 'कृपया पहले छात्र के टेस्ट के मार्क्स भरें!';
    }
    if (!entry.status) {
      return 'कृपया छात्र की पढ़ाई का स्तर चुनें!';
    }
    return null;
  };

  const validateBulk = (): string | null => {
    if (selectedRolls.length === 0) {
      return 'कृपया कम से कम एक छात्र चुनें!';
    }
    if (!bulkMarks.trim()) {
      return 'कृपया सभी के लिए मार्क्स भरें!';
    }
    if (!bulkStatus) {
      return 'कृपया सभी के लिए पढ़ाई का स्तर चुनें!';
    }
    return null;
  };

  const runAction = (action: PendingAction) => {
    if (action.type === 'single') doSingleSend(action.roll);
    else if (action.type === 'all') doSendAll();
    else doBulkSend();
  };

  const requireAuth = (action: PendingAction) => {
    if (isAuthenticated()) {
      runAction(action);
    } else {
      setPendingAction(action);
    }
  };

  const handleSingleSend = (roll: string) => {
    setError('');
    const validationError = validateSingle(roll);
    if (validationError) {
      setError(validationError);
      return;
    }
    requireAuth({ type: 'single', roll });
  };

  const doSingleSend = (roll: string) => {
    const entry = getEntry(roll);
    sendSinglePtmToWhatsApp(selectedClass, roll, entry.marks, entry.status);
    setSentRoll(roll);
    setTimeout(() => setSentRoll(null), 2500);
  };

  const handleSendAll = () => {
    setError('');
    if (students.length === 0) {
      setError('इस कक्षा का डेटा अभी उपलब्ध नहीं है।');
      return;
    }
    if (filledEntries.length === 0) {
      setError('कृपया कम से कम एक छात्र के अंक और स्थिति दोनों भरें!');
      return;
    }
    requireAuth({ type: 'all' });
  };

  const doSendAll = () => {
    sendPtmToWhatsApp(selectedClass, filledEntries);
    setSentAll(true);
    setTimeout(() => {
      setSentAll(false);
      setEntries({});
    }, 3500);
  };

  const handleBulkSend = () => {
    setError('');
    const validationError = validateBulk();
    if (validationError) {
      setError(validationError);
      return;
    }
    requireAuth({ type: 'bulk' });
  };

  const doBulkSend = () => {
    setReportBatch(
      selectedRolls.map((roll) => {
        const info = getStudentInfo(selectedClass, roll);
        return { roll, name: info.name, phone: info.phone, marks: bulkMarks, status: bulkStatus };
      })
    );
  };

  const closeReportBatch = () => {
    setReportBatch(null);
    setSelectedRolls([]);
    setBulkMarks('');
    setBulkStatus('');
  };

  const handlePasswordSuccess = () => {
    const action = pendingAction;
    setPendingAction(null);
    if (action) runAction(action);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError('');
    setEntries({});
    setSelectedRolls([]);
    setBulkMarks('');
    setBulkStatus('');
  };

  const renderStudentRow = (roll: string, name: string) => {
    const entry = getEntry(roll);
    const isSent = sentRoll === roll;
    const validationError = validateSingle(roll);

    return (
      <div
        key={roll}
        className="bg-ink-900/60 border border-ink-600/30 rounded-lg p-3 transition-colors hover:border-ink-500/40"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm text-white font-medium">
            रोल {roll}. {name}
          </span>
          <input
            type="number"
            min={0}
            max={100}
            value={entry.marks}
            onChange={(e) => updateEntry(roll, 'marks', e.target.value)}
            placeholder="मार्क्स"
            className="w-16 bg-ink-950 border border-ink-600/40 text-white text-sm rounded-md px-2 py-1.5 text-center outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        <select
          value={entry.status}
          onChange={(e) => updateEntry(roll, 'status', e.target.value)}
          className="w-full bg-ink-950 border border-ink-600/40 text-slate-300 text-xs rounded-md px-3 py-2 outline-none focus:border-amber-500/50 transition-colors cursor-pointer mb-2.5"
        >
          <option value="">-- पढ़ाई का स्तर चुनें --</option>
          {ptmStatusOptions.map((opt, i) => (
            <option key={opt} value={opt}>
              {i + 1}. {opt}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleSingleSend(roll)}
          disabled={isSent || validationError !== null}
          className={`w-full py-2 rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
            isSent
              ? 'bg-green-600/20 text-green-400 border border-green-500/30'
              : validationError !== null
                ? 'bg-ink-700/40 text-slate-500 border border-ink-600/30 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-500 active:scale-95'
          }`}
        >
          {isSent ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              भेजा गया!
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              WhatsApp पर रिपोर्ट भेजें
            </>
          )}
        </button>
      </div>
    );
  };

  const renderGenderGroup = (
    label: string,
    Icon: typeof User,
    studentsList: Array<{ roll: string; info: { name: string } }>,
    accent: 'sky' | 'pink'
  ) => {
    if (studentsList.length === 0) return null;
    const headerClasses =
      accent === 'sky'
        ? 'bg-sky-600/20 border-sky-500/30 text-sky-300'
        : 'bg-pink-600/20 border-pink-500/30 text-pink-300';
    return (
      <div className="mb-5">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold mb-3 ${headerClasses}`}
        >
          <Icon className="w-4 h-4" />
          {label} <span className="text-xs opacity-70">({studentsList.length})</span>
        </div>
        <div className="space-y-2.5">
          {studentsList.map((s) => renderStudentRow(s.roll, s.info.name))}
        </div>
      </div>
    );
  };

  const inputClasses =
    'w-full bg-ink-950 border border-ink-600/40 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-amber-500/50 transition-colors';

  const sendButtonClasses =
    'w-full max-w-[280px] mx-auto block py-3.5 rounded-lg bg-green-600 text-white font-bold text-base hover:bg-green-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100';

  return (
    <section
      id="ptm-center"
      className="relative py-20 sm:py-28 bg-ink-900 scroll-mt-20 border-t border-ink-600/30"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div ref={ref} className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="reveal inline-block">
            <span className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase mb-2 block">
              PTM Center • प्रवेश पत्रिका वार्ता
            </span>
            <h2 className="font-devanagari font-bold text-2xl sm:text-4xl text-amber-500 mb-3">
              प्रवेश पत्रिका वार्ता (PTM)
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              कक्षा चुनें, छात्रों के अंक और पढ़ाई का स्तर भरें, फिर WhatsApp पर रिपोर्ट भेजें।
            </p>
          </div>
        </div>

        <div className="reveal p-6 sm:p-8 rounded-2xl bg-ink-800 border border-ink-600/40">
          {sentAll ? (
            <div className="flex flex-col items-center justify-center text-center py-14 animate-scaleIn">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-devanagari font-bold text-lg text-white mb-2">
                PTM संदेश भेजे गए!
              </h3>
              <p className="text-sm text-slate-400">
                {mode === 'bulk'
                  ? `${selectedRolls.length} छात्रों के माता-पिता को WhatsApp संदेश भेजे जा रहे हैं।`
                  : `${filledEntries.length} छात्रों के माता-पिता को WhatsApp संदेश भेजे जा रहे हैं।`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white font-medium mb-2.5">
                  कक्षा चुनें (Select Class)
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setEntries({});
                    setSelectedRolls([]);
                    setError('');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-ink-900 border border-ink-600/50 text-sm text-white outline-none focus:border-amber-500/50 transition-colors cursor-pointer min-w-[120px]"
                >
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 p-1 rounded-xl bg-ink-900/60 border border-ink-600/30">
                <button
                  onClick={() => switchMode('individual')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === 'individual'
                      ? 'bg-amber-500 text-ink-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  व्यक्तिगत (Individual)
                </button>
                <button
                  onClick={() => switchMode('bulk')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === 'bulk'
                      ? 'bg-amber-500 text-ink-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  बल्क (Bulk)
                </button>
              </div>

              {mode === 'individual' ? (
                <>
                  <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-600/30">
                    <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{students.length} छात्र • लिंग-वार विभाजित</span>
                    </div>

                    {renderGenderGroup('बालक (Boys)', User, maleStudents, 'sky')}
                    {renderGenderGroup('बालिकाएँ (Girls)', UserRound, femaleStudents, 'pink')}

                    <div className="mt-4 px-3 py-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs text-amber-400">
                        {filledEntries.length > 0
                          ? `${filledEntries.length} छात्रों के अंक और स्तर भरे गए हैं — सभी को एक साथ भेजने के लिए तैयार।`
                          : 'अभी कोई मूल्यांकन नहीं भरा गया है। हर छात्र का अपना भेजें बटन भी है।'}
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-slideDown">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSendAll}
                    className={sendButtonClasses}
                    style={{ boxShadow: '0 4px 12px rgba(35, 197, 94, 0.3)' }}
                  >
                    <Send className="w-4 h-4" />
                    सभी को WhatsApp पर भेजें ({filledEntries.length})
                  </button>
                </>
              ) : reportBatch ? (
                <ReportCardShareList
                  items={reportBatch}
                  className={selectedClass}
                  onBack={closeReportBatch}
                />
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-ink-900/50 border border-ink-600/30 space-y-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Layers className="w-4 h-4" />
                      <span>एक ही अंक और स्तर सभी चुने हुए छात्रों को भेजें</span>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">
                        सभी के लिए मार्क्स (Global Marks)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={bulkMarks}
                        onChange={(e) => setBulkMarks(e.target.value)}
                        placeholder="मार्क्स भरें"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">
                        सभी के लिए पढ़ाई का स्तर (Global Status)
                      </label>
                      <select
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value)}
                        className={`${inputClasses} text-slate-300 cursor-pointer`}
                      >
                        <option value="">-- पढ़ाई का स्तर चुनें --</option>
                        {ptmStatusOptions.map((opt, i) => (
                          <option key={opt} value={opt}>
                            {i + 1}. {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <StudentSelector
                    students={students}
                    selectedRolls={selectedRolls}
                    onChange={setSelectedRolls}
                  />

                  {error && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-slideDown">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleBulkSend}
                    disabled={selectedRolls.length === 0}
                    className={sendButtonClasses}
                    style={{ boxShadow: '0 4px 12px rgba(35, 197, 94, 0.3)' }}
                  >
                    <Send className="w-4 h-4" />
                    बल्क WhatsApp पर भेजें ({selectedRolls.length})
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {pendingAction && (
        <PasswordModal
          description="PTM संदेश भेजने के लिए कृपया पासवर्ड दर्ज करें"
          onClose={() => setPendingAction(null)}
          onAuthenticated={handlePasswordSuccess}
        />
      )}
    </section>
  );
}
