import { useState, useMemo } from 'react';
import {
  Lock,
  Unlock,
  UserPlus,
  Trash2,
  ArrowRightCircle,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import {
  classOptions,
  getClassStudents,
  addOrUpdateStudent,
  removeStudent,
  promoteClassStudents,
} from '@/utils/whatsappAlert';

const ADMIN_PASS = 'yuvi@108';

export default function StudentAdminCenter() {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [selectedClass, setSelectedClass] = useState('Class 9 B');
  const [rollInput, setRollInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [genderInput, setGenderInput] = useState<'male' | 'female'>('male');

  const [fromClass, setFromClass] = useState('Class 9 B');
  const [toClass, setToClass] = useState('Class 10 B');

  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [tick, setTick] = useState(0);

  const students = useMemo(
    () => getClassStudents(selectedClass),
    [selectedClass, tick]
  );

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setUnlocked(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('गलत पासवर्ड! केवल अधिकृत एडमिन ही इसे खोल सकते हैं।');
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStatusMsg('');

    const cleanRoll = rollInput.trim();
    const cleanName = nameInput.trim().toUpperCase();
    const cleanPhone = phoneInput.replace(/\D/g, '');

    if (!cleanRoll || !cleanName || cleanPhone.length < 10) {
      setErrorMsg('कृपया सही रोल नंबर, छात्र का नाम और 10 अंकों का WhatsApp नंबर दर्ज करें!');
      return;
    }

    addOrUpdateStudent(selectedClass, cleanRoll, {
      name: cleanName,
      phone: cleanPhone.slice(-10),
      gender: genderInput,
    });

    setRollInput('');
    setNameInput('');
    setPhoneInput('');
    setTick((t) => t + 1);
    setStatusMsg(`${cleanName} (रोल नं. ${cleanRoll}) को ${selectedClass} में जोड़ दिया गया है!`);
  };

  const handleDelete = (roll: string, name: string) => {
    if (window.confirm(`क्या आप वाकई ${name} (रोल नं. ${roll}) को ${selectedClass} से हटाना चाहते हैं?`)) {
      removeStudent(selectedClass, roll);
      setTick((t) => t + 1);
      setStatusMsg(`${name} को सूची से हटा दिया गया है।`);
    }
  };

  const handlePromote = () => {
    setErrorMsg('');
    setStatusMsg('');
    if (fromClass === toClass) {
      setErrorMsg('कृपया अलग-अलग कक्षा चुनें!');
      return;
    }
    if (
      window.confirm(
        `क्या आप वाकई ${fromClass} के सभी छात्रों को अगली कक्षा (${toClass}) में शिफ्ट करना चाहते हैं?`
      )
    ) {
      const movedCount = promoteClassStudents(fromClass, toClass);
      setTick((t) => t + 1);
      if (movedCount === 0) {
        setErrorMsg(`${fromClass} में कोई छात्र नहीं मिला।`);
      } else {
        setStatusMsg(
          `सफलता! ${fromClass} के कुल ${movedCount} छात्रों को ${toClass} में शिफ्ट कर दिया गया है।`
        );
      }
    }
  };

  return (
    <section
      id="student-admin"
      className="relative py-16 sm:py-24 bg-ink-950 border-t border-ink-600/40"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-amber-500/80 tracking-[0.2em] uppercase mb-2 block">
            Admin Control Panel • गोपनीय प्रबंधन
          </span>
          <h2 className="font-devanagari font-bold text-2xl sm:text-3xl text-white">
            छात्र प्रबंधन एवं कक्षा प्रोन्नति (Add / Remove / Shift)
          </h2>
        </div>

        {!unlocked ? (
          <form
            onSubmit={handleUnlock}
            className="max-w-md mx-auto p-6 sm:p-8 rounded-2xl bg-ink-900 border border-ink-600/50 text-center space-y-5"
          >
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                यह सेक्शन पासवर्ड से सुरक्षित है
              </h3>
              <p className="text-xs text-slate-400">
                नया छात्र जोड़ने, हटाने या अगली कक्षा में भेजने के लिए एडमिन पासवर्ड दर्ज करें।
              </p>
            </div>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="एडमिन पासवर्ड दर्ज करें..."
              className="w-full px-4 py-3 rounded-lg bg-ink-950 border border-ink-600/60 text-white text-sm outline-none focus:border-amber-500 text-center"
            />
            {authError && (
              <p className="text-xs text-red-400 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-500 text-ink-950 font-bold text-sm hover:bg-amber-400 transition-colors"
            >
              अनलॉक करें (Unlock Admin Panel)
            </button>
          </form>
        ) : (
          <div className="space-y-8 p-6 sm:p-8 rounded-2xl bg-ink-900 border border-ink-600/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink-700">
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <Unlock className="w-4 h-4" />
                <span>एडमिन पैनल सक्रिय है (सभी बदलाव अपने आप सेव होंगे)</span>
              </div>
              <button
                onClick={() => setUnlocked(false)}
                className="px-3.5 py-1.5 rounded-lg bg-ink-800 border border-ink-600 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                लॉक करें (Lock)
              </button>
            </div>

            {statusMsg && (
              <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{statusMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-amber-500 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  1. नया छात्र जोड़ें या सूची देखें
                </h3>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-ink-950 border border-amber-500/50 text-sm text-white font-semibold outline-none"
                >
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  value={rollInput}
                  onChange={(e) => setRollInput(e.target.value)}
                  placeholder="रोल नंबर (जैसे: 31)"
                  className="px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-600/60 text-sm text-white outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="छात्र का पूरा नाम"
                  className="px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-600/60 text-sm text-white outline-none focus:border-amber-500"
                />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="अभिभावक का WhatsApp नंबर (10 अंक)"
                  className="px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-600/60 text-sm text-white outline-none focus:border-amber-500"
                />
                <select
                  value={genderInput}
                  onChange={(e) => setGenderInput(e.target.value as 'male' | 'female')}
                  className="px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-600/60 text-sm text-white outline-none focus:border-amber-500"
                >
                  <option value="male">छात्र (Male)</option>
                  <option value="female">छात्रा (Female)</option>
                </select>
                <button
                  type="submit"
                  className="sm:col-span-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-colors"
                >
                  + {selectedClass} में छात्र जोड़ें
                </button>
              </form>
            </div>

            
