import { stats } from '@/data/siteData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Stats() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative py-16 sm:py-20 bg-ink-850 border-y border-ink-600/30">
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="reveal flex flex-col items-center text-center"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ink-700 to-ink-800 border border-ink-600/40 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-amber-500" strokeWidth={1.8} />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gradient-amber mb-1 font-sans">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400 font-devanagari">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
