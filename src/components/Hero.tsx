import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  const scrollToFeatures = () =>
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/20200756/pexels-photo-20200756.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600"
          alt="School campus"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/80 via-ink-900/70 to-ink-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/80 via-transparent to-ink-900/60" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid opacity-40 z-0" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl animate-pulseGlow z-0" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl animate-pulseGlow z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center py-24">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink-800/60 border border-ink-600/40 backdrop-blur-sm mb-6 animate-fadeUp"
          style={{ animationDelay: '0.1s' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-medium text-slate-300 tracking-[0.25em] uppercase">
            ज्ञान • तकनीक • संस्कार
          </span>
        </div>

        <h1
          className="font-devanagari font-extrabold text-3xl sm:text-5xl md:text-6xl leading-[1.2] mb-6 animate-fadeUp"
          style={{ animationDelay: '0.25s', opacity: 0 }}
        >
          <span className="text-gradient-amber">गायत्री विद्या मंदिर</span>
          <br />
          <span className="text-white">उच्चतर माध्यमिक विद्यालय</span>
        </h1>

        <p
          className="text-base sm:text-lg text-sky-400 italic font-medium mb-6 animate-fadeUp"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          भविष्य गढ़ने वाला विद्यालय
        </p>

        <p
          className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-10 animate-fadeUp"
          style={{ animationDelay: '0.55s', opacity: 0 }}
        >
          आधुनिक शिक्षा का एक सुरक्षित, प्रेरक और आत्मविश्वासी डिजिटल अनुभव। प्रयोग,
          खोज और रचनात्मक सोच के लिए तैयार सीखना।
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeUp"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          <button
            onClick={scrollToFeatures}
            className="px-7 py-3.5 rounded-xl bg-amber-500 text-ink-950 font-semibold text-sm hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all duration-300 glow-amber"
          >
            हमारी विशेषताएँ देखें
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToFeatures}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-slate-400 hover:text-amber-500 transition-colors duration-300 animate-floatY"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-6 h-6" />
      </button>
    </section>
  );
}
