import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, IndianRupee, CalendarDays, Send, Wallet } from 'lucide-react';
import {
  classOptions,
  getClassStudents,
  isAuthenticated,
  sendFeeRemindersToWhatsApp,
} from '@/utils/whatsappAlert';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import PasswordModal from '@/components/PasswordModal';
import StudentSelector from '@/components/StudentSelector';

export default function FeesReminderCenter() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [selectedClass, setSelectedClass] = useState('9th B');
  const students = useMemo(() => getClassStudents(selectedClass), [selectedClass]);

  const [amount, setAmount] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [selectedRolls, setSelectedRolls] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  const validate = (): string | null => {
    if (selectedRolls.length === 0) return 'कृपया कम से कम एक छात्र चुनें!';
    if (!amount.trim() || Number(amount) <= 0) return 'कृपया बकाया फीस राशि सही भरें!';
    if (!lastDate) return 'कृपया अंतिम तिथि चुनें!';
    return null;
  };

  const doSend = () => {
    sendFeeRemindersToWhatsApp(selectedClass, selectedRolls, amount.trim(), lastDate);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedRolls([]);
      setAmount('');
      setLastDate('');
    }, 3500);
  };

  const handleSend = () => {
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (isAuthenticated()) {
      doSend();
    } else {
      setNeedsPassword(true);
    }
  };

  const handlePasswordSuccess = () => {
    setNeedsPassword(false);
    doSend();
  };

  const inputClasses =
    'w-full bg-ink-950 border border-ink-600/40 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-amber-500/50 transition-colors';

  return (
    <section
      id="fees-reminder"
      className="relative py-20 sm:py-28 bg-ink-900 scroll-mt-20 border-t border-ink-600/30"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div ref={ref} className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="reveal inline-block">
            <span className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase mb-2 block">
              Fees Dues Reminder Center • फीस अनुस्मारक
            </span>
            <h2 className="font-devanagari font-bold text-2xl sm:text-4xl text-amber-500 mb-3">
              फीस रिमाइंडर केंद्र (Fees Dues Reminder Center)
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              बकाया राशि और अंतिम तिथि भरें, बच्चों को चुनें, फिर अभिभावकों को WhatsApp पर रिमाइंडर भेजें।
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
                फीस रिमाइंडर भेजे गए!
              </h3>
              <p className="text-sm text-slate-400">
                {selectedRolls.length} छात्रों के अभिभावकों को संदेश भेजे जा रहे हैं।
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

              <div className="p-4 rounded-xl bg-ink-900/50 border border-ink-600/30 space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Wallet className="w-4 h-4" />
                  <span>कक्षा {selectedClass} • सभी छात्रों के लिए एक ही राशि और तिथि</span>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    बकाया फीस राशि (Amount)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="जैसे: 2500"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    अंतिम तिथि (Last Date)
                  </label>
                  <input
                    type="date"
                    value={lastDate}
                    onChange={(e) => setLastDate(e.target.value)}
                    className={`${inputClasses} [color-scheme:dark]`}
                  />
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
                onClick={handleSend}
                disabled={selectedRolls.length === 0}
                className="w-full max-w-[320px] mx-auto block py-3.5 rounded-lg bg-green-600 text-white font-bold text-base hover:bg-green-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ boxShadow: '0 4px 12px rgba(35, 197, 94, 0.3)' }}
              >
                <Send className="w-4 h-4" />
                चयनित बच्चों को फीस रिमाइंडर भेजें ({selectedRolls.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {needsPassword && (
        <PasswordModal
          description="फीस रिमाइंडर भेजने के लिए कृपया पासवर्ड दर्ज करें"
          onClose={() => setNeedsPassword(false)}
          onAuthenticated={handlePasswordSuccess}
        />
      )}
    </section>
  );
}
