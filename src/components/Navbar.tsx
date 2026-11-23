import { useEffect, useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'मुख्य पृष्ठ' },
  { id: 'features', label: 'विशेषताएँ' },
  { id: 'alert-center', label: 'संदेश केंद्र' },
  { id: 'ptm-center', label: 'PTM' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      const sections = navItems
        .map((n) => document.getElementById(n.id))
        .filter(Boolean) as HTMLElement[];
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollPos) {
          setActive(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink-900/85 backdrop-blur-lg border-b border-ink-600/40 py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="flex items-center gap-2.5 group"
        >
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-amber">
            <GraduationCap className="w-5.5 h-5.5 text-ink-950" strokeWidth={2.5} />
          </span>
          <span className="font-devanagari font-bold text-sm sm:text-base text-white leading-tight text-left">
            गायत्री विद्या मंदिर
            <span className="block text-[10px] sm:text-xs text-amber-500 font-medium">
              उच्चतर माध्यमिक विद्यालय
            </span>
          </span>
        </button>

        <ul className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`nav-link text-sm font-medium transition-colors duration-300 ${
                  active === item.id
                    ? 'text-amber-500 active'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden w-10 h-10 rounded-lg bg-ink-800/60 border border-ink-600/50 flex items-center justify-center text-slate-200"
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden mt-2 mx-4 rounded-2xl bg-ink-850/95 backdrop-blur-lg border border-ink-600/40 overflow-hidden animate-slideDown">
          <ul className="py-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors ${
                    active === item.id
                      ? 'text-amber-500 bg-ink-800/50'
                      : 'text-slate-300 hover:text-white hover:bg-ink-800/30'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
