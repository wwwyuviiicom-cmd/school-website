import { facilities } from '@/data/siteData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Facilities() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id="features" className="relative py-20 sm:py-28 scroll-mt-20">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="reveal inline-block">
            <span className="text-xs font-semibold text-amber-500 tracking-[0.3em] uppercase mb-3 block">
              हमारी सुविधाएँ
            </span>
            <h2 className="font-devanagari font-bold text-2xl sm:text-4xl text-white mb-3">
              विद्यालय की मुख्य विशेषताएँ
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
          </div>
        </div>

        {/* Facilities grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {facilities.map((facility, i) => {
            const Icon = facility.icon;
            const isAmber = facility.accent === 'amber';
            return (
              <article
                key={facility.title}
                className="reveal group card-hover bg-ink-800 rounded-2xl overflow-hidden border border-ink-600/40 hover:border-ink-500/60 hover:shadow-2xl hover:shadow-black/40"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/20 to-transparent" />
                  <div
                    className={`absolute top-4 left-4 w-11 h-11 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${
                      isAmber
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        : 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className={`font-devanagari font-bold text-lg sm:text-xl mb-2.5 transition-colors ${
                      isAmber ? 'text-amber-400' : 'text-sky-400'
                    }`}
                  >
                    {facility.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
