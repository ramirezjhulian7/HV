import './styles/index.css';
import { MotionConfig } from 'framer-motion';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Navbar } from './components/Navbar';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ExportPDF } from './components/ExportPDF';
import { ParticlesBackground } from './components/ParticlesBackground';
import { ScrollToTop } from './components/ScrollToTop';
import { SectionDivider } from './components/SectionDivider';
import { Footer } from './components/Footer';

function App() {
  return (
    // The global CSS `prefers-reduced-motion` block cannot reach the inline
    // transforms framer-motion writes from its rAF loop, so the setting has to
    // be honoured by the library too.
    <MotionConfig reducedMotion="user">
      <div className="app">
        <ParticlesBackground />
        <Navbar />
        <LanguageSwitcher />
        <ExportPDF />
        <ScrollToTop />
        <Hero />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Experience />
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
