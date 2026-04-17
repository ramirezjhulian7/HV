import './styles/index.css';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
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
    <div className="app">
      <ParticlesBackground />
      <Navbar />
      <LanguageSwitcher />
      <ExportPDF />
      <ScrollToTop />
      <Hero />
      <SectionDivider />
      <Stats />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Experience />
      <Footer />
    </div>
  );
}

export default App;
