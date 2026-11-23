import { GraduationCap, Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-ink-950 border-t border-ink-600/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
              </span>
              <div className="font-devanagari font-bold text-sm text-white leading-tight">
                गायत्री विद्या मंदिर
                <span className="block text-xs text-amber-500 font-medium">
                  उच्चतर माध्यमिक विद्यालय
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              ज्ञान, तकनीक और संस्कार के संगम पर एक ऐसा विद्यालय, जो भविष्य की
              पीढ़ी को आत्मनिर्भर, रचनात्मक और आत्मविश्वासी बनाता है।
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-ink-800 border border-ink-600/40 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-devanagari font-semibold text-sm text-white mb-4">
              त्वरित लिंक
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'मुख्य पृष्ठ', id: 'home' },
                { label: 'विशेषताएँ', id: 'features' },
                { label: 'संदेश केंद्र', id: 'alert-center' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() =>
                      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Developer credit */}
        <div className="mb-8 text-center">
          <p className="text-sm font-bold text-amber-500 tracking-wide">
            Designed &amp; Developed by: YUVRAJ RAJPUT (Class 11th, JEE Aspirant)
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-ink-600/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © 2026 गायत्री विद्या मंदिर उच्चतर माध्यमिक विद्यालय। सर्वाधिकार सुर्वक्षित।
          </p>
          <p className="text-xs text-slate-500">
            ज्ञान • तकनीक • संस्कार
          </p>
        </div>
      </div>
    </footer>
  );
}
