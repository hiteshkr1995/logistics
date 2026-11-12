import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/sections/Services';
import HowItWorks from './components/sections/HowItWorks';
import Coverage from './components/sections/Coverage';
import WhyUs from './components/sections/WhyUs';
import Business from './components/sections/Business';
import FinalCta from './components/sections/FinalCta';
import Footer from './components/Footer';
import { DialogProvider } from './components/ui/DialogProvider';
import { useReveal } from './hooks/useReveal';
import './components/sections/sections.css';

export default function App() {
  useReveal();
  return (
    <DialogProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <HowItWorks />
        <Coverage />
        <WhyUs />
        <Business />
        <FinalCta />
      </main>
      <Footer />
    </DialogProvider>
  );
}
