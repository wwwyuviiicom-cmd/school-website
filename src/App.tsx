import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Facilities from '@/components/Facilities';
import AlertCenter from '@/components/AlertCenter';
import PTMCenter from '@/components/PTMCenter';
import FeesReminderCenter from '@/components/FeesReminderCenter';
import DailyDiaryCenter from '@/components/DailyDiaryCenter';
import CertificateCenter from '@/components/CertificateCenter';
import StudentAdminCenter from '@/components/StudentAdminCenter';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Facilities />
        <AlertCenter />
        <PTMCenter />
        <FeesReminderCenter />
        <DailyDiaryCenter />
        <CertificateCenter />
        <StudentAdminCenter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
