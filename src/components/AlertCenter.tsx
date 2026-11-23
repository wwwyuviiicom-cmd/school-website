import { useMemo, useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Users, ClipboardList } from 'lucide-react';
import {
  alertReasons,
  classOptions,
  sendToWhatsApp,
  isAuthenticated,
  getClassStudents,
  getStudentInfo,
} from '@/utils/whatsappAlert';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import PasswordModal from '@/components/PasswordModal';

export default function AlertCenter() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [selectedClass, setSelectedClass] = useState('11th Chemistry');
  const [selectedRolls, setSelectedRolls] = useState<string[]>([]);
  const [selectedAlert, setSelectedAlert] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const students = useMemo(() => getClassStudents(selectedClass), [selectedClass]);

  const toggleRoll = (roll: string) => {
    setSelectedRolls((prev) =>
      prev.includes(roll) ? prev.filter((r) => r !== roll) : [...prev, roll]
    );
  };

  const handleSendClick = () => {
    setError('');
    if (selectedRolls.length === 0) {
      setError('कृपया कम से कम एक रोल नंबर चुनें!');
      return;
    }
    if (!selectedAlert) {
      setError('कृपया अलर्ट का प्रकार चुनें!');
      return;
    }

    if (isAuthenticated()) {
      doSend();
    } else {
      setShowPasswordModal(true);
    }
  };

  const doSend = () => {
    sendToWhatsApp(selectedClass, selectedRolls, selectedAlert);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedRolls([]);
      setSelectedAlert('');
    }, 3500);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    doSend();
  };

  const previewRolls = selectedRolls.length > 0 ? selectedRolls.join(', ') : '-';
  const previewStudentNames = selectedRolls.length > 0
    ? selectedRolls
        .map((r) => getStudentInfo(selectedClass, r).name)
        .join(', ')
    : '-';

  return (
    <section
      id="alert-center"
      className="relative py-20 sm:py-28 bg-ink-850 scroll-mt-20 border-t border-ink-600/30"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-green-500/5 blur-3xl pointer-events-none" />

      <div ref={ref} className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="reveal inline-block">
            <span className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase mb-2 block">
              Quick Alert Center • त्वरित संदेश केंद्र
            </span>
            <h2 className="font-devanagari font-bold text-2xl sm:text-4xl text-amber-500 mb-3">
              त्वरित संदेश केंद्र
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              कक्षा, एक क्लिक में रोल नंबर और अलर्ट प्रकार चुनें, फिर WhatsApp पर संदेश भेजें।
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
                संदेश भेजा गया!
              </h3>
              <p className="text-sm text-slate-400">
                {selectedRolls.length > 1
                  ? `${selectedRolls.length} छात्रों के व्हाट्सऐप पर संदेश नए टैब में खुल रहे हैं।`
                  : 'व्हाट्सऐप पर संदेश नए टैब में खुल गया है। भेजने के लिए Send बटन दबाएँ।'}
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

              <div className="p-4 rounded-xl bg-ink-900/50 border border-ink-600/30">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-white font-medium">
                    1. रोल नंबर चुनें (एक से अधिक चुन सकते हैं)
                  </label>
                  {selectedRolls.length > 0 && (
                    <button
                      onClick={() => setSelectedRolls([])}
                      className="text-xs text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      सभी हटाएँ
                    </button>
                  )}
                </div>
                {students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <ClipboardList className="w-10 h-10 text-slate-600 mb-3" />
                    <p className="text-sm text-slate-400">
                      इस कक्षा का छात्र डेटा अभी उपलब्ध नहीं है।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-10 gap-2">
                    {students.map(({ roll, info }) => (
                      <button
                        key={roll}
                        onClick={() => toggleRoll(roll)}
                        title={info.name}
                        className={`py-2 rounded-md text-xs font-bold text-center transition-all duration-200 border ${
                          selectedRolls.includes(roll)
                            ? 'bg-sky-600 text-white border-sky-400'
                            : 'bg-ink-700/60 text-slate-300 border-ink-600/40 hover:border-ink-500/60 hover:text-white'
                        }`}
                      >
                        {roll}
                      </button>
                    ))}
                  </div>
                )}
                {selectedRolls.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{selectedRolls.length} रोल नंबर चुने गए</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-white font-medium mb-3">
                  2. अलर्ट प्रकार चुनें
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {alertReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedAlert(reason)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                        selectedAlert === reason
                          ? 'bg-sky-600 text-white border-sky-400'
                          : 'bg-ink-900/50 text-slate-300 border-ink-600/40 hover:border-ink-500/60 hover:text-white'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-ink-900/40 border border-ink-600/20 space-y-1.5">
                <p className="text-sm text-sky-400 font-medium break-words">
                  कक्षा: <span className="text-white">{selectedClass}</span>
                  {' • '}
                  रोल नंबर: <span className="text-white">{previewRolls}</span>
                  {' • '}
                  अलर्ट: <span className="text-white">{selectedAlert || '-'}</span>
                </p>
                {selectedRolls.length > 0 && (
                  <p className="text-xs text-slate-400 break-words">
                    छात्र: <span className="text-slate-200">{previewStudentNames}</span>
                  </p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-slideDown">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleSendClick}
                className="w-full max-w-[250px] mx-auto block py-3.5 rounded-lg bg-green-600 text-white font-bold text-base hover:bg-green-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                style={{ boxShadow: '0 4px 12px rgba(35, 197, 94, 0.3)' }}
              >
                <Send className="w-4 h-4" />
                Send to WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal
          description="संदेश भेजने के लिए कृपया पासवर्ड दर्ज करें"
          onClose={() => setShowPasswordModal(false)}
          onAuthenticated={handlePasswordSuccess}
        />
      )}
    </section>
  );
}
