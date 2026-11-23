import { ListChecks, User, UserRound, Users } from 'lucide-react';
import type { StudentInfo } from '@/utils/whatsappAlert';

interface StudentSelectorProps {
  students: Array<{ roll: string; info: StudentInfo }>;
  selectedRolls: string[];
  onChange: (rolls: string[]) => void;
}

interface GenderGroupProps {
  label: string;
  Icon: typeof User;
  accent: 'sky' | 'pink';
  students: Array<{ roll: string; info: StudentInfo }>;
  selectedRolls: string[];
  onToggle: (roll: string) => void;
}

function GenderGroup({ label, Icon, accent, students, selectedRolls, onToggle }: GenderGroupProps) {
  if (students.length === 0) return null;
  const headerClasses =
    accent === 'sky'
      ? 'bg-sky-600/20 border-sky-500/30 text-sky-300'
      : 'bg-pink-600/20 border-pink-500/30 text-pink-300';

  return (
    <div className="mb-5 last:mb-0">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold mb-3 ${headerClasses}`}
      >
        <Icon className="w-4 h-4" />
        {label} <span className="text-xs opacity-70">({students.length})</span>
      </div>
      <div className="space-y-2">
        {students.map(({ roll, info }) => {
          const isChecked = selectedRolls.includes(roll);
          return (
            <label
              key={roll}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                isChecked
                  ? 'bg-sky-600/15 border-sky-500/40'
                  : 'bg-ink-900/60 border-ink-600/30 hover:border-ink-500/40'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(roll)}
                className="w-4 h-4 accent-sky-500 cursor-pointer flex-shrink-0"
              />
              <span className={`text-sm font-medium ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                रोल {roll}. {info.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function StudentSelector({ students, selectedRolls, onChange }: StudentSelectorProps) {
  const boys = students.filter((s) => s.info.gender === 'male');
  const girls = students.filter((s) => s.info.gender === 'female');
  const allRolls = students.map((s) => s.roll);
  const allSelected = students.length > 0 && selectedRolls.length === students.length;

  const toggle = (roll: string) => {
    onChange(
      selectedRolls.includes(roll)
        ? selectedRolls.filter((r) => r !== roll)
        : [...selectedRolls, roll]
    );
  };

  return (
    <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-600/30">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-4 h-4" />
          <span>
            {students.length} छात्र • {selectedRolls.length} चुने गए
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(allRolls)}
            disabled={allSelected}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-sky-600/20 text-sky-300 border border-sky-500/30 hover:bg-sky-600/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ListChecks className="w-3.5 h-3.5" />
            सभी चुनें
          </button>
          <button
            onClick={() => onChange([])}
            disabled={selectedRolls.length === 0}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-ink-700/60 text-slate-300 border border-ink-600/40 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            सभी हटाएँ
          </button>
        </div>
      </div>

      <GenderGroup
        label="बालक (Boys)"
        Icon={User}
        accent="sky"
        students={boys}
        selectedRolls={selectedRolls}
        onToggle={toggle}
      />
      <GenderGroup
        label="बालिकाएँ (Girls)"
        Icon={UserRound}
        accent="pink"
        students={girls}
        selectedRolls={selectedRolls}
        onToggle={toggle}
      />
    </div>
  );
}
